#!/bin/bash
chmod -R 777 /data
mkdir -p /data/floors
mkdir -p /data/documents
exec uvicorn app.main:app --host 0.0.0.0 --port 8000