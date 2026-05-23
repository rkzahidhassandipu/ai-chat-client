
import { io, Socket } from "socket.io-client";

class ChatSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket", "polling"],
      auth: {
        token,
      },
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export const chatSocketService = new ChatSocketService();