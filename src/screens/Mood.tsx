import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface MoodEntry {
  id: string;
  image: ImageSourcePropType;
  label: string;
  description: string;
  time: string;
}

const sampleMoods: MoodEntry[] = [
  {
    id: '1',
    image: require('../assets/Happy.png'),
    label: 'Happy',
    description: 'Caught up with friends over lunch.',
    time: '2:00 PM',
  },
  {
    id: '2',
    image: require('../assets/Energetic.png'),
    label: 'Energetic',
    description: 'Morning workout left me feeling pumped.',
    time: '10:30 AM',
  },
];

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

const toISODate = (date: Date) => date.toISOString().split('T')[0];

const Mood: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  }, [currentMonth]);

  const monthMatrix = useMemo(() => {
    const weeks: Array<Array<{ iso: string; label: string; inCurrentMonth: boolean }>> = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    let dayCounter = 1;
    let nextMonthDay = 1;

    for (let week = 0; week < 6; week += 1) {
      const weekRow: Array<{ iso: string; label: string; inCurrentMonth: boolean }> = [];
      for (let day = 0; day < 7; day += 1) {
        let date: Date;
        let label = '';
        let inCurrentMonth = false;

        if (week === 0 && day < startWeekday) {
          const value = prevMonthDays - (startWeekday - day - 1);
          date = new Date(year, month - 1, value);
          label = String(value);
        } else if (dayCounter > daysInMonth) {
          date = new Date(year, month + 1, nextMonthDay);
          label = String(nextMonthDay);
          nextMonthDay += 1;
        } else {
          date = new Date(year, month, dayCounter);
          label = String(dayCounter);
          dayCounter += 1;
          inCurrentMonth = true;
        }

        weekRow.push({ iso: toISODate(date), label, inCurrentMonth });
      }
      weeks.push(weekRow);
    }

    return weeks;
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-12">
          <Text className="text-2xl font-bold text-gray-900">Mood Diary</Text>
          <Text className="mt-1 text-base text-gray-600">
            Log your daily mood here!
          </Text>

          <View className="mt-6 rounded-3xl bg-primary px-5 py-6 shadow-md">
            <View className="mb-4 flex-row items-center justify-between">
              <TouchableOpacity onPress={() => changeMonth(-1)} activeOpacity={0.7}>
                <Icon name="chevron-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">{monthLabel}</Text>
              <TouchableOpacity onPress={() => changeMonth(1)} activeOpacity={0.7}>
                <Icon name="chevron-right" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between">
              {weekDays.map((day) => (
                <Text
                  key={day}
                  className="flex-1 text-center text-xs font-semibold uppercase text-white"
                >
                  {day}
                </Text>
              ))}
            </View>

            <View className="mt-4 space-y-2">
              {monthMatrix.map((week, index) => (
                <View key={week[0].iso + index} className="flex-row justify-between">
                  {week.map((day) => {
                    const isSelected = day.iso === selectedDate;
                    return (
                      <TouchableOpacity
                        key={day.iso}
                        className={`flex-1 items-center justify-center rounded-full py-2 ${
                          isSelected ? 'bg-white/20' : ''
                        }`}
                        activeOpacity={0.7}
                        onPress={() => setSelectedDate(day.iso)}
                      >
                        <Text
                          className="text-sm font-semibold"
                          style={[
                            styles.dayText,
                            isSelected
                              ? styles.dayTextSelected
                              : day.inCurrentMonth
                              ? styles.dayTextCurrent
                              : styles.dayTextOutside,
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          <View className="mt-8 space-y-4">
            {sampleMoods.map((entry) => (
              <View
                key={entry.id}
                className="rounded-3xl bg-white px-4 py-4 shadow-sm border-primary-100 border mb-1"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                      <Image
                        source={entry.image}
                        className="h-[45px] w-[45px]"
                        resizeMode="contain"
                      />
                    </View>
                    <View>
                      <Text className="text-base font-semibold text-gray-900">
                        {entry.label}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {entry.description}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-sm font-medium text-gray-500">
                    {entry.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        onPress={() => {/* Placeholder for navigation to mood logging flow */}}
        activeOpacity={0.8}
      >
        <Icon name="plus" color="#FFFFFF" size={26} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dayText: {
    textAlign: 'center',
  },
  dayTextSelected: {
    color: '#FFD966',
  },
  dayTextCurrent: {
    color: '#FFFFFF',
  },
  dayTextOutside: {
    color: '#BFDBFE',
  },
});

export default Mood;
