import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
// import { testAi } from './src/services/ai.service.js';
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 8000;
const httpServer = http.createServer(app);

initSocket(httpServer);

// testAi()

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the process with an error code
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
