import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import TermsOfUseScreen from './TermsOfUseScreen';
import axios from 'axios';
import VerificationScreen from './VerificationScreen';


const SignupScreen = ({navigation}) => {


  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailVer, setEmailVer] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false); // State variable for tracking signup success
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (signupSuccess) {
      
      const timer = setTimeout(() => {
        setSignupSuccess(false); // Hide the success message after 2 seconds
      }, 2000);
      setShowVerificationModal(true);

      return () => clearTimeout(timer); // Clear the timer when the component unmounts or when signupSuccess changes
    }
  }, [signupSuccess]);

  const handleSignup = () => {
    setSigningIn(true);
    
    const serverUrl = 'https://saver-server.onrender.com/register'; // Replace YOUR_MACHINE_IP with your actual IP address
    axios.post(serverUrl, {
      username: name,
      email: email,
      password: password,
    })
    .then(function (response) {
      if(response.status === 201){
        console.log('User registered successfully');
        setSignupSuccess(true); // Set signup success state to true
        // Clear input fields after successful signup
        
        setName('');
        setEmailVer(email)
        setEmail('');
        setPassword('');
      } else {
        console.error('Registration failed. Status:', response.status);
      }
    })
    .catch(function (error) {
      if (error.response && error.response.status === 400) {
        console.error('Registration failed. User with this email already exists');
      } else {
        console.error('Error occurred during registration:', error);
      }
    }).finally(() => {
      // Set signingIn state back to false after sign up process completes
      setSigningIn(false);
    });
  };


  const handleVerificationComplete = () => {
    // Handle what happens after successful verification
    // For example, you can navigate to the next screen
    setShowVerificationModal(false);

    navigation.replace('Login');
    // Proceed with whatever action comes after verification
    console.log('Verification successful');
  };

  const openTermsModal = () => {
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {signupSuccess && ( // Render success message if signup was successful
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>Registration successful!</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text)=> setPassword(text)}
      />
      <TouchableOpacity style={styles.termsLink} onPress={openTermsModal}>
        <Text style={styles.termsLinkText}>Terms of Service</Text>
      </TouchableOpacity>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox} onPress={() => setTermsAccepted(!termsAccepted)}>
          {termsAccepted ? (
            <Text style={styles.checkboxText}>☑</Text>
          ) : (
            <Text style={styles.checkboxText}>☐</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
      </View>
      <TouchableOpacity
        style={[styles.signupButton, !termsAccepted && styles.signupButtonDisabled]}
        onPress={handleSignup}
        disabled={!termsAccepted || signingIn}>
        <Text style={styles.signupButtonText}>{signingIn ? 'Signing In...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTermsModal}
        onRequestClose={closeTermsModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TermsOfUseScreen />
            <TouchableOpacity style={styles.okButton} onPress={handleAcceptTerms}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}>
        <VerificationScreen onComplete={handleVerificationComplete}  verifyingEmail={emailVer}/>
      </Modal>
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
  termsLink: {
    marginBottom: 15,
  },
  termsLinkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#3d3dbe',
  },
  signupButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  termsText: {
    fontSize: 16,
  },
  okButton: {
    width: '100%',
    height: 50,
    
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor:'#3d3dbe',
  },
  okButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  successMessage: {
    backgroundColor: '#4CAF50', // Green background color
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  successMessageText: {
    color: '#ffffff', // White text color
    fontWeight: 'bold',
  },
});

export default SignupScreen;
