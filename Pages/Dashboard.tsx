import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,SafeAreaView, FlatList, ActivityIndicator, Image,  StatusBar, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import FixedView from './Fixedviewchild'
import UpdateTask from './UpdateTask';
import Loading from './Loading';
import EditTaskModal from './UpdateTask';
import CreateTaskForm from './CreateTodo';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../redux/slice';
import { Filter } from 'react-native-svg';
import FilterComponent from './Filter';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaProvider, useSafeAreaInsets  } from 'react-native-safe-area-context';
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
    const [filteredTasks, setFilteredTasks] = useState([]);
const navigation=useNavigation();
  const { token ,user} = useSelector(state => state.user);
  const dispatch=useDispatch();
  useEffect(()=>{

if(!token || !user){
    navigation.navigate("Login")
}

  },[token,user])


const handleSearch = async (search,filterData) => {
 try {
    const queryParams = new URLSearchParams();
    
   
    if (filterData.status.length > 0) queryParams.append('status', JSON.stringify(filterData.status));
    if (filterData.priority.length > 0) queryParams.append('priority', JSON.stringify(filterData.priority));
    if (filterData.dueDate) queryParams.append('dueDate', filterData.dueDate);
    
   
    if (search.trim() !== '') {
      queryParams.append('search', search);
    }else{
      const res = await axios.get(
      `https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks?${queryParams.toString()}`,
      {
        headers: { Authorization: `${token}` }
      }
    );

   setFilteredTasks(res.data)
    
    }

    const res = await axios.get(
      `https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks?${queryParams.toString()}`,
      {
        headers: { Authorization: `${token}` }
      }
    );

   setFilteredTasks(res.data)
    
    
  } catch (err) {
    console.error('Filter error:', err);
  }
};

const handleApplyFilter = async (data) => {
  const { search, ...filterData } = data;
  try {
    const queryParams = new URLSearchParams();
console.log("serach without ",JSON.stringify(search))
  
    if (filterData.status.length > 0) queryParams.append('status', JSON.stringify(filterData.status));
    if (filterData.priority.length > 0) queryParams.append('priority', JSON.stringify(filterData.priority));
    if (filterData.dueDate) queryParams.append('dueDate', filterData.dueDate);

    queryParams.append('search', search);

    
    const res = await axios.get(
      `https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks?${queryParams.toString()}`,
      {
        headers: { Authorization: `${token}` }
      }
    );
  const sortedTasks = res.data.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    setFilteredTasks(sortedTasks);
  } catch (err) {
    console.error('Filter error:', err);
  }
};
const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks', {
          headers: { Authorization: `${token}` }
        });
         const sortedTasks = response.data.sort((a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
        setTasks(sortedTasks);
        setFilteredTasks(sortedTasks)
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
            <View style={[styles.priorityBadge, 
                         { backgroundColor: item.priority === 'High' ? '#FEE2E2' : 
                                           item.priority === 'Medium' ? '#FEF3C7' : '#D1FAE5' }]}>
              <Text style={[styles.priorityText, 
                          { color: item.priority === 'High' ? '#B91C1C' : 
                                  item.priority === 'Medium' ? '#92400E' : '#065F46' }]}>
                {item.priority}
              </Text>
            </View>
          </View>

          <Text style={styles.taskDescription}>{item.description}</Text>

          <View style={styles.taskMeta}>
         <View style={{flexDirection:"row"}}> <Feather name="calendar" size={14} color="#6B7280" />
              <Text style={styles.metaText}>
                {new Date(item.dueDate).toLocaleDateString()}
                {isOverdue && <Text style={{color: '#EF4444'}}> • Overdue</Text>}
              </Text></View>
            <Text style={styles.taskStatus}>Status: {item.status}</Text>
          </View>
 <View style={styles.metaItem}>
            <Text style={styles.taskCreator}><Feather name="user" size={14} color="#6B7280" />  {  item.createdBy?.name || 'You'}</Text>
          </View>
         

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Feather name="edit" size={16} color="#222222" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item._id)}
              disabled={deleteLoadingId === item._id}
            >
              {deleteLoadingId === item._id ? (
                <ActivityIndicator color="black" />
              ) : (
                <Feather name="trash-2" size={16} color="#EF4444" />
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
    <SafeAreaProvider><StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

   <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent', paddingTop: insets.top    }}>
       

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
        onPress={()=>{Keyboard.dismiss();
          setTimeout(()=>{addTodo()},100)
        }}
        style={{
          backgroundColor: '#4CAF50',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 50,
          marginRight: 8, 

        }}
      >
     <Feather name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
        
         dispatch(logout())
        }}
        style={{
          backgroundColor: '#1F2937',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 50,
        }}
      >
             <Icon name="sign-out" size={22} color="gray" />

      </TouchableOpacity>
    </View>

  </View>
  
</View><FilterComponent   onApplyFilter={handleApplyFilter}
        onSearch={handleSearch} />



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
            data={filteredTasks.length > 0 ? filteredTasks : tasks}
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
    </View></SafeAreaView></SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    
    backgroundColor: '#FFFFFF',
  },
    metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
 topView: {
  padding: 10,
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  marginBottom: 2,
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
    metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
   priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
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
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 5,
    minWidth: 40,
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
