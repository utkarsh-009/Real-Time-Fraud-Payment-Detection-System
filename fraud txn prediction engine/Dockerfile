FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app/ ./app
COPY model/ ./model
COPY train_model.py .

# Set PYTHONUNBUFFERED to see logs in real-time
ENV PYTHONUNBUFFERED=1

# Run the fraud detection engine
CMD ["python", "-u", "app/main.py"]
