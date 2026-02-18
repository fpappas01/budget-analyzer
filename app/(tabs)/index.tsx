import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSQLiteContext } from "expo-sqlite";
import { useTransactionStore } from "../../stores/TransactionStore";

const screenWidth = Dimensions.get("window").width;



const numsToMonths: Map<number, string> = new Map([
  [0, "January"],
  [1, "February"],
  [2, "March"],
  [3, "April"],
  [4, "May"],
  [5, "June"],
  [6, "July"],
  [7, "August"],
  [8, "September"],
  [9, "October"],
  [10, "November"],
  [11, "December"],
]);

export default function Index() {
  const [income, setIncome] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [expenses, setExpenses] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [yearIncomes, setYearIncomes] = useState(new Date().getFullYear());
  const [yearExpenses, setYearExpenses] = useState(new Date().getFullYear());
  const transactions = useTransactionStore((state) => state.transactions);

  const groupByYear = (year: number, tx_type: string): number[] => {
    const tmp_arr: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let tx_year: number, year_month, tx_month: number;
    transactions.forEach((transaction) => {
      year_month = transaction.month_year.split("-");
      tx_year = parseInt(year_month[0]);
      tx_month = parseInt(year_month[1]);
      if (tx_year === year && transaction.type === tx_type) {
        tmp_arr[tx_month - 1] += transaction.value;
      }
    });
    return tmp_arr;
  };

  const db = useSQLiteContext();

  // useEffect(() => {
  //   (async () => {
      // const temp_arr_expenses: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      // const temp_arr_incomes: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      //     await db
      //       .getAllAsync<RowObj>(
      //         `
      //     SELECT type, SUM(value) as total, STRFTIME('%m', created_at) as month
      //     FROM transactions
      //     WHERE created_at >= '${year}-01-01' AND created_at <= '${year}-12-31'
      //     GROUP BY month, type
      //     ORDER BY month ASC;
      // `,
      //       )
      //       .then((rows) => {
      //         rows.forEach((row) => {
      //           if (row.type === "expense") {
      //             temp_arr_expenses[parseInt(row.month) - 1] = row.total;
      //           } else temp_arr_incomes[parseInt(row.month) - 1] = row.total;
      //         });
      //       });

      // if (temp_arr_expenses.length !== 0) {
      //   setExpenses(temp_arr_expenses);
      // }
      // if (temp_arr_incomes.length !== 0) {
      //   setIncome(temp_arr_incomes);
      // }
  //     setExpenses(groupByYear(yearExpenses, "expenses"));
  //     setIncome(groupByYear(yearIncomes, "income"));
  //   })();
  // }, [db, transactions]);

  useEffect(() => {
  setExpenses(groupByYear(yearExpenses, "expense"));
}, [yearExpenses, transactions, groupByYear]);

useEffect(() => {
  setIncome(groupByYear(yearIncomes, "income"));
}, [yearIncomes, transactions, groupByYear]);


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

  const handlePreviousYear = (type: string) => {
    if (type === "expenses") {
      setYearExpenses((cur) => cur - 1);
    } else {
      setYearIncomes((cur) => cur - 1);
    }
  };

  const handleNextYear = (type: string) => {
    if (type === "expenses") {
      setYearExpenses((cur) => cur + 1);
    } else {
      setYearIncomes((cur) => cur + 1);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Yearly Financial Overview</Text>

      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => handlePreviousYear("expenses")}>
            <Text style={styles.arrow}>◀</Text>
          </Pressable>

          <Text style={styles.expenseTitle}>{`Expenses (${yearExpenses})`}</Text>

          <Pressable onPress={() => handleNextYear("expenses")}>
            <Text style={styles.arrow}>▶</Text>
          </Pressable>
        </View>

        <LineChart
          data={{
            labels: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
            ],
            datasets: [{ data: expenses }],
          }}
          width={screenWidth - 32}
          height={250}
          yAxisInterval={1}
          chartConfig={expenseChartConfig}
          bezier
          style={styles.chart}
          onDataPointClick={(data) => {
            Alert.alert(
              `For month ${numsToMonths.get(data.index)} your total expenses were: ${data.value}€`,
            );
          }}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Pressable onPress={() => handlePreviousYear("income")}>
            <Text style={styles.arrow}>◀</Text>
          </Pressable>

          <Text style={styles.incomeTitle}>{`Income (${yearIncomes})`}</Text>

          <Pressable onPress={() => handleNextYear("income")}>
            <Text style={styles.arrow}>▶</Text>
          </Pressable>
        </View>

        <LineChart
          data={{
            labels: [
              "01",
              "02",
              "03",
              "04",
              "05",
              "06",
              "07",
              "08",
              "09",
              "10",
              "11",
              "12",
            ],
            datasets: [{ data: income }],
          }}
          width={screenWidth - 32}
          height={250}
          yAxisInterval={1}
          chartConfig={incomeChartConfig}
          bezier
          style={styles.chart}
          onDataPointClick={(data) => {
            Alert.alert(
              `For month ${numsToMonths.get(data.index)} your total income was: ${data.value}€`,
            );
          }}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  arrow: {
    fontSize: 18,
    color: "#f9fafb",
    marginHorizontal: 15,
  },
});
