package org.example.kafka;

import org.example.event.TransactionEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TransactionConsumer {
    @KafkaListener(topics = "transactions", groupId = "fraud-dtn-grp")
    public void consume(TransactionEvent event) {
        System.out.println("Received Event: " + event);
    }
}
