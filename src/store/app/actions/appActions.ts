import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { Currency } from "../../../types";

export const getCurrency = createAsyncThunk("app/getCurrency", async () => {
  try {
    const { data } = await axios.get<Currency[]>(
      "https://api.binance.com/api/v3/ticker/24hr",
    );

    return data;
  } catch {
    throw new Error("Somothing want wrong");
  }
});
