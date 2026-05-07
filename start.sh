#!/bin/bash
set -e
chmod 777 /data
exec uvicorn app.main:app --host 0.0.0.0 --port 8000