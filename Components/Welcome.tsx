import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
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
  category?: string;
}

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const [data, setData] = useState<Spot[]>([]);
  const [filteredData, setFilteredData] = useState<Spot[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const GetSpots = async () => {
    setRefreshing(true);
    try {
      const response = await axios.get('https://ece3-86-93-44-129.ngrok-free.app/api/spot');
      const validData = response.data.filter((item: { MaterialID: any; }) => item && typeof item.MaterialID !== 'undefined')
        .map((item: Spot) => ({
          ...item,
          Photo: item.Photo ? item.Photo : null
        }));
      setData(validData);
      setFilteredData(validData);
    } catch (error) {
      console.error('Error fetching spots:', error);
      Alert.alert('Error', 'Failed to fetch spots. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://ece3-86-93-44-129.ngrok-free.app/api/category');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to fetch categories. Please try again.');
    }
  };

  const showCategoryOptions = () => {
    if (categories.length === 0) {
      Alert.alert("No Categories", "No categories available to filter by.");
      return;
    }
    setModalVisible(true);
  };

  const filterSpotsByCategory = (category: string) => {
    const newFilteredData = data.filter(spot => spot.category === category);
    setFilteredData(newFilteredData);
    setModalVisible(false);
  };

  const markAsPickedUp = async (materialId: number) => {
    try {
      const response = await axios.post('https://ece3-86-93-44-129.ngrok-free.app/api/mark-as-picked-up', { materialId });
      if (response.status === 200) {
        const updatedData = data.map((spot) =>
          spot.MaterialID === materialId ? { ...spot, status: 'picked_up' } : spot
        );
        setData(updatedData);
        setFilteredData(updatedData);
        Alert.alert('Success', 'Spot marked as picked up.');
      }
    } catch (error) {
      console.error('Error marking spot as picked up:', error);
      Alert.alert('Error', 'Failed to mark spot as picked up. Please try again.');
    }
  };
  
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
        {item.status && item.status.toLowerCase() !== 'picked_up' ? (
          <TouchableOpacity onPress={() => markAsPickedUp(item.MaterialID)} style={styles.pickUpButton}>
            <Text style={styles.pickUpText}>Mark as Picked Up</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickUpButton}>
            <Text style={styles.pickUpText}>Already Picked Up</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    GetSpots();
    fetchCategories();
  }, []);

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
          <TouchableOpacity style={styles.iconButton} onPress={showCategoryOptions}>
            <FontAwesome name="filter" size={20} color="#4A5568" />
            <Text style={styles.iconButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.MaterialID?.toString() || Math.random().toString()}
          renderItem={renderSpotItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={GetSpots}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              {categories.map(category => (
                <TouchableOpacity key={category} onPress={() => filterSpotsByCategory(category)} style={styles.categoryButton}>
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.categoryButton, styles.cancelButton]}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => navigation.navigate('Profile', { userId: 5 })}
        >
          <Image source={require('../assets/profile1.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatList')}>
          <Image source={require('../assets/chat.png')} style={styles.navIcon} />
          <Text style={styles.navText}>Chat</Text>
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
        marginRight: 16,
      },
      iconButtonText: {
        marginLeft: 4,
        fontSize: 16,
        color: '#4A5568',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        elevation: 10,
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 16,
      },
      categoryButton: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
      },
      cancelButton: {
        borderBottomWidth: 0,
        marginTop: 16,
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
      pickUpButton: {
        backgroundColor: '#38A169',
        borderRadius: 8,
        padding: 8,
        marginTop: 8,
      },
      pickUpText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
      },
    });
    
    export default Welcome;
