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
          'Biometric auth not supported',
          'Your device does not support biometric authentication.',
          'OK',
          () => {}
        );
      }

      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

      if (!savedBiometrics) {
        return alertComponent(
          'Biometric record not found',
          'Please set up biometrics on your device.',
          'OK',
          () => {}
        );
      }

      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with your biometrics",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      if (biometricAuth.success) {
        
        const fingerprints = JSON.parse(await SecureStore.getItemAsync('fingerprints')) || [];

        
        const existingFingerprint = fingerprints.find(fp => fp.id === biometricAuth.id);

        if (existingFingerprint) {
          alertComponent('Welcome', 'You are successfully logged in', 'OK', () => {});
          console.log("Fingerprint already exists. User ID:", existingFingerprint.userId);
        } else {
         
          const uniqueUserId = uuidv4();
          const newFingerprint = { id: biometricAuth.id, userId: uniqueUserId };

         
          fingerprints.push(newFingerprint);
          await SecureStore.setItemAsync('fingerprints', JSON.stringify(fingerprints));

          console.log("New Fingerprint Registered. User ID:", uniqueUserId);
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
      const fingerprints = JSON.parse(await SecureStore.getItemAsync('fingerprints')) || [];
      if (fingerprints.length > 0) {
        alertComponent('Retrieved Fingerprints', `Stored Fingerprints: ${JSON.stringify(fingerprints)}`, 'OK', () => {});
        console.log("Retrieved Fingerprints:", fingerprints);
      } else {
        alertComponent('No Data Found', 'No fingerprints found in secure storage.', 'OK', () => {});
      }
    } catch (error) {
      console.error("Error retrieving fingerprints:", error);
      alertComponent('Error', 'An error occurred while retrieving fingerprints', 'OK', () => {});
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
        <TouchableOpacity onPress={handleBiometricAuth}>
          <Entypo name='fingerprint' size={50} color='black' />
        </TouchableOpacity>

        <TouchableOpacity onPress={retrieveUserId}>
          <Text style={styles.buttonText}>Scan Fingerprints</Text>
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
  buttonText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
});