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
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';

type WelcomeProps = {
  navigation: NavigationProp<any>; // Replace 'any' with your specific navigation type if using a defined navigator
};

const Welcome: React.FC<WelcomeProps> = ({ navigation }) => {
  const data = ['Metalen plaat', 'Metaal voor auto', 'Auto motor', 'Plastic'];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTextSmall}>Empty State</Text>
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
        data={data}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContainer}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Image
              source={{ uri: '../assets/placeholder_image.png' }}
              style={styles.itemImage}
            />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Image
            source={require('../assets/explorelogo.png' )}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Explore</Text>
        </View>
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
