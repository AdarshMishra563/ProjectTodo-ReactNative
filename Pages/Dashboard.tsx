import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import FixedView from './Fixedviewchild'
import UpdateTask from './UpdateTask';
import Loading from './Loading';
import EditTaskModal from './UpdateTask';

const TaskDashboard = ({ onClick, j }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [page, setPage] = useState(false);
  const [change, setChange] = useState(0);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const {token} = useSelector(state => state.user);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks', {
          headers: { Authorization: `${token}` }
        });
        setTasks(response.data);
        setPage(true);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [change, j,  token]);

  const handleEdit = (task) => {
    setCurrentTask(task);
    setModal(true);
  };

  const handleDelete = async (taskId) => {
    setDeleteLoadingId(taskId);
    try {
      await axios.delete(`https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks/${taskId}`, {
        headers: { Authorization: `${token}` }
      });
      setChange(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const renderItem = ({ item }) => {
    const isOverdue = new Date(item.dueDate) < new Date();
    
    return (
      <View style={[styles.taskItem, isOverdue && styles.overdueTask]}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskPriority}>{item.priority}</Text>
        </View>
        
        <Text style={styles.taskDescription}>{item.description}</Text>
        
        <View style={styles.taskMeta}>
          <Text style={styles.taskDate}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
          <Text style={styles.taskStatus}>Status: {item.status}</Text>
        </View>
        
        <View style={styles.taskMeta}>
          <Text style={styles.taskCreator}>Created by: {item.createdBy?.name || 'You'}</Text>
         
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => handleDelete(item._id)}
            disabled={deleteLoadingId === item._id}
          >
            {deleteLoadingId === item._id ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const refreshTasks = () => {
    setChange(prev => prev + 1);
  };

  if (!page) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <TouchableOpacity style={styles.addButton} onPress={onClick}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.emptyStateText}>Create Your First Task</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={tasks}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContainer}
            refreshing={loading}
            onRefresh={refreshTasks}
          />
          
         
           <EditTaskModal isOpen={modal} onClose={() => setModal(false)} task={currentTask} onUpdate={refreshTasks}/>
         
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: 'red',
    backgroundColor: '#fff0f0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskPriority: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
  taskStatus: {
    fontSize: 12,
    color: '#666',
  },
  taskCreator: {
    fontSize: 12,
    color: '#666',
  },
  taskAssignee: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
    lineHeight: 36,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default TaskDashboard;