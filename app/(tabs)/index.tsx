import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSQLiteContext } from "expo-sqlite";

import Form from "../components/form";

// const month = new Date().toLocaleString("default", { month: "long" });
const screenWidth = Dimensions.get("window").width;

type RowObj = {
  type: "income" | "expense";
  total: number;
  month: string;
};


export default function Index() {
  const [income, setIncome] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [expenses, setExpenses] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [year, setYear] = useState(new Date().getFullYear());

  const db = useSQLiteContext();

  useEffect(() => {
    (async () => {
      const temp_arr_expenses: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const temp_arr_incomes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      await db
        .getAllAsync<RowObj>(
          `
      SELECT type, SUM(value) as total, STRFTIME('%m', created_at) as month
      FROM transactions 
      WHERE created_at >= '${year}-01-01' AND created_at <= '${year}-12-31'
      GROUP BY month, type
      ORDER BY month ASC;
  `,
        )
        .then((rows) => {
          rows.forEach((row) => {
            if (row.type === "expense") {
              temp_arr_expenses[parseInt(row.month) - 1] = row.total;
            } else temp_arr_incomes[parseInt(row.month) - 1] = row.total;
          });
        });

      if (temp_arr_expenses.length !== 0) {
        setExpenses(temp_arr_expenses);
      }
      if (temp_arr_incomes.length !== 0) {
        setIncome(temp_arr_incomes);
      }
    })();
  }, [db, year]);

const expenseChartConfig = {
  backgroundGradientFrom: "#634a4a",
  backgroundGradientTo: "#e4d9d9",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // red
  labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#ce1a1a",
  },
};

const incomeChartConfig = {
  backgroundGradientFrom: "#634a4a",
  backgroundGradientTo: "#e4d9d9",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(34,197,94, ${opacity})`, // green
  labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#027c2f",
  },
};
 return (
  <View style={styles.container}>
    <Text style={styles.screenTitle}>Yearly Financial Overview</Text>

    <View style={styles.card}>
      <Text style={styles.expenseTitle}>{`Expenses (${year})`}</Text>
      <LineChart
        data={{
          labels: [
            "01","02","03","04","05","06",
            "07","08","09","10","11","12",
          ],
          datasets: [{ data: expenses }],
        }}
        width={screenWidth - 32}
        height={250}
        yAxisInterval={1}
        chartConfig={expenseChartConfig}
        bezier
        style={styles.chart}
        onDataPointClick={(data) => console.log(data.value)}
      />
    </View>

    <View style={styles.card}>
      <Text style={styles.incomeTitle}>{`Income (${year})`}</Text>
      <LineChart
        data={{
          labels: [
            "01","02","03","04","05","06",
            "07","08","09","10","11","12",
          ],
          datasets: [{ data: income }],
        }}
        width={screenWidth - 32}
        height={250}
        yAxisInterval={1}
        chartConfig={incomeChartConfig}
        bezier
        style={styles.chart}
        onDataPointClick={(data) => console.log(data.index)}w
        
      />
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2b44",
    padding: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#f9fafb",
  },
  card: {
    // backgroundColor: "#e4d9d9",
    // borderRadius: 18,
    // padding: 16,
    // marginBottom: 20,
    // shadowColor: "#000",
    // shadowOpacity: 0.4,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 6 },
    // elevation: 6,
    marginBottom: 50,
  },
  expenseTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#ef4444",
  },
  incomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#22c55e",
  },
  chart: {
    borderRadius: 16,
    height: 220,
  },
});
