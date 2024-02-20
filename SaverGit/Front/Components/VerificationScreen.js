import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const VerificationScreen = ({ onComplete, verifyingEmail }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verifying, setVerifying] = useState(false); // State to control verification process

  const handleVerify = async () => {
    try {
      // Set verifying state to true to disable the button and show "Verifying" text
      setVerifying(true);

      const response = await axios.post('http://192.168.1.14:3005/verify', {
        email: verifyingEmail,
        verificationCode: verificationCode
      });
      
      // If verification is successful
      if (response.status === 200) {
        // Code is correct
        onComplete();
      }
    } catch (error) {
      // If there's an error
      setVerificationError('Invalid or expired verification code from frontEnd');
    } finally {
      // Set verifying state back to false regardless of success or failure
      setVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.Warn}>Check your email for the verification code!</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        value={verificationCode}
        onChangeText={(text) => setVerificationCode(text)}
      />
      {verificationError ? <Text style={styles.errorText}>{verificationError}</Text> : null}
      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleVerify}
        disabled={verifying} // Disable the button while verifying
      >
        <Text style={styles.verifyButtonText}>{verifying ? 'Verifying...' : 'Verify'}</Text>
      </TouchableOpacity>
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  Warn: {
    paddingBottom: 20,
    color: "green"
  },
});

export default VerificationScreen;
