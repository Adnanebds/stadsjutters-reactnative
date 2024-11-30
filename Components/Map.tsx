import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import axios from 'axios'; // For making API requests

const MapScreen = () => {
  const [spots, setSpots] = useState<any[]>([]); // State to store spots
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching data

  useEffect(() => {
    // Fetch the spots data from the API
    const fetchSpots = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/spot'); // Your API endpoint
        setSpots(response.data); // Set the spots data to the state
      } catch (error) {
        console.error("Error fetching spots data: ", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    
    fetchSpots(); // Call the function to fetch data
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 52.3700, // Almere center coordinates (default)
          longitude: 5.2157, // Almere center coordinates (default)
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {spots.map((spot) => (
          <Marker
            key={spot.MaterialID} // Unique key for each marker
            coordinate={{
              latitude: parseFloat(spot.Latitude), // Convert to float to ensure valid coordinates
              longitude: parseFloat(spot.Longitude), // Convert to float
            }}
            title={spot.Title} // Title of the spot
            description={spot.Description} // Description of the spot
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
