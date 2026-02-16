import {
  View,
  Text,
  StyleSheet,
  SectionList,
  Button,
  Alert,
  Pressable,
} from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import Form from "../components/form";
import Ionicons from "@expo/vector-icons/Ionicons";

type RowObj = {
  id: number;
  type: "income" | "expense";
  value: number;
  description: string;
  category_id: number;
  category_name: string;
  complete_date: string;
  month_year: string;
};

function groupByMonth(transactions: RowObj[]) {
  const grouped: Record<string, RowObj[]> = {};
  transactions.forEach((transaction) => {
    if (!grouped[transaction.month_year]) {
      grouped[transaction.month_year] = [];
    }
    grouped[transaction.month_year].push(transaction);
  });
  // console.log(`After the function: ${grouped}`);
  return Object.keys(grouped).map((month_year) => ({
    title: month_year,
    data: grouped[month_year],
  }));
}

export default function TransactionsScreen() {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<RowObj[]>([]);
  const [renderForm, setRenderForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [rowObj, setRowObj] = useState<RowObj>();
  const [countDeleteCategory, setCountDeleteCategory] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const it = await db.getEachAsync<RowObj>(`
      SELECT t.id, t.type, t.value, t.description, t.category_id, c.name as category_name, STRFTIME('%Y-%m-%d', t.created_at) as complete_date, STRFTIME('%Y-%m', t.created_at) as month_year  
      FROM transactions as t JOIN categories as c ON t.category_id = c.id
      ORDER BY t.created_at DESC;`);

      const temp_arr: RowObj[] = [];

      for await (const row of it) {
        temp_arr.push(row);
      }

      setTransactions(temp_arr);
    };

    fetchData();
  }, [db, countDeleteCategory]);

  const sections = groupByMonth(transactions);
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

            setTransactions((prev) =>
              prev.filter((transaction) => transaction.id !== item_id),
            );
          },
        },
      ],
    );
  };

  const handleEdit = (item_id: number) => {
    setEdit(true);
    const transaction = transactions.find((t) => t.id === item_id);
    setRowObj(transaction);
    setRenderForm(true);
  };

  return (
    <View style={styles.container}>
      {renderForm && (
        <Form
          type={rowObj?.type || "income"}
          category={rowObj?.category_name || ""}
          description={rowObj?.description || ""}
          amount={rowObj?.value.toString() || ""}
          date={new Date(rowObj?.complete_date || new Date())}
          renderForm={renderForm}
          edit={edit}
          item_id={rowObj?.id}
          onClose={() => {
            setRenderForm(false);
          }}
          onUpdate={(updatedRow) => {
            setRowObj(updatedRow);
            setTransactions((prev) =>
              prev.map((transaction) =>
                transaction.id === updatedRow.id ? updatedRow : transaction,
              ),
            );
          }}
          onAdd={(newRow) => {
            setTransactions((prev) => [newRow, ...prev]);
          }}
          onDeleteCategory={() => setCountDeleteCategory((prev) => prev + 1)}
        />
      )}
      <Pressable
        onPress={() => {
          setRowObj(undefined);
          setEdit(false);
          setRenderForm(true);
          
        }}
      >
        <Ionicons name="add-circle-outline" size={60} color="#f9fafb" />
      </Pressable>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.monthYearHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View>
                <Text style={styles.category}>{item.category_name}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>

              <View style={styles.rightSide}>
                <Text
                  style={[
                    styles.value,
                    { color: item.type === "income" ? "#2e7d32" : "#c62828" },
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}
                  {item.value}€
                </Text>

                <View style={styles.actions}>
                  <Pressable onPress={() => handleEdit(item.id)}>
                    <Ionicons name="create-outline" size={20} color="#444" />
                  </Pressable>

                  <Pressable onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#c62828" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f2b44",
    padding: 20,
  },

  card: {
    backgroundColor: "#e4d9d9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },

  description: {
    fontSize: 13,
    color: "#777",
  },

  rightSide: {
    alignItems: "flex-end",
  },

  value: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },

  actions: {
    flexDirection: "row",
    gap: 12,
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  type: {
    fontSize: 16,
    fontWeight: "600",
  },
});
