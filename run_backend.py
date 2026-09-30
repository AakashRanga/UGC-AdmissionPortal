import uvicorn
from backend.config import settings

if __name__ == "__main__":
    print(f"===========================================================")
    print(f" Starting UGC-DEB Backend Server on PORT: {settings.BACKEND_PORT}")
    print(f" (Configured in backend/.env -> BACKEND_PORT={settings.BACKEND_PORT})")
    print(f"===========================================================")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.BACKEND_PORT, reload=True)
