import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SendHorizonalIcon } from 'lucide-react-native';

const WS_BASE_URL =
  Platform.OS === 'android' ? 'ws://10.0.2.2:8000/chatbot/ws' : 'ws://127.0.0.1:8000/chatbot/ws';
const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

interface WebSocketMessage {
  type: 'welcome' | 'message' | 'error';
  content?: string;
  role?: 'assistant' | 'user';
}

const Chatbot: React.FC = () => {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!hasStarted) return;

    const initializeWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          console.warn('No authentication token found');
          return;
        }

        const wsUrl = `${WS_BASE_URL}?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };

        ws.onmessage = (event: WebSocketMessageEvent) => {
          try {
            const data: WebSocketMessage = JSON.parse(event.data);

            if (data.type === 'welcome') {
              const welcomeMessage: Message = {
                id: `${Date.now()}-welcome`,
                text: data.content || "Connected to assistant!",
                isUser: false,
              };
              setMessages((prev) => [...prev, welcomeMessage]);
            } else if (data.type === 'message' && data.role === 'assistant') {
              const assistantMessage: Message = {
                id: `${Date.now()}-assistant`,
                text: data.content || '',
                isUser: false,
              };
              setMessages((prev) =>
                prev.map((message) =>
                  message.isLoading ? { ...message, isLoading: false, ...assistantMessage } : message,
                ),
              );
            } else if (data.type === 'error') {
              const errorMessage: Message = {
                id: `${Date.now()}-error`,
                text: data.content || 'Something went wrong on server side',
                isUser: false,
              };
              setMessages((prev) =>
                prev.map((message) =>
                  message.isLoading ? { ...message, isLoading: false, ...errorMessage } : message,
                ),
              );
            }
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        ws.onerror = (error: WebSocketErrorEvent) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-error`,
              text: 'Connection error. Please try again.',
              isUser: false,
            },
          ]);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to initialize WebSocket:', error);
        setIsConnected(false);
      }
    };

    initializeWebSocket();
    // Cleanup on unmount or when hasStarted changes
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [hasStarted]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isSending || !isConnected) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      text,
      isUser: true,
    };

    const loadingMessageId = `${Date.now()}-loading`;
    const loadingMessage: Message = {
      id: loadingMessageId,
      text: 'Thinking...',
      isUser: false,
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInputText('');
    setIsSending(true);

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const messagePayload = {
          type: 'message',
          content: text,
        };
        wsRef.current.send(JSON.stringify(messagePayload));
      } else {
        throw new Error('WebSocket is not connected');
      }
    } catch (error) {
      const fallbackMessage =
        error instanceof Error ? error.message : 'Failed to send message. Please try again.';

      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessageId
            ? {
                id: `${Date.now()}-error`,
                text: fallbackMessage,
                isUser: false,
              }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
    }
  };

  const loadHistory = useCallback(async () => {
    try {
      console.log('Loading chat history...');
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        console.warn('No authentication token found');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/chatbot/conversation/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      console.log('Chat history loaded successfully');
      const history = await response.json();
      console.log('Chat history:', history);
      const formattedHistory: Message[] = history.map((item: any, index: number) => ({
        id: `${index}-${item.role}`,
        text: item.content,
        isUser: item.role === 'user',
      }));
      setMessages(formattedHistory);

      if(formattedHistory.length > 0) {
        setHasStarted(true);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);


  if (!hasStarted) {
    return (
      <View
        className="flex-1 items-center justify-center bg-[#f3f6fb] px-8"
        style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
      >
        <Text className="text-center text-lg font-semibold text-gray-900">
          "Hey, I'm here for you. 💙"
        </Text>
        <Text className="mt-3 text-center text-base text-gray-600">
          Tell me how you're feeling today, and I'll check in, share little tips, and help you feel a bit lighter.
        </Text>
        <TouchableOpacity
          className="mt-10 w-full rounded-xl bg-primary py-4"
          activeOpacity={0.8}
          onPress={() => setHasStarted(true)}
        >
          <Text className="text-center text-base font-semibold text-white">Let's Start!</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
      keyboardVerticalOffset={90}
    >
      <View className="flex-1">
        <View className="flex items-center bg-primary px-6 pt-[50px] pb-4 ">
          <Text className="mb-1 text-2xl font-bold text-white">LUMORA</Text>
          <Text className="text-md text-white/80">Your mental wellness companion</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 flex-row ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-primary rounded-tr-sm'
                    : 'bg-gray-100 rounded-tl-sm border border-gray-300'
                }`}
              >
                {message.isLoading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator size="small" color="#4093D6" />
                    <Text className="ml-2 text-base text-gray-500">Thinking...</Text>
                  </View>
                ) : (
                  <Text className={`text-base ${message.isUser ? 'text-white' : 'text-gray-800'}`}>
                    {message.text}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="border-t border-gray-200 bg-white px-4 py-3">
          <View className="flex-row items-center">
            <TextInput
              className="mr-3 flex-1 rounded-full bg-gray-100 px-4 py-3 text-base"
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isSending && isConnected}
            />
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full"
              onPress={handleSend}
              disabled={isSending || !inputText.trim() || !isConnected}
            >
              <SendHorizonalIcon
                color={isSending || !inputText.trim() || !isConnected ? '#9CA3AF' : '#4093D6'}
                fill={isSending || !inputText.trim() || !isConnected ? '#9CA3AF' : '#4093D6'}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
