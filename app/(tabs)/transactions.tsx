import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Button,
  Alert,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import Form from "../components/form";

type RowObj = {
  id: number;
  type: "income" | "expense";
  value: number;
  description: string;
  month_year: string;
};

export default function TransactionsScreen() {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<
    { title: string; data: RowObj[] }[]
  >([]);
  const [renderForm, setRenderForm] = useState(false);
  const [rowObj, setRowObj] = useState<RowObj>();
  useEffect(() => {
    const fetchData = async () => {
      const it = await db.getEachAsync<RowObj>(`
      SELECT id, type, value, description, STRFTIME('%Y-%m', created_at) as month_year  
      FROM transactions 
      ORDER BY created_at DESC;`);

      const temp_arr: RowObj[] = [];

      for await (const row of it) {
        temp_arr.push(row);
      }

      const grouped: Record<string, RowObj[]> = {};
      temp_arr.forEach((transaction) => {
        if (!grouped[transaction.month_year]) {
          grouped[transaction.month_year] = [];
        }
        grouped[transaction.month_year].push(transaction);
      });

      const sections = Object.keys(grouped).map((month_year) => ({
        title: month_year,
        data: grouped[month_year],
      }));

      setTransactions(sections);
    };

    fetchData();
  }, [db]);

  const handleDelete = (item_id: number) => {
    Alert.alert(
      "Delete transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.runAsync(
              `DELETE FROM transactions WHERE id = ${item_id};`,
            );

            setTransactions((prevSections) =>
              prevSections
                .map((section) => ({
                  ...section,
                  data: section.data.filter(
                    (transaction) => transaction.id !== item_id,
                  ),
                }))
                .filter((section) => section.data.length > 0),
            );
          },
        },
      ],
    );
  };

  const handleEdit = (item_id: number) => {
    for (let section of transactions) {
      for (let transaction of section.data) {
        if (transaction.id === item_id) {
          setRowObj(transaction);
          setRenderForm(true);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      {renderForm && (
        <Form
          type="expense"
          category=""
          description=""
          amount={""}
          renderForm={renderForm}
          edit={true}
          item_id={rowObj?.id}
          onClose={() => {
            setRenderForm(false);

            setTransactions((prevSections) =>
              prevSections.map((section) => ({
                ...section,
                data: section.data.map((transaction) =>
                  transaction.id === rowObj?.id
                    ? {
                        ...transaction,
                        description: rowObj.description,
                        value: rowObj.value,
                        type: rowObj.type,
                      }
                    : transaction,
                ),
              })),
            );
          }}
        />
      )}

      <SectionList
        sections={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.monthYearHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              {/* <Text style={styles.type}>{item.type}</Text> */}
              <Button title="Edit" onPress={() => handleEdit(item.id)} />
              <Button title="Delete" onPress={() => handleDelete(item.id)} />
              <Text
                style={[
                  styles.value,
                  { color: item.type === "income" ? "#2e7d32" : "#aa0619" },
                ]}
              >
                {item.value}
              </Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9c7676",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },

  monthYearHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  type: {
    fontSize: 16,
    fontWeight: "600",
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },

  description: {
    fontSize: 14,
    color: "#666",
  },
});
