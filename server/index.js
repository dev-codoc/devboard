const express = require("express");
const http = require("http");
const { server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const httpServer = http.createServer(app);
const io = new server({
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/teams", require("./routes/teams"));
app.use("/standups", require("./routes/standups"));

io.on("connection", (socket) => {
  console.log("Socket connected: " + socket.id);

  socket.on("join:Team", (teamId) => {
    socket.join(teamId);
    console.log(`Socket ${socket.id} joined room: ${teamId}`);
  });

  socket.on("presence:Join", (teamId, user) => {
    socket.to(teamId).emit("presence:online", user);
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected: " + socket.id);
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server on port ${PORT}`));
