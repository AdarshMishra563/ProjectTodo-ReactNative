import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification from 'react-native-push-notification';
const CreateTaskForm = ({ visible, onClose, onOkay }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: '',
  });
  
  const {token,user} = useSelector(state => state.user);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.title) tempErrors.title = 'Title is required';
    if (!formData.dueDate) tempErrors.dueDate = 'Due Date is required';
    if (!formData.priority) tempErrors.priority = 'Priority is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
useEffect(() => {
  PushNotification.createChannel(
    {
      channelId: 'task-channel',
      channelName: 'Task Notifications',
       channelDescription: "A channel to categorise task notifications",
    importance: 4, // 4 = high
    vibrate: true,
    },
    (created) => console.log(`createChannel returned '${created}'`)
  );
}, []);
const triggerNotification = (title, message, imageUrl) => {

  console.log(title,message)
  PushNotification.localNotification({
    channelId: 'task-channel',
    title: title,
    message: message,
    bigPictureUrl: imageUrl, 
    largeIconUrl: imageUrl,  
    smallIcon: 'ic_launcher', 
    importance: 'high',
    priority: 'high',
  });
};

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 const handleDateChange = (selectedDate) => {
  setShowDatePicker(false);
  if (selectedDate) {
    handleChange('dueDate', selectedDate);
  }
};


  const handleSubmit = async () => {
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        status: 'To Do',
        dueDate: formData.dueDate.toISOString()
      };

      await axios.post(
        'https://backend-taskmanagement-k0md.onrender.com/api/auth/createtasks',
        payload,
        { headers: { Authorization: `${token}` } }
      );
 triggerNotification(
      `${user.name} created a new task`, 
      `📌 ${formData.title} | Due: ${formData.dueDate.toLocaleDateString()} | Priority: ${formData.priority}`,
      user.picture
    );
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOkay();
        resetForm();
      }, 1500);
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: null,
      priority: '',
    });
    setErrors({});
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create New Task</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={[styles.input, errors.title && styles.errorInput]}
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                placeholder="Enter title"
                placeholderTextColor="#9ca3af"
              />
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                placeholder="Enter description"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date</Text>
              <TouchableOpacity
                style={[styles.input, styles.dateInput, errors.dueDate && styles.errorInput]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: formData.dueDate ? 'white' : '#9ca3af' }}>
                  {formData.dueDate ? formData.dueDate.toLocaleDateString() : 'Select due date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePickerModal
  isVisible={showDatePicker}
  mode="date"
  
  onConfirm={handleDateChange}
  onCancel={()=>{setShowDatePicker(false)}}
  
/>

              )}
              {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority</Text>
              <View style={[styles.input, styles.pickerInput, errors.priority && styles.errorInput]}>
                <View style={styles.radioGroup}>
                  {['Low', 'Medium', 'High'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.radioButton,
                        formData.priority === option && styles.radioButtonSelected
                      ]}
                      onPress={() => handleChange('priority', option)}
                    >
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Create Todo</Text>
              )}
            </TouchableOpacity>

            {success && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>Todo Created successfully!</Text>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: 'white',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#374151',
    color: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorInput: {
    borderColor: '#ef4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    justifyContent: 'center',
  },
  pickerInput: {
    padding: 0,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  radioButton: {
    backgroundColor: '#4b5563',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#3b82f6',
  },
  radioText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successContainer: {
    backgroundColor: '#16a34a',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CreateTaskForm;