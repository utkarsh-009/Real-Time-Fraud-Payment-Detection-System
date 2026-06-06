package com.transaction.gateway.service;


import lombok.RequiredArgsConstructor;
import com.transaction.gateway.dto.TransactionRequestDTO;
import com.transaction.gateway.dto.TransactionResponseDTO;
import com.transaction.gateway.entity.Transaction;
import com.transaction.gateway.event.TransactionEvent;
import com.transaction.gateway.kafka.TransactionProducer;
import com.transaction.gateway.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository txnRepository;

    private final TransactionProducer producer;

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

        TransactionEvent event =
                TransactionEvent.builder()
                        .transactionId(savedTxn.getTxnId())
                        .userId(savedTxn.getUserId())
                        .amount(savedTxn.getAmount())
                        .merchant(savedTxn.getMerchant())
                        .location(savedTxn.getLocation())
                        .deviceId(savedTxn.getDeviceId())
                        .createdAt(savedTxn.getCreatedDateTime())
                        .build();

        producer.publishTransaction(event);
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
