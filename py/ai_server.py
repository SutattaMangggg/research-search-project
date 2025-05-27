from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import numpy as np

app = Flask(__name__)
CORS(app)

model = SentenceTransformer('sentence-transformers/paraphrase-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed_text():
    data = request.get_json()
    text = data.get('text', '')
    if not text.strip():
        return jsonify({'error': 'Empty text'}), 400
    embedding = model.encode(text).tolist()
    return jsonify({'embedding': embedding})

if __name__ == '__main__':
    app.run(host='localhost', port=5001)
