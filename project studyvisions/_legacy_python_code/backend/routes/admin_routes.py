from fastapi import APIRouter

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats():
    return {"message": "Admin stats placeholder"}
