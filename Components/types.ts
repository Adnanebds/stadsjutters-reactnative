// types.ts
export type RootStackParamList = {
    ChatList: undefined; // No params required for ChatList
    ChatScreen: {
      senderId: string;
      receiverId: string;
    };
  };
  
  