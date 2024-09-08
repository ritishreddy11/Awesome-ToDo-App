import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import TodoListScreen from './screens/TodoListScreen';
import AddTodoScreen from './screens/AddTodoScreen';
import AddListScreen from './screens/AddListScreen';
import SettingsScreen from './screens/SettingsScreen';
import { ThemeContext, themes } from './context/ThemeContext';

const Stack = createStackNavigator();

export default function App() {
  const [theme, setTheme] = useState(themes.default);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(themes[savedTheme]);
    }
  };

  const changeTheme = (themeName) => {
    setTheme(themes[themeName]);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.primary,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Todo Lists' }} />
          <Stack.Screen name="TodoList" component={TodoListScreen} options={{ title: 'Todo List' }} />
          <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{ title: 'Add Todo' }} />
          <Stack.Screen name="AddList" component={AddListScreen} options={{ title: 'Add List' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
