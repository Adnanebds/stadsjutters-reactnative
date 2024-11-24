import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootStackParamList = {
    LoginPage: undefined;
    RegistrationPage: undefined;
    Welcome : undefined
  };


  type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginPage'>;
  
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const onLoginButtonClicked = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post('https://8ca0-86-93-44-129.ngrok-free.app/api/login', {
        Email: email,
        Password: password
      });

      console.log('Response:', response.data);

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!');
        onWelcomeTapped()
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        Alert.alert('Error', `An error occurred while logging in: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred while logging in');
      }
    }
  };

  const onRegisterTapped = () => {
    navigation.navigate('RegistrationPage');
  };


  const onWelcomeTapped = () => {
    navigation.navigate('Welcome');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welkom!</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={onLoginButtonClicked}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.grayText}>Nog geen account? </Text>
          <TouchableOpacity onPress={onRegisterTapped}>
            <Text style={styles.blueText}>Registreer nu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <TouchableOpacity onPress={onWelcomeTapped}>
            <Text style={styles.blueText}>Welkom Pagina</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}> Or continue with </Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
          <Text style={styles.googleButtonText}>G</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F8FA',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    padding: 10,
    color: 'black',
  },
  loginButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  grayText: {
    fontSize: 14,
    color: 'gray',
  },
  blueText: {
    fontSize: 14,
    color: '#1E90FF',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  dividerText: {
    fontSize: 14,
    color: 'gray',
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  googleButtonText: {
    color: 'red',
    fontSize: 20,
  },
});

export default LoginPage;