import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { loginScreenStyles } from '../styles/LoginScreenStyles'; 

export default function LoginScreen({ navigation }) {
  const handleLogin = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with your fingerprint',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        const fingerprints = JSON.parse(await SecureStore.getItemAsync('fingerprints')) || [];
        const existingFingerprint = fingerprints.find(fp => fp.id === biometricAuth.id);

        if (existingFingerprint) {
          Alert.alert('Success', 'Fingerprint recognized!', [
            {
              text: 'Proceed',
              onPress: () =>
                navigation.navigate('Welcome', {
                  name: existingFingerprint.name,
                  userId: existingFingerprint.userId,
                }),
            },
          ]);
        } else {
          Alert.alert('Error', 'Fingerprint not recognized. Please register first.');
        }
      } else {
        Alert.alert('Failed', 'Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  return (
    <View style={loginScreenStyles.container}>
      <Text style={loginScreenStyles.title}>Login</Text>
      <TouchableOpacity style={loginScreenStyles.button} onPress={handleLogin}>
        <Text style={loginScreenStyles.buttonText}>Login with Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );
}

