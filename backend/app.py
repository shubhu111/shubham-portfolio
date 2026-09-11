import gradio as gr
from main import app as fastapi_app
import uvicorn

# 1. Create a dummy UI to satisfy Hugging Face's Gradio requirement
demo = gr.Interface(
    fn=lambda: "ST-Buddy FastAPI Engine is Online & Routing Traffic.",
    inputs=None,
    outputs="text",
    title="ST-Buddy AI Engine"
)

# 2. Mount your actual FastAPI application onto the Gradio server
app = gr.mount_gradio_app(fastapi_app, demo, path="/ui")

# 3. CRITICAL FIX: Tell the server to stay awake and listen on HF's required port
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)