package org.example.service;


import lombok.RequiredArgsConstructor;
import org.example.dto.TransactionRequestDTO;
import org.example.dto.TransactionResponseDTO;
import org.example.entity.Transaction;
import org.example.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository txnRepository;

    @Override
    public TransactionResponseDTO createTxn(TransactionRequestDTO txnReq) {
        Transaction txnResponse = Transaction.builder()
                .txnId(UUID.randomUUID().toString())
                .userId(txnReq.getUserId())
                .amount(txnReq.getAmount())
                .merchant(txnReq.getMerchant())
                .location(txnReq.getLocation())
                .deviceId(txnReq.getDeviceId())
                .createdDateTime(LocalDateTime.now())
                .build();

        Transaction savedTxn = txnRepository.save(txnResponse);
        return mapTxnToResponse(savedTxn);
    }

    private TransactionResponseDTO mapTxnToResponse(Transaction savedTxn) {
        return TransactionResponseDTO.builder()
                .transactionId(savedTxn.getTxnId())
                .userId(savedTxn.getUserId())
                .amount(savedTxn.getAmount())
                .merchant(savedTxn.getMerchant())
                .location(savedTxn.getLocation())
                .deviceId(savedTxn.getDeviceId())
                .createdAt(savedTxn.getCreatedDateTime())
                .build();
    }

    @Override
    public TransactionResponseDTO getTxnById(Long id) {
        Transaction txn = txnRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return mapTxnToResponse(txn);
    }

    @Override
    public List<TransactionResponseDTO> getAllTxns() {
        return txnRepository.findAll()
                .stream()
                .map(this::mapTxnToResponse)
                .toList();
    }
}
