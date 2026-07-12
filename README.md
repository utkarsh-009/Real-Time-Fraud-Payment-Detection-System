# Real-Time Fraud Payment Detection System

A real-time payment fraud detection project built with Spring Boot, Apache Kafka, PostgreSQL, Python machine learning, WebSockets, and a React dashboard.

The system accepts payment transactions, stores them in PostgreSQL, publishes them to Kafka, analyzes fraud risk through a Python prediction engine, and streams fraud alerts to the dashboard in real time.

## Architecture

```text
Client / API Tool
      |
      v
Spring Boot Transaction API
      |
      | stores transaction
      v
PostgreSQL
      |
      | publishes event
      v
Kafka topic: transactions
      |
      v
Python Fraud Prediction Engine
      |
      | publishes prediction
      v
Kafka topic: fraud-analysis
      |
      v
Spring Boot Fraud Alert Consumer
      |
      | WebSocket / STOMP
      v
React Fraud Dashboard
```

The visual architecture diagram is available at:

![System Architecture Flow](docs/system-architecture-flow.svg)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend API | Java 21, Spring Boot 3.5 |
| Messaging | Apache Kafka, Zookeeper |
| Database | PostgreSQL 16 |
| ML service | Python, scikit-learn, Kafka Python client |
| Frontend | React, Vite, Recharts |
| Real-time alerts | WebSocket, STOMP, SockJS |
| Local infrastructure | Docker Compose |

## Project Structure

```text
.
+-- src/main/java/com/transaction
|   +-- gateway          # Transaction REST API Gateway
|   +-- analysis         # Consumes prediction engine's results to publish it to dashboard using WebSockets
+-- src/main/resources
|   +-- application.yml  # Spring Boot runtime configuration
|   +-- docker-compose.yml
+-- fraud txn prediction engine
|   +-- app              # Python Kafka consumer, prediction pipeline, producer
|   +-- train_model.py   # Synthetic model training script
|   +-- requirements.txt
+-- fraud-txn-dashboard  # React + Vite dashboard
```

## Main Components

### Spring Boot Backend

Runs on `http://localhost:8081`.

Responsibilities:

- Exposes transaction REST APIs.
- Stores transaction records in PostgreSQL.
- Publishes transaction events to Kafka topic `transactions`.
- Consumes fraud results from Kafka topic `fraud-analysis`.
- Pushes fraud alerts to dashboard clients through `/ws-alerts`.

### Python Fraud Prediction Engine

Located in `fraud txn prediction engine`.

Responsibilities:

- Consumes transaction events from Kafka topic `transactions`.
- Extracts fraud features such as high amount, night transaction, risky location, and new device.
- Runs the trained model prediction.
- Publishes fraud results to Kafka topic `fraud-analysis`.

### React Dashboard

Located in `fraud-txn-dashboard`.

Responsibilities:

- Connects to `http://localhost:8081/ws-alerts`.
- Subscribes to `/topic/fraud-alerts`.
- Displays fraud alerts, summaries, and charts in real time.

## Prerequisites

Install these before running the project:

- Java 21
- Maven
- Python 3.10 or later
- Node.js and npm
- Docker Desktop

## Local Setup

### 1. Start Kafka, Zookeeper, and PostgreSQL

From the project root:

```bash
docker compose -f src/main/resources/docker-compose.yml up -d
```

This starts:

- Kafka on `localhost:9092`
- Zookeeper on `localhost:2181`
- PostgreSQL on `localhost:5431`

Database credentials from `application.yml`:

```text
Database: fraud_txns_detection
Username: postgres
Password: password
```

### 2. Start the Spring Boot backend

From the project root:

```bash
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

Swagger UI:

```text
http://localhost:8081/swagger-ui/index.html
```

### 3. Set up and run the Python fraud engine

From the ML service folder:

```bash
cd "fraud txn prediction engine"
pip install -r requirements.txt
python train_model.py
python app/main.py
```

The engine listens to `transactions` and publishes predictions to `fraud-analysis`.

### 4. Start the React dashboard

From the dashboard folder:

```bash
cd fraud-txn-dashboard
npm install
npm run dev
```

Vite will print the local dashboard URL, usually:

```text
http://localhost:5173
```

## API Usage

### Create a transaction

```http
POST http://localhost:8081/api/v1/transactions
Content-Type: application/json
```

```json
{
  "transactionId": "TXN1001",
  "userId": "USER101",
  "amount": 120000,
  "merchant": "Amazon",
  "location": "Russia",
  "deviceId": "NEW-DEVICE-999",
  "timestamp": "2026-05-17T10:15:00"
}
```

The backend stores the transaction and publishes this event to Kafka. The Python service then returns a fraud analysis event like:

```json
{
  "transactionId": "TXN1001",
  "userId": "USER101",
  "riskScore": 0.85,
  "isFraud": true
}
```

### Get all transactions

```http
GET http://localhost:8081/api/v1/transactions
```

### Get a transaction by database ID

```http
GET http://localhost:8081/api/v1/transactions/{id}
```

## Kafka Topics

| Topic | Producer | Consumer | Purpose |
| --- | --- | --- | --- |
| `transactions` | Spring Boot backend | Python fraud engine | Carries new transaction events |
| `fraud-analysis` | Python fraud engine | Spring Boot alert consumer | Carries fraud prediction results |

## Fraud Features

The current ML engine converts each transaction into risk signals. Each signal can increase the final `riskScore`; the model treats transactions with multiple risk signals as more suspicious than transactions with only one weak signal.

| Feature | How it affects risk score |
| --- | --- |
| Transaction amount | Higher amounts increase risk because large fraudulent payments create more financial exposure. The engine also uses `amount_log` so very large values are handled more smoothly. |
| High amount flag | Amounts above `50000` add a risk signal. This does not automatically mean fraud, but it raises suspicion when combined with other signals. |
| Very high amount flag | Amounts above `100000` add a stronger risk signal than normal high-value transactions. |
| Night-time transaction flag | Transactions between midnight and early morning are treated as riskier because unusual payment times can indicate account misuse. |
| Location risk flag | Transactions outside the configured safe locations increase risk. Safe locations currently include Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Pune. |
| High-risk location flag | Locations such as Russia, Nigeria, North Korea, Iran, or Unknown add a stronger risk signal. |
| New device flag | Device IDs that start with `NEW` or end with `999` increase risk because unfamiliar devices are often suspicious. |
| Risky merchant flag | Merchant names containing keywords such as `crypto`, `gift`, `betting`, `casino`, or `wire` increase risk. |
| Risk factor count | The engine counts how many suspicious signals are present. More combined signals usually push the prediction closer to fraud. |

Some combinations increase risk further. For example, a very high amount from a high-risk location, a high amount from a new device, or a night transaction from a risky location will generally receive a higher `riskScore` than any one of those signals alone.

The model is trained with synthetic data using `train_model.py`. This makes the project easy to run locally, but production use would require real historical data, stronger validation, monitoring, retraining, and model governance.

## Real-Time Alert Flow

1. Dashboard connects to `http://localhost:8081/ws-alerts`.
2. Dashboard subscribes to `/topic/fraud-alerts`.
3. Spring Boot consumes `fraud-analysis` events from Kafka.
4. Spring Boot publishes each fraud result to connected dashboard clients.
5. React updates alerts, summaries, and charts without polling.


## Future Enhancements

- Authentication and role-based access
- API rate limiting
- More realistic fraud training data
- Model metrics and retraining pipeline
- Blockchain audit service implementation for critical fraud events
- Prometheus and Grafana monitoring
- Kubernetes deployment
- Cloud deployment pipeline

## Summary

This project demonstrates an end-to-end fraud detection workflow using event-driven architecture. It combines transaction APIs, Kafka streaming, ML-based risk scoring, persistent storage, and live dashboard alerts into one real-time system.
