# Real-time Financial Data Analysis and Trading Signal Generation

## Table of Contents
1. [Introduction](#introduction)
2. [Objective](#objective)
3. [Project Overview](#project-overview)
4. [Technologies Used](#Technologies)
5. [Challenges Faced](#Challenges)
6. [Implementation](#implementation)
7. [Getting Started](#getting-started)


## Introduction <a name="introduction"></a>
This project is designed to build a scalable, distributed system that processes and analyzes simulated financial data in real-time to generate actionable trading signals. The system is developed using distributed computing principles, microservices architecture, and stream processing.

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

## Technologies Used <a name="Technologies"></a>

In this project, I used a variety of technologies to achieve my goals:

1. **Python**: I used Python for creating the data generator script (`generator.py`), the data ingestion service (`server`), and the trading signal service (`signal_service`). Python's simplicity and vast library support made it an ideal choice for these tasks.

2. **Java**: I used Java for the stream processing service. Java's robustness and efficiency in handling large data streams made it suitable for real-time data processing.

3. **Kafka**: I used Kafka as the messaging system to pass data between different services. Kafka provides a distributed stream processing system which is perfect for our use case.

4. **WebSockets**: I used WebSockets for real-time data transmission between the server and the client. They provide a persistent connection between the client and the server and allow both parties to start sending data at any time.

5. **JavaScript**: I used JavaScript for updating the dashboard in real-time. It listens to the WebSocket and updates the dashboard whenever new data arrives.

## Challenges Faced <a name="Challenges"></a>

During the development of this project, I faced several challenges:

1. **Real-time Data Processing**: One of the main challenges was processing the simulated financial data in real-time. The data is continuously generated and needed to be processed as soon as it arrived to generate trading signals.

2. **Microservices Architecture**: Designing and implementing a microservices architecture was challenging. Each service should be loosely coupled and independently deployable, which required careful design.

3. **Data Validation**: The data received from the generator script needed to be validated before it could be processed. Implementing a robust validation mechanism was challenging.

4. **Signal Generation**: Generating buy/sell signals based on the analyzed data was another challenge. The signals should accurately reflect the state of the market to be useful.

5. **Notification Service**: Implementing a notification service that sends an email whenever a trading signal is generated was challenging. The service should be reliable and must not miss any signals.

6. **Data Visualization**: Visualizing the processed data and signals in a user-friendly dashboard was also a challenge. The dashboard should be updated in real-time and should be easy to understand.


## Implementation <a name="Implementation"></a>
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







## Getting Started <a name="getting-started"></a>
Instructions for setting up your project locally. Steps for installation, software requirements, and how to run the system.
