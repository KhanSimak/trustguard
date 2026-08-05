from onnxruntime.quantization import quantize_dynamic, QuantType

input_model = "trustguard_onnx/model.onnx"
output_model = "trustguard_onnx/model_quantized.onnx"

quantize_dynamic(
    model_input=input_model,
    model_output=output_model,
    weight_type=QuantType.QInt8
)

print("✅ Quantization completed!")