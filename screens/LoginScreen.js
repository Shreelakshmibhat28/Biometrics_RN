import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ navigation }) {
  const handleLogin = async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with your fingerprint',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        // Retrieve the list of users from SecureStore
        const fingerprints = JSON.parse(await SecureStore.getItemAsync('fingerprints')) || [];

        // Check if the fingerprint matches any registered user
        const existingFingerprint = fingerprints.find(fp => fp.id === biometricAuth.id);

        if (existingFingerprint) {
          Alert.alert('Success', 'Fingerprint recognized!', [
            {
              text: 'Proceed',
              onPress: () =>
                navigation.navigate('Welcome', {
                  name: existingFingerprint.name, // Pass the name
                  userId: existingFingerprint.userId, // Pass the userId
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
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login with Fingerprint</Text>
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