# CommuniMart Troubleshooting Guide

### MongoDB Connection Error
If you see `MongooseServerSelectionError`:
1. Start MongoDB with Docker: `docker compose up -d`
2. Or start Windows MongoDB service: `net start MongoDB`
3. Verify connection string in `.env` matches `mongodb://localhost:27017/communimart`.
