#!/bin/bash
mkdir -p /data/floors
mkdir -p /data/documents
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2