import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SendHorizonalIcon } from 'lucide-react-native';
interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [hasStarted, setHasStarted] = useState(false);
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
          Tell me how you're feeling today, and I'll check in,
          share little tips, and help you feel a bit lighter.
        </Text>
        <TouchableOpacity
          className="mt-10 w-full rounded-xl bg-primary py-4"
          activeOpacity={0.8}
          onPress={() => setHasStarted(true)}
        >
          <Text className="text-center text-base font-semibold text-white">Let’s Start!</Text>
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
        {/* Header */}
        <View className="flex items-center bg-primary px-6 pt-[50px] pb-4 ">
          <Text className="text-white text-2xl font-bold mb-1">
            LUMORA
          </Text>
          <Text className="text-white/80 text-md">
            Your mental wellness companion
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
                    : 'bg-gray-100 rounded-tl-sm border border-gray-300'
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
              className="w-12 h-12 rounded-full items-center justify-center"
              onPress={handleSend}
            >
              <SendHorizonalIcon color="#4093D6" fill="#4093D6" size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chatbot;
