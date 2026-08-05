import numpy as np
import onnxruntime as ort

from transformers import AutoTokenizer
from config import MODEL_PATH, MAX_LENGTH, THRESHOLD

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

session = ort.InferenceSession(
    f"{MODEL_PATH}/model.onnx",
    providers=["CPUExecutionProvider"],
)

def verify_response(query: str, context: str, response: str):

    inputs = tokenizer(
        context,
        response,
        truncation=True,
        padding="max_length",
        max_length=MAX_LENGTH,
        return_tensors="np",
    )

    outputs = session.run(
        None,
        {
            "input_ids": inputs["input_ids"],
            "attention_mask": inputs["attention_mask"],
        },
    )

    logits = outputs[0][0]

    exp_logits = np.exp(logits - np.max(logits))
    probabilities = exp_logits / exp_logits.sum()
    print("Logits:", logits)
    print("Probabilities:", probabilities)
    hallucination_probability = float(probabilities[1])

    if hallucination_probability >= THRESHOLD:
        label = "hallucinated"
    else:
        label = "grounded"

    confidence = (
        hallucination_probability
        if label == "hallucinated"
        else 1 - hallucination_probability
    )

    return {
        "label": label,
        "confidence": confidence,
        "hallucination_probability": hallucination_probability,
        "threshold": THRESHOLD,
    }