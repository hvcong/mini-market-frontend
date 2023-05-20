import io from "socket.io-client";
import { baseURL } from "../api/axiosClient";

export default function connectSocketIo() {
  const socket = io(baseURL);
  handleListentSocket(socket, io);

  return socket;
}

function handleListentSocket(socket, io) {
  socket.on("connect", () => {
    console.log(socket.id); // "G5p5..."
  });
}
