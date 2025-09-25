# Makefile pour MoneyWise

# Variables
DOCKER_COMPOSE=docker-compose
NPM=npm
DEPENDENCY_FILE=package-lock.json
TARGET_DIR=node_modules

# Lancer tous les containers avec check si rebuild nécessaire
up:
	@if [ ! -d "$(TARGET_DIR)" ] || [ "$(DEPENDENCY_FILE)" -nt "$(TARGET_DIR)" ]; then \
		echo "Dependencies changed or missing. Rebuilding containers..."; \
		$(DOCKER_COMPOSE) up --build -d; \
	else \
		echo "No changes in dependencies. Starting containers..."; \
		$(DOCKER_COMPOSE) up -d; \
	fi

# Build explicite
build:
	$(DOCKER_COMPOSE) up --build -d

# Arrêter et supprimer tous les containers
down:
	$(DOCKER_COMPOSE) down

# Installer les dépendances Node.js
install:
	$(NPM) install

# Lancer le serveur en dev avec nodemon
dev:
	$(DOCKER_COMPOSE) exec app $(NPM) run dev

# Lancer le serveur en prod
start:
	$(DOCKER_COMPOSE) exec app $(NPM) start

# Vérifier que tout fonctionne
status:
	$(DOCKER_COMPOSE) ps

# Vérifier que tout fonctionne
open:
	$(DOCKER_COMPOSE) exec app sh
