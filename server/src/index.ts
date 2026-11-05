import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { initSocketServer } from './socket/socketServer';

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  initSocketServer(server, CLIENT_URL);

  server.listen(PORT, () => {
    console.log(`🚀 CommuniMart Server running on port ${PORT}`);
    console.log(`📡 WebSocket ready for gated community real-time sync`);
  });
};

startServer().catch(err => {
  console.error('Fatal startup error:', err);
});

