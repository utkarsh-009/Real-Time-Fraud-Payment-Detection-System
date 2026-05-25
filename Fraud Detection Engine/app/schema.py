from pydantic import BaseModel

class TransactionEvent(BaseModel):
    transactionId: str
    userId: str
    amount: float
    merchant: str
    location: str
    deviceId: str
    createdAt: str