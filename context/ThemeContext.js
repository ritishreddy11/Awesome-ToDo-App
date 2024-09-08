import React from 'react';

export const themes = {
  default: {
    primary: '#4A90E2',
    background: '#FFFFFF',
    card: '#F0F0F0',
    text: '#333333',
    border: '#E0E0E0',
    backgroundImage: require('../assets/default_bg.jpg'),
  },
  light: {
    primary: '#FFB3BA',
    background: '#FFFFFF',
    card: '#FFF0F5',
    text: '#4A4A4A',
    border: '#FFE4E1',
    backgroundImage: require('../assets/adaptive-icon.png')
  },
  dark: {
    primary: '#34495E',
    background: '#2C3E50',
    card: '#34495E',
    text: '#FFFFFF',
    border: '#4A6572',
    backgroundImage: require('../assets/dark_bg.jpg'),
  },
  avengers: {
    primary: '#3949AB',
    background: '#ECEFF1',
    card: '#FFFFFF',
    text: '#37474F',
    border: '#CFD8DC',
    backgroundImage: require('../assets/avengers_bg.jpg'),
  },
  starWars: {
    primary: '#FFC107',
    background: '#212121',
    card: '#2C2C2C',
    text: '#FAFAFA',
    border: '#424242',
    backgroundImage: require('../assets/starwars_bg.jpg'),
  },
};

export const ThemeContext = React.createContext({
  theme: themes.default,
  changeTheme: () => {},
});
