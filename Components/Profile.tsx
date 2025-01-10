import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Animated } from 'react-native';
import { Surface, Avatar, Chip, Searchbar, useTheme, FAB, IconButton } from 'react-native-paper';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App'; // Make sure this path is correct
import { MD3Elevation } from 'react-native-paper';

const API_BASE_URL = 'https://ece3-86-93-44-129.ngrok-free.app/api';

interface Spot {
  MaterialID: string;
  title: string;
  description: string;
  Photo: string | null;
  Status: string;
  CreatedAt: string;
  category: string;
  Latitude: string;
  Longitude: string;
}

type UserSpotsProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

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

const UserSpots: React.FC<UserSpotsProps> = ({ route }) => {
  const { userId } = route.params;
  const { colors } = useTheme();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [cardAnim] = useState(new Animated.Value(0));

  const fetchSpots = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/spot/user/${userId}`);
      setSpots(response.data);
    } catch (error) {
      console.error('Error fetching user spots:', error);
    } finally {
      setLoading(false);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [userId, fadeAnim, cardAnim]);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const filteredSpots = spots.filter(spot =>
    spot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/spot/${id}`);
      setSpots(prevSpots => prevSpots.filter(spot => spot.MaterialID !== id));
    } catch (error) {
      console.error('Error deleting spot:', error);
    }
  };

  const SpotItem: React.FC<{ item: Spot; index: number }> = ({ item, index }) => {
    const [location, setLocation] = useState<string>('');
    const [locationLoading, setLocationLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchLocation = async () => {
        const cityName = await getCityFromCoordinates(parseFloat(item.Latitude), parseFloat(item.Longitude));
        setLocation(cityName);
        setLocationLoading(false);
      };
      fetchLocation();
    }, [item]);

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50 * (index + 1), 0],
                }),
              },
            ],
          },
        ]}
      >
        <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={4 as MD3Elevation}>
          <View style={styles.cardHeader}>
            <Avatar.Image
              size={60}
              source={item.Photo ? { uri: item.Photo } : require('../assets/no-image.png')}
              style={styles.avatar}
            />
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: colors.primary }]}>{item.title}</Text>
              <Chip icon="tag" style={styles.categoryChip} textStyle={{ color: colors.onPrimary }}>
                {item.category}
              </Chip>
            </View>
            <IconButton
              icon="trash-can"
              size={24}
              onPress={() => handleDelete(item.MaterialID)}
              style={styles.deleteButton}
            />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.description, { color: colors.onSurface }]}>{item.description}</Text>
            {locationLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.location, { color: colors.onSurface }]}>{location}</Text>
            )}
          </View>
        </Surface>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for spots"
        value={searchQuery}
        onChangeText={onChangeSearch}
        style={styles.searchBar}
      />
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={filteredSpots}
          renderItem={({ item, index }) => <SpotItem item={item} index={index} />}
          keyExtractor={item => item.MaterialID}
          contentContainerStyle={styles.flatList}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Add Spot')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  flatList: {
    paddingBottom: 60,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 10,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  categoryChip: {
    marginTop: 8,
  },
  cardContent: {
    marginTop: 10,
  },
  description: {
    fontSize: 14,
  },
  location: {
    marginTop: 8,
    fontStyle: 'italic',
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#6200ee',
  },
  deleteButton: {
    padding: 0,
    marginLeft: 12,
  },
});

export default UserSpots;
