import DropDownPicker from "react-native-dropdown-picker";

import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DatePickerModal } from "react-native-paper-dates";
import { useSQLiteContext } from "expo-sqlite";
import { Button } from "react-native-paper";

type CategoryRow = {
  id: number;
  name: string;
};

type formProps = {
  type: "income" | "expense";
  amount: string;
  description: string;
  category: string;
  renderForm: boolean;
  edit: boolean;
  item_id?: number;
  date?: Date;
  onClose?: () => void;
  onUpdate?: (updatedRow: any) => void;
  onAdd?: (newRow: any) => void;
};

export default function Form(props: formProps) {
  const db = useSQLiteContext();
  const [modalVisible, setModalVisible] = useState(
    props.renderForm ? props.renderForm : false,
  );
  const [amount, setAmount] = useState(props.amount ? props.amount : "");
  const [description, setDescription] = useState(props.description);
  const [type, setType] = useState<string>(props.type);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [category, setCategory] = useState(props.category);
  const [date, setDate] = useState<Date>(props.date || new Date());
  const [open, setOpen] = React.useState(false);
  const [openType, setOpenType] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params: any) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate],
  );

  const edit = props.edit;

  useEffect(() => {
    const temp_categories: CategoryRow[] = [];
    const fetchCategories = async () => {
      await db
        .getAllAsync<CategoryRow>(`SELECT id, name FROM categories;`)
        .then((rows) => {
          rows.forEach((row) => {
            temp_categories.push(row);
          });
        });
      setCategories(temp_categories);
      setCategory(temp_categories[0].name);
    };
    fetchCategories();
  }, [db]);

  const handleUpdateTransaction = async (item_id: number) => {
    let categoryId: number = -1;
    for (let el of categories) {
      if (el.name === category) {
        categoryId = el.id;
        break;
      }
    }
    if (categoryId === -1 || amount === "" || description === "") {
      Alert.alert("", "Please fill in all fields.");
      return;
    }

    try {
      await db.runAsync(
        `UPDATE transactions SET type = ?, value = ?, description = ?, category_id = ?, created_at = ? WHERE id = ?`,
        [
          type,
          amount.replace(",", "."),
          description,
          categoryId,
          date.toISOString(),
          item_id,
        ],
      );
      if (props.onClose) {
        props.onClose();
      }
      if (props.onUpdate) {
        props.onUpdate({
          id: item_id,
          type: type,
          value: parseFloat(amount.replace(",", ".")),
          description: description,
          category_id: categoryId,
          category_name: category,
          complete_date: date.toISOString(),
          month_year: date.toISOString().slice(0, 7),
        });
      }

      setModalVisible(false);
    } catch (error) {}
  };

  const handleAddTransaction = async () => {
    let categoryId: number = -1;
    for (let el of categories) {
      if (el.name === category) {
        categoryId = el.id;
        break;
      }
    }
    if (categoryId === -1 || amount === "" || description === "") {
      Alert.alert("", "Please fill in all fields.");
      return;
    }
    try {
      await db.runAsync(
        `INSERT INTO transactions (type, value, description, category_id, created_at) VALUES
      (?, ?, ?, ?, ?)`,
        [
          type,
          amount.replace(",", "."),
          description,
          categoryId,
          date.toISOString(),
        ],
      );

      if (props.onClose) {
        props.onClose();
      }

      if (props.onAdd) {
        props.onAdd({
          id: 0,
          type: type,
          value: parseFloat(amount.replace(",", ".")),
          description: description,
          category_id: categoryId,
          category_name: category,
          complete_date: date.toISOString(),
          month_year: date.toISOString().slice(0, 7),
        });
      }
    } catch (error) {
      console.log(error);

      Alert.alert("", "Problem occured, try again.");
    }

    // reset form
    setAmount("");
    setDescription("");
    setModalVisible(false);
    setType("expense");
    setCategory("");
  };
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          setModalVisible(true);
          setDate(new Date());
        }}
      >
        Add Transaction
      </Button>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardContainer}
          >
            <ScrollView
              contentContainerStyle={styles.modalView}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.title}>New Transaction</Text>
              <Text style={styles.label}>Type</Text>
              <View style={styles.container}>
                <DropDownPicker
                  open={openType}
                  value={type}
                  items={[
                    { label: "Expense", value: "expense" },
                    { label: "Income", value: "income" },
                  ]}
                  setOpen={setOpenType}
                  setValue={setType}
                  placeholder="Select a type"
                  listMode="SCROLLVIEW"
                  style={styles.dropdown}
                />
              </View>

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.container}>
                <DropDownPicker
                  open={openCategory}
                  value={category}
                  items={categories.map((el) => ({
                    label: el.name,
                    value: el.name,
                  }))}
                  setOpen={setOpenCategory}
                  setValue={setCategory}
                  placeholder="Select a category"
                  listMode="SCROLLVIEW"
                  style={styles.dropdown}
                />
              </View>

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />
              <Text style={styles.label}>Date</Text>

              <View style={styles.dateInputContainer}>
                <TextInput
                  style={styles.dateInput}
                  value={date?.toLocaleDateString()}
                  editable={false}
                />

                <Pressable
                  onPress={() => setOpen(true)}
                  style={styles.iconContainer}
                >
                  <FontAwesome name="calendar" size={24} color="black" />
                </Pressable>
              </View>

              <SafeAreaProvider>
                <View
                  style={{
                    marginTop: 10,
                    justifyContent: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <DatePickerModal
                    locale="en"
                    endYear={new Date().getFullYear()}
                    presentationStyle="pageSheet"
                    allowEditing={false}
                    saveLabel="Save"
                    mode="single"
                    visible={open}
                    onDismiss={onDismissSingle}
                    date={date}
                    onConfirm={onConfirmSingle}
                  />
                </View>
              </SafeAreaProvider>

              <View style={styles.buttons}>
                <Pressable
                  style={styles.button}
                  onPress={
                    edit
                      ? () => handleUpdateTransaction(props.item_id!)
                      : handleAddTransaction
                  }
                >
                  <Text style={styles.buttonText}>
                    {edit ? "Update" : "Add"}
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.cancel]}
                  onPress={() => {
                    if (props.onClose) {
                      props.onClose();
                    }
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  containerF: {
    marginTop: 100,
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  dropdown: {
    borderColor: "#140505",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardContainer: {
    width: "90%",
  },

  modalView: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#140505",
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  cancel: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "600",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#140505",
    borderRadius: 8,
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#140505",
    borderRadius: 8,
    paddingHorizontal: 10,
  },

  dateInput: {
    flex: 1,
    height: 40,
  },

  iconContainer: {
    paddingLeft: 8,
  },
});
