# (New code - Data Ingestion Service)
# Use a web framework like Flask or FastAPI to create an API to receive data.
# Add validation logic to ensure the received data is in the expected format.
# Forward the validated data to the Stream Processing Service.

# Example using Flask:
# Install Flask: pip install Flask
# Create an endpoint to receive data:
from flask import Flask, request

app = Flask(__name__)

@app.route('/ingest', methods=['POST'])
def ingest_data():
    data = request.get_json()
    # Add validation logic here
    # Forward data to the Stream Processing Service
    return "Data received successfully."

if __name__ == '__main__':
    app.run(debug=True)
