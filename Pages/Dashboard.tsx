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
import PushNotification from 'react-native-push-notification';
import { SafeAreaProvider, useSafeAreaInsets  } from 'react-native-safe-area-context';
const TaskDashboard = ({ onClick, j }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [page, setPage] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [change, setChange] = useState(0);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [create, setcreate] = useState(false);
  const [close, setclose] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [completedTaskId, setCompletedTaskId] = useState(null);
const navigation=useNavigation();
  const { token ,user} = useSelector(state => state.user);
  const dispatch=useDispatch();


  PushNotification.configure({
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});
PushNotification.createChannel(
  {
    channelId: "task-reminders",
    channelName: "Task Reminders",
    channelDescription: "Notifications for task reminders",
    importance: 4,
    vibrate: true,
  },
  (created) => console.log(`Channel created: ${created}`)
);

const scheduleTaskNotifications = (tasks) => {
  
  PushNotification.cancelAllLocalNotifications();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  tasks.forEach(task => {
    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(12, 0, 0, 0);


    if (task.status !== 'Done') {
      
      if (taskDueDate.getTime() === today.getTime()) {
        scheduleNotification(
          task._id + '-today',
          `"${task.title}" is due today!`,
          `Don't forget to complete: ${task.title}`,
          new Date(today.setHours(9, 0, 0, 0)))
      }
      
     
      if (taskDueDate.getTime() === tomorrow.getTime()) {
        scheduleNotification(
          task._id + '-tomorrow',
          `"${task.title}" is due tomorrow!`,
          `Upcoming task: ${task.title}`,
          new Date(today.setHours(18, 0, 0, 0))
        )
      }
    }
  });
};

const scheduleNotification = (id, title, message, date) => {
  PushNotification.localNotificationSchedule({
    channelId: "task-reminders",
    id: id, 
    title: title,
    message: message,
    date: date,
    allowWhileIdle: true,
    repeatType: 'day', 
  });
};
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
         scheduleTaskNotifications(sortedTasks);
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
  const markTaskAsDone = async (taskId) => {
  try {
    setCompletedTaskId(taskId);
    const res = await axios.put(`https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks/${taskId}`, { status: 'Done' }, {
      headers: { Authorization: `${token}` }
    });
     PushNotification.cancelLocalNotifications({ id: taskId + '-today' });
    PushNotification.cancelLocalNotifications({ id: taskId + '-tomorrow' });
    await refreshTasks();
  } catch (err) {
    console.error('Error marking task as done:', err);
  } finally {
    setCompletedTaskId(null);
  }
};
 const categorizeTasks = (taskList) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayTasks = [];
  const tomorrowTasks = [];
  const upcomingTasks = [];
  const overdueTasks = [];

  taskList.forEach(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() < today.getTime()) {
      overdueTasks.push(task);
    } else if (taskDate.getTime() === today.getTime()) {
      todayTasks.push(task);
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      tomorrowTasks.push(task);
    } else {
      upcomingTasks.push(task);
    }
  });

  return { overdueTasks, todayTasks, tomorrowTasks, upcomingTasks };
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
          <View style={[styles.priorityBadge, {
            backgroundColor: item.priority === 'High' ? '#FEE2E2' :
              item.priority === 'Medium' ? '#FEF3C7' : '#D1FAE5'
          }]}>
            <Text style={[styles.priorityText, {
              color: item.priority === 'High' ? '#B91C1C' :
                item.priority === 'Medium' ? '#92400E' : '#065F46'
            }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <Text style={styles.taskDescription}>{item.description}</Text>

        <View style={styles.taskMeta}>
          <View style={{ flexDirection: "row" }}>
            <Feather name="calendar" size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              {new Date(item.dueDate).toLocaleDateString()}
              {isOverdue && <Text style={{ color: '#EF4444' }}> • Overdue</Text>}
            </Text>
            
          </View>
          <Text style={styles.taskStatus}>Status: {item.status}</Text>
        </View>

        <View style={styles.metaItem}>
          <Text style={styles.taskCreator}>
            <Feather name="user" size={14} color="#6B7280" />  {item.createdBy?.name || 'You'}
          </Text>
        </View>

     
        <View style={styles.actionButtons}>
  
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
    {item.status !== 'Done' ? (
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => markTaskAsDone(item._id)}
        disabled={completedTaskId === item._id}
      >
        {completedTaskId === item._id ? (
          <ActivityIndicator size="small" color="#10B981" />
        ) : (
          <>
            <Feather name="square" size={18} color="#10B981" />
            <Text style={styles.completeText}>Mark as Complete</Text>
          </>
        )}
      </TouchableOpacity>
    ) : (
      <><Feather name="check-square" size={18} color="#10B981" /> <Text style={styles.completeText}>Completed</Text></>
    )}
  </View>

  
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    </View>
  );
};

 const renderTaskSections = () => {
  const tasksToDisplay = filteredTasks.length > 0 ? filteredTasks : tasks;
  const { overdueTasks, todayTasks, tomorrowTasks, upcomingTasks } = categorizeTasks(tasksToDisplay);

  const sections = [
    { title: 'Overdue', data: overdueTasks },
    { title: 'Today', data: todayTasks },
    { title: 'Tomorrow', data: tomorrowTasks },
    { title: 'Upcoming', data: upcomingTasks },
  ];

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => (
        <View style={styles.sectionContainer}>
          {item.data.length > 0 && <Text style={styles.sectionHeader}>{item.title}</Text>}
          {
            item.data.map(task => (
              <View key={task._id}>
                {renderItem({ item: task })}
              </View>
            ))
          }
        </View>
      )}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.listContainer}
      refreshing={loading}
      onRefresh={refreshTasks}
    />
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
       <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>

    <View style={[styles.container,{position:"relative",flex:1}]}>
             <TouchableOpacity
        onPress={()=>{Keyboard.dismiss();
          setTimeout(()=>{addTodo()},100)
        }}
        style={{ position:"absolute",
          bottom:58,right:18,
          backgroundColor: '#4CAF50',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 50,
          marginRight: 8, zIndex:99

        }}
      >
     <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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


    <View style={{ flexDirection: 'row', position: 'relative' }}>

     <TouchableOpacity onPress={() => setMenuVisible(true)}>
  <Feather name="more-vertical" size={24} color="#374151" />
</TouchableOpacity>
 {menuVisible && (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Profile');
          setMenuVisible(false);
        }}
        style={styles.menuItem}
      >
        <Feather name="user" size={18} color="#374151" />
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          dispatch(logout());
          setMenuVisible(false);
        }}
        style={styles.menuItem}
      >
        <Feather name="log-out" size={18} color="#EF4444" />
        <Text style={styles.menuText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )}
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
          {renderTaskSections()}
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
    </View></TouchableWithoutFeedback></SafeAreaView></SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
   sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    paddingHorizontal: 8,
  },
  emptySectionText: {
    color: '#999',
    paddingHorizontal: 8,
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
    padding: 12,
    
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
    marginLeft:14,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  completeContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 12,
},

checkbox: {
  marginRight: 8,
},

actionButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 12,
},

completeButton: {
  flexDirection: 'row',
  alignItems: 'center',
},

completeText: {
  marginLeft: 6,
  fontSize: 13,
  color: '#10B981',
},

editButton: {
  marginLeft: 8,
},

deleteButton: {
  marginLeft: 8,
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
   menuContainer: {
    position: 'absolute',
    top: 32, 
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
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
