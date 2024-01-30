import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from confluent_kafka import Consumer
import json


def send_email(subject, body):
    # Email configuration
    email_config = {
        'sender_email': 'rm69179@gmail.com',
        'recipient_email': 'r.mohammadvand98@gmail.com',
        'smtp_host': 'smtp.gmail.com',
        'smtp_port': 587,
    }

    # Create a MIMEText object with the email body
    msg = MIMEMultipart()
    msg['From'] = email_config['sender_email']
    msg['To'] = email_config['recipient_email']
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    # Create an SMTP connection
    server = smtplib.SMTP(email_config['smtp_host'], email_config['smtp_port'])
    server.starttls()  # Start TLS encryption

    # Login to the SMTP server with your Gmail credentials
    server.login(email_config['sender_email'], 'vfaq igqq msrt usku')

    # Send the email
    server.send_message(msg)

    # Close the SMTP connection
    server.quit()



# Set up Kafka consumer configuration
conf = {
    'bootstrap.servers': 'localhost:9092',  # Replace with your Kafka broker(s)
    'group.id': 'python-consumer',
    'auto.offset.reset': 'earliest'
}

# Create Kafka consumer instance
consumer = Consumer(conf)

# Subscribe to the topic
topic = 'alarm_topic'  # Replace with your Kafka topic
consumer.subscribe([topic])

# Continuously consume messages from Kafka and print them out
while True:
    msg = consumer.poll(1.0)

    if msg is None:
        continue
    if msg.error():
        print("Consumer error: {}".format(msg.error()))
        continue

    # Parse the data
    data = msg.value().decode('utf-8')
    print(data)
    

    #send data
    subject = 'Notification'
    body = json.dumps(data)  # Convert data to JSON string for email body
    send_email(subject, body)

consumer.close()




