import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const month = new Date().toLocaleString("default", { month: "long" });
const income = 1838;
const expenses = 1000;
const screenWidth = Dimensions.get("window").width;

export default function Index() {
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