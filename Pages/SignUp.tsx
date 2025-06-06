import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/slice'

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const otpInputs = useRef([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleSignup = async () => {
    if (!username.trim()) return setError('Name is required');
    if (!email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Invalid email');
    if (!password) return setError('Password is required');
    if (password.length < 6) return setError('Password must be 6+ characters');

    try {
      setLoading(true);
      const res = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/register", {
        name: username, email, password
      });
      setError("");
      if (res.data.isVerified) setShowPopup(true);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return setError('Enter a valid 6-digit OTP');

    try {
      setLoading(true);
      const response = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/verifyOtp", {
        email,
        otp: otpCode
      });
      if (response.data.isVerified) {
        dispatch(login(response.data));
        navigation.navigate('Dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CREATE ACCOUNT</Text>

      <TextInput
        placeholder="Name"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#aaa"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity onPress={handleSignup} style={styles.button} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>

      
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalText}>A 6-digit code was sent to {email}</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={(e) => handleOtpKeyDown(index, e)}
                  ref={(el) => (otpInputs.current[index] = el)}
                />
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.cancelBtn}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={verifyOtp} style={styles.verifyBtn} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1F1F1F', padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E0E0E0', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#2C2C2C', color: '#fff', padding: 16, borderRadius: 10,
    marginBottom: 16, borderWidth: 1, borderColor: '#444'
  },
  button: {
    backgroundColor: '#333', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 20
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  linkText: { color: '#aaa', textAlign: 'center' },
  error: { color: 'salmon', textAlign: 'center', marginBottom: 10 },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#2C2C2C', padding: 24, borderRadius: 12, width: '85%'
  },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  modalText: { color: '#ccc', marginBottom: 16, textAlign: 'center' },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  otpInput: {
    width: 45, height: 55, borderRadius: 10, backgroundColor: '#3A3A3A', color: '#fff',
    textAlign: 'center', fontSize: 20, marginHorizontal: 6
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, backgroundColor: '#555', padding: 12, borderRadius: 8, marginRight: 8, alignItems: 'center' },
  verifyBtn: { flex: 1, backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center' }
});
