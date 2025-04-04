import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';
import { registerScreenStyles } from '../styles/RegisterScreenStyles'; 

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
        // Generate a unique fingerprint ID
        const fingerprintId = uuidv4(); // Generate a unique ID for the fingerprint

        // Check if the name is already registered in SecureStore
        const existingFingerprint = await SecureStore.getItemAsync(name);
        if (existingFingerprint) {
          Alert.alert('Error', 'This name is already registered. Please use a different name.');
          return;
        }

        // Save the fingerprint ID in SecureStore with the name as the key
        await SecureStore.setItemAsync(name, fingerprintId);

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
    <View style={registerScreenStyles.container}>
      <Text style={registerScreenStyles.title}>Register</Text>
      <TextInput
        style={registerScreenStyles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={registerScreenStyles.button} onPress={handleRegister}>
        <Text style={registerScreenStyles.buttonText}>Register Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );
}

