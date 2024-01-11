import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Map;
import java.util.Collections;
import java.util.Properties;

public class KafkaProcessor {
    private static final MovingAverage movingAverage = new MovingAverage(14);
    private static final ExponentialMovingAverage exponentialMovingAverage = new ExponentialMovingAverage(0.5); // alpha is 0.5
    private static final RSI rsi = new RSI(14);

    public static void main(String[] args) {
        // Set up Kafka consumer configuration
        Properties consumerProps = new Properties();
        consumerProps.put("bootstrap.servers", "localhost:9092");
        consumerProps.put("group.id", "test");
        consumerProps.put("key.deserializer", StringDeserializer.class.getName());
        consumerProps.put("value.deserializer", StringDeserializer.class.getName());

        // Create Kafka consumer instance
        Consumer<String, String> consumer = new KafkaConsumer<>(consumerProps);

        // Subscribe to the topic
        String topic = "validated_data";
        consumer.subscribe(Collections.singletonList(topic));

        // Continuously consume messages from Kafka and print them out
        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(100);
            for (ConsumerRecord<String, String> record : records) {
                System.out.println("Received data: " + record.value());

                // Parse the data
                Map<String, Object> data = parseData(record.value());

                // Update the indicators
                double closingPrice = (double) data.get("closing_price");
                movingAverage.add(closingPrice);
                exponentialMovingAverage.add(closingPrice);
                rsi.add(closingPrice);

                // Forward the received data and the indicator values to another Python application
                Map<String, Object> forwardData = new HashMap<>(data);
                forwardData.put("moving_average", movingAverage.getAverage());
                forwardData.put("exponential_moving_average", exponentialMovingAverage.getAverage());
                forwardData.put("rsi", rsi.getRSI());
                forwardDataToPython(forwardData);
            }
        }
    }

    private static void forwardDataToPython(Map<String, Object> data) {
        // Set up Kafka producer configuration
        Properties producerProps = new Properties();
        producerProps.put("bootstrap.servers", "localhost:9092");
        producerProps.put("key.serializer", StringSerializer.class.getName());
        producerProps.put("value.serializer", StringSerializer.class.getName());

        // Create Kafka producer instance
        Producer<String, String> producer = new KafkaProducer<>(producerProps);

        // Define the topic to which the data will be sent
        String topic = "signal_data";

        // Convert the data to JSON
        String jsonData = convertToJson(data);

        // Send the data to the topic
        producer.send(new ProducerRecord<String, String>(topic, jsonData), new Callback() {
            public void onCompletion(RecordMetadata metadata, Exception e) {
                if(e != null) {
                    e.printStackTrace();
                } else {
                    System.out.println("Forwarded data to Python: " + jsonData);
                }
            }
        });

        // Close the producer
        producer.close();
    }

    private static Map<String, Object> parseData(String jsonData) {
        // TODO: Implement this method to convert the JSON string into a Map
        return null;
    }

    private static String convertToJson(Map<String, Object> data) {
        // TODO: Implement this method to convert a Map into a JSON string
        return null;
    }
}
