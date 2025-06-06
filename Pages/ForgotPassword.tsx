import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    setMessage("");
    setIsError(false);
    setLoading(true);
    try {
      const res = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/forgotpassword", { email });
      setMessage(res.data.message || "Reset link sent successfully!");
    } catch (err) {
      console.log(err);
      setIsError(true);
      setMessage(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleForgot}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#ccc" /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
      </TouchableOpacity>

      {!!message && (
        <Text style={[styles.message, isError ? styles.error : styles.success]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d2d2d", 
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    color: "#d1d5db", 
    marginBottom: 20,
  },
  input: {
    height: 44,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#fff",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4b5563", 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#6b7280", 
  },
  buttonText: {
    color: "#d1d5db",
    fontSize: 16,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    paddingHorizontal: 4,
  },
  error: {
    color: "#f87171",
  },
  success: {
    color: "#4ade80", 
  },
});
