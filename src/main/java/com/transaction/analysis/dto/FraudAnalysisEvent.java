package com.transaction.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudAnalysisEvent {
    private String txnId;
    private String userId;
    private Double riskScore;
    private Boolean isFraud;
}
