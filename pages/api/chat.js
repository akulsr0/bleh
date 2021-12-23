import { Server } from "socket.io";
import Room from "../../models/Room";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    let users = [];

    io.on("connection", (socket) => {
      // When user joins
      socket.on("user-joined", (payload) => {
        const { username, roomId } = payload;
        socket.join(roomId);
        users.push({ id: socket.id, username });
        io.to(roomId).emit("user-joined", { username: username });
      });

      // When user sends message
      socket.on("chat-message", (payload) => {
        const { roomId, username, msg } = payload;
        io.to(roomId).emit("message", { username, msg });
      });

      socket.on("user-left", (payload) => {
        const { username, roomId } = payload;
        users = users.filter((u) => u.username !== username);

        // Last user left, delete the room
        if (users.length <= 0) {
          Room.find({ roomId }).deleteOne().exec();
        }

        io.to(roomId).emit("user-left", { username });
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
