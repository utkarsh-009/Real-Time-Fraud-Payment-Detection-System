package com.transaction.gateway.service;

import com.transaction.gateway.dto.TransactionRequestDTO;
import com.transaction.gateway.dto.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {
    TransactionResponseDTO createTxn(TransactionRequestDTO txnReq);

    TransactionResponseDTO getTxnById(Long id);

    List<TransactionResponseDTO> getAllTxns();
}
