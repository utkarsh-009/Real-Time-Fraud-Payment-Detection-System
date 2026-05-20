package org.example.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.dto.TransactionRequestDTO;
import org.example.dto.TransactionResponseDTO;
import org.example.service.TransactionService;
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
