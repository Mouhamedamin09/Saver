import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import axios from 'axios';



const LoginScreen = ({ navigation }) => {




  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [Login, setLogIn] = useState(false);
  
  const openFacebookPage = () => {
    Linking.openURL('https://www.facebook.com/profile.php?id=100086984183075');
  };

  const handleLogin = () => {
    setLogIn(true); // Set Login state to true when logging in
  
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Check if the email matches the regular expression
    if (!emailRegex.test(email)) {
      // Set error message for invalid email format
      setErrorMessage('Please enter a valid email address');
      setLogIn(false); // Reset Login state
      return; // Stop further execution
    }
  
    const serverUrl = 'http://192.168.1.14:3005/login'; // Replace YOUR_MACHINE_IP with your actual IP address
    axios.post(serverUrl, {
      email: email,
      password: password,
    })
    .then(function (response) {
      if (response.status === 200) {
        console.log('Login successful');
        // Pass token and user info to MainAppScreen and replace the login screen
        navigation.replace('MainApp', { token: response.data.token, user: response.data.user });
      } else {
        console.log('Login failed. Status:', response.status);
        setErrorMessage('Incorrect email or password'); // Set error message for incorrect email or password
      }
    })
    .catch(function (error) {
      console.error('Error occurred during login:', error);
      setErrorMessage('Incorrect email or password.'); // Set error message for other errors
    }).finally(() => {
      // Set signingIn state back to false after sign up process completes
      setLogIn(false);
    });
  };
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={Login}>
        <Text style={styles.loginButtonText}>{Login ? "Logging In..." : "Log In"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text>Or Signup using <Text style={styles.signupLink}> Sign Up</Text></Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <TouchableOpacity onPress={openFacebookPage}>
          <Text>For any Bugs Please <Text style={styles.footerText}>Contact me</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 130,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#3d3dbe',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  signupLink: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;