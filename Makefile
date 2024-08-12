RED = \033[1;31m
GREEN = \033[1;32m
RESET = \033[0m
MAGENT = \033[1;35m
YELLOW = \033[1;33m
BLUE = \033[1;34m

all: up

check:
	@for fname in ".env" "./frontend/.env.production"; \
	do \
		if [ ! -f $$fname ]; then \
			echo "$(RED)$$fname file not found$(RESET)" ; \
			exit 1 ; \
		fi \
	done 

up: check
	@echo "$(MAGENT)Starting containers...$(RESET)"
	@docker compose up -d
	@echo "$(GREEN)Containers started$(RESET)"

down:
	@echo "$(RED)Stopping containers...$(RESET)"
	@docker compose down
	@echo "$(RED)Containers stopped$(RESET)"

fclean:
	@printf "$(RED)$(YELLOW)WARNING:$(RESET)$(RED) This will remove all containers, volumes and networks.$(RESET)\n"
	@read -p  " [y/N] " ans && ans=$${ans:-N} ; \
    if [ $${ans} = y ] || [ $${ans} = Y ]; then \
		docker compose down -v ; \
		echo "$(RED)All containers and volumes removed$(RESET)" ; \
	else \
		echo "$(YELLOW)Aborted$(RESET)" ; \
	fi

status:
	@docker-compose ps


.PHONY: all up down fclean status check