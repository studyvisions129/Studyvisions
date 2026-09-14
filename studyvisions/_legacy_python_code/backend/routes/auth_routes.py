from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def login():
    return {"message": "Login endpoint placeholder"}

@router.post("/logout")
def logout():
    return {"message": "Logout endpoint placeholder"}
