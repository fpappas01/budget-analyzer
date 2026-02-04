import { View, Text, StyleSheet } from "react-native";


export default function TransactionsScreen() {

  return (
    <View style={styles.container}>
        <Text>Transactions Screen</Text>
        <Text> SOmetin sdfsdf</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9c7676",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
