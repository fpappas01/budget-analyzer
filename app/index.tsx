import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Budgety</Text>
      <Text> Add Income</Text>
      <Text>Add Expense</Text>

      <Link href={"/tools"}>
      Go to tools</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7c7575",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30
  }
});