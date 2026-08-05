from fastapi import FastAPI

from inference import verify_response
from schemas import VerifyRequest, VerifyResponse
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TrustGuard API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://trustguard-qz68.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/verify", response_model=VerifyResponse)
def verify(request: VerifyRequest):

    if not request.query.strip():
        raise HTTPException(400, "Query cannot be empty.")

    if not request.context.strip():
        raise HTTPException(400, "Context cannot be empty.")

    if not request.response.strip():
        raise HTTPException(400, "Response cannot be empty.")

    if len(request.context) > 10000:
        raise HTTPException(400, "Context too long.")

    return verify_response(
        request.query,
        request.context,
        request.response,
    )