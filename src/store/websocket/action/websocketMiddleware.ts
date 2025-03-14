import { Middleware } from "@reduxjs/toolkit";
import { createAction } from "@reduxjs/toolkit";

import { messageReceived } from "../../app/slices/appSlice";

export const wsConnect = createAction<{ url: string }>("ws/connect");
export const wsDisconnect = createAction("ws/disconnect");

const websocketMiddleware: Middleware = (store) => {
  let socket: WebSocket | null = null;

  return (next) => (action) => {
    const { dispatch } = store;

    if (wsConnect.match(action)) {
      const { url } = action.payload;
      socket = new WebSocket(url);

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        dispatch(messageReceived(message));
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }

    if (wsDisconnect.match(action) && socket) {
      socket.close();
      socket = null;
    }

    return next(action);
  };
};

export default websocketMiddleware;
