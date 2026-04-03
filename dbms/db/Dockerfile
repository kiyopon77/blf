FROM postgres:15

# Run schema bootstrap on first database initialization.
COPY init.sql /docker-entrypoint-initdb.d/1-init.sql

EXPOSE 5432
