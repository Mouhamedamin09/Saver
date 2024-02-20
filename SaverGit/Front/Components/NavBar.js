import React, { useState,useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native'; // Import Picker from react-native
import {Picker} from "@react-native-picker/picker"
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faPlus, faSave, faEnvelope, faHeading, faKey, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const NavBar = ({ openModal, handleSearchChange, handleBarclick }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBarclick}> 
        <FontAwesomeIcon icon={faBars} style={styles.icon} size={20} />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#999"
          onChangeText={handleSearchChange}
        />
      </View>
      <TouchableOpacity onPress={openModal}>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faPlus} style={styles.icon} size={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const NavBarParent = ({ token, user,handleSearchChange,handleBarclick ,ActiveModal,setActiveModal }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [header, setHeader] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('google'); // State to hold selected icon
  const isSaveDisabled = email.trim() === '' || password.trim() === '';




  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSave = () => {
    const data = {
      userId:user._id,
      header: header,
      email: email,
      password: password,
      selectedIcon: selectedIcon
    };

    axios.post('http://192.168.1.14:3005/api/data', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log(response.data);
      closeModal(); // Close modal after successful save
    })
    .catch(error => {
      console.error(error);
    });
  };

  useEffect(() => {
    if (ActiveModal) {
      openModal();
      setActiveModal(false);
    }
  }, [ActiveModal]);

  return (
    <View>
      <NavBar openModal={openModal} handleSearchChange={handleSearchChange} handleBarclick={handleBarclick} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} style={styles.closeIcon} size={25} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add To Saver</Text>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faHeading} style={styles.inputIcon} size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter header"
                value={header}
                onChangeText={text => setHeader(text)}
            
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.inputIcon} size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={text => setEmail(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faKey} style={styles.inputIcon} size={20} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry={true}
                value={password}
                onChangeText={text => setPassword(text)}
              />
            </View>
            {/* Add Picker for selecting icon */}
            <Picker
              selectedValue={selectedIcon}
              style={{ height: 50, width: '100%', marginBottom: 15 }}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedIcon(itemValue)
              }>
              <Picker.Item label="Google" value="google" />
              <Picker.Item label="Facebook" value="facebook" />
              <Picker.Item label="Instagram" value="instagram" />
              <Picker.Item label="TikTok" value="tiktok" />
              <Picker.Item label="LinkedIn" value="linkedin" />
            </Picker>
            {/* End of Picker */}
            <TouchableOpacity style={[styles.saveButton, isSaveDisabled && styles.disabledButton]} onPress={handleSave} disabled={isSaveDisabled}>
              <FontAwesomeIcon icon={faSave} style={styles.buttonIcon} size={20} />
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    flex: 1,
  },
  searchBar: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: '#666',
  },
  iconContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeIcon: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 10,
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5, // Set the opacity to visually indicate that the button is disabled
  },
});

export default NavBarParent;
