import React, {useState} from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Button from "../components/Button";

const TestForm = () =>{
    const [enery, setEnergy] = useState(0);

    return(
        <ScrollView className="flex-1 bg-gray-50 px-6 pt-12">
            {/* Header */}
            <Text className="Text-2xl font-bold mt-6 text-gray-800 text-center mb-2">Log Your Mood</Text>
            <Text className="text-gray-600 text-center mb-6">Select your current mood and share your thoughts</Text>

            {/* Select fields */}
        </ScrollView>
    );
}

export default TestForm;