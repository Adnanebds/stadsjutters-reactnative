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
import { useNavigation, NavigationProp } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from "./types";

type ChatItem = {
  MessageID: number;
  SenderID: number;
  ReceiverID: number;
  MessageText: string;
  SentAt: string;
  ReadStatus: number;
};

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSession, setUserSession] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // First, get the user session
  useEffect(() => {
    const getUserSession = async () => {
      try {
        const session = await AsyncStorage.getItem('userSession');
        setUserSession(session);
      } catch (error) {
        console.error("Error getting user session:", error);
      }
    };
    getUserSession();
  }, []);

  // Then fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!userSession) return;
      
      try {
        const response = await fetch(
          "https://ece3-86-93-44-129.ngrok-free.app/api/messages"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userSession) {
      fetchChats();
    }
  }, [userSession]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleChatPress = (receiverId: number) => {
    if (!userSession) {
      console.error("No user session found");
      return;
    }

    navigation.navigate("ChatScreen", {
      senderId: userSession,  // Pass the user session directly
      receiverId: receiverId.toString()
    });
  };

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => handleChatPress(item.ReceiverID)}
    >
      <Image
        source={{ uri: "https://via.placeholder.com/50" }}
        style={styles.avatar}
      />
      <View style={styles.chatDetails}>
        <Text style={styles.username}>{`User ${item.ReceiverID}`}</Text>
        <Text style={styles.lastMessage}>{item.MessageText}</Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(item.SentAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item.MessageID.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

// Styles remain the same
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