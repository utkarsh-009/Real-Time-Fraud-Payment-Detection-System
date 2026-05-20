package org.example.service;

import org.example.dto.TransactionRequestDTO;
import org.example.dto.TransactionResponseDTO;
import org.example.entity.Transaction;

import java.util.List;

public interface TransactionService {
    TransactionResponseDTO createTxn(TransactionRequestDTO txnReq);

    TransactionResponseDTO getTxnById(Long id);

    List<TransactionResponseDTO> getAllTxns();
}
