import styles from "./App.module.scss";
import CurrencyAdd from "./components/currencyAdd/CurrencyAdd";
import Table from "./components/table/Table";

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Portfolio Overview</h1>
        <CurrencyAdd />
      </div>
      <Table />
    </div>
  );
}

export default App;
