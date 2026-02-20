import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CompositeNavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../navigation/AppNavigator';
import { BottomTabParamList } from '../navigation/BottomTabNavigator';

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

const moodAssetMap: Record<string, ImageSourcePropType> = {
  Happy: require('../assets/mood/happy.png'),
  Energetic: require('../assets/mood/energetic.png'),
  Neutral: require('../assets/mood/neutral.png'),
  Satisfied: require('../assets/mood/satisfied.png'),
  Tired: require('../assets/mood/tired.png'),
  Stressed: require('../assets/mood/stressed.png'),
  Angry: require('../assets/mood/angry.png'),
  Sad: require('../assets/mood/sad.png'),
};

const defaultMoodAsset = require('../assets/mood/neutral.png');

const activityIconMap: Record<string, string> = {
  Friends: 'users',
  Romance: 'heart',
  Work: 'briefcase',
  Creative: 'paint-brush',
  Learning: 'book',
  Music: 'music',
  Rest: 'bed',
  Gaming: 'gamepad',
  Shopping: 'shopping-cart',
  Cafe: 'coffee',
};

const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

const toISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseUTCDate = (value?: string) => {
  if (!value) return null;
  const trimmed = value.trim();
  const normalized = trimmed.replace(/\s+/g, 'T');
  const hasExplicitTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(normalized);
  const candidate = hasExplicitTimezone ? normalized : `${normalized}Z`;
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getMoodAsset = (label: string) => moodAssetMap[label] ?? defaultMoodAsset;

const formatDisplayTime = (value?: string) => {
  const parsed = parseUTCDate(value);
  if (!parsed) return '--:--';

  return parsed.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getISODateFromString = (value?: string) => {
  const parsed = parseUTCDate(value);
  if (!parsed) return '';
  return toISODate(parsed);
};

const getAuthToken = async () => AsyncStorage.getItem('authToken');

interface MoodApiResponse {
  mood_id?: number;
  id?: number;
  mood_type?: string;
  activities?: string[];
  note?: string;
  created_at?: string;
}

interface MoodEntry {
  id: string;
  moodType: string;
  activities: string[];
  note: string;
  createdAt?: string;
  isoDate: string;
  displayTime: string;
  image: ImageSourcePropType;
}

type MoodScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Mood'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Mood: React.FC = () => {
  const navigation = useNavigation<MoodScreenNavigationProp>();
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const fetchMoodEntries = useCallback(
    async (targetDate: string, showSpinner: boolean = true) => {
      if (showSpinner) {
        setIsLoading(true);
      }

      try {
        const token = await getAuthToken();

        if (!token) {
          setErrorMessage('Please log in again to view your mood diary.');
          setMoodEntries([]);
          return;
        }

        setErrorMessage(null);

        const response = await fetch(
          `${API_BASE_URL}/moods/daily?selected_date=${encodeURIComponent(targetDate)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: MoodApiResponse[] = await response.json().catch(() => []);

        if (!response.ok) {
          const message = (data as unknown as { message?: string; detail?: string })?.message ||
            (data as unknown as { message?: string; detail?: string })?.detail ||
            'Failed to load mood entries.';
          throw new Error(message);
        }

        const normalized: MoodEntry[] = Array.isArray(data)
          ? data.map((item) => {
              const createdAt = item.created_at;
              const localISODate = getISODateFromString(createdAt) || targetDate;
              return {
                id: String(item.mood_id ?? item.id ?? Math.random().toString(36).slice(2)),
                moodType: item.mood_type ?? 'Unknown',
                activities: Array.isArray(item.activities) ? item.activities : [],
                note: item.note ?? '',
                createdAt,
                isoDate: localISODate,
                displayTime: formatDisplayTime(createdAt),
                image: getMoodAsset(item.mood_type ?? 'Neutral'),
              };
            })
          : [];

        setMoodEntries(normalized);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load mood entries.';
        setErrorMessage(message);
      } finally {
        if (showSpinner) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchMoodEntries(selectedDate, false);
    setIsRefreshing(false);
  }, [fetchMoodEntries, selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchMoodEntries(selectedDate);
    }, [fetchMoodEntries, selectedDate])
  );


  const deleteMoodEntry = useCallback(async (moodId: string) => {
    try {
      const token = await getAuthToken();

      if (!token) {
        Alert.alert('Not signed in', 'Log in again to manage your entries.');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/moods/daily?selected_date=${encodeURIComponent(selectedDate)}&mood_id=${encodeURIComponent(
          moodId
        )}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const rawBody = await response.text();
      let data: Record<string, unknown> = {};
      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        const message = (data.message as string) || (data.detail as string) || 'Failed to delete entry.';
        throw new Error(message);
      }

      setMoodEntries((prev) => prev.filter((entry) => entry.id !== moodId));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete entry.';
      Alert.alert('Delete failed', message);
    }
  }, [selectedDate]);

  const handleDeleteMood = useCallback((moodId: string) => {
    Alert.alert('Delete entry', 'Are you sure you want to remove this mood log?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteMoodEntry(moodId) },
    ]);
  }, [deleteMoodEntry]);

  const filteredEntries = useMemo(() => {
    return moodEntries.filter((entry) => entry.isoDate === selectedDate);
  }, [moodEntries, selectedDate]);
  

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="pb-28"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#4093D6']}
            tintColor="#4093D6"
          />
        }
      >
        <View className="px-6 pt-12">
         <View className="pt-4">
          <Text className="text-center text-2xl font-bold text-gray-900">Mood Diary</Text>
                   <Text className="mt-1 text-center text-base text-gray-600">
                     Log your daily mood here!
                   </Text>
         </View>

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
            {isLoading ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator size="large" color="#4093D6" />
                <Text className="mt-3 text-gray-600">Loading your moods...</Text>
              </View>
            ) : filteredEntries.length ? (
              filteredEntries.map((entry) => (
                <View
                  key={entry.id}
                  className="mb-1 rounded-xl border border-primary-200 bg-primary-100 px-4 py-4 shadow-sm relative"
                >
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMood(entry.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={18} color="#991B1B" />
                  </TouchableOpacity>
                  <View className="flex-row items-start">
                    <View className="items-center" style={styles.avatarColumn}>
                      <View style={styles.avatarWrapper}>
                        <Image source={entry.image} style={styles.avatarImage} resizeMode="contain" />
                      </View>
                      <Text className="mt-2 text-sm font-semibold text-gray-800">{entry.moodType}</Text>
                    </View>

                    <View className="ml-4 flex-1">
                      <View className="flex-row items-center justify-between">
                        <View style={styles.activitiesRow}>
                          {entry.activities.length ? (
                            entry.activities.map((activity) => {
                              const iconName = activityIconMap[activity];
                              return (
                                <View
                                  key={`${entry.id}-${activity}`}
                                  style={styles.activityChip}
                                  accessibilityLabel={activity}
                                  accessible
                                >
                                  {iconName ? (
                                    <Icon name={iconName} size={18} color="#1F2937" />
                                  ) : (
                                    <Text style={styles.activityChipText}>
                                      {activity.slice(0, 2).toUpperCase()}
                                    </Text>
                                  )}
                                </View>
                              );
                            })
                          ) : (
                            <Text style={styles.emptyActivitiesText}>No activities logged</Text>
                          )}
                        </View>
                      </View>
                      {entry.note ? (
                        <Text className="mt-3 text-sm text-gray-800" numberOfLines={3}>
                          {entry.note}
                        </Text>
                      ) : (
                        <Text className="mt-3 text-sm text-gray-600 italic">
                          No notes added.
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.timeText}>{entry.displayTime}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text className="text-base font-semibold text-gray-800">
                  No moods logged for this day.
                </Text>
                <Text className="mt-1 text-center text-sm text-gray-600">
                  Tap the + button to capture how you feel.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        onPress={() => navigation.navigate('MoodJournal')}
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
  avatarColumn: {
    width: 64,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  activitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -8,
  },
  activityChip: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityChipText: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '700',
  },
  emptyActivitiesText: {
    fontSize: 12,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  emptyState: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
});

export default Mood;
