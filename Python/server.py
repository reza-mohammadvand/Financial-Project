from flask import Flask, request, jsonify
from confluent_kafka import Producer

# Create a Flask application
app = Flask(__name__)

# Set up Kafka producer configuration
producer_conf = {
    'bootstrap.servers': 'localhost:9092',  # Kafka broker address
    'client.id': 'flask-producer'  # Identifier for this producer
}

# Create Kafka producer instance
kafka_producer = Producer(producer_conf)

@app.route('/ingest', methods=['POST'])
def ingest_data():
    """
    Ingests data from POST requests and forwards it to Kafka after validation.
    """
    # Get JSON data from the request
    data = request.get_json()

    # Validate the data
    if not validate_data(data):
        # If the data is invalid, return an error response
        return jsonify({"error": "Invalid data"}), 400

    # Forward the validated data to Kafka
    forward_data_to_kafka(data)

    # Return a success response
    return jsonify({"message": "Data received successfully"}), 200

def validate_data(data):
    """
    Validates the received data based on its type.
    """
    # Check the type of the data
    if "data_type" not in data:
        # If "data_type" is not in the data, we assume it's financial data
        required_keys = ["stock_symbol", "opening_price", "closing_price", "high", "low", "volume", "timestamp"]
    else:
        # If "data_type" is in the data, we assume it's additional data
        required_keys = ["data_type", "timestamp"]

    # Check if all required keys are present in the data
    if not all(key in data for key in required_keys):
        return False

    # Additional validation for financial data
    if "data_type" not in data:
        # Check if the stock symbol is a string and the prices, volume, and timestamp are numbers
        if not isinstance(data["stock_symbol"], str) or \
           not all(isinstance(data[key], (int, float)) for key in ["opening_price", "closing_price", "high", "low", "volume"]) or \
           not isinstance(data["timestamp"], (int, float)):
            return False

        # Check if the opening price is less than the high price and the low price is greater than the closing price
        if data["opening_price"] > data["high"] or data["low"] > data["closing_price"]:
            return False

    # Additional validation for additional data
    elif "data_type" in data:
        # Check if the data type is a string and the timestamp is a number
        if not isinstance(data["data_type"], str) or not isinstance(data["timestamp"], (int, float)):
            return False

        # Depending on the data type, check if the required keys are present and of the correct type
        if data["data_type"] == "order_book":
            if not all(key in data for key in ["stock_symbol", "order_type", "price", "quantity"]):
                return False
        elif data["data_type"] == "news_sentiment":
            if not all(key in data for key in ["stock_symbol", "sentiment_score", "sentiment_magnitude"]):
                return False
        elif data["data_type"] == "market_data":
            if not all(key in data for key in ["stock_symbol", "market_cap", "pe_ratio"]):
                return False
        elif data["data_type"] == "economic_indicator":
            if not all(key in data for key in ["indicator_name", "value"]):
                return False

    # If all checks pass, the data is valid
    return True

def forward_data_to_kafka(data):
    """
    Forwards the validated data to Kafka.
    """
    try:
        # Produce data to the Kafka topic 'validated_data'
        kafka_producer.produce('validated_data', key=None, value=str(data))
        kafka_producer.flush()  # Ensure that all messages are sent

        print(f"Received data and forwarded it to Kafka on port 9092")

    except Exception as e:
        print(f"Error forwarding data to Kafka: {e}")

if __name__ == '__main__':
    # Run the Flask application
    app.run(port=5000)
