import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function AddTodoScreen({ navigation, route }) {
  const [text, setText] = useState('');
  const { listId, listName } = route.params;
  const { theme } = useContext(ThemeContext);

  const addTodo = async () => {
    if (text.trim().length === 0) return;

    try {
      const storedTodoLists = await AsyncStorage.getItem('todoLists');
      let todoLists = storedTodoLists ? JSON.parse(storedTodoLists) : [];
      
      const newTodo = { id: Date.now().toString(), text, completed: false };
      
      todoLists = todoLists.map(list =>
        list.id === listId ? { ...list, todos: [...list.todos, newTodo] } : list
      );
      
      await AsyncStorage.setItem('todoLists', JSON.stringify(todoLists));
      navigation.goBack();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder={`Add todo to ${listName}`}
        placeholderTextColor={theme.border}
        value={text}
        onChangeText={setText}
      />
      <Button title="Add Todo" onPress={addTodo} color={theme.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
