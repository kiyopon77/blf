import os
import uuid
import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin, ensure_society_access
from app.models.document import Document, EntityType
from app.models.sale import Sale
from app.schemas.document import DocumentResponse

router = APIRouter(prefix="/documents", tags=["Documents"])

BUCKET_NAME = os.environ.get("RAILWAY_BUCKET_NAME", "efficient-toybox-44h-7jms")


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=os.environ["RAILWAY_BUCKET_ENDPOINT_URL"],
        aws_access_key_id=os.environ["RAILWAY_BUCKET_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["RAILWAY_BUCKET_SECRET_ACCESS_KEY"],
        region_name=os.environ.get("RAILWAY_BUCKET_REGION", "auto"),
    )


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
    sale = db.query(Sale).filter(Sale.sale_id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    floor = sale.floor
    plot_id = floor.plot_id
    floor_id = floor.floor_id

    ext = os.path.splitext(file.filename)[1].lower()
    unique_name = f"{uuid.uuid4()}{ext}"

    # S3 key: documents/{plot_id}/{floor_id}/{uuid}.ext
    s3_key = f"documents/{plot_id}/{floor_id}/{unique_name}"

    contents = await file.read()

    s3 = get_s3_client()
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=s3_key,
        Body=contents,
        ContentType=file.content_type or "application/octet-stream",
    )

    doc = Document(
        label=label,
        file_name=file.filename,
        file_path=s3_key,          # store S3 key in DB
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

    s3 = get_s3_client()
    try:
        response = s3.get_object(Bucket=BUCKET_NAME, Key=doc.file_path)
    except ClientError as e:
        if e.response["Error"]["Code"] == "NoSuchKey":
            raise HTTPException(status_code=404, detail="File not found in storage")
        raise

    return StreamingResponse(
        content=response["Body"].iter_chunks(),
        media_type=doc.file_type,
        headers={"Content-Disposition": f"attachment; filename={doc.file_name}"}
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

    s3 = get_s3_client()
    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=doc.file_path)
    except Exception:
        pass  # Don't fail delete if file cleanup fails

    db.delete(doc)
    db.commit()

    return {"message": "Document deleted"}