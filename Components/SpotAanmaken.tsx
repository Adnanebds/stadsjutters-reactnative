import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

const SpotAanmaken = ({ navigation }: any) => {
  const [spotName, setSpotName] = useState('');
  const [spotImage, setSpotImage] = useState<string | null>(null);
  const [spotDescription, setSpotDescription] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [status, setStatus] = useState('available');
  const [expiryDate, setExpiryDate] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } else {
        Alert.alert('Permission Required', 'Location permission is required to create a spot!');
      }
    };

    const fetchCategoryOptions = async () => {
      try {
        const response = await fetch('https://ece3-86-93-44-129.ngrok-free.app/api/category');
        const data = await response.json();
        console.log('Fetched Categories:', data);
        if (Array.isArray(data)) {
          setCategoryOptions(data.map(option => ({ label: option, value: option })));
        } else {
          console.error('Unexpected data format:', data);
        }
      } catch (error) {
        console.error('Error fetching description options:', error);
      }
    };

    getLocationPermission();
    fetchCategoryOptions();
  }, []);

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

    if (!spotName.trim()) {
      Alert.alert('Error', 'Spot name is required');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    const formData = new FormData();

    formData.append('title', spotName.trim());
    formData.append('description', spotDescription);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('status', status);
    formData.append('expiryDate', expiryDate);
    formData.append('category', category || '');
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
      const response = await fetch('https://ece3-86-93-44-129.ngrok-free.app/api/spot', {
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a New Spot</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Spot Name"
          value={spotName}
          onChangeText={setSpotName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Spot Description"
          value={spotDescription}
          onChangeText={setSpotDescription}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Expiry Date"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />

    <DropDownPicker
      open={dropdownOpen}
      value={category}
      items={categoryOptions}
      setOpen={setDropdownOpen}
      setValue={setCategory}
      setItems={setCategoryOptions}
      placeholder="Select a category..."
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}
    />

      </View>

      <TouchableOpacity style={styles.imagePicker} onPress={openGallery}>
        <Text style={styles.imagePickerText}>Pick an image</Text>
      </TouchableOpacity>

      {spotImage && <Image source={{ uri: spotImage }} style={styles.image} />}

      <View style={styles.mapContainer}>
        {locationPermission && latitude && longitude ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} title="Your Spot" />
          </MapView>
        ) : (
          <Text style={styles.loadingText}>Loading map...</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateSpot}>
          <Text style={styles.buttonText}>Create Spot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
  },
  imagePicker: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  imagePickerText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  mapContainer: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 200,
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#ddd',
  },
  secondaryButtonText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SpotAanmaken;
