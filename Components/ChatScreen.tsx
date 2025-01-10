import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

type Message = {
    id: string;
    sender: string;
    text: string;
};

const ChatScreen = ({ route }: { route: any }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const { senderId, receiverId } = route.params;

    const fetchMessages = async () => {
        
        try {
            const senderData = JSON.parse(senderId);
            const userId = senderData.userId;
            
            const response = await axios.get(`https://ece3-86-93-44-129.ngrok-free.app/api/messages/${userId}`);
            console.log(response);
       
            // Map backend response to match the expected structure in frontend
            const mappedMessages = response.data.map((msg: any) => ({
                id: String(msg.MessageID),
                sender: msg.SenderID === userId,
                text: msg.MessageText,
            }));
            setMessages(mappedMessages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            Alert.alert('Error', 'Could not fetch messages');
        }
    };

    const sendMessage = async () => {
        if (input.trim() !== '') {
            const senderUserId = JSON.parse(senderId).userId.toString();
            try {
                const newMessage = {
                    sender: parseInt(senderUserId),
                    userId: parseInt(receiverId),
                    text: input,
                };

                console.log("Sending message:", newMessage);
                await axios.post('https://ece3-86-93-44-129.ngrok-free.app/api/messages', newMessage);
                setInput('');  // Clear the input field after sending
                fetchMessages(); // Optionally, fetch updated messages
            } catch (error) {
                console.error("Error sending message:", error);
                Alert.alert('Error', 'Could not send message');
            }
        }
    };

    useEffect(() => {
        fetchMessages(); // Fetch messages immediately when the component mounts

        // Set up an interval to fetch messages every 5 seconds
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 2000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [senderId]);

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[styles.messageBubble, item.sender ? styles.myMessage : styles.otherMessage]}>
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
                inverted
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message"
                />
                <TouchableOpacity onPress={() => {
                    console.log('Send button clicked');
                    sendMessage();
                }} style={styles.sendButton}>
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
