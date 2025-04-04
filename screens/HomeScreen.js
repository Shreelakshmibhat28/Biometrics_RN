import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { homeScreenStyles } from '../styles/HomeScreenStyles'; 
export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={homeScreenStyles.title}>Welcome to Biometrics Demo</Text>
      <TouchableOpacity
        style={homeScreenStyles.button}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={homeScreenStyles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={homeScreenStyles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={homeScreenStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

