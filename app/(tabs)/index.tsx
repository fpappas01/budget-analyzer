import React, { useEffect, useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useSQLiteContext } from "expo-sqlite";
// import Db from "../db";

const month = new Date().toLocaleString("default", { month: "long" });
const screenWidth = Dimensions.get("window").width;

type RowObj = {
  type: "income" | "expense";
  total: number;
};

export default function Index() {
  const [income, setIncome] = useState(200);
  const [expenses, setExpenses] = useState(100);

  const db = useSQLiteContext();

  useEffect(() => {
    (async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        type TEXT NOT NULL,
        value REAL NOT NULL,
        description TEXT,
        category_id INTEGER,
        created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
        foreign key(category_id) references categories(id)
        
      );

      DELETE FROM transactions;
      DELETE FROM categories;

      PRAGMA FOREIGN_KEYS = ON;
      PRAGMA journal_mode = WAL;

      INSERT INTO categories (name) VALUES ('Shopping');
      INSERT INTO categories (name) VALUES ('Groceries');

      INSERT INTO transactions (type, value, description, category_id, created_at) VALUES
      ('income', 1200.00, 'January salary', 2, '2026-01-02 09:00:00'),
      ('expense', 85.40, 'Supermarket run', 2, '2026-01-03 18:20:00'),
      ('expense', 42.99, 'Online shopping', 1, '2026-01-05 21:10:00'),
      ('expense', 15.20, 'Groceries', 2, '2026-01-08 12:30:00'),
      ('income', 150.00, 'Freelance task', 2, '2026-01-10 14:15:00'),
      ('expense', 220.75, 'Clothes', 1, '2026-01-12 17:45:00'),
      ('expense', 64.10, 'Weekly groceries', 2, '2026-01-15 13:05:00'),
      ('expense', 33.50, 'Household items', 1, '2026-01-18 19:40:00'),
      ('income', 90.00, 'Sold old item', 1, '2026-01-21 11:25:00'),
      ('expense', 72.30, 'Groceries', 2, '2026-01-24 16:55:00'),
      ('expense', 140.00, 'Shoes', 1, '2026-01-27 20:10:00'),
      ('expense', 58.90, 'End of month groceries', 2, '2026-01-30 18:35:00');


      
      INSERT INTO transactions (type, value, description, category_id) VALUES ('income', 235.66, 'desc1', 2);
      INSERT INTO transactions (type, value, description, category_id) VALUES ('expense', 422.66, 'desc2', 1);
      INSERT INTO transactions (type, value, description, category_id) VALUES ('income', 25.66, 'desc3', 2);
      INSERT INTO transactions (type, value, description, category_id) VALUES ('expense', 2400.66, 'desc4', 2);
      INSERT INTO transactions (type, value, description, category_id) VALUES ('expense', 125.66, 'desc5', 1);

      INSERT INTO transactions (type, value, description, category_id, created_at) VALUES
      ('income', 1250.00, 'March salary', 2, '2026-03-01 09:10:00'),
      ('expense', 78.60, 'Groceries', 2, '2026-03-02 18:25:00'),
      ('expense', 49.99, 'Online order', 1, '2026-03-04 21:15:00'),
      ('expense', 22.30, 'Market', 2, '2026-03-06 12:40:00'),
      ('income', 200.00, 'Side project', 2, '2026-03-08 15:00:00'),
      ('expense', 180.45, 'Jacket', 1, '2026-03-10 17:20:00'),
      ('expense', 69.80, 'Weekly groceries', 2, '2026-03-13 13:50:00'),
      ('expense', 35.00, 'Home supplies', 1, '2026-03-16 19:30:00'),
      ('income', 60.00, 'Refund', 1, '2026-03-19 10:45:00'),
      ('expense', 74.25, 'Groceries', 2, '2026-03-22 17:10:00'),
      ('expense', 120.00, 'Electronics accessory', 1, '2026-03-25 20:05:00'),
      ('expense', 55.60, 'End of month groceries', 2, '2026-03-29 18:55:00');


      `);
    })();
  }, [db]);

  // const db = Db();

  const InitFun = async () => {
    await db
      .getAllAsync<RowObj>(
        `
      SELECT type, SUM(value) as total FROM transactions WHERE created_at >= '2026-01-01' AND created_at <  '2026-02-01' GROUP BY type;
  `,
      )
      .then((rows) => {
        rows.forEach((row) => {
          console.log(row);
          if (row.type === "income") {
            setIncome(row.total);
          } else setExpenses(row.total);
        });
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> {month} </Text>
      <BarChart
        data={{
          labels: ["Income", "Expenses"],
          datasets: [
            {
              data: [income, expenses],
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisLabel="€"
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundColor: "#646060",
          backgroundGradientFrom: "#b3b1b1",
          backgroundGradientTo: "#e9d6d6",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(22, 58, 99, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />

      <Button title="Set Values" onPress={InitFun} />
      {/* <Button title="Add Row" onPress={RowFun} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#9c7676",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
});
