import 'react-native-get-random-values'; 
import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import { Entypo } from "@expo/vector-icons";
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store'; 
import { v4 as uuidv4 } from 'uuid'; 
import React, { useState, useEffect } from 'react';

export default function App() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const fallBackToDefaultAuth = () => {
    console.log("Fall back to password authentication");
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const TwoButtonAlert = () =>
    Alert.alert("You are logged in", "Subscribe now", [
      {
        text: "Back",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "PROCEED",
        onPress: () => console.log("OK Pressed"),
      },
    ]);

  const handleBiometricAuth = async () => {
    try {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

      if (!isBiometricAvailable) {
        return alertComponent(
          'Please enter your password',
          'Biometric auth not supported',
          'OK',
          () => fallBackToDefaultAuth()
        );
      }

      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

      if (!savedBiometrics) {
        return alertComponent(
          'Biometric record not found',
          'Please login with your password',
          'OK',
          () => fallBackToDefaultAuth()
        );
      }

      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with your biometrics",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        // Check if a fingerprint ID already exists
        const existingUserId = await SecureStore.getItemAsync('userId');
        if (existingUserId) {
          alertComponent('Fingerprint Exists', 'You have already registered this fingerprint.', 'OK', () => {});
          console.log("Fingerprint already exists. User ID:", existingUserId);
        } else {
          // Generate a unique user ID for the new fingerprint
          const uniqueUserId = uuidv4();
          await SecureStore.setItemAsync('userId', uniqueUserId); // Store it securely
          
          // Log the unique user ID to the console
          console.log("New User ID:", uniqueUserId);

          TwoButtonAlert();
        }
      } else {
        alertComponent('Authentication Failed', 'Please try again', 'OK', () => {});
      }
    } catch (error) {
      console.error("Error during biometric authentication:", error);
      alertComponent('Error', 'An error occurred during authentication', 'OK', () => {});
    }
  };

  const retrieveUserId = async () => {
    try {
      const userId = await SecureStore.getItemAsync('userId');
      if (userId) {
        alertComponent('Retrieved User ID', `Your User ID is: ${userId}`, 'OK', () => {});
        console.log("Retrieved User ID:", userId);
      } else {
        alertComponent('No Data Found', 'No user ID found in secure storage.', 'OK', () => {});
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      alertComponent('Error', 'An error occurred while retrieving user ID', 'OK', () => {});
    }
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to my app</Text>
        <Text>
          {isBiometricSupported
            ? "Your device is compatible with biometrics"
            : "Face or fingerprint scanner is available on this device"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.passwordButton}>
          <Text style={styles.buttonText}>Login With Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBiometricAuth}>
          <Entypo name='fingerprint' size={50} color='black' />
        </TouchableOpacity>

        <TouchableOpacity onPress={retrieveUserId}>
          <Text style={styles.buttonText}>Retrieve User ID</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    marginBottom: 100,
    alignItems: 'center',
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  passwordButton: {
    borderRadius: 8,
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
  },
});