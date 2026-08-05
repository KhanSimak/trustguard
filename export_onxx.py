from optimum.onnxruntime import ORTModelForSequenceClassification
from transformers import AutoTokenizer

MODEL_PATH = "./best_model"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

print("Exporting model to ONNX...")
ort_model = ORTModelForSequenceClassification.from_pretrained(
    MODEL_PATH,
    export=True,
)

ort_model.save_pretrained("./trustguard_onnx")
tokenizer.save_pretrained("./trustguard_onnx")

print("✅ Export completed successfully!")