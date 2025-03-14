import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { removeItemPortfolio } from "../../store/app/slices/appSlice";
import { AppDispatch, RootState } from "../../store/store";
import {
  wsConnect,
  wsDisconnect,
} from "../../store/websocket/action/websocketMiddleware";
import styles from "./Table.module.scss";

function roundUpToHundredths(number: number) {
  return Math.ceil(number * 100) / 100;
}

const headerItems: Array<string> = [
  "asset",
  "quantity",
  "price",
  "total cost",
  "Change in 24 hours",
  "portfolio %",
];

const BASE_URL = "wss://stream.binance.com:9443/stream?streams=";

const Table = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { portfolio } = useSelector((state: RootState) => state.app);

  const total = portfolio.reduce((acc, el) => (acc += el.totalValue), 0);

  const ticker = useMemo(
    () => portfolio.map((item) => `${item.name.toLowerCase()}@ticker`),
    [portfolio],
  );

  const handleCell = (name: string) => {
    dispatch(removeItemPortfolio(name));
  };

  useEffect(() => {
    if (portfolio.length) {
      dispatch(wsDisconnect());
      dispatch(
        wsConnect({
          url: BASE_URL + ticker.join("/"),
        }),
      );
    } else {
      dispatch(wsDisconnect());
    }
  }, [portfolio]);

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.table}>
        <div className={styles.header}>
          {headerItems.map((item) => {
            return (
              <div key={item} className={styles[`cell-${item}`]}>
                {item}
              </div>
            );
          })}
        </div>
        <div className={styles.body}>
          <AnimatePresence>
            {portfolio.map((row) => {
              return (
                <motion.div
                  onClick={() => handleCell(row.name)}
                  onKeyDown={(e) => {
                    if (e.key == "Enter") handleCell(row.name);
                  }}
                  tabIndex={0}
                  key={row.name}
                  className={classNames(styles.row, {
                    [styles.red]: row.priceChangePercent < 0,
                    [styles.green]: row.priceChangePercent > 0,
                  })}
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -200, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.cell}>
                    {row.name.replace("USDT", "")}
                  </div>
                  <div className={styles.cell}>{row.quantity}</div>
                  <div className={styles.cell}>{row.currentPrice}</div>
                  <div className={styles.cell}>{row.totalValue}</div>
                  <div
                    className={classNames(styles.cell, {
                      [styles.red]: row.priceChangePercent < 0,
                      [styles.green]: row.priceChangePercent > 0,
                    })}
                  >
                    {row.priceChangePercent > 0 && "+"}
                    {roundUpToHundredths(row.priceChangePercent)}%
                  </div>
                  <div className={styles.cell}>
                    {roundUpToHundredths((row.totalValue / total) * 100)}%
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Table;
