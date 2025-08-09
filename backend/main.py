from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Mentorium API")

# Dynamic CORS origins via env (comma-separated). Fallback to sensible defaults.
_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if _origins_env.strip():
	ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(',') if o.strip()]
else:
	ALLOWED_ORIGINS = [
		"http://localhost",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://mentorium.tech",
		"https://mentorium.tech",
	]

app.add_middleware(
	CORSMiddleware,
	allow_origins=ALLOWED_ORIGINS,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

@app.get("/api/health")
def health():
	return {"status": "ok"}

@app.get("/api/echo")
def echo(msg: str = "hello"):
	return {"echo": msg}

if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
