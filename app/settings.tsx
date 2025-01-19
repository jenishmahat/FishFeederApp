import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/services/firebaseConfig";
import { signOut } from "firebase/auth";
import { firebase } from "@react-native-firebase/auth";
import { router } from "expo-router";

export default function SettingsScreen() {
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    const fetchIpAddress = async () => {
      const savedIpAddress = await AsyncStorage.getItem("ipAddress");
      if (savedIpAddress) {
        setIpAddress(savedIpAddress);
      } else {
        setIpAddress("192.168.0.31"); // Default IP address placeholder
      }
    };
    fetchIpAddress();
  }, []);

  const handleIpChange = (newIp: string) => {
    setIpAddress(newIp);
  };

  const saveIpAddress = async () => {
    try {
      await AsyncStorage.setItem("ipAddress", ipAddress);
      Alert.alert("Success", "IP Address saved!");
    } catch (error) {
      Alert.alert("Error", "Failed to save IP address.");
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("feedingHistory");
      Alert.alert("Success", "Feeding history cleared!");
    } catch (error) {
      Alert.alert("Error", "Failed to clear feeding history.");
    }
  };
  const logOut = async () => {
    try {
      signOut(auth);
      await AsyncStorage.clear();
      router.push("/");
    } catch (error) {
      alert("Unable to logout");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      
      <View style={styles.profileContainer}>
       <Image
          source={require("../components/images/profile.png")} // Replace with the actual path to your profile picture
          style={styles.profileImage}
        /> 
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{auth.currentUser?.email}</Text>
          <Text style={styles.profileEmail}>{auth.currentUser?.email}</Text>
        </View>
      </View>
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionHeader}>Account</Text>
        <TouchableOpacity style={styles.settingItem} onPress={logOut}>
          <Icon name="user" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="user" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="lock" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Change Password</Text>
        </TouchableOpacity>
        <Text style={styles.sectionHeader}>Clear History</Text>
        <TouchableOpacity style={styles.settingItem} onPress={clearHistory}>
          <Icon name="trash" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Clear Feeding History</Text>
        </TouchableOpacity>
        <Text style={styles.sectionHeader}>Network</Text>
        <View style={styles.settingItem}>
          <Icon name="wifi" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Change IP Address</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={ipAddress}
            onChangeText={handleIpChange}
            placeholder="Enter new IP address"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveIpAddress}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="bell" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Allow Notifications</Text>
          <Icon name="toggle-on" size={20} color="orange" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.sectionHeader}>More</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="shield" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon name="info-circle" size={20} color="gray" style={styles.icon} />
          <Text style={styles.settingText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Icon
            name="question-circle"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <Text style={styles.settingText}>Help</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 16,
    color: "gray",
  },
  settingsContainer: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    marginBottom: 10,
    marginTop: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  icon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    flex: 1,
  },
});
