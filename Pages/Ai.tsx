import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import Voice from '@react-native-voice/voice';
const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
const [isListening, setIsListening] = useState(false);
  const { token } = useSelector((state) => state.user);

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
  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };
    const stopListening = async () => {
    try {
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
