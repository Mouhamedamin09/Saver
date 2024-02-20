import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsOfUseScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms of Use for SAVER App</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. User Registration:</Text>
        <Text>- To access SAVER, you must register an account with us.You agree to provide accurate, current, and complete information during the registration process</Text>
        <Text>- You are solely responsible for maintaining the confidentiality of your account credentials, including your username and password. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Personal Information:</Text>
        <Text>- SAVER allows you to store personal information, including but not limited to passwords, account numbers, and sensitive data. You acknowledge and agree that you are solely responsible for the accuracy, legality, and appropriateness of the information you store in the app</Text>
        <Text>- We take reasonable measures to protect your personal information, as outlined in our Privacy Policy. However, you understand and acknowledge that no security measures are perfect or impenetrable, and we cannot guarantee the absolute security of your data.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Usage Guidelines:</Text>
        <Text>- You agree to use SAVER solely for lawful purposes and in accordance with these terms. You may not use the app for any illegal or unauthorized purpose.</Text>
        <Text>- You agree not to attempt to gain unauthorized access to any portion or feature of SAVER, or to any other systems or networks connected to the app.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Intellectual Property:</Text>
        <Text>- SAVER and all of its content, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws. You agree not to reproduce, distribute, modify, or create derivative works of the app without our prior written consent.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Limitation of Liability:</Text>
        <Text>- In no event shall SAVER, its affiliates, or their respective officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, arising out of or in connection with your use of the app.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Indemnification:</Text>
        <Text>- You agree to indemnify and hold harmless SAVER, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or in connection with your use of the app or any violation of these terms.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Modification of Terms:</Text>
        <Text>- We reserve the right to modify or revise these terms at any time, with or without notice. Your continued use of SAVER after any such changes constitutes your acceptance of the new terms.</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Governing Law:</Text>
        <Text>- These terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
    },
  });

export default TermsOfUseScreen;
