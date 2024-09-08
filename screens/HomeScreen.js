import React, { useState, useCallback, useContext, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, StatusBar, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const [todoLists, setTodoLists] = useState([]);
  const { theme } = useContext(ThemeContext);
  
  // Animation values
  const addButtonScale = useRef(new Animated.Value(1)).current;
  const settingsButtonRotate = useRef(new Animated.Value(0)).current;

  const loadTodoLists = useCallback(async () => {
    try {
      const storedTodoLists = await AsyncStorage.getItem('todoLists');
      if (storedTodoLists !== null) {
        setTodoLists(JSON.parse(storedTodoLists));
      }
    } catch (error) {
      console.error('Error loading todo lists:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTodoLists();
    }, [loadTodoLists])
  );

  const addNewList = () => {
    // Animate the add button
    Animated.sequence([
      Animated.timing(addButtonScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(addButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate('AddList');
    });
  };

  const openSettings = () => {
    // Animate the settings button
    Animated.timing(settingsButtonRotate, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      settingsButtonRotate.setValue(0);
      navigation.navigate('Settings');
    });
  };

  const spin = settingsButtonRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={theme.statusBarColor ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.statusBarColor || theme.background} 
      />
      <View style={styles.backgroundImageContainer}>
        <Image 
          source={theme.backgroundImage} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>My Todo Lists</Text>
        <FlatList
          data={todoLists}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.listItem, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate('TodoList', { listId: item.id, listName: item.name })}
            >
              <Text style={[styles.listItemText, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.listItemCount, { color: theme.text }]}>{item.todos.length} items</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <Animated.View style={[styles.addButton, { transform: [{ scale: addButtonScale }] }]}>
        <TouchableOpacity 
          style={[styles.addButtonTouchable, { backgroundColor: theme.primary }]} 
          onPress={addNewList}
        >
          <Icon name="add" size={24} color={theme.background} />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View style={[styles.settingsButton, { transform: [{ rotate: spin }] }]}>
        <TouchableOpacity 
          style={[styles.settingsButtonTouchable, { backgroundColor: theme.primary }]} 
          onPress={openSettings}
        >
          <Icon name="settings" size={24} color={theme.background} />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 80,
  },
  listItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 18,
  },
  listItemCount: {
    fontSize: 14,
    opacity: 0.7,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  addButtonTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  settingsButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
  },
  settingsButtonTouchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

