import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import Voice from '@react-native-voice/voice';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
const [isListening, setIsListening] = useState(false);
  const { token ,user} = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      
      const newSocket = io('http://192.168.205.118:8000', {
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected:', newSocket.id);
      });

      newSocket.on('ai_reply', (data) => {
        setChatHistory((prev) => [...prev, { sender: 'AI', content: data.response }]);
      });

      newSocket.on('error', (data) => {
        console.log('Error:', data.error);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected');
      });

      setSocket(newSocket);

      // Clean up on unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]); // <-- Runs when token is available
 useEffect(() => {
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechError = (e) => console.error(e);

  

  return () => {
    Voice.destroy().then(Voice.removeAllListeners);
  };
}, []);
const requestAudioPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone for voice input.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission granted');
        return true;
      } else {
        console.log('Microphone permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    // iOS permission handled via Info.plist, assume true here for simplicity
    return true;
  }
};

 const startListening = async () => {
  try {
    const hasPermission = await requestAudioPermission();
    if (!hasPermission) {
      console.warn('Microphone permission denied');
      return;
    }



    setIsListening(true);
    console.log(Voice)
    if (Voice && Voice?.start) {
  await Voice.start('en-US');
} else {
  console.log('Voice module not available');
}
  } catch (e) {
    console.error(e);
  }
};
    const stopListening = async () => {
    try {console.log(Voice)
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };
  
  const onSpeechResults = (e) => {
    const spokenText = e.value[0];
    setMessage(spokenText);
  };
  const sendMessage = () => {
    if (socket && message.trim() !== '') {
      setChatHistory((prev) => [...prev, { sender: 'You', content: message }]);

      socket.emit('send_message', {
        message: message.trim(),token
      });

      setMessage('');
    }
  };
  const startInterview = () => {
    if (socket) {
      // Example — you could also get these from TextInput or user selection
      const interviewConfig = {
        topic: 'React Native with coding rounds ',
        level: 'Hard',
        name: user.name,
        token,
      };
console.log(interviewConfig)
      socket.emit('start_interview', interviewConfig);
    }
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={chatHistory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            <Text style={{ fontWeight: 'bold' }}>{item.sender}: </Text>
            {item.content}
          </Text>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        value={message}
        onChangeText={setMessage}
      />

       <View style={styles.buttonRow}>
        <Button title="Send" onPress={sendMessage} />

        <TouchableOpacity
          style={[styles.micButton, isListening && { backgroundColor: 'red' }]}
          onPress={isListening ? stopListening : startListening}
        >
          <Text style={styles.micButtonText}>{isListening ? 'Stop' : '🎙️'}</Text>
        </TouchableOpacity>
      </View>
          <View style={{ marginTop: 10 }}>
        <Button title="🎯 Start Interview" color="#6200ee" onPress={startInterview} />
      </View>
    </View>
  );
};

export default ChatComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  message: {
    marginVertical: 5,
    fontSize: 16,
  },
  buttonRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  micButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  micButtonText: { color: 'white', fontSize: 20 },

});
