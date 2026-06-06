package com.transaction.analysis.kafka;

import com.transaction.analysis.dto.FraudAnalysisEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FraudAlertConsumer {
    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(
            topics = "fraud-analysis",
            groupId = "alert-group"
    )
    public void consume(FraudAnalysisEvent event) {
        System.out.println("Fraud Event: " + event);
        messagingTemplate.convertAndSend(
                "/topic/fraud-alerts",
                event
        );
    }
}
