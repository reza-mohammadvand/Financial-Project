import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.clients.producer.*;

import java.util.Collections;
import java.util.Properties;

public class KafkaProccessor {
    public static void main(String[] args) {

        // Set up Kafka consumer configuration
        Properties consumerProps = new Properties();
        consumerProps.put("bootstrap.servers", "localhost:9092");
        consumerProps.put("group.id", "test");
        consumerProps.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        consumerProps.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

        // Create Kafka producer and consumer instances
        Consumer<String, String> consumer = new KafkaConsumer<>(consumerProps);

        // Subscribe to the topic
        String topic = "validated_data";
        consumer.subscribe(Collections.singletonList(topic));

        // Continuously consume messages from Kafka and print them out
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(100);
            for (ConsumerRecord<String, String> record : records) {
                System.out.println("Received data: " + record.value());

                // Forward the received data to another Python application
                // You need to implement this part according to your needs
                forwardDataToPython(record.value());
            }
        }
    }

    private static void forwardDataToPython(String data) {
// Set up Kafka producer configuration
        Properties producerProps = new Properties();
        producerProps.put("bootstrap.servers", "localhost:9092");
        producerProps.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        producerProps.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

        // Create Kafka producer instance
        Producer<String, String> producer = new KafkaProducer<>(producerProps);

        // Define the topic to which the data will be sent
        String topic = "signal_data";

        // Send the data to the topic
        producer.send(new ProducerRecord<String, String>(topic, data), new Callback() {
            public void onCompletion(RecordMetadata metadata, Exception e) {
                if(e != null) {
                    e.printStackTrace();
                } else {
                    System.out.println("Forwarded data to Python: " + data);
                }
            }
        });

        // Close the producer
        producer.close();    }
}
