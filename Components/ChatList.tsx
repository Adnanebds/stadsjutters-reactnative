import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native"; // For navigation
import { RootStackParamList } from './types';


type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;
  timestamp: string;
};

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<ChatItem[]>([]); // Store chat data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Hook for navigation with typing

  // Fetch chat data
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch("http://10.0.2.2:5000/api/messages"); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Failed to fetch chats2");
        }
        const data = await response.json();
        setChats(data); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    fetchChats(); // Call the function to fetch chats
  }, []); // Empty dependency array = runs once when component mounts

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render each chat item
  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => navigation.navigate('ChatScreen', { userId: item.id })} // Now works with correct types
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.username}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 10,
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
  },
});

export default ChatList;
