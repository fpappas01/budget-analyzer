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
import Ionicons from '@expo/vector-icons/Ionicons';

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
  }, [db]);

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
            setTransactions((prev) => [...prev, newRow]);
            console.log(transactions);
          }
        }
        />
      )}
      <Pressable onPress={() => {
        setRowObj(undefined);
        setEdit(false);
        setRenderForm(true);
      }}>
        <Ionicons name="add-circle-outline" size={60} color="black" />
      </Pressable>
      <SectionList
        sections={sections}
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
                {item.category_name}
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
