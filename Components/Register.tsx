import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios, { AxiosError } from 'axios';

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onRegistrationButtonClicked = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('https://fdae-145-44-78-113.ngrok-free.app/api/users', {
        Name: name,
        Email: email,
        Password: password,
        Role: 'user',
        Bio: ''
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!');
        // You might want to navigate to the login page or clear the form here
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error: string }>;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorMessage =
            axiosError.response.data && typeof axiosError.response.data === 'object' && 'error' in axiosError.response.data
              ? axiosError.response.data.error
              : 'Registration failed';
          Alert.alert('Error', errorMessage);
        } else if (axiosError.request) {
          // The request was made but no response was received
          Alert.alert('Error', 'No response from server. Please try again.');
        } else {
          // Something happened in setting up the request that triggered an Error
          Alert.alert('Error', axiosError.message || 'An unexpected error occurred');
        }
      } else {
        // This is not an Axios error
        Alert.alert('Error', 'An unexpected error occurred');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Registreren!</Text>
        <Text style={styles.subText}>Maak een account aan om door te gaan</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Naam"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email adres"
            placeholderTextColor="#888"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Wachtwoord"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={onRegistrationButtonClicked}>
          <Text style={styles.registerButtonText}>Registreren</Text>
        </TouchableOpacity>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Door te registreren ga je akkoord met onze{' '}
            <Text style={styles.termsLink}>Voorwaarden</Text> en{' '}
            <Text style={styles.termsLink}>Privacybeleid</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    elevation: 1,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#333',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  registerButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  termsText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  termsLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default RegistrationPage;