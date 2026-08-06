from pydantic import BaseModel


class VerifyRequest(BaseModel):
    query: str
    context: str
    response: str


class VerifyResponse(BaseModel):

    label:str

    confidence:float

    hallucination_probability:float

    threshold:float

    latency_ms:float