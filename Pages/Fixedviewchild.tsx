import React from 'react';
import { 
  Modal, 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  ScrollView 
} from 'react-native';

const CustomModal = ({ isOpen, onClose, children }) => {
  return (
   <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
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
    fontSize: 28,
    lineHeight: 28,
  },
});

export default CustomModal;
