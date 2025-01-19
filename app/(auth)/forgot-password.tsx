import { TouchableOpacity, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useRef } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "@/services/firebaseConfig";
import { router } from "expo-router";

const ForgotPassword = () => {
  const inputRef = useRef<TextInput>(null);

  const updatePassw = async () => {
    try {
      const data = await sendPasswordResetEmail(
        getAuth(app),
        "jenishmahat101gmail.com"
      );
      console.log(data);
      alert("Password reset link sent to your email.");
    } catch (error) {
      alert("Failed to send reset link. Please try again.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email below to receive a password reset link.
      </Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        placeholderTextColor="#aaa"
        ref={inputRef}
      />
      <TouchableOpacity style={styles.button} onPress={updatePassw}>
        <Text style={styles.buttonText}>Get Reset Password Link</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light gray background
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#000",
    marginBottom: 15,
  },
  button: {
    width: "90%",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
