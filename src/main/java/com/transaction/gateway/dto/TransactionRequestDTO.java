package com.transaction.gateway.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// DTO for Client's request
@Data
public class TransactionRequestDTO {

    @NotBlank
    private String userId;

    @NotNull
    private Double amount;

    @NotBlank
    private String merchant;

    @NotBlank
    private String location;

    @NotBlank
    private String deviceId;
}