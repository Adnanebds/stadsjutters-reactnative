import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

type Message = {
    id: string;
    sender: 'me' | 'other';
    text: string;
};

const ChatScreen = ({ route }: { route: any }) => {
    const [messages, setMessages] = useState<Message[]>([]); // State to store messages
    const [input, setInput] = useState<string>(''); // State to store input message
    const { userId } = route.params; // Retrieve userId from route parameters
    const navigation = useNavigation();

    // Fetch messages from the server (GET)
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/${userId}`);
            setMessages(response.data); // Set messages to the state
        } catch (error) {
            console.error("Error fetching messages:", error);
            Alert.alert('Error', 'Could not fetch messages');
        }
    };

    // Send message to the server (POST)
    const sendMessage = async () => {
        if (input.trim() !== '') {
            try {
                const newMessage = {
                    sender: 'me',
                    text: input,
                    userId: userId, // Send userId to associate the message with the chat
                };

                // POST new message to the backend
                await axios.post('http://localhost:5000/api/messages', newMessage);
                setMessages((prev) => [...prev, { id: String(Date.now()), sender: 'me', text: input }]); // Update local messages
                setInput(''); // Clear input after sending
            } catch (error) {
                console.error("Error sending message:", error);
                Alert.alert('Error', 'Could not send message');
            }
        }
    };

    // Fetch messages when component mounts
    useEffect(() => {
        fetchMessages();
    }, [userId]); // Refetch if userId changes

    // Render each message in the list
    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                style={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput} // Update input state on text change
                    placeholder="Type a message"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 10,
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 20,
    },
    myMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#E5E5E5',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#0078D4',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ChatScreen;
