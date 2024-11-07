FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    wget \
    git \
    # npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

CMD ["bash"]