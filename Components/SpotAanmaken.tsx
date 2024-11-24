import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpotAanmaken = ({ navigation }: any) => {
  const [spotName, setSpotName] = useState('');
  const [spotImage, setSpotImage] = useState<string | null>(null);
  const [spotDescription, setSpotDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('available');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState('');

  const getUserSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  };


  const openGallery = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow access to your photos to use this feature.");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
  
    if (!result.canceled) {
      setSpotImage(result.assets[0].uri);
      console.log('Selected image URI:', result.assets[0].uri);
    }
  };

  const handleCreateSpot = async () => {
    const userSession = await getUserSession();
    if (!userSession || !userSession.userId) {
      Alert.alert('Error', 'User not logged in');
      return;
    }
    // Validation
    if (!spotName.trim()) {
      Alert.alert('Error', 'Spot name is required');
      return;
    }

  
    const formData = new FormData();
    
    // Append all fields
    formData.append('title', spotName.trim());
    formData.append('description', spotDescription);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('status', status);
    formData.append('expiryDate', expiryDate);
    formData.append('category', category);
    formData.append('userId', userSession.userId.toString());
  
    if (spotImage) {
        const uriParts = spotImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('photo', {
          uri: spotImage,
          name: `photo.${fileType}`,
          type: `image/${fileType}`
        } as any);
      }
  
    console.log('Form Data:', formData);

    try {
      const response = await fetch('https://1a24-86-93-44-129.ngrok-free.app/api/spot', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
  
      console.log('Response Status:', response.status);
      const responseText = await response.text();
      console.log('Response Text:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log('Spot Created:', data);
        Alert.alert('Success', 'Spot created successfully');
        navigation.goBack();
      } else {
        console.error('Error creating spot:', responseText);
        Alert.alert('Error', 'Failed to create spot. Please try again.');
      }
    } catch (error) {
      console.error("Error posting data: ", error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };
  
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Spot</Text>

      {/* Spot Name */}
      <TextInput
        style={styles.input}
        placeholder="Enter Spot Name"
        value={spotName}
        onChangeText={setSpotName}
      />

      {/* Spot Description */}
      <TextInput
        style={styles.input}
        placeholder="Enter Spot Description"
        value={spotDescription}
        onChangeText={setSpotDescription}
      />

      {/* Latitude */}
      <TextInput
        style={styles.input}
        placeholder="Enter Latitude"
        value={latitude}
        onChangeText={setLatitude}
      />

      {/* Longitude */}
      <TextInput
        style={styles.input}
        placeholder="Enter Longitude"
        value={longitude}
        onChangeText={setLongitude}
      />

      {/* Expiry Date */}
      <TextInput
        style={styles.input}
        placeholder="Enter Expiry Date"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />

      {/* Category */}
      <TextInput
        style={styles.input}
        placeholder="Enter Category"
        value={category}
        onChangeText={setCategory}
      />

      {/* Spot Image Picker */}
      <TouchableOpacity onPress={openGallery}>
        <View style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Pick an image</Text>
        </View>
      </TouchableOpacity>

      {/* Show selected image if exists */}
      {spotImage && <Image source={{ uri: spotImage }} style={styles.image} />}

      {/* Submit Button */}
      <Button title="Create Spot" onPress={handleCreateSpot} />

      {/* Back Navigation */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  imagePicker: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  imagePickerText: {
    textAlign: 'center',
    color: '#333',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default SpotAanmaken;
