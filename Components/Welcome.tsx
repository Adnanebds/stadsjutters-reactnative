import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import axios from 'axios';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

type WelcomeProps = {
  navigation: NavigationProp<any>;
};

interface Spot {
  MaterialID: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: string;
  Photo: string | null;
}

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const [data, setData] = useState<Spot[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const GetSpots = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get('https://1a24-86-93-44-129.ngrok-free.app/api/spot');
      const validData = response.data.filter((item: { MaterialID: any; }) => item && typeof item.MaterialID !== 'undefined')
        .map((item: Spot) => ({
          ...item,
          Photo: item.Photo ? item.Photo : null
        }));
      setData(validData);
    } catch (error) {
      console.error('Error fetching spots:', error);
      Alert.alert('Error', 'Failed to fetch spots. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };
  

  useEffect(() => {
    GetSpots();
  }, []);

  const renderSpotItem = ({ item }: { item: Spot }) => (
    <TouchableOpacity style={styles.spotCard}>
      {item.Photo ? (
        <Image
          source={{ uri: item.Photo }}
          style={styles.spotImage}
          onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
        />
      ) : (
        <Image
          source={require('../assets/no-image.png')}
          style={styles.spotImage}
        />
      )}
      <View style={styles.spotDetails}>
        <Text style={styles.spotTitle}>{item.title}</Text>
        <Text style={styles.spotDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.spotStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Spots</Text>
        </View>

        <View style={styles.searchFilterContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Sort pressed')}>
            <MaterialIcons name="sort" size={20} color="#4A5568" />
            <Text style={styles.iconButtonText}>Sort</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.searchBar}
            placeholder="Search for spots..."
            placeholderTextColor="#A0AEC0"
          />
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Filter pressed')}>
            <FontAwesome name="filter" size={20} color="#4A5568" />
            <Text style={styles.iconButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <FlatList
        data={data}
        keyExtractor={(item) => item.MaterialID?.toString() || Math.random().toString()}
        renderItem={renderSpotItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={GetSpots}
      />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Explore')}>
          <Image source={require('../assets/explorelogo.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SpotAanmaken')}>
          <Image source={require('../assets/foursquares.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Spots</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image source={require('../assets/profile1.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  spotCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  spotDetails: {
    flex: 1,
  },
  spotTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  spotDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  spotStatus: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#718096',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 4,
  },
  iconButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4A5568',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default Welcome;