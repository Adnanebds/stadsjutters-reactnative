// types.ts
export type RootStackParamList = {
    ChatList: undefined; // No params required for ChatList
    ChatScreen: { userId: string }; // ChatScreen expects a 'userId' parameter
  };
  