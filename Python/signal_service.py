from confluent_kafka import Consumer
import json
import asyncio
import websockets


def generate_signal(data):
    # Check the data type
    data_type = data.get('data_type')

    if data_type is None:
        # Get the stock symbol and indicators
        stock_symbol = data.get('stock_symbol')
        rsi = data.get('rsi')
        moving_average = data.get('moving_average')
        exponential_moving_average = data.get('exponential_moving_average')

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

        # Only print a signal if two or more indicators agree
        if buy_signals >= 2:
            signal = 'Buy'
        elif sell_signals >= 2:
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

        # Generate a signal based on the economic indicator
        if indicator_name == 'GDP Growth Rate' and value > 2:
            data["final_signal"] = "Buy"
            return f'Buy signal: {indicator_name} is positive ({value})'
        elif indicator_name == 'GDP Growth Rate' and value < -2:
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

        # Generate a signal based on the order type
        if order_type == 'buy' and quantity > 50 and price > 500:
            data["final_signal"] = "Buy"
            return f'Buy signal for {stock_symbol}: Order book shows a buy order'
        elif order_type == 'sell' and quantity > 50 and price < 500:
            data["final_signal"] = "Sell"
            return f'Sell signal for {stock_symbol}: Order book shows a sell order'
        else:
            data["final_signal"] = "Neutral"

    elif data_type == 'market_data':
        # Get the stock symbol, market cap, and P/E ratio
        stock_symbol = data.get('stock_symbol')
        market_cap = data.get('market_cap')
        pe_ratio = data.get('pe_ratio')

        # Generate a signal based on the market cap and P/E ratio
        if market_cap > 1e11 and pe_ratio < 15:
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
     'bootstrap.servers': 'localhost:9092', # Replace with your Kafka broker(s)
     'group.id': 'python-consumer',
     'auto.offset.reset': 'earliest'
}

# Create Kafka consumer instance
consumer = Consumer(conf)

# Subscribe to the topic
topic = 'Processed_data'
consumer.subscribe([topic])

# Continuously consume messages from Kafka and print them out
async def time(websocket, path):
    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue

        # Parse the data
        data = json.loads(msg.value().decode('utf-8'))

        # Generate a signal based on the data
        signal = generate_signal(data)

        # Print the signal
        print(signal)

        # Send the data to the client
        await websocket.send(json.dumps(data))
        await asyncio.sleep(1)

start_server = websockets.serve(time, "localhost", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

consumer.close()