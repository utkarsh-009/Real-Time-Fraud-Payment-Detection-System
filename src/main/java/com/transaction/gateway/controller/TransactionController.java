package com.transaction.gateway.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.transaction.gateway.dto.TransactionRequestDTO;
import com.transaction.gateway.dto.TransactionResponseDTO;
import com.transaction.gateway.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService txnService;

    @PostMapping
    public TransactionResponseDTO create(@Valid @RequestBody TransactionRequestDTO requestDto) {
        return txnService.createTxn(requestDto);
    }

    @GetMapping("/{id}")
    public TransactionResponseDTO getById(@PathVariable Long id) {
        return txnService.getTxnById(id);
    }

    @GetMapping
    public List<TransactionResponseDTO> getAll() {
        return txnService.getAllTxns();
    }
}
