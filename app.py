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
        "https://trustguard-wfry.vercel.app/"
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

    result = verify_response(
        query=request.query,
        context=request.context,
        response=request.response,
    )

    return result

@app.post("/verify")
def verify(request: VerifyRequest):

    if not request.context.strip():
        raise HTTPException(
            status_code=400,
            detail="Context cannot be empty."
        )

    if not request.response.strip():
        raise HTTPException(
            status_code=400,
            detail="Response cannot be empty."
        )

    if not request.query.strip():
        raise HTTPException(
            status_code=400,
            detail="Query cannot be empty."
        )

    result = verify_response(
        request.query,
        request.context,
        request.response,
    )
    if len(request.context) > 10000:
      raise HTTPException(
        status_code=400,
        detail="Context too long."
    )

    return result

