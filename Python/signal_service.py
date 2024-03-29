from confluent_kafka import Consumer, Producer
import json
import asyncio
import websockets

# Set up Kafka producer configuration
producer_conf = {
     'bootstrap.servers': 'localhost:9092', # Replace with your Kafka broker(s)
}

# Create Kafka producer instance
producer = Producer(producer_conf)

def generate_signal(data):
     # Check the data type
     data_type = data.get('data_type')

     if data_type is None:
         # Get the stock symbol and indicators
         stock_symbol = data.get('stock_symbol')
         rsi = data.get('rsi')
         moving_average = data.get('moving_average')
         exponential_moving_average = data.get('exponential_moving_average')

         # Round the values to 2 decimal places
         data["rsi"] = round(data.get('rsi'), 2)
         data["moving_average"] = round(data.get('moving_average'), 2)
         data["exponential_moving_average"] = round(data.get('exponential_moving_average'), 2)
         data["opening_price"] = round(data.get('opening_price'), 2)
         data["high"] = round(data.get('high'), 2)
         data["low"] = round(data.get('low'), 2)
         data["closing_price"] = round(data.get('closing_price'), 2)

         # Generate a signal based on the RSI
         rsi_signal = 'Buy' if rsi < 40 else 'Sell' if rsi > 70 else 'Neutral'
         data["rsi_signal"] = rsi_signal

         # Generate a signal based on the moving average
         ma_signal = 'Buy' if moving_average < data.get('closing_price') else 'Sell' if moving_average > data.get('closing_price') else 'Neutral'
         data["ma_signal"] = ma_signal

         # Generate a signal based on the exponential moving average
         ema_signal = 'Buy' if exponential_moving_average < data.get('closing_price') else 'Sell' if exponential_moving_average > data.get('closing_price') else 'Neutral'
         data["ema_signal"] = ema_signal

         # Count the number of buy and sell signals
         signals = [rsi_signal, ma_signal, ema_signal]
         buy_signals = signals.count('Buy')
         sell_signals = signals.count('Sell')

         # Only print a signal if three indicators agree
         if buy_signals == 3:
             signal = 'Buy'
         elif sell_signals == 3:
             signal = 'Sell'
         else:
             signal = 'Neutral'
        
         data["final_signal"] = signal

         return f'Signals for {stock_symbol}: RSI ({rsi}) signal is {rsi_signal}, Moving Average ({moving_average}) signal is {ma_signal}, Exponential Moving Average ({exponential_moving_average}) signal is {ema_signal}. Final signal is {signal}.'

     elif data_type == 'news_sentiment':
         # Get the stock symbol and sentiment score
         stock_symbol = data.get('stock_symbol')
         sentiment_score = data.get('sentiment_score')
         sentiment_magnitude = data.get('sentiment_magnitude')

         # Round the sentiment score and magnitude to 2 decimal places
         data["sentiment_score"] = round(data.get('sentiment_score'), 2)
         data["sentiment_magnitude"] = round(data.get('sentiment_magnitude'), 2)

         # Generate a signal based on the sentiment score
         if sentiment_score > 0.5 and sentiment_magnitude > 0.5:
             data["final_signal"] = "Buy"
             return f'Buy signal for {stock_symbol}: News sentiment is positive ({sentiment_score})'
            
         elif sentiment_score < -0.5 and sentiment_magnitude > 0.5:
             data["final_signal"] = "Sell"
             return f'Sell signal for {stock_symbol}: News sentiment is negative ({sentiment_score})'
         else:
             data["final_signal"] = "Neutral"
             return f'Neutral signal for {stock_symbol}: News sentiment is neutral ({sentiment_score})'

     elif data_type == 'economic_indicator':
         # Get the indicator name and value
         indicator_name = data.get('indicator_name')
         value = data.get('value')

         data["value"] = round(data.get('value'), 2)

         # Generate a signal based on the economic indicator
         if indicator_name == 'GDP Growth Rate' and value > 3:
             data["final_signal"] = "Buy"
             return f'Buy signal: {indicator_name} is positive ({value})'
         elif indicator_name == 'GDP Growth Rate' and value < -3:
             data["final_signal"] = "Sell"
             return f'Sell signal: {indicator_name} is negative ({value})'
         else:
             data["final_signal"] = "Neutral"
             return f'Neutral signal: {indicator_name} is neutral ({value})'

     elif data_type == 'order_book':
         # Get the order type
         order_type = data.get('order_type')
         stock_symbol = data.get('stock_symbol')
         quantity = data.get('quantity')
         price = data.get('price')

         data["price"] = round(data.get('price'), 2)

         # Generate a signal based on the order type
         if order_type == 'buy' and quantity > 70 and price > 600:
             data["final_signal"] = "Buy"
             return f'Buy signal for {stock_symbol}: Order book shows a buy order'
         elif order_type == 'sell' and quantity > 70 and price < 400:
             data["final_signal"] = "Sell"
             return f'Sell signal for {stock_symbol}: Order book shows a sell order'
         else:
             data["final_signal"] = "Neutral"

     elif data_type == 'market_data':
         # Get the stock symbol, market cap, and P/E ratio
         stock_symbol = data.get('stock_symbol')
         market_cap = data.get('market_cap')
         pe_ratio = data.get('pe_ratio')


         market_cap_rounded = market_cap / 1000000000
         data["market_cap"] = round(market_cap_rounded, 2)
         data["pe_ratio"] = round(data.get('pe_ratio'), 2)

         # Generate a signal based on the market cap and P/E ratio
         if market_cap > 1e11 and pe_ratio < 12:
             data["final_signal"] = "Buy"
             return f'Buy signal for {stock_symbol}: High market cap ({market_cap}) and low P/E ratio ({pe_ratio})'
         elif market_cap < 1e10 or pe_ratio > 25:
             data["final_signal"] = "Sell"
             return f'Sell signal for {stock_symbol}: Low market cap ({market_cap}) or high P/E ratio ({pe_ratio})'
         else:
             data["final_signal"] = "Neutral"
             return f'Neutral signal for {stock_symbol}: Market cap ({market_cap}) and P/E ratio ({pe_ratio}) are moderate'

     else:
         # For other data types, no signal is generated
         return None

    
# Set up Kafka consumer configuration
conf = {
    'bootstrap.servers': 'localhost:9092', # Kafka broker(s)
    'group.id': 'python-consumer', # Consumer group ID
    'auto.offset.reset': 'earliest' # Start reading from the beginning of the topic if no offset is stored
}

# Create Kafka consumer instance
consumer = Consumer(conf)

# Topic to subscribe to
topic = 'Processed_data'
consumer.subscribe([topic])

# Asynchronous function to handle incoming data
async def time(websocket, path):
    while True:
        # Poll for new messages
        msg = consumer.poll(1.0)

        # If no message was received, continue to the next iteration
        if msg is None:
            continue
        # If there was an error, print it and continue to the next iteration
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue

        # Parse the message value as JSON
        data = json.loads(msg.value().decode('utf-8'))

        # Generate a trading signal based on the data
        signal = generate_signal(data)

        print("Receive data and send it on port 5678")

        # If the final signal is either "Buy" or "Sell", produce a message to the 'alarm_topic' topic
        if data["final_signal"] in ["Buy", "Sell"]:
            producer.produce('alarm_topic', signal)
            producer.flush()
            print("Send a notification")

        # Send the data to the client connected via WebSocket
        await websocket.send(json.dumps(data))
        await asyncio.sleep(1)

# Start the WebSocket server
start_server = websockets.serve(time, "localhost", 5678)

# Run the server until it is stopped
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

# Close the Kafka consumer
consumer.close()