```markdown
# Real-time Financial Data Analysis and Trading Signal Generation

## Table of Contents
1. [Introduction](#introduction)
2. [Objective](#objective)
3. [Project Overview](#project-overview)
4. [Implementation](#implementation)
5. [Getting Started](#getting-started)


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

## Implementation <a name="implementation"></a>
The `generator.py` file generates data about different stocks and news about different stocks. This data is sent to port 5000. Another file named `server` receives this data from port 5000 and after validating it, sends it through the Kafka server on port 9092 with the subject `validated_data`. A Java file takes this data and calculates 3 indicators for each share, which are `rsi`, `ema`, and `ma`. These indicators are calculated for each data received from each stock and added to that data. It then sends this data through Kafka with the `Processed_data` topic.

A Python file named `signal_service` takes this data and issues a buy, sell, or neutral signal according to the added indicators. It also generates signals for stock news data according to the type and importance of purchases. After generating the signal, it adds it to the data and sends it via WebSocket on port 5678. If it is a buy or sell signal, it is sent via Kafka with `alarm_topic`. This data is received in the Python `notification` file and the program sends a signal alert email to a specified email address. 

The `addData` JavaScript file listens on port 5678 and implements it in the dashboard when data arrives. The data for each stock is put in separate charts in the dashboard and these charts are updated every time the data comes in. Also, generated signals are displayed on the web.

## Getting Started <a name="getting-started"></a>
Instructions for setting up your project locally. Steps for installation, software requirements, and how to run the system.


```
