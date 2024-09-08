import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function AddListScreen({ navigation }) {
  const [listName, setListName] = useState('');
  const { theme } = useContext(ThemeContext);

  const addList = async () => {
    if (listName.trim().length === 0) return;

    try {
      const storedTodoLists = await AsyncStorage.getItem('todoLists');
      let todoLists = storedTodoLists ? JSON.parse(storedTodoLists) : [];
      
      const newList = { id: Date.now().toString(), name: listName, todos: [] };
      todoLists.push(newList);
      
      await AsyncStorage.setItem('todoLists', JSON.stringify(todoLists));
      navigation.goBack();
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Create New List</Text>
        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          placeholder="Enter list name"
          placeholderTextColor={theme.border}
          value={listName}
          onChangeText={setListName}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={addList}
        >
          <Text style={[styles.addButtonText, { color: theme.background }]}>Add List</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  addButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
