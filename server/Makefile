run:
	docker-compose up api

format:
	docker-compose run --rm pipenv run unify -ri .
	docker-compose run --rm pipenv run yapf -ri .
	docker-compose run --rm pipenv run isort .

type:
	docker-compose run --rm pipenv run mypy .

test:
	docker-compose run --rm pipenv run pytest -vvv -s



	