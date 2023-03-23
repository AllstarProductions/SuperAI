import openai
from flask import Flask, render_template, request, jsonify

API_KEY = "your_api_key_here"
MODEL_NAME = "gpt-3.5-turbo"

import os
openai.api_key = os.environ.get('OPENAI_API_KEY')


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    messages = request.json["messages"]

    response = openai.ChatCompletion.create(
        model=MODEL_NAME,
        messages=messages
    )

    assistant_response = response['choices'][0]['message']['content']

    return jsonify({"response": assistant_response})

if __name__ == "__main__":
    app.run(debug=True)
