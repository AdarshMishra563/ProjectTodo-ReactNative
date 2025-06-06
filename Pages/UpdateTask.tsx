import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  TextInput, 
  ActivityIndicator 
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EditTaskModal = ({ isOpen, onClose, task, onUpdate }) => {
  const { token } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    dueDate: new Date(task.dueDate),
    priority: task.priority,
    status: task.status,
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        dueDate: formData.dueDate.toISOString(),
      };
      await axios.put(
        `https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks/${task._id}`,
        payload,
        { headers: { Authorization: `${token}` } }
      );
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>

            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Edit Task</Text>

              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
                placeholder="Title"
                placeholderTextColor="#9ca3af"
                returnKeyType="next"
                autoFocus={true}
                editable={true}
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                placeholder="Description"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                blurOnSubmit={true}
                returnKeyType="done"
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Priority:</Text>
                <View style={styles.radioGroup}>
                  {['Low', 'Medium', 'High'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.radioButton,
                        formData.priority === option && styles.radioButtonSelected,
                      ]}
                      onPress={() => handleChange('priority', option)}
                    >
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.pickerContainer}>
                <Text style={styles.label}>Status:</Text>
                <View style={styles.radioGroup}>
                  {['To Do', 'In Progress', 'Done'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.radioButton,
                        formData.status === option && styles.radioButtonSelected,
                      ]}
                      onPress={() => handleChange('status', option)}
                    >
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.updateButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Update</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 24,
    position: 'relative',
    alignSelf: 'center',
    maxHeight: '90%',
  },
  modalContent: {
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 10,
  },
  closeButtonText: {
    color: '#9ca3af',
    fontSize: 34,
    lineHeight: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e5e7eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#374151',
    color: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 8,
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioButton: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  radioButtonSelected: {
    backgroundColor: '#4b5563',
    borderColor: '#3b82f6',
    borderWidth: 1,
  },
  radioText: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  updateButton: {
    backgroundColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4b5563',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditTaskModal;
