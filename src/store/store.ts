import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./app/slices/appSlice";
import websocketMiddleware from "./websocket/action/websocketMiddleware";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(websocketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
