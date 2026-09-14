from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_products():
    return {"message": "List of products placeholder"}

@router.get("/{product_id}")
def get_product_details(product_id: int):
    return {"message": f"Details for product {product_id} placeholder"}
