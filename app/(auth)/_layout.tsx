import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />

      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
};

export default AuthLayout;
