# Real-time Financial Data Analysis and Trading Signal Generation

## Table of Contents
1. [Introduction](#introduction)
2. [Objective](#objective)
3. [Project Overview](#project-overview)
4. [Technologies Used](#technologies-used)
5. [Challenges Faced](#challenges-faced)
6. [Description of the Codes](#description-of-the-codes)
7. [Implementation](#Project-Implementation)

## Introduction <a name="introduction"></a>
Welcome to our real-time financial data analysis project. In the fast-paced world of financial markets, quick and informed decision-making is crucial. This project is designed to provide real-time insights by analyzing simulated financial data and generating actionable trading signals. It uses distributed computing principles, microservices architecture, and stream processing to deliver these insights.

## Objective <a name="objective"></a>
The objective of this project is to work with simulated financial data, analyze various fields such as `stock_symbol`, `open_price`, etc., and generate actionable trading signals. The system consists of components for data acquisition, stream processing, signal generation, and data visualization that provide real-time financial insight.

## Project Overview <a name="project-overview"></a>
The project involves the development of an architecture based on microservices and the combination of streaming processing, as well as the use of web sockets to provide real-time data. The system is composed of the following services:

1. **Data Generator Script**: Generates and modifies simulated financial data from multiple sources.
2. **Data Ingestion Service**: Receives, validates, and sends simulated data.
3. **Stream Processing Service**: Processes data in real-time, analyzes it, and calculates mandatory trading indicators.
4. **Trading Signal Service**: Generates buy/sell signals based on analyzed data.
5. **Notification Service**: Notifies users immediately when a trading signal is generated.
6. **Visualization Service**: Displays processed data and signals in a user-friendly dashboard.
7. **Aggregator Service**: Summarizes the performance of each stock.
8. **User Interface**: Allows users to interact with the system, view visualized data, and receive notifications.

## Technologies Used <a name="technologies-used"></a>

In this project, I used a variety of technologies to achieve my goals:

1. **Python**: I used Python for creating the data generator script (`generator.py`), the data ingestion service (`server`), and the trading signal service (`signal_service`). Python's simplicity and vast library support made it an ideal choice for these tasks.

2. **Java**: I used Java for the stream processing service. Java's robustness and efficiency in handling large data streams made it suitable for real-time data processing.

3. **Kafka**: I used Kafka as the messaging system to pass data between different services. Kafka provides a distributed stream processing system which is perfect for our use case.

4. **WebSockets**: I used WebSockets for real-time data transmission between the server and the client. They provide a persistent connection between the client and the server and allow both parties to start sending data at any time.

5. **JavaScript**: I used JavaScript for updating the dashboard in real-time. It listens to the WebSocket and updates the dashboard whenever new data arrives.

## Challenges Faced <a name="challenges-faced"></a>

During the development of this project, I faced several challenges:

1. **Real-time Data Processing**: One of the main challenges was processing the simulated financial data in real-time. The data is continuously generated and needed to be processed as soon as it arrived to generate trading signals.

2. **Microservices Architecture**: Designing and implementing a microservices architecture was challenging. Each service should be loosely coupled and independently deployable, which required careful design.

3. **Data Validation**: The data received from the generator script needed to be validated before it could be processed. Implementing a robust validation mechanism was challenging.

4. **Signal Generation**: Generating buy/sell signals based on the analyzed data was another challenge. The signals should accurately reflect the state of the market to be useful.

5. **Notification Service**: Implementing a notification service that sends an email whenever a trading signal is generated was challenging. The service should be reliable and must not miss any signals.

6. **Data Visualization**: Visualizing the processed data and signals in a user-friendly dashboard was also a challenge. The dashboard should be updated in real-time and should be easy to understand.


## Description of the codes <a name="description-of-the-codes"></a>
The `generator.py` file generates data about different stocks and news about different stocks. This data is sent to port 5000. Another file named `server` receives this data from port 5000 and after validating it, sends it through the Kafka server on port 9092 with the subject `validated_data`. A Java file takes this data and calculates 3 indicators for each share, which are `rsi`, `ema`, and `ma`. These indicators are calculated for each data received from each stock and added to that data. It then sends this data through Kafka with the `Processed_data` topic.

A Python file named `signal_service` takes this data and issues a buy, sell, or neutral signal according to the added indicators. It also generates signals for stock news data according to the type and importance of purchases. After generating the signal, it adds it to the data and sends it via WebSocket on port 5678. If it is a buy or sell signal, it is sent via Kafka with `alarm_topic`. This data is received in the Python `notification` file and the program sends a signal alert email to a specified email address. 

The `addData` JavaScript file listens on port 5678 and implements it in the dashboard when data arrives. The data for each stock is put in separate charts in the dashboard and these charts are updated every time the data comes in. Also, generated signals are displayed on the web.
Below you can see an overview of the project.

### Data Generator (generator.py)

The data generator is a Python script that simulates financial data and additional data for a randomly chosen stock. The script runs continuously, generating and sending data at random intervals between 1 and 5 seconds.

The `generate_data` function simulates financial data such as opening price, closing price, high, low, and volume for a stock. The price changes are simulated using geometric Brownian motion, a common method used in financial mathematics to model stock prices.

The `generate_additional_data` function generates additional data such as order book data, news sentiment data, market data, and economic indicators. The type of additional data to generate is chosen randomly.

The `send_data` function sends the generated data to an API endpoint. If the data fails to send, an error message is printed.

The `send_additional_data` function continuously generates and sends additional data. It runs in a separate thread, so the main thread can continue to generate and send financial data.

The script uses the `psutil` library to set CPU affinity to the first core. This can help improve performance by ensuring that the script runs on a specific CPU core.

### Data Ingestion Service (server.py)

The data ingestion service is a Flask application that receives data from POST requests, validates the data, and forwards it to a Kafka topic. The data can be either financial data or additional data, and the validation checks are different for each type of data.

The `ingest_data` function is the route handler for the `/ingest` endpoint. It gets the JSON data from the request, validates the data using the `validate_data` function, and if the data is valid, forwards it to Kafka using the `forward_data_to_kafka` function.

The `validate_data` function checks if all required keys are present in the data and if their values are of the correct type. For financial data, it also checks if the opening price is less than the high price and the low price is greater than the closing price.

The `forward_data_to_kafka` function sends the validated data to the Kafka topic 'validated_data'. If an error occurs while sending the data, it prints an error message.

The Flask application runs on port 5000 and the Kafka producer connects to a Kafka broker running on localhost at port 9092.

### Kafka Processor (KafkaProcessor.java)

The Kafka processor is a Java application that consumes data from a Kafka topic, processes the data, and then produces the processed data to another Kafka topic.

The `StockIndicators` class is a container for the three types of indicators that are being calculated for each stock: Moving Average (over 14 periods), Exponential Moving Average (with a smoothing factor of 0.5), and Relative Strength Index (RSI, over 14 periods). Each of these indicators is represented by an instance of a class (`MovingAverage`, `ExponentialMovingAverage`, `RSI`) that encapsulates the logic for calculating the respective indicator.

The `parseData` function is a utility function that uses the Gson library to parse a JSON string into a `Map<String, Object>`. The `TypeToken` is used to specify the generic type for the map.

The `convertToJson` function is another utility function that uses the Gson library to convert a `Map<String, Object>` into a JSON string.

The `forwardDataToPython` function is responsible for sending the processed data to another Python application via Kafka. It creates a Kafka producer with the specified properties, defines the Kafka topic to which the data will be sent, converts the data to JSON, and sends it to the Kafka topic. If an error occurs while sending the data, it prints an error message. Finally, it closes the Kafka producer to release its resources.
پ
The `ExponentialMovingAverage` class in Java calculates the exponential moving average (EMA) of a series of numbers. The EMA is a type of moving average that gives more weight to recent data. The degree of weighting decrease is defined by the `alpha` parameter, also known as the smoothing factor.

The `MovingAverage` class in Java calculates the moving average of a series of numbers. The moving average is the average of the most recent `n` numbers, where `n` is the period of the moving average.

The `RSI` class in Java calculates the Relative Strength Index (RSI) of a series of closing prices. The RSI is a momentum oscillator used in technical analysis that measures the speed and change of price movements.

### Signal Service (signal_service.py)

The `signal_service` script sets up a Kafka producer and defines a function `generate_signal` that generates trading signals based on the Relative Strength Index (RSI), moving average, exponential moving average, and news sentiment.

The `generate_signal` function checks the data type of the input data. If the data type is `None`, it treats the data as stock price data and generates trading signals based on the RSI, moving average, and exponential moving average. If the data type is `news_sentiment`, it treats the data as news sentiment data and generates a trading signal based on the sentiment score.

This Python script sets up a Kafka consumer that subscribes to a topic and continuously polls for new messages. When a new message is received, it is parsed as JSON and passed to the `generate_signal` function to generate a trading signal. If the final signal is either "Buy" or "Sell", a message is produced to the 'alarm_topic' topic. The data is then sent to the client connected via WebSocket. The script also starts a WebSocket server that runs until it is stopped.

This script provides a simple and efficient way to generate trading signals from stock price data and news sentiment data, which can be useful in algorithmic trading.

### Email Notifications (notification.py)

This Python script sets up a Kafka consumer that subscribes to a topic and continuously polls for new messages. When a new message is received, it is parsed as JSON and an email is sent with the data as the body. The script also defines a function `send_email` that sends an email with a given subject and body.
This script provides a simple and efficient way to consume data from a Kafka topic and send email notifications based on the data.

### Display on UI (Java Scripts Files)

This script is designed to continuously receive data through a web socket on port 5678 and display them on the graphs and tables defined on the web page. The JavaScript codes are placed in separate files for better readability.

#### script.js

This file contains many main functions:

- **Main Tabs**: Launches jQuery UI tabs to display content vertically on the page.
- **startTime()**: Displays a digital clock with hours, minutes, and seconds.
- **Notification Bell**: Contains several functions related to notifications:
  - `shakeBell()`: Animates the notification bell icon.
  - `updateBadge()`: Updates the notification badge number.
  - `resetNumber()`: Resets the notification badge number.
  - `showNotification()`: Displays a notification message with type, signal, and symbol.
  - `hideNotification()`: Hides the notification message.
- **Search Box**: Implements a search input to filter items in a list. Listens for input events and filters the list based on the input value.
- **Trade Box**: Displays different trade options based on the selected amount. This section creates a new page for each stock and displays information such as purchase and sale information, pie chart, and change table for that stock, where the stock can be bought and sold.
- **Circle Chart**: Launches circle charts to display the final signals of various stocks, which are displayed in the buy and sell section.
- **Table**: Updates the table with the latest stock information including closing price, signal, volume, percent change, and time.

#### addData.js

In this file, we listen to port 5678 and every time data arrives, we send it to different parts of the web page to be displayed.

#### chart.js

In this file, we create two types of charts using the Chart.js library. One chart is drawn for each share, and each chart has 5 price charts, moving average, exponential moving average, RSI, and volume for that share. Also, a function is created for when new data is received, which is used to update the chart. Additionally, a small chart is considered for each share, which is displayed on the main page and only shows the last 15 prices.

## Project Implementation <a name="Project-Implementation"></a>

To implement this project, follow these steps:

1. **Install and run the Kafka server**: Navigate to the Kafka directory, open CMD there and run the Kafka server with these commands:
    ```
    .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
    ```
    ```
    .\bin\windows\kafka-server-start.bat .\config\server.properties
    ```

2. **Run generator.py**: This file generates data for us.

3. **Start server.py**: This validates our data and sends it to the Kafka server.

4. **Run KafkaProcessor.java**: This file gets the data from Kafka, processes it, and then sends it back to the Kafka server.

5. **Run signal_service.py**: This file gets the data from Kafka again and sends it to websocket (port 5678) and Kafka (port 9092) after generating the signal.

6. **Run notification.py**: This file receives the alerts and sends them to the user via email.

7. **Open index.html**: Finally, you can open the index.html file and see the output.

Please note that you need to have Kafka installed and running on your machine to implement this project.

