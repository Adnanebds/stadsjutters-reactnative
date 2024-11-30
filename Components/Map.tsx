import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// Define the Spot interface for type safety
interface Spot {
  MaterialID: string;
  title: string;
  description: string;
  Latitude: string;
  Longitude: string;
}

// Define the props for the SpotModal component
interface SpotModalProps {
  isVisible: boolean;
  spot: Spot | null;
  onClose: () => void;
}

// Function to get city name from coordinates using reverse geocoding
const getCityFromCoordinates = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const address = response.data.address;
    return address.city || address.town || address.village || address.hamlet || 'Unknown location';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Unknown location';
  }
};

// Function to get coordinates for a given city name
const getCoordinatesForCity = async (cityName: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`
    );
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    return null; // No results found
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null; // Return null on error
  }
};

// SpotModal component to display spot details
const SpotModal: React.FC<SpotModalProps> = ({ isVisible, spot, onClose }) => {
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (spot) {
      setLoading(true);
      getCityFromCoordinates(parseFloat(spot.Latitude), parseFloat(spot.Longitude))
        .then(locationName => {
          setLocation(locationName);
          setLoading(false);
        });
    }
  }, [spot]);

  if (!spot) return null;

  // Function to handle chat button press
  const handleChatPress = () => {
    console.log(`Chat initiated for ${spot.title}`);
    onClose(); // Close modal after initiating chat
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{spot.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.description}>{spot.description}</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text style={styles.location}>Locatie: {location}</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// Main MapScreen component
const MapScreen: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  
  const mapRef = useRef<MapView | null>(null);

  // Fetch spots data from API
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await axios.get<Spot[]>('https://1a24-86-93-44-129.ngrok-free.app/api/spot');
        setSpots(response.data);
      } catch (error) {
        console.error('Error fetching spots data: ', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpots();
  }, []);

  // Handle marker press to show modal
  const handleMarkerPress = (spot: Spot) => {
    setSelectedSpot(spot);
    setModalVisible(true);
  };

  // Handle search functionality based on location
  const handleSearch = async () => {
    const coordinates = await getCoordinatesForCity(searchQuery); // Get coordinates for the entered city

    if (coordinates) {
      // Filter spots based on proximity to the searched city coordinates
      const foundSpots = spots.filter(spot => {
        const lat = parseFloat(spot.Latitude);
        const lon = parseFloat(spot.Longitude);

        // Calculate distance (you could improve this with a more accurate distance calculation)
        const distance = Math.sqrt(Math.pow(lat - coordinates.lat, 2) + Math.pow(lon - coordinates.lon, 2));
        return distance < 0.1; // Adjust this threshold as needed for your application
      });

      if (foundSpots.length > 0) {
        mapRef.current?.animateToRegion({
          latitude: coordinates.lat,
          longitude: coordinates.lon,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }, 1000);

        // Do not open modal automatically; just focus on the region.
        Alert.alert('Spots Gevonden', `${foundSpots.length} spots gevonden in deze locatie.`);
        
      } else {
        Alert.alert('Geen spots gevonden', 'Geen spots gevonden in deze locatie.'); // Alert instead of modal
      }
    } else {
      Alert.alert('Location not found', 'The specified location could not be found.');
    }
    
    // Reset selected spot and close modal if opened.
    setSelectedSpot(null); 
    setModalVisible(false); 
  };

   // Show loading indicator while fetching data
   if (loading) {
     return (
       <View style={styles.loaderContainer}>
         <ActivityIndicator size="large" color="#0000ff" />
       </View>
     );
   }

   return (
     <View style={styles.container}>
       <MapView
         ref={mapRef}
         style={StyleSheet.absoluteFillObject}
         initialRegion={{
           latitude: 52.3700,
           longitude: 5.2157,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
         }}
       >
         {spots.map((spot) => {
           const lat = parseFloat(spot.Latitude);
           const lon = parseFloat(spot.Longitude);

           if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
             return null;
           }

           return (
             <Marker
               key={spot.MaterialID}
               coordinate={{ latitude: lat, longitude: lon }}
               onPress={() => handleMarkerPress(spot)} 
             >
               <Ionicons name="location" size={30} color="#FF5252" />
             </Marker>
           );
         })}
       </MapView>

       <View style={styles.searchContainer}>
         <TextInput
           style={styles.searchInput}
           placeholder="Zoek op basis van locatie"
           value={searchQuery}
           onChangeText={setSearchQuery}
           onSubmitEditing={handleSearch}
         />
         <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
           <Ionicons name="search" size={24} color="white" />
         </TouchableOpacity>
       </View>

       {/* Only one modal should be displayed */}
       <SpotModal
         isVisible={modalVisible}
         spot={selectedSpot}
         onClose={() => setModalVisible(false)}
       />
     </View>
   );
};

// Styles for the components
const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   loaderContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   searchContainer: {
     position: 'absolute',
     top: 50,
     left: 20,
     right: 20,
     flexDirection: 'row',
     alignItems: 'center',
     zIndex: 1,
     elevation: 5,
   },
   searchInput: {
     flex: 1,
     height: 50,
     backgroundColor: 'white',
     borderRadius: 25,
     paddingHorizontal: 20,
   },
   searchButton:{
     marginLeft :10,
     backgroundColor :'#FF5252',
     borderRadius :25,
     width :50,
     height :50,
     justifyContent :'center',
     alignItems :'center',
     elevation :5,
     shadowColor :'#000',
     shadowOffset :{width :0,height :2},
     shadowOpacity :0.25,
     shadowRadius :3.84,

   },
   modal:{
     justifyContent :'center', 
     margin :0,

   },
   modalContent:{
     backgroundColor :'white',
     borderRadius :20, 
     paddingTop :20,
     paddingHorizontal :20,
     paddingBottom :30,
     maxHeight :'80%',
   },
   header:{
     flexDirection :'row',
     justifyContent :'space-between',
     alignItems :'center',
     marginBottom :15,

   },
   title:{
     fontSize :22,
     fontWeight :'bold',

   },
   scrollView:{
     marginBottom :20,

   },
   description:{
     fontSize :16,
     marginBottom :15,

   },
   location:{
     fontSize :14,
     color :'#666',

   },
   chatButton:{
       backgroundColor:'#FF5252', 
       borderRadius:25, 
       paddingVertical:10, 
       alignItems:'center', 
       marginTop:10 
   },
   chatButtonText:{
       color:'white', 
       fontWeight:'bold' 
   },

});

export default MapScreen;
