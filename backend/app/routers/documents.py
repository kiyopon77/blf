import os
import uuid
from PIL import Image
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.models.document import Document, EntityType
from app.schemas.document import DocumentResponse
from typing import List

router = APIRouter(prefix="/documents", tags=["Documents"])

UPLOAD_DIR = "/app/uploads"
ALLOWED_TYPES = {"application/pdf", "image/jpeg", "image/png"}
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
IMAGE_QUALITY = 70
IMAGE_MAX_WIDTH = 1920

os.makedirs(UPLOAD_DIR, exist_ok=True)


def compress_image(contents: bytes, ext: str) -> bytes:
    img = Image.open(io.BytesIO(contents))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    if img.width > IMAGE_MAX_WIDTH:
        ratio = IMAGE_MAX_WIDTH / img.width
        new_height = int(img.height * ratio)
        img = img.resize((IMAGE_MAX_WIDTH, new_height), Image.LANCZOS)
    output = io.BytesIO()
    fmt = "JPEG" if ext in (".jpg", ".jpeg") else "PNG"
    img.save(output, format=fmt, quality=IMAGE_QUALITY, optimize=True)
    return output.getvalue()


# ── Upload ──────────────────────────────────────────────
@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    label: str = Form(...),
    entity: EntityType = Form(...),       # CUSTOMER or SALE
    sale_id: int = Form(...),             # always required — links to sale
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF, JPG and PNG files allowed")
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large — max 10MB")

    if ext in (".jpg", ".jpeg", ".png"):
        contents = compress_image(contents, ext)

    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(contents)

    doc = Document(
        label=label,
        file_name=file.filename,
        file_path=file_path,
        file_type=file.content_type,
        entity=entity,
        sale_id=sale_id
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


# ── List by sale ────────────────────────────────────────
@router.get("/sale/{sale_id}", response_model=List[DocumentResponse])
def get_sale_documents(
    sale_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Document).filter(Document.sale_id == sale_id).all()


# ── List by entity type ─────────────────────────────────
@router.get("/sale/{sale_id}/{entity}", response_model=List[DocumentResponse])
def get_documents_by_entity(
    sale_id: int,
    entity: EntityType,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return db.query(Document).filter(
        Document.sale_id == sale_id,
        Document.entity == entity
    ).all()


# ── Download ────────────────────────────────────────────
@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    doc = db.query(Document).filter(Document.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if not os.path.exists(doc.file_path):
        raise HTTPException(status_code=404, detail="File not found on server")
    return FileResponse(
        path=doc.file_path,
        filename=doc.file_name,
        media_type=doc.file_type
    )


# ── Delete ──────────────────────────────────────────────
@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    doc = db.query(Document).filter(Document.document_id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}