import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ImageBackground } from 'react-native';
import { ThemeContext, themes } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { theme, changeTheme } = useContext(ThemeContext);

  const themeNames = {
    default: 'Default',
    light: 'Light',
    dark: 'Dark',
    avengers: 'Avengers',
    starWars: 'Star Wars',
  };

  const themeColors = {
    default: ['#4A90E2', '#50E3C2'],
    light: ['#FFB3BA', '#FFDFBA'],
    dark: ['#2C3E50', '#34495E'],
    avengers: ['#3949AB', '#5C6BC0'],
    starWars: ['#FFC107', '#FF9800'],
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const renderThemeButton = (themeName) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedTouchable
        key={themeName}
        style={[
          styles.themeButton,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
        onPress={() => changeTheme(themeName)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <ImageBackground
          source={themes[themeName].backgroundImage}
          style={styles.themeButtonBackground}
          imageStyle={styles.themeButtonBackgroundImage}
        >
          <LinearGradient
            colors={themeColors[themeName]}
            style={styles.themeButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.themeButtonText}>{themeNames[themeName]}</Text>
          </LinearGradient>
        </ImageBackground>
      </AnimatedTouchable>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Select Theme</Text>
      <View style={styles.themeContainer}>
        {Object.keys(themeNames).map(renderThemeButton)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  themeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  themeButton: {
    width: '45%',
    aspectRatio: 1,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  themeButtonBackground: {
    flex: 1,
  },
  themeButtonBackgroundImage: {
    opacity: 0.5,
  },
  themeButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  themeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
