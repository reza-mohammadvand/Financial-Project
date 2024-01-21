from flask import Flask, request, jsonify
from confluent_kafka import Producer

app = Flask(__name__)

# Set up Kafka producer configuration
producer_conf = {
    'bootstrap.servers': 'localhost:9092',  # Replace with your Kafka broker(s)
    'client.id': 'flask-producer'
}

# Create Kafka producer instance
kafka_producer = Producer(producer_conf)

@app.route('/ingest', methods=['POST'])
def ingest_data():
    data = request.get_json()

    # Validate the data...
    # If the data is invalid, return an error response
    if not validate_data(data):
        return jsonify({"error": "Invalid data"}), 400

    # Forward the data to Kafka
    forward_data_to_kafka(data)

    return jsonify({"message": "Data received successfully"}), 200

def validate_data(data):
    # If "data_type" is not in the data, we assume it's the first type of data
    if "data_type" not in data:
        # Define the keys that are required for this data type
        required_keys = ["stock_symbol", "opening_price", "closing_price", "high", "low", "volume", "timestamp"]
        # Check if all required keys are present in the data
        if not all(key in data for key in required_keys):
            return False
        # Check if the stock symbol is a string
        if not isinstance(data["stock_symbol"], str):
            return False
        # Check if the prices, volume and timestamp are numbers (int or float)
        if not all(isinstance(data[key], (int, float)) for key in ["opening_price", "closing_price", "high", "low", "volume"]):
            return False
        # Check if the timestamp is a number (int or float)
        if not isinstance(data["timestamp"], (int, float)):
            return False
        # Check if the opening price is less than the high price and the low price is greater than the closing price
        if data["opening_price"] > data["high"] or  data["low"] > data["closing_price"]:
            return False

    # If "data_type" is in the data, we assume it's the second type of data
    elif "data_type" in data:
        # Define the keys that are required for this data type
        required_keys = ["data_type", "timestamp"]
        # Check if all required keys are present in the data
        if not all(key in data for key in required_keys):
            return False
        # Check if the data type is a string
        if not isinstance(data["data_type"], str):
            return False
        # Check if the timestamp is a number (int or float)
        if not isinstance(data["timestamp"], (int, float)):
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
    # If all checks pass, return True
    return True


def forward_data_to_kafka(data):
    try:
        # Produce data to the Kafka topic 'validated_data'
        kafka_producer.produce('validated_data', key=None, value=str(data))
        kafka_producer.flush()  # Ensure that all messages are sent

        print(f"Data forwarded to Kafka: {data}")

    except Exception as e:
        print(f"Error forwarding data to Kafka: {e}")
        print(f"Exception type: {type(e)}")
        print(f"Exception args: {e.args}")
        print(f"Exception message: {str(e)}")


if __name__ == '__main__':
    app.run(port=5000)

