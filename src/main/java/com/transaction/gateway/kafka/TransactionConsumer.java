package com.transaction.gateway.kafka;

import org.springframework.stereotype.Component;

@Component
public class TransactionConsumer {
    /*
     * The Python prediction engine is the consumer for the transactions topic.
     * Keeping a Java listener here creates a second, unnecessary consumer that can
     * block on older records whose JSON shape does not match TransactionEvent.
     */
}
