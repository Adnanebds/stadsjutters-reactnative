import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import * as Location from 'expo-location'; // For location access
import MapView, { Marker } from 'react-native-maps'; // For displaying the map

const SpotAanmaken = ({ navigation }: any) => {
  const [spotName, setSpotName] = useState('');
  const [spotImage, setSpotImage] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    // Request location permission when the component mounts
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        // Get the user's current location
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } else {
        alert('Location permission is required to create a spot!');
      }
    };

    getLocationPermission();
  }, []);

  const pickImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
        quality: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        if (image.uri) {
          setSpotImage(image.uri);
        } else {
          setSpotImage(null);
        }
      } else {
        setSpotImage(null);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const handleCreateSpot = () => {
    if (!spotName || !spotImage || !latitude || !longitude) {
      alert("Please fill in all fields, including the location.");
      return;
    }

    console.log('Spot Created:', spotName, spotImage, latitude, longitude);
    navigation.goBack(); // Navigate back to the previous screen
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

      {/* Spot Image Picker */}
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Pick an image</Text>
        </View>
      </TouchableOpacity>

      {/* Show selected image if exists */}
      {spotImage && <Image source={{ uri: spotImage }} style={styles.image} />}

      {/* Display Google Map with the user's location */}
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
        <Text>Loading map...</Text>
      )}

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
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});

export default SpotAanmaken;
