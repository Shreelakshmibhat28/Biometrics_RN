import {StatusBar} from 'expo-status-bar';
import {Text, TouchableOpacity, View, Alert} from 'react-native';
import tw from "twrnc";
import {Entypo} from "@expo/vector-icons";
import * as LocalAuthentication from 'expo-local-authentication';
import React, {useState} from 'react';
import { useEffect } from 'react';

export default function App(){

  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const fallBackToDefaultAuth =() => {
    console.log(" Fall back to password authentication");
  };

  const alertComponent = (
    title,
    mess,
    btnTxt,
    btnFunc,
  ) => {
    return Alert.alert(title,mess, [
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
        style : "cancel",
      },
      {
        text: "PROCEED",
        onPress: () => console.log("OK Pressed"),
      },
    ]);

    const handleBiometricAuth = async () => {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

      if(!isBiometricAvailable){
        return alertComponent(
          'Please enter your password',
          'Biometric auth not supported',
          'OK',
          () => fallBackToDefaultAuth()
        );
      }

      let supportedBiometrics;
      if(isBiometricAvailable) {
        supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
      }

      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

      if(!savedBiometrics){
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

      if(biometricAuth) {
        TwoButtonAlert();
      }

    };

    useEffect(() => {
      (
        async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
      })
    }, []);

  return (
    <View style = {tw`flex-1 bg-white items-center justify-center`}>
      <View style = {tw` mb-[100px]`}>
        <Text style = {tw` text-center text-lg` }> Welcome to my app</Text>

        <Text>
          {" "}
          {isBiometricSupported
          ? "Your device is compatible with biometrics"
          : "Face or fingerprint scanner is available on this device"}
        </Text>
      </View>

      <View style= {tw`flex flex-row items-center gap-4`}>
        <TouchableOpacity style = {tw` rounded-lg bg-black flex flex-row items-center`}>

          <Text style = {tw`text-white`}>Login With Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBiometricAuth}>
          <Entypo name='fingerprint' size={50} color='black' />
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  )
}