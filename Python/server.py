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
    print(data)

    return jsonify({"message": "Data received successfully"}), 200

def validate_data(data):
    # # Check if the necessary fields are present
    # if 'timestamp' not in data :
    #     return False

    # # Check the data type
    # if data['data_type'] == 'economic_indicator':
    #     required_fields = ['indicator_name', 'value']
    #     if not all(field in data for field in required_fields):
    #         return False
    #     # Business validation for economic_indicator
    #     if not isinstance(data['value'], (int, float)):
    #         return False

    # elif data['data_type'] == 'market_data':
    #     required_fields = ['stock_symbol', 'market_cap', 'pe_ratio']
    #     if not all(field in data for field in required_fields):
    #         return False
    #     # Business validation for market_data
    #     if not isinstance(data['market_cap'], (int, float)) or not isinstance(data['pe_ratio'], (int, float)):
    #         return False

    # elif data['data_type'] == 'order_book':
    #     required_fields = ['stock_symbol', 'order_type', 'price', 'quantity']
    #     if not all(field in data for field in required_fields):
    #         return False
    #     # Business validation for order_book
    #     if not isinstance(data['price'], (int, float)) or not isinstance(data['quantity'], int):
    #         return False

    # elif data['data_type'] == 'news_sentiment':
    #     required_fields = ['stock_symbol', 'sentiment_score', 'sentiment_magnitude']
    #     if not all(field in data for field in required_fields):
    #         return False
    #     # Business validation for news_sentiment
    #     if not isinstance(data['sentiment_score'], (int, float)) or not isinstance(data['sentiment_magnitude'], (int, float)):
    #         return False

    # else:
    #     required_fields = ['stock_symbol', 'opening_price', 'closing_price', 'high', 'low', 'volume']
    #     if not all(field in data for field in required_fields):
    #         return False
    #     # Business validation for stock data
    #     if not isinstance(data['opening_price'], (int, float)) or not isinstance(data['closing_price'], (int, float)) or not isinstance(data['high'], (int, float)) or not isinstance(data['low'], (int, float)) or not isinstance(data['volume'], int):
    #         return False
    #     if data['opening_price'] > data['high'] or data['closing_price'] < data['low']:
    #         return False
    return True

def forward_data_to_kafka(data):
    try:
        # Produce data to the Kafka topic 'validated_data'
        kafka_producer.produce('validated_data', key=None, value=str(data))
        kafka_producer.flush()  # Ensure that all messages are sent

        print(f"Data forwarded to Kafka: {data}")

    except Exception as e:
        print(f"Error forwarding data to Kafka: {e}")

if __name__ == '__main__':
    app.run(port=5000)

