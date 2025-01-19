import { auth } from "@/services/firebaseConfig";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(user);

      if (user.uid) {
        // Navigate to the next screen
        await AsyncStorage.setItem("id", user.uid);
        router.push("/(tabs)");
      }
    } catch (error) {
      alert("Failed to log in");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>
      <TextInput
        placeholder="@ Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="gray"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="gray"
      />
      <TouchableOpacity
        style={[styles.button, styles.buttonContainer]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.secondaryButton, styles.buttonContainer]}
        onPress={() => router.push("/(auth)/forgot-password")}
      >
        <Text style={styles.secondaryButtonText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7F00",
    paddingHorizontal: 20, // Padding on the sides
    paddingVertical: 40,   // Padding at the top and bottom
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    color: "#000", // Text color
  },
  buttonContainer: {
    width: "90%",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
