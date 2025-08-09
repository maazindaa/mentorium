from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="Mentorium API")

@app.get("/api/health")
def health():
	return {"status": "ok"}

@app.get("/api/echo")
def echo(msg: str = "hello"):
	return {"echo": msg}

if __name__ == "__main__":
	import uvicorn
	uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
