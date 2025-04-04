import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeScreen({ route }) {
  const { name, userId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {name}!</Text>
      <Text style={styles.subtitle}>Your User ID: {userId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
  },
});