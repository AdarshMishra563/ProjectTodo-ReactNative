import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
  const { token, user } = useSelector(state => state.user);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

 const statusCounts = tasks.reduce(
  (acc, task) => {
    if (acc[task.status] !== undefined) {
      acc[task.status]++;
    }
    return acc;
  },
  { 'To Do': 0, 'In Progress': 0, 'Done': 0 }
);


  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://backend-taskmanagement-k0md.onrender.com/api/auth/tasks', {
        headers: { Authorization: `${token}` }
      });
      setTasks(response.data);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  
  const chartData = [
    { name: 'To Do', population: statusCounts['To Do'], color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'In Progress', population: statusCounts['In Progress'], color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Done', population: statusCounts['Done'], color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  const upcomingTasks = tasks
    .filter(task => new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.userInfo}>
        <Image source={{ uri: user.picture }} style={styles.avatar} />
        <Text style={styles.userName}>{user.name}</Text>
      </View>

      <Text style={styles.title}>Total Tasks: {tasks.length}</Text>
      <Text style={styles.subtitle}>To Do: {statusCounts['To Do']} | In Progress: {statusCounts['In Progress']} | Done: {statusCounts['Done']}</Text>

      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={styles.title}>Upcoming Tasks</Text>
      <FlatList
        data={upcomingTasks}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, marginBottom: 10 },
  taskItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
});

export default Dashboard;
