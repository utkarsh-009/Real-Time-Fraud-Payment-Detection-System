package com.transaction.gateway.event;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEvent {

    private String transactionId;

    private String userId;

    private Double amount;

    private String merchant;

    private String location;

    private String deviceId;

    private LocalDateTime createdAt;
}