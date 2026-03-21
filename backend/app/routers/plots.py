from app.models.floor_log import FloorStatusLog
from datetime import datetime

@router.get("/matrix", response_model=list[PlotMatrixResponse])
def get_plots_matrix(db: Session = Depends(get_db), user=Depends(get_current_user)):
    plots = db.query(Plot).all()
    result = []

    for plot in plots:
        floors = db.query(Floor).filter(
            Floor.plot_id == plot.plot_id
        ).order_by(Floor.floor_no).all()

        floor_items = []
        for floor in floors:
            sale_status = None
            broker_name = None
            broker_company = None
            last_changed_by = None
            last_changed_at = None

            # get sale info
            if floor.active_sale_id:
                sale = db.query(Sale).filter(
                    Sale.sale_id == floor.active_sale_id
                ).first()
                if sale:
                    sale_status = sale.status
                    broker = db.query(Broker).filter(
                        Broker.broker_id == sale.broker_id
                    ).first()
                    if broker:
                        broker_name = broker.broker_name
                        broker_company = broker.company

            # get last status change
            last_log = db.query(FloorStatusLog).filter(
                FloorStatusLog.floor_id == floor.floor_id
            ).order_by(FloorStatusLog.changed_at.desc()).first()

            if last_log:
                last_changed_at = last_log.changed_at
                user_obj = db.query(User).filter(
                    User.user_id == last_log.changed_by
                ).first()
                if user_obj:
                    last_changed_by = user_obj.full_name

            floor_items.append(FloorMatrixItem(
                floor_id=floor.floor_id,
                floor_no=floor.floor_no,
                status=floor.status,
                active_sale_id=floor.active_sale_id,
                sale_status=sale_status,
                broker_name=broker_name,
                broker_company=broker_company,
                last_changed_by=last_changed_by,
                last_changed_at=last_changed_at
            ))

        result.append(PlotMatrixResponse(
            plot_id=plot.plot_id,
            plot_code=plot.plot_code,
            area_sqyd=float(plot.area_sqyd) if plot.area_sqyd else None,
            area_sqft=float(plot.area_sqft) if plot.area_sqft else None,
            type=plot.type,
            floors=floor_items
        ))

    return result