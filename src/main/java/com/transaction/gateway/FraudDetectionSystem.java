package com.transaction.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.transaction")
public class FraudDetectionSystem {
    public static void main(String[] args) {
        SpringApplication.run(FraudDetectionSystem.class, args);
    }
}
