import React from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { useState, useEffect } from 'react';

type WelcomeProps = {
  navigation: NavigationProp<any>; // Replace 'any' with your specific navigation type if using a defined navigator
};

interface Spot {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  Photo: string | null;
}

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const [data, setData] = useState<Spot[]>([]); // State to store fetched data


  const GetSpots = async () => {
    try {
        const response = await axios.get('https://1a24-86-93-44-129.ngrok-free.app/api/spot', 
          
        {
        });
        const data: Spot[] = response.data;
        setData(data); 
        console.log('Response:', response.data);
        
        if (response.status === 200) {
            console.log('Success vol data opgehaald!');
        } else {
          console.log('Data lukt niet met ophalen');
        }
    } catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            Alert.alert('Error', `An error occurred while logging in: ${error.message}`);
        } else {
            Alert.alert('Error', 'An unknown error occurred while logging in');
        }
    }
};

useEffect(() => {
  GetSpots(); // Call the API when the component mounts
}, []); // Empty dependency array to call once on mount

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTextLarge}>Spots</Text>
      </View>

      {/* Search and Filter Section */}
      <View style={styles.searchFilterContainer}>
        <Button title="Sorteren" onPress={() => console.log('Sort button pressed')} />
        <TextInput style={styles.searchBar} placeholder="Search" />
        <Button title="Filter (2)" onPress={() => console.log('Filter button pressed')} />
      </View>

      {/* Items Grid Section */}
      <FlatList
        data={data} // data is now of type Spot[]
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.Photo ? (
              <Image
                source={{ uri: `https://1a24-86-93-44-129.ngrok-free.app/uploads/${item.Photo}` }} // Construct full URL for image source
                style={styles.itemImage}
              />
            ) : (
              <Text>No Image Available</Text> // Fallback if no photo is available
            )}
            <Text style={styles.itemText}>{item.title}</Text> {/* Accessing item.title */}
          </View>
        )}
      />


      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Explore')}>
        <Image
        source={require('../assets/explorelogo.png')}
        style={styles.navIcon}
        />
          <Text style={styles.navTextBold}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SpotAanmaken')}>
        <Image
        source={require('../assets/foursquares.png')}
        style={styles.navIcon}
        />
          <Text style={styles.navTextBold}>Spots</Text>
        </TouchableOpacity>
        <View style={styles.navItem}>
          <Image
            source={require('../assets/profile1.png' )}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    padding: 20,
  },
  header: {
    marginVertical: 10,
  },
  headerTextSmall: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTextLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  flatListContainer: {
    marginVertical: 10,
  },
  itemCard: {
    backgroundColor: '#E8E8F1',
    borderRadius: 8,
    margin: 5,
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  itemImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 12,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  navText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  navTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
});

export default Welcome;
