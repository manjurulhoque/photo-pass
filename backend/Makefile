.PHONY: help install run test clean lint format

help: ## Show this help message
	@echo "Photo Pass API - Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	pip install -r requirements.txt
	pip install pytest pytest-asyncio httpx black isort

run: ## Run the development server
	python run.py

run-prod: ## Run the production server
	uvicorn main:app --host 0.0.0.0 --port 8000

test: ## Run tests
	python test_api.py

clean: ## Clean up generated files
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf uploads/ processed/

lint: ## Run linting checks
	black --check .
	isort --check-only .

format: ## Format code
	black .
	isort .

setup: ## Initial setup
	mkdir -p uploads processed
	python -m venv venv
	@echo "Virtual environment created. Activate it with:"
	@echo "source venv/bin/activate  # On Linux/Mac"
	@echo "venv\\Scripts\\activate     # On Windows"

docker-build: ## Build Docker image
	docker build -t photo-pass-api .

docker-run: ## Run with Docker
	docker run -p 8000:8000 photo-pass-api
