// screens/SignUpScreen.tsx
import { auth } from "@/services/firebaseConfig";
import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";
// import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
const SignUpScreen: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (password === confirmPassword) {
      try {
        // const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(
          auth,
          username,
          password
        );
        if (user.uid) {
          alert(`Thank you for signing up ${user.email}`);

          router.push("/(auth)/sign-in");
        }
      } catch (error) {
        alert("Account already exist.Please login");
      }
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create a new account</Text>
      <TextInput
        placeholder="@ Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7F00",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default SignUpScreen;
