import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import videocallRoutes from "./routes/videocall.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from 'path';
import { initSocket } from "./lib/sockets.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/videocall", videocallRoutes)

initSocket(server);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); 

  app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
  connectDB(); 
});
