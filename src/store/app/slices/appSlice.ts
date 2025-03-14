import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { Currency, PortfolioItem, Stream } from "../../../types";
import { getCurrency } from "../actions/appActions";

interface appState {
  portfolio: PortfolioItem[];
  currency: Currency[];
  isLoading: boolean;
  ticker: string[];
}

const initialState: appState = {
  ticker: [],
  portfolio: JSON.parse(localStorage.getItem("portfolio") || "[]"),
  currency: [],
  isLoading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addItemPortfolio: (state, action: PayloadAction<PortfolioItem>) => {
      const existingItemIndex = state.portfolio.findIndex(
        (item: PortfolioItem) => item.name === action.payload.name,
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.portfolio[existingItemIndex];
        existingItem.quantity = action.payload.quantity;
        existingItem.currentPrice = action.payload.currentPrice;
        existingItem.totalValue =
          existingItem.quantity * action.payload.currentPrice;
        existingItem.priceChangePercent = action.payload.priceChangePercent;
      } else {
        state.portfolio.push(action.payload);
      }

      localStorage.setItem("portfolio", JSON.stringify(state.portfolio));
    },
    removeItemPortfolio: (state, action: PayloadAction<string>) => {
      const newPortfolio = state.portfolio.filter(
        (item) => item.name !== action.payload,
      );
      state.portfolio = newPortfolio;
      localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
    },
    messageReceived: (state, action: PayloadAction<Stream>) => {
      const existingItemIndex = state.portfolio.findIndex(
        (item: PortfolioItem) => item.name === action.payload.data.s,
      );
      if (existingItemIndex !== -1) {
        const existingItem = state.portfolio[existingItemIndex];

        existingItem.currentPrice = parseFloat(action.payload.data.c);
        existingItem.totalValue =
          existingItem.quantity * existingItem.currentPrice;
        existingItem.priceChangePercent = parseFloat(action.payload.data.P);
      }
      localStorage.setItem("portfolio", JSON.stringify(state.portfolio));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCurrency.fulfilled, (state, action) => {
      state.currency = action.payload.filter((item) =>
        item.symbol.toLowerCase().includes("usdt"),
      );
      state.isLoading = false;
    });
    builder.addCase(getCurrency.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const { addItemPortfolio, removeItemPortfolio, messageReceived } =
  appSlice.actions;

export default appSlice.reducer;
