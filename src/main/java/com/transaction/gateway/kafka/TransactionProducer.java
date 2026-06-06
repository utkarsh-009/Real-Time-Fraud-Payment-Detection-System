package com.transaction.gateway.kafka;

import lombok.RequiredArgsConstructor;
import com.transaction.gateway.event.TransactionEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionProducer {
    private final KafkaTemplate<String, TransactionEvent> kafkaTemplate;

    public void publishTransaction(TransactionEvent event) {
        kafkaTemplate.send("transactions", event);
    }
}
