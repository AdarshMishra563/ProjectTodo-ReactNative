import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import FixedView from './Fixedviewchild'
import UpdateTask from './UpdateTask';
import Loading from './Loading';
import EditTaskModal from './UpdateTask';
import CreateTaskForm from './CreateTodo';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../redux/slice';


const TaskDashboard = ({ onClick, j }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [page, setPage] = useState(false);
  const [change, setChange] = useState(0);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [create, setcreate] = useState(false);
  const [close, setclose] = useState(false);
const navigation=useNavigation();
  const { token ,user} = useSelector(state => state.user);
  const dispatch=useDispatch();
  useEffect(()=>{

if(!token || !user){
    navigation.navigate("Login")
}

  },[token,user])

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
  }, [change, j, token]);

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

    
    const statusColor = item.status === 'Done'
      ? 'green'
      : item.status === 'In Progress'
        ? 'orange'
        : 'red';

    return (
      <View style={styles.taskItemContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
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
      </View>
    );
  };

  const refreshTasks = () => {
    setChange(prev => prev + 1);
  };

  if (!page) {
    return <Loading />;
  }

  const addTodo = () => {
    setcreate(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111' }}>

    <View style={styles.container}>
   
      <View style={styles.topView}>
  <View style={{ flexDirection: "row", flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
    <View style={{ flexDirection: "row", alignItems: 'center', flexWrap: 'wrap', maxWidth: '100%' }}>
  <Image
    source={{
      uri: user.picture
        ? user.picture
        : 'https://up.yimg.com/ib/th?id=OIP.UzzlrDvFoX5QUT4uuDQIdgHaHa&pid=Api&rs=1&c=1&qlt=95&w=104&h=104',
    }}
    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
  />
  <Text style={{ fontSize: 18, textTransform: 'capitalize', flexShrink: 1, flexWrap: 'wrap' }}>
    {user.name}
  </Text>
</View>


    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={addTodo}
        style={{
          backgroundColor: '#4CAF50',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 5,
          marginRight: 8, 
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
        
         dispatch(logout())
        }}
        style={{
          backgroundColor: '#e74c3c',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </View>

  </View>
</View>


      {create && (
        <CreateTaskForm
          visible={create}
          onClose={() => { setcreate(false); setclose(true); }}
          onOkay={() => { refreshTasks(); setcreate(false); }}
        />
      )}

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.emptyStateText}>Create Your First Todo</Text>
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

          {modal && (
            <EditTaskModal
              isOpen={modal}
              onClose={() => setModal(false)}
              task={currentTask}
              onUpdate={refreshTasks}
            />
          )}
        </>
      )}
    </View></SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    top:30,
    backgroundColor: '#111',
  },
 topView: {
  padding: 12,
  backgroundColor: '#4a90e2',
  borderRadius: 8,
  marginBottom: 16,
  height: 70, 
  justifyContent: 'center', 
},
  topViewText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  taskItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: 'white',
  },
  statusIndicator: {
    width: 6,
    backgroundColor: 'grey',
  },
  taskItem: {
    flex: 1,
    padding: 16,
  },
  overdueTask: {
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
  taskImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
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
