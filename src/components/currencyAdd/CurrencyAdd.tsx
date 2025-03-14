import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getCurrency } from "../../store/app/actions/appActions";
import { addItemPortfolio } from "../../store/app/slices/appSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Currency } from "../../types";
import { useOutsideClick } from "../../utils/hooks/useOutsideClick";
import Button from "../ui/button/Button";
import styles from "./CurrencyAdd.module.scss";

const CurrencyAdd = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, currency } = useSelector((state: RootState) => state.app);

  const [isFormVisible, setFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const containerRef = useOutsideClick(() => setFormVisible(false));

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const filteredCurrency = useMemo(() => {
    return currency.filter((item) =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, currency]);

  const handleSave = (e: FormEvent<HTMLFormElement>, data: Currency) => {
    e.preventDefault();
    const { symbol, lastPrice, priceChangePercent } = data;
    const quantity = Number(quantityInput);
    const currentPrice = parseFloat(lastPrice);
    const totalValue = quantity * currentPrice;
    const priceChange = parseFloat(priceChangePercent);
    dispatch(
      addItemPortfolio({
        name: symbol,
        quantity,
        currentPrice,
        totalValue,
        priceChangePercent: priceChange,
      }),
    );

    toggleForm();
  };

  useEffect(() => {
    if (isFormVisible) {
      dispatch(getCurrency());
    } else {
      setQuantityInput("1");
      setSearchTerm("");
      setSelectedCurrency(null);
    }
  }, [isFormVisible, dispatch]);

  useEffect(() => {
    console.log(1);
  }, [containerRef]);

  return (
    <div ref={containerRef} className={styles.container}>
      <Button onClick={toggleForm}>{isFormVisible ? "Close" : "Add"}</Button>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.currencyContainer}
          >
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search"
              className={styles.input}
            />
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <ul className={styles.currency}>
                {filteredCurrency.map((item) => {
                  return (
                    <li
                      onClick={() => setSelectedCurrency(item)}
                      key={item.symbol}
                    >
                      <span>{item.symbol}</span>
                      <span>{parseFloat(item.lastPrice)}$</span>
                    </li>
                  );
                })}
              </ul>
            )}

            {selectedCurrency && (
              <form
                className={styles.form}
                onSubmit={(e) => handleSave(e, selectedCurrency)}
              >
                <span>Selected: {selectedCurrency.symbol}</span>
                <input
                  required
                  min={1}
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(e.target.value)}
                  type="number"
                />

                <div className={styles.wrapperButtons}>
                  <Button type="submit" className={styles.saveButton}>
                    Save
                  </Button>
                  <Button
                    onClick={() => setSelectedCurrency(null)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencyAdd;
