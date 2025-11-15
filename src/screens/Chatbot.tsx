import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI mental health assistant. How can I help you today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing that with me. I'm here to listen and support you. Would you like to talk more about how you're feeling?",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
      keyboardVerticalOffset={90}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 pt-[50px] pb-4">
          <Text className="text-white text-2xl font-bold mb-1">
            AI Assistant
          </Text>
          <Text className="text-white/80 text-sm">
            Your 24/7 mental health companion
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 flex-row ${
                message.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              <View
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? 'bg-primary rounded-tr-sm'
                    : 'bg-white rounded-tl-sm border border-gray-200'
                }`}
              >
                <Text
                  className={`text-base ${
                    message.isUser ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3 text-base"
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              className="bg-primary w-12 h-12 rounded-full items-center justify-center"
              onPress={handleSend}
            >
              <Text className="text-white text-xl">➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
