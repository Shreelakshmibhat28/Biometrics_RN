import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name.');
      return;
    }

    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Register your fingerprint',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        // Retrieve the existing list of users from SecureStore
        const users = JSON.parse(await SecureStore.getItemAsync('users')) || [];

        // Generate a unique user ID and fingerprint ID
        const uniqueUserId = uuidv4();
        const fingerprintId = uuidv4(); // Generate a unique ID for the fingerprint

        // Check if the name is already registered
        const existingUser = users.find(user => user.name === name);
        if (existingUser) {
          Alert.alert('Error', 'This name is already registered. Please use a different name.');
          return;
        }

        // Create a new user object
        const newUser = { name, userId: uniqueUserId, fingerprintId };

        // Add the new user to the list
        users.push(newUser);

        // Save the updated list back to SecureStore
        await SecureStore.setItemAsync('users', JSON.stringify(users));

        Alert.alert('Success', 'Fingerprint registered successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Failed', 'Fingerprint registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'An error occurred during registration.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register Fingerprint</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});