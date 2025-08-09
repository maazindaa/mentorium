from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Mentorium API")

# CORS settings: adjust origins as needed (e.g., add production domain later)
ALLOWED_ORIGINS = [
	"http://localhost",
	"http://localhost:3000",
	"http://mentorium.tech",
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
