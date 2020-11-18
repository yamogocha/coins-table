import React, {useEffect, useState} from "react";
import CoinsTable from "./Table";
import "../scss/App.scss";
import {columns} from "../instance";

const App = () => {
  const [data, setData] = useState([]);
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false";
  const getData = async () =>
    await fetch(url)
      .then(res => res.json())
      .then(result => setData(result));

  useEffect(() => {
    getData();
  }, []);

  const sum = key => {
    let total = 0;
    data.forEach(item => {
      total += item[key];
    });
    return total;
  };

  const dayCount = (start, end) => {
    const d1 = Date.parse(start); //this is in milliseconds
    const d2 = Date.parse(end);
    const diffMs = Math.abs(d1 - d2);
    const ONE_DAY = 1000 * 60 * 60 * 24;
    return Math.round(diffMs / ONE_DAY);
  };

  const addData = (key, start, end) => {
    const total = sum(key);
    return data.map(item => ({
      ...item,
      ath_d: dayCount(item[start], item[end]),
      total_market_share_percentage: `${((item[key] / total) * 100).toFixed(
        2
      )}%`
    }));
  };

  return (
    <div className="App">
      <CoinsTable
        data={addData("market_cap", "ath_date", "last_updated")}
        columns={columns}
      />
    </div>
  );
};

export default App;
