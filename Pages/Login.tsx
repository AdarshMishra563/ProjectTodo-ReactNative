import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';



import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout, login } from '../redux/slice';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin,GoogleSigninButton } from '@react-native-google-signin/google-signin';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hide, setHide] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

   useEffect(() => {
    GoogleSignin.configure({
      webClientId: '903202728181-ndf0t06toltn1f0aj6cucoa7pm1dmdi5.apps.googleusercontent.com', // From Google Cloud OAuth
    });
  }, []);

const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut(); 
    
    const userInfo = await GoogleSignin.signIn();
    setLoading(true)
    const idToken=userInfo?.data?.idToken;
    console.log(idToken);

const res=await  axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/googlelogin",{
  idToken
})
if(res.data?.token){
console.log(res)
  dispatch(login(res.data));
  navigation.navigate('Dashboard')
  
  
}
  } catch (error) {
    console.error(error);
  }finally{setLoading(false)}
}

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await axios.post("https://backend-taskmanagement-k0md.onrender.com/api/auth/login", {
        email,
        password
      });
      if (res?.data?.token) {
        dispatch(login(res.data));
        navigation.navigate('Dashboard')
       
      }
    } catch (err) {
      dispatch(logout());
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={hide}
        />
        <TouchableOpacity onPress={() => setHide(!hide)} style={styles.eyeIcon}>
<Text style={{top:4,color:"gray"}}>{hide?"See":"Hide"}</Text>


        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity onPress={() => {navigation.navigate('ForgotPassword')}}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleLogin} 
        style={styles.button}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>LOGIN</Text>
        )}
      </TouchableOpacity>
      <View style={styles.orContainer}>
  <View style={styles.line} />
  <Text style={styles.orText}>OR</Text>
  <View style={styles.line} />
</View>


<GoogleSigninButton
  style={{ width: 192, height: 48, alignSelf: 'center' }}
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Dark}
  onPress={signIn}
/>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.text}>
          No credentials?{' '}
          <Text 
            style={styles.linkText}
            onPress={() => navigation.navigate('SignUp')}
          >
          SIGNUP
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  orContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 20,
},
line: {
  flex: 1,
  height: 1,
  backgroundColor: '#444',
},
orText: {
  marginHorizontal: 10,
  color: '#aaa',
  fontWeight: 'bold',
},
googleButton: {
  backgroundColor: '#db4437',
  padding: 15,
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  alignSelf: 'center',
},
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#ccc',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#222',
    color: '#eee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  button: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  errorText: {
    color: '#f77',
    marginBottom: 10,
    fontSize: 14
  },
  forgotText: {
    color: '#888',
    textAlign: 'right',
    marginBottom: 10,
    textDecorationLine: 'underline'
  },
  text: {
    color: '#aaa',
    textAlign: 'center'
  },
  linkText: {
    color: '#ccc',
    fontWeight: 'bold'
  }
});
