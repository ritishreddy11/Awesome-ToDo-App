import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../context/ThemeContext';

export default function TodoListScreen({ route, navigation }) {
  const { listId, listName } = route.params;
  const [todos, setTodos] = useState([]);
  const { theme } = useContext(ThemeContext);

  const loadTodos = useCallback(async () => {
    try {
      const storedTodoLists = await AsyncStorage.getItem('todoLists');
      if (storedTodoLists !== null) {
        const todoLists = JSON.parse(storedTodoLists);
        const currentList = todoLists.find(list => list.id === listId);
        if (currentList) {
          setTodos(currentList.todos);
        }
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }, [listId]);

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [loadTodos])
  );

  const toggleTodo = async (todoId) => {
    const updatedTodos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await updateTodoList(updatedTodos);
  };

  const deleteTodo = async (todoId) => {
    const updatedTodos = todos.filter(todo => todo.id !== todoId);
    setTodos(updatedTodos);
    await updateTodoList(updatedTodos);
  };

  const updateTodoList = async (updatedTodos) => {
    try {
      const storedTodoLists = await AsyncStorage.getItem('todoLists');
      if (storedTodoLists !== null) {
        let todoLists = JSON.parse(storedTodoLists);
        todoLists = todoLists.map(list =>
          list.id === listId ? { ...list, todos: updatedTodos } : list
        );
        await AsyncStorage.setItem('todoLists', JSON.stringify(todoLists));
      }
    } catch (error) {
      console.error('Error updating todo list:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={theme.statusBarColor ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.statusBarColor || theme.background} 
      />
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{listName}</Text>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTodo(item.id)} onLongPress={() => deleteTodo(item.id)}>
            <View style={[styles.todoItem, { backgroundColor: theme.card }]}>
              <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.checkbox}>
                {item.completed && <Icon name="check" size={20} color={theme.primary} />}
              </TouchableOpacity>
              <Text style={[
                styles.todoText, 
                { color: theme.text },
                item.completed && styles.completedTodo
              ]}>
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: theme.primary }]} 
        onPress={() => navigation.navigate('AddTodo', { listId, listName })}
      >
        <Icon name="add" size={24} color={theme.background} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 16,
    flex: 1,
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});
