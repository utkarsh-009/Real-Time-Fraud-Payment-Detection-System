package com.transaction.gateway.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

// Data for Server's response
@Data
@Builder
public class TransactionResponseDTO {

    private String transactionId;

    private String userId;

    private Double amount;

    private String merchant;

    private String location;

    private String deviceId;

    private LocalDateTime createdAt;
}