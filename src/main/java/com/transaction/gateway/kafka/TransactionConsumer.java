package com.transaction.gateway.kafka;

import com.transaction.gateway.event.TransactionEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TransactionConsumer {
    @KafkaListener(topics = "transactions", groupId = "fraud-dtn-grp")
    public void consume(TransactionEvent event) {
        System.out.println("Received Event: " + event);
    }
}
