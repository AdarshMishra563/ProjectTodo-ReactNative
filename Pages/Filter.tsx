import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
const FilterComponent = ({ onApplyFilter, onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');
  const [debounce, setDebounce] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [filterData, setFilterData] = useState({
    status: [],
    priority: [],
    dueDate: ''
  });

  React.useEffect(() => {
    console.log("debounce", debounce)
    const timeout = setTimeout(() => {
      if (onApplyFilter) {
        onApplyFilter({
          ...filterData,
          search: debounce
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [debounce, filterData]);

  const handleCheckboxChange = (type, value) => {
    setFilterData(prev => {
      const updatedValues = prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updatedValues };
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setFilterData(prev => ({ ...prev, dueDate: dateStr }));
    }
  };

  const applyFilter = () => {
    setShowDropdown(false);
    if (onApplyFilter) onApplyFilter({
      ...filterData,
      search: debounce
    });
  };

  const resetFilters = () => {
    setFilterData({
      status: [],
      priority: [],
      dueDate: ''
    });
    setSearch('');
    setDebounce('');
    if (onApplyFilter) onApplyFilter({
      status: [],
      priority: [],
      dueDate: '',
      search: ''
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
         <Icon name="search" size={20} color="white" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your tasks"
          placeholderTextColor="gray"
          value={debounce}
          onChangeText={setDebounce}
        />
      </View>

      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.filterButtonText}>Filter</Text>
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Tasks</Text>

            <Text style={styles.filterSectionTitle}>Status</Text>
            {['To Do', 'In Progress', 'Done'].map(status => (
              <View key={status} style={styles.checkboxContainer}>
                <Checkbox
                  label={status}
                  value={filterData.status.includes(status)}
                  onValueChange={() => handleCheckboxChange('status', status)}
                />
                
              </View>
            ))}

            <Text style={styles.filterSectionTitle}>Priority</Text>
            {['Low', 'Medium', 'High'].map(priority => (
              <View key={priority} style={styles.checkboxContainer}>
                <Checkbox
                  label={priority}
                  value={filterData.priority.includes(priority)}
                  onValueChange={() => handleCheckboxChange('priority', priority)}
                />
               
              </View>
            ))}

            <Text style={styles.filterSectionTitle}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: 'white' }}>
                {filterData.dueDate ? filterData.dueDate : 'Select Due Date'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.resetButton]}
                onPress={resetFilters}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.applyButton]}
                onPress={applyFilter}
              >
                <Text style={styles.buttonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={filterData.dueDate ? new Date(filterData.dueDate) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const Checkbox = ({ value, onValueChange, label }) => {
  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onValueChange(!value)}
    >
      <View style={[styles.checkbox, value && styles.checked]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    marginBottom:8,
    borderRadius:18
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
    color: 'white'
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'white',
  },
  filterButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#2e7d32',
    borderColor: '#2e7d32',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
  },
  checkboxLabel: {
    color: 'white',
  },
  dateInput: {
    backgroundColor: '#555',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#757575',
  },
  applyButton: {
    backgroundColor: '#2e7d32',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default FilterComponent;
