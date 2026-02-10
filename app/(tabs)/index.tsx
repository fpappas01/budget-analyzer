import React, { useEffect, useState } from "react";
import { Button, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSQLiteContext } from "expo-sqlite";
import { useForm, SubmitHandler } from "react-hook-form"
import Form from "../components/form";

// const month = new Date().toLocaleString("default", { month: "long" });
const screenWidth = Dimensions.get("window").width;

type RowObj = {
  type: "income" | "expense";
  total: number;
  created_at: string;
};

type Inputs = {
  example: string
  exampleRequired: string
}



export default function Index() {
  const [income, setIncome] = useState<number[]>([]);
  const [expenses, setExpenses] = useState<number[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const db = useSQLiteContext();

  useEffect(() => {
    (async () => {
      const temp_arr_expenses: number[] = [];
    const temp_arr_incomes: number[] = [];
      await db
      .getAllAsync<RowObj>(
        `
      SELECT STRFTIME('%m', created_at) as month, type, SUM(value) as total
      FROM transactions 
      WHERE created_at >= '${year}-01-01' AND created_at <= '${year}-12-31'
      GROUP BY month, type
      ORDER BY month ASC;
  `,
      )
      .then((rows) => {
        rows.forEach((row) => {
          if (row.type === "expense") {
            temp_arr_expenses.push(row.total);
          } else temp_arr_incomes.push(row.total);
        });
      });

    setIncome(temp_arr_incomes);
    setExpenses(temp_arr_expenses);
    })();
  }, [db, year]);

  //   const {
  //   register,
  //   handleSubmit,
  //   watch,
  //   formState: { errors },
  // } = useForm<Inputs>()

  const handleAddTransaction = async () => {
    await db.runAsync(
      ``
    );
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>{`Expenses (${year})`}</Text>
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
          datasets: [
            {
              data: expenses,
            },
          ],
        }}
        width={screenWidth}
        height={220}
        // yAxisLabel=""
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#9e846d",
          backgroundGradientFrom: "#584328",
          backgroundGradientTo: "#8d7249",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      <Text style={styles.title}>{`Income (${year})`}</Text>

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
          datasets: [
            {
              data: income,
            },
          ],
        }}
        width={screenWidth}
        height={220}
        // yAxisLabel=""
        // yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#9e846d",
          backgroundGradientFrom: "#584328",
          backgroundGradientTo: "#8d7249",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    <Form />
      {/* <Button title="Add Transaction" onPress={handleAddTransaction}/> */}
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    borderRadius: 16,
  },
});
