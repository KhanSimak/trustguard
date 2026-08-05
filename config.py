from huggingface_hub import snapshot_download

MODEL_PATH = snapshot_download(
    repo_id="simak31/trustguard-onxx",
    local_dir="./trustguard_onnx"
)
MAX_LENGTH = 256
THRESHOLD = 0.35