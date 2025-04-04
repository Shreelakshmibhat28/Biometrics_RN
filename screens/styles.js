import { StyleSheet } from 'react-native';
const homeScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    title: {
      fontSize: 24,
      marginBottom: 40,
    },
    button: {
      backgroundColor: 'black',
      padding: 15,
      borderRadius: 8,
      marginVertical: 10,
      width: '80%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
    },
  });

  const registerScreenStyles = StyleSheet.create({
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

  const loginScreenStyles = StyleSheet.create({
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

  const welcomeScreenStyles = StyleSheet.create({
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

  export { homeScreenStyles, registerScreenStyles, loginScreenStyles, welcomeScreenStyles };