class FloorMatrixItem(BaseModel):
    floor_id: int
    floor_no: Optional[int] = None
    status: str
    active_sale_id: Optional[int] = None
    sale_status: Optional[str] = None
    broker_name: Optional[str] = None
    broker_company: Optional[str] = None
    last_changed_by: Optional[str] = None    # user full name
    last_changed_at: Optional[datetime] = None

    class Config:
        from_attributes = True