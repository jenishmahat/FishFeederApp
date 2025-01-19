import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function App() {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [frequency, setFrequency] = useState("Daily");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [iotStatus, setIotStatus] = useState("Checking...");
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIpAddress = async () => {
      const savedIpAddress = await AsyncStorage.getItem("ipAddress");
      if (savedIpAddress) {
        setIpAddress(savedIpAddress);
      } else {
        setIpAddress("192.168.1.14"); // Default IP address placeholder
      }
    };
    fetchIpAddress();
  }, []);

  useEffect(() => {
    if (!ipAddress) return;

    const checkIotConnection = async () => {
      try {
        const res = await axios.get(`http://${ipAddress}/ping`);
        setIotStatus(
          res.data === "pong" ? "Device Connected" : "No Connection"
        );
      } catch (error) {
        setIotStatus("No Connection");
      }
    };

    // Check connection immediately when the component mounts
    checkIotConnection();

    // Set up the interval to check the connection periodically
    const intervalId = setInterval(() => {
      checkIotConnection();
    }, 10000); // Check every 10 seconds (adjust as needed)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [ipAddress]);

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const saveHistory = async (time: string, date: string, type: string) => {
    try {
      const historyData = await AsyncStorage.getItem("feedingHistory");
      const history = historyData ? JSON.parse(historyData) : [];
      history.push({ time, date, type });
      await AsyncStorage.setItem("feedingHistory", JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save feeding history:", error);
    }
  };

  const scheduleFeeding = async () => {
    try {
      const url = `http://${ipAddress}/schedule?time=${encodeURIComponent(
        time.toLocaleTimeString()
      )}&date=${encodeURIComponent(
        date.toLocaleDateString()
      )}&frequency=${encodeURIComponent(frequency)}`;
      console.log("Request URL:", url);
      const response = await axios.get(url);
      Alert.alert("Success", "Feeding scheduled successfully!");
      await saveHistory(
        time.toLocaleTimeString(),
        date.toLocaleDateString(),
        "auto"
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to schedule feeding.");
    }
  };

  const manualFeed = async () => {
    try {
      const response = await axios.get(`http://${ipAddress}/feed`);
      Alert.alert("Success", "Manual feeding initiated!");
      const now = new Date();
      await saveHistory(
        now.toLocaleTimeString(),
        now.toLocaleDateString(),
        "manual"
      );
    } catch (error) {
      Alert.alert("Error", "Failed to initiate manual feeding.");
    }
  };

  const setiotstatuscolor = () => {
    return iotStatus === "Device Connected" ? "green" : "red";
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.link}>
          <Text style={styles.statusText}>
            <Icon
              name="wifi"
              size={30}
              color={setiotstatuscolor()}
              style={styles.icon}
            />{" "}
            {iotStatus}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require("../../components/images/fish1.gif")} // Replace with the actual path to your illustration
          style={styles.illustration}
        />
        <View style={styles.schedule}>
          <Text style={styles.scheduleHeader}>Feeding Schedule</Text>
          <View style={styles.scheduleItem}>
            <Icon name="clock-o" size={20} color="gray" style={styles.icon} />
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <View style={styles.inputContainer}>
                <Text style={styles.selectedValue}>
                  {time.toLocaleTimeString()}
                </Text>
              </View>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChangeTime}
                is24Hour={true} // Optional: if you prefer 24-hour format
              />
            )}
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.scheduleItem}>
            <Icon name="calendar" size={20} color="gray" style={styles.icon} />
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={styles.inputContainer}>
                <Text style={styles.selectedValue}>
                  {date.toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.scheduleItem}>
            <Icon name="repeat" size={20} color="gray" style={styles.icon} />
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={frequency}
                style={styles.picker}
                onValueChange={(itemValue) => setFrequency(itemValue)}
              >
                <Picker.Item label="Daily" value="Daily" />
                <Picker.Item label="Bi-weekly" value="Bi-weekly" />
                <Picker.Item label="Weekly" value="Weekly" />
              </Picker>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={scheduleFeeding}>
              <Text style={styles.buttonText}>Update Schedule Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={manualFeed}>
              <Text style={styles.buttonText}>Feed Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 50,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
    textAlign: "center",
  },
  illustration: {
    width: width * 0.8,
    height: width * 0.5,
    marginBottom: 20,
    resizeMode: "contain",
  },
  schedule: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
    alignItems: "center",
  },
  scheduleHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: "30%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    color: "red",
    borderColor: "red", // Remove underline
    backgroundColor: "#e0ebeb",
    borderRadius: 5,
    padding: 5,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  selectedValue: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e0ebeb",
    borderRadius: 5,
    justifyContent: "space-evenly", // Add space between elements
  },
  picker: {
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
  },

  button: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  spacing: {
    paddingTop: 80, // Adjust this value to control the spacing
  },
  lineStyle: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    width: "100%",
    marginBottom: 10,
  },

  statusContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    zIndex: 10,
  },
  statusText: {
    fontSize: 18,
    color: "gray",
  },
  link: {
    flexDirection: "row",
  },
  // scrollContainer: {
  //   flex: 1,
  //   padding: 20,
  //   paddingTop: 80, // Adjust padding to avoid overlap with status
  // },
});
