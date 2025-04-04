import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TextInput, Button } from 'react-native';
import React from 'react';
import * as SecureStore from 'expo-secure-store'; 

export default function App () {
  const [key, onChangeKey] = React.useState('');
  const [value, onChangeValue] = React.useState('');
  const [result, onChangeResult] = React.useState('(result)');

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key){
    let result = await  SecureStore.getItemAsync(key);
    if (result) {
      onChangeResult(result);
    } else {
      alert("Invalid key");
    }
  }

  return (
    <View style = {StyleSheet.container}>
      <Text style= {styles.maintext}> Save a Key/Value</Text>

      <TextInput
        style = {styles.textInput}
        placeholder = {'Enter a key'}
        onChangeText={ text => onChangeKey(text)}
        value={key}
        />

       <TextInput
        style = {styles.textInput}
        placeholder = {'Enter a value'}
        onChangeText={ text => onChangeValue(text)}
        value={value}
        />

        <Button
        title='Save'
        onPress={() => {
          save(key,value)
          onChangeKey('')
          onChangeValue('')
        }}
        />

        <Text style = {styles.maintext}>Enter Your Key</Text>

        <TextInput
        style = {styles.textInput}
        onSubmitEditing={event => {getValueFor(event.nativeEvent.text);}}
        placeholder='Enter a key'
        />

        <Text style= {styles.maintext}>{result}</Text>


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: '#fff',
  },
  maintext: {
    marginTop: 34,
    margin:24,
    fontSize:18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    height: 55,
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 10,
    margin : 4,
    borderRadius: 20,
  },
});
