import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { welcomeScreenStyles } from '../styles/WelcomeScreenStyles'; 

export default function WelcomeScreen({ route }) {
  const { name, userId } = route.params;

  return (
    <View style={welcomeScreenStyles.container}>
      <Text style={welcomeScreenStyles.title}>Welcome, {name}!</Text>
      <Text style={welcomeScreenStyles.subtitle}>Your User ID: {userId}</Text>
    </View>
  );
}

