import React, { useState, useEffect, useCallback,useRef } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Modal, TouchableWithoutFeedback, Alert, TextInput, Animated, Dimensions, StatusBar,PanResponder } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faEdit, faTrash, faCopy, faEye, faEyeSlash, faEnvelope, faLock,faTimes,faUserCircle,faHouse,faCog,faInfoCircle,faSignOutAlt  } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faGoogle, faInstagram, faTiktok, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import NavBar from './NavBar';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native'; // Import CommonActions

const screenWidth = Dimensions.get('window').width;

const MainAppScreen = ({ navigation, route }) => {
  const { token, user } = route.params;
  const [dataModal, setDataModal] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [SearchValue, setSearchValue] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [ActiveModal, setActiveModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [isCurrentScreen, setIsCurrentScreen] = useState(true);

  useEffect(() => {
    fetchDataModal();
  }, []);

  const fetchDataModal = async () => {
    try {
      const response = await axios.get(`http://192.168.1.14:3005/api/data/${user._id}`, {
      headers: {
      Authorization: `Bearer ${token}`,
      },
    timeout: 5000, //timer for refresh and fetsh data
});
      setDataModal(response.data);
      setOriginalData(response.data);
    } catch (error) {
      console.error('Error fetching data modals:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDataModal();
  }, []);

  const handleLongPress = (itemId) => {
    setSelectedItemId(itemId);
    setModalVisible(true);
  };

  const handleEdit = (item) => {
    setEditedData(item);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.1.14:3005/api/data/${selectedItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataModal(dataModal.filter(item => item._id !== selectedItemId));
      setModalVisible(false);
    } catch (error) {
      console.error('Error deleting data item:', error);
      Alert.alert('Error', 'Failed to delete data item. Please try again.');
    }
  };

  const handleSearchChange = (text) => {
    setSearchValue(text);
    const filteredData = originalData.filter(item => item.header.toLowerCase().includes(text.toLowerCase()));
    setDataModal(filteredData);
  };

  const handleCopy = (item) => {
    const { email, password } = item;
    const copiedText = `Email: ${email}\nPassword: ${password}`;
    console.log(copiedText);
    setModalVisible(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEditSubmit = async () => {
   
    try {
      await axios.put(`http://192.168.1.14:3005/api/data/${selectedItemId}`, editedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataModal(dataModal.map(item => (item._id === selectedItemId ? editedData : item)));
      setModalVisible(false);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating data item:', error);
      Alert.alert('Error', 'Failed to update data item. Please try again.');
    }
  };

  const renderDataModalItem = ({ item }) => {
    const isExpanded = expandedId === item._id;
    const toggleExpand = () => {
      setExpandedId(isExpanded ? null : item._id);
    };

    let iconComponent = null;
    switch (item.selectedIcon) {
      case 'facebook':
        iconComponent = <FontAwesomeIcon icon={faFacebookF} style={styles.icon} size={20} />;
        break;
      case 'google':
        iconComponent = <FontAwesomeIcon icon={faGoogle} style={styles.icon} size={20} />;
        break;
      case 'instagram':
        iconComponent = <FontAwesomeIcon icon={faInstagram} style={styles.icon} size={20} />;
        break;
      case 'tiktok':
        iconComponent = <FontAwesomeIcon icon={faTiktok} style={styles.icon} size={20} />;
        break;
      case 'linkedin':
        iconComponent = <FontAwesomeIcon icon={faLinkedinIn} style={styles.icon} size={20} />;
        break;
      default:
        iconComponent = null;
    }

    const eyeIcon = showPassword ? faEye : faEyeSlash;

    return (
      <TouchableOpacity
        onPress={toggleExpand}
        onLongPress={() => handleLongPress(item._id)}
        style={[styles.modalItem, isExpanded && styles.expandedItem]}>
        <View style={styles.contentContainer}>
          {iconComponent}
          <Text style={styles.header}>{item.header}</Text>
          <FontAwesomeIcon icon={faChevronDown} style={[styles.icon, isExpanded && styles.rotateIcon]} size={20} />
        </View>
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.fieldContainer}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.fieldIcon} size={20} />
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.fieldIcon} size={20} />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <FontAwesomeIcon icon={eyeIcon} style={styles.eyeIcon} size={20} />
              </TouchableOpacity>
              <Text style={styles.password}>{showPassword ? item.password : '********'}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsSidebarOpen(!isSidebarOpen);
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, 0],
  });

  const handleLogout = () => {
    // Reset the navigation stack to the login screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar} >
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      <NavBar token={token} user={user} handleSearchChange={handleSearchChange} handleBarclick={toggleSidebar} ActiveModal={ActiveModal} setActiveModal={setActiveModal} />
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <TouchableOpacity style={styles.closeIconContainer} onPress={toggleSidebar}>
          <FontAwesomeIcon icon={faTimes} size={25} style={styles.closeIcon} />
        </TouchableOpacity>
        <View style={styles.user}>
          <FontAwesomeIcon icon={faUserCircle} size={60} style={styles.userIcon} />
          <Text style={styles.userName}>{user.username}</Text>
        </View>
        <View  style={styles.itemContainer }>
        <View style={[styles.sidebarItem, isCurrentScreen && styles.CurrentScreen]}>
            <TouchableOpacity style={styles.ItemSet}>
            <FontAwesomeIcon icon={faHouse} size={20} color={ isCurrentScreen ?"#3d3dbe" :"black"} />
              <Text style={[styles.sidebarItemText, isCurrentScreen && styles.CurrentItem]}>Home</Text>
            </TouchableOpacity>
          </View >
          <View style={styles.sidebarItem}>
            <TouchableOpacity style={styles.ItemSet}>
              <FontAwesomeIcon icon={faCog} size={20}  />
              <Text style={styles.sidebarItemText}>Options</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sidebarItem}>
            <TouchableOpacity style={styles.ItemSet}>
              <FontAwesomeIcon icon={faInfoCircle} size={20}  />
              <Text style={styles.sidebarItemText}>About Us</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.barAboveEmail}></View>

          <View style={styles.sidebargmail}>
            <TouchableOpacity style={styles.ItemSet}>
              <FontAwesomeIcon icon={faEnvelope} size={20}  />
              <Text style={styles.sidebarItemTextGmail}>{user.email}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sidebarItemLogout}>
            <TouchableOpacity style={styles.ItemSet} onPress={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} size={20}  />
              <Text style={styles.sidebarItemTextLogout}>Log Out</Text>
            </TouchableOpacity>
          </View>
      </Animated.View>
      <FlatList
        data={dataModal}
        renderItem={renderDataModalItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3d3dbe']}
            progressBackgroundColor="#fff"
          />
        }
      />
      {dataModal.length === 0 && !SearchValue && (
        <View style={styles.noDataContainer}>
          <TouchableOpacity onPress={() => setActiveModal(true)}  >
            <Text style={styles.noDataText}>Add new Account</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {editMode ? (
                  <View>
                    <TextInput
                      style={styles.input}
                      placeholder="Header"
                      value={editedData.header}
                      onChangeText={(text) => setEditedData({ ...editedData, header: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={editedData.email}
                      onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      secureTextEntry={!showPassword}
                      value={editedData.password}
                      onChangeText={(text) => setEditedData({ ...editedData, password: text })}
                    />
                    <Button title="Save Changes" onPress={handleEditSubmit} />
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity style={styles.modalItemButton} onPress={() => handleEdit(editedData)}>
                      <FontAwesomeIcon icon={faEdit} style={styles.modalIcon} size={20} />
                      <Text style={styles.modalButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItemButton} onPress={handleDelete}>
                      <FontAwesomeIcon icon={faTrash} style={styles.modalIcon} size={20} />
                      <Text style={styles.modalButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalItemButton} onPress={() => handleCopy(editedData)}>
                      <FontAwesomeIcon icon={faCopy} style={styles.modalIcon} size={20} />
                      <Text style={styles.modalButtonText}>Copy</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  listContainer: {
    paddingVertical: 10,
  },
  modalItem: {
    backgroundColor: '#fff',
    padding: 30,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  expandedItem: {
    marginBottom: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  icon: {
    color: '#777',
  },
  rotateIcon: {
    transform: [{ rotate: '180deg' }],
  },
  expandedContent: {
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  password: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  fieldIcon: {
    marginRight: 10,
    color: '#777',
  },
  eyeIcon: {
    marginLeft: 10,
    color: '#777',
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
    width: '80%',
  },
  modalItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalIcon: {
    marginRight: 10,
  },
  modalButtonText: {
    fontSize: 16,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    paddingVertical: 12,
    paddingLeft: 15,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 250,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 20,
    color: '#555',
  },
  addButtonContainer: {
    marginTop: 20,
    backgroundColor: '#3d3dbe',
    borderRadius: 50,
    padding: 10,
  },
  addButtonIcon: {
    color: 'white',
  },
  sidebar: {
    
    position: 'absolute',
    padding:0,
    top: 0,
    left: 0,
    backgroundColor: '#FFF',
   
    borderRightWidth: 1,
    borderColor: '#DDD',
    width: screenWidth * 0.75, // Adjust as needed
    height: '100%',
    zIndex: 999,
  },
 
  closeIconContainer: {
    top:23,
    right:10,
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeIcon: {
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1, // Ensure overlay is above other content
  },
  user: {
    
    alignItems: 'center',
    marginBottom: 44,
    
  },
  userIcon: {
    right:70,
    bottom:40,
    color: '#333',
  },
  userName: {
    textAlign:'left',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    bottom:35,
    right:5,
    color: '#333',
  },
  itemContainer: {
   bottom:50,
  },
  sidebarItem: {
    display:"flex",
    margin:0,
   
   
    
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom:20,
    paddingTop:20,
  },
  sidebarItemText: {
    fontSize: 15,
    color: '#333',
    marginLeft:20,
    
    
  },
  ItemSet:{
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    
    
  },
  hoveredItem: {
    backgroundColor: '#f0f0f0',
  },
  sidebargmail:{
    
    marginLeft:20,
    width:250,
    top:310,
  },
  ItemSetGmail:{
    
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    backgroundColor: '#fff',
    
  },
  sidebarItemTextGmail:{
    fontSize: 12,
    color: '#333',
    marginLeft:20,
  },
  barAboveEmail: {
    top:300,
    height: 1, // Adjust the height as needed
    backgroundColor: 'grey',
    marginVertical: 10, // Adjust the vertical margin as needed
  },
  sidebarItemTextLogout:{
    fontSize: 15,
    color: '#333',
    marginLeft:20,
    fontWeight: 'bold',
  },
  sidebarItemLogout:{
    marginLeft:30,
    width:250,
    top:290,
   
  },
  CurrentScreen:{
    backgroundColor:'#3d3dbe2a'
  },

  CurrentItem:{
    color:"#3d3dbe",
  }
  



});

export default MainAppScreen;
