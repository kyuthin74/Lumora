import React, { useEffect, useMemo, useState } from "react";
import { Modal, View, Text, TouchableOpacity, ScrollView } from "react-native";
import ProfileInput from "./ProfileInput";

type EditableField = {
  key: string;
  label: string;
  placeholder?: string;
  value?: string;
};

type EditProfileProps = {
  visible: boolean;
  title: string;
  fields: EditableField[];
  onCancel: () => void;
  onSave: (values: Record<string, string>) => void;
};

const EditProfile: React.FC<EditProfileProps> = ({
  visible,
  title,
  fields,
  onCancel,
  onSave,
}) => {
  const initialFormValues = useMemo(() => {
    return fields.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = field.value ?? "";
      return acc;
    }, {});
  }, [fields]);

  const [formValues, setFormValues] = useState<Record<string, string>>(initialFormValues);

  useEffect(() => {
    if (visible) {
      setFormValues(initialFormValues);
    }
  }, [visible, initialFormValues]);

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(formValues);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-6">
        <View className="bg-white rounded-2xl px-6 pt-6 pb-10 w-full max-h-[80%]">
          <Text className="text-lg font-semibold text-gray-900 text-center mb-4">{title}</Text>

          <ScrollView className="flex-grow" showsVerticalScrollIndicator={false}>
            {fields.map((field) => (
              <ProfileInput
                key={field.key}
                label={field.label}
                placeholder={field.placeholder}
                value={formValues[field.key] ?? ""}
                onChangeText={(text) => handleChange(field.key, text)}
              />
            ))}
          </ScrollView>

          <View className="flex-row mt-4">
            <TouchableOpacity
              className="flex-1 border border-muted bg-[#9CA3AF] rounded-xl py-3 mr-3"
              onPress={onCancel}
            >
              <Text className="text-center text-white font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-primary rounded-xl py-3"
              onPress={handleSave}
            >
              <Text className="text-center text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfile;
