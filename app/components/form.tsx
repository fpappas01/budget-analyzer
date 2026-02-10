import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DatePicker, DatePickerHandle } from "@s77rt/react-native-date-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  // TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";

type CategoryRow = {
  id: number;
  name: string;
};

type AndroidMode = "date" | "time" | undefined;

export default function Form() {
  const db = useSQLiteContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date(1598051730000));
  const [mode, setMode] = useState<AndroidMode>("date");
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const onChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined,
  ) => {
    let currentDate: Date = date;
    if (selectedDate) {
      currentDate = selectedDate;
      setDate(currentDate);
    }
    setShow(false);
  };

  const showMode = (currentMode: AndroidMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

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

  const addTransaction = async () => {
    let categoryId: number = -1;
    for (let el of categories) {
      if (el.name === category) {
        categoryId = el.id;
        break;
      }
    }
    if (categoryId === -1) throw new Error("Could not find category id.");
    try {
      await db.runAsync(
        `INSERT INTO transactions (type, value, description, category_id) VALUES
      (?, ?, ?, ?)`,
        [type.toLowerCase(), amount, description, categoryId],
      );
    } catch (error) {
      alert("Problem occured, try again.");
    }

    // reset form
    setAmount("");
    setDescription("");
    setModalVisible(false);
    setType("expense");
    setCategory("");
  };
  const datePickerRef = useRef<DatePickerHandle>(null);
  return (
    <View style={styles.container}>
      {/* <Pressable onPress={() => setModalVisible(true)}>
        <AntDesign name="file-add" size={50} color="black" />
      </Pressable> */}
      <Button
        title="Add Transaction"
        onPress={() => {
          setModalVisible(true);
        }}
      />
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
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={type}
                  onValueChange={(newVal) => setType(newVal)}
                >
                  <Picker.Item label="Expense" value={"expense"} />
                  <Picker.Item label="Income" value={"income"} />
                </Picker>
              </View>

              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  mode="dropdown"
                  selectedValue={category}
                  onValueChange={(newVal) => setCategory(newVal)}
                >
                  {categories.map((el) => (
                    <Picker.Item key={el.id} label={el.name} value={el.name} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                returnKeyType="done"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />

              <SafeAreaView>
                <Pressable>
                  <Text style={styles.label}> Date </Text>
                </Pressable>
                
                <Button title="Pick a Date" onPress={showDatepicker} />
                {/* <TextInput 
                style={styles.input}
                value={date?.toLocaleDateString()}
                editable={false}
                onFocus={showDatepicker}
                onBlur={() => {setShow(false)}}
                
                /> */}
                {/* <Pressable onPress={() => showDatepicker()}>
                  <View pointerEvents="none">
                    <TextInput
                      style={styles.input}
                      value={date?.toLocaleDateString()}
                      editable={true}
                      right={
                        <TextInput.Icon
                          icon={"calendar"}
                          onPress={showDatepicker}
                        />
                      }
                      // onFocus={showDatepicker}
                      // onBlur={() => {
                      //   setShow(false);
                      // }}
                    />
                  </View>
                </Pressable> */}

                

                {show && (
                  <DateTimePicker
                    maximumDate={new Date()}
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour={true}
                    onChange={onChange}
                  />
                )}
              </SafeAreaView>

              <View style={styles.buttons}>
                <Pressable style={styles.button} onPress={addTransaction}>
                  <Text style={styles.buttonText}>Add</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.cancel]}
                  onPress={() => setModalVisible(false)}
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
    padding: 20,
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
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
