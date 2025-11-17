import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';

const AccountRemoved: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-gray-50 px-5">
      {/* Header */}
      <View
        className="flex-row mt-14 position-relative items-center justify-center"
     >
        {/* Left Icon */}
        <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className="absolute left-0"
        >
            <Icon name="close" size={28} color="#000" />
        </TouchableOpacity>

        {/* Center Title */}
        <Text className="text-xl font-semibold">Account removed</Text>
        </View>


      {/* Content */}
      <View className="mt-10 px-4">
        <Text className="text-xl font-bold text-gray-800 mb-3">
          Thank you for choosing our app!
        </Text>

        <Text className="text-gray-600 text-base leading-6 mb-4">
          We’re sorry to see you go, but we respect your decision to delete your
          account. Your account deletion request has been successfully processed,
          and your account is now permanently deactivated.
        </Text>

        <Text className="text-gray-600 leading-6">
          If you ever decide to return, we’ll be here with new updates and
          features to make your experience even better.
        </Text>
      </View>

      {/* Footer Button */}
      <View
        style={{ marginBottom: insets.bottom + 20 }}
        className="mt-auto"
      >
         <Button 
        onPress={() => navigation.navigate('SignUp')}
        title='Done'
        variant='primary'
       />
      </View>
     
    </View>
  );
};

export default AccountRemoved;
