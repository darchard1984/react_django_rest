FROM ubuntu:20.04
ENV LANG C.UTF-8
RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y --no-install-recommends \
    build-essential \
    python3.8-dev \
    python3.8 \
    pipenv \
    libpq-dev \
    && adduser --disabled-password --gecos "" user
USER user
COPY --chown=user:user Pipfile Pipfile.lock /home/user/api_project/
WORKDIR /home/user/api_project
RUN pipenv install --deploy --dev
EXPOSE 8080
ENTRYPOINT ["pipenv"]
CMD ["run", "uwsgi", "--ini", "./uwsgi.ini"]
