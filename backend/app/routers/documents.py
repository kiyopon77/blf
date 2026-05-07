import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, ensure_society_access
from app.models.document import Document, EntityType
from app.models.sale import Sale
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

# ✅ Base directory
UPLOAD_BASE = "/app/uploads/documents"
BASE_DIR = "/app"




# ── Upload ──────────────────────────────────────────────
@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    label: str = Form(...),
    entity: EntityType = Form(...),
    sale_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    # ✅ Validate sale
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # ✅ Extract hierarchy
    floor = sale.floor
    plot_id = floor.plot_id
    floor_id = floor.floor_id

    # ✅ Create folder structure
    folder_path = os.path.join(UPLOAD_BASE, str(plot_id), str(floor_id))
    os.makedirs(folder_path, exist_ok=True)

    # ✅ Get extension (supports ALL file types)
    ext = os.path.splitext(file.filename)[1].lower()

    # ✅ Unique filename
    unique_name = f"{uuid.uuid4()}{ext}"

    # ✅ Relative path (store in DB)
    relative_path = f"uploads/documents/{plot_id}/{floor_id}/{unique_name}"

    # ✅ Full path (server use)
    full_path = os.path.join(BASE_DIR, relative_path)

    # ✅ Save file
    contents = await file.read()
    with open(full_path, "wb") as f:
        f.write(contents)

    # ✅ Save in DB
    doc = Document(
        label=label,
        file_name=file.filename,
        file_path=relative_path,
        file_type=file.content_type or "application/octet-stream",
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
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    ensure_society_access(user, sale.floor.plot.society_id)

    return db.query(Document).filter(Document.sale_id == sale_id).all()


# ── List by entity type ─────────────────────────────────
@router.get("/sale/{sale_id}/{entity}", response_model=List[DocumentResponse])
def get_documents_by_entity(
    sale_id: int,
    entity: EntityType,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    ensure_society_access(user, sale.floor.plot.society_id)

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

    ensure_society_access(user, doc.sale.floor.plot.society_id)

    full_path = os.path.join(BASE_DIR, doc.file_path)

    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(
        path=full_path,
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

    full_path = os.path.join(BASE_DIR, doc.file_path)

    if os.path.exists(full_path):
        os.remove(full_path)

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted"}