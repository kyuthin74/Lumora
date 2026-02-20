import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Svg, {
  Line,
  Polyline,
  Circle,
  Text as SvgText,
  Path,
} from 'react-native-svg';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

interface RiskPoint {
  day: string;
  value: number;
}

interface MoodSlice {
  label: string;
  value: number;
  color: string;
}

interface WeeklyMoodWeek {
  slices: MoodSlice[];
  startDateISO: string;
  endDateISO: string;
  label: string;
}

interface WeeklyRiskData {
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  daily_risks: RiskPoint[];
  average_risk: number;
}

interface MoodApiResponse {
  mood_type?: string;
}
// Helper function to format date range
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = monthNamesShort[start.getMonth()];
  const endMonth = monthNamesShort[end.getMonth()];
  const year = end.getFullYear();
  
  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
};

// Helper function to filter out future days from the dataset
const filterPastDays = (data: RiskPoint[], weekStartDate: string): RiskPoint[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekStart = new Date(weekStartDate);
  
  return data.filter((point, index) => {
    const pointDate = new Date(weekStart);
    pointDate.setDate(weekStart.getDate() + index);
    pointDate.setHours(0, 0, 0, 0);
    
    return pointDate <= today;
  });
};

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://127.0.0.1:8000';

const moodLegend = [
  { label: 'Neutral', color: '#BFDBFE' },
  { label: 'Energetic', color: '#FBCFE8' },
  { label: 'Happy', color: '#BBF7D0' },
  { label: 'Satisfied', color: '#FEF3C7' },
  { label: 'Tired', color: '#FED7AA' },
  { label: 'Stressed', color: '#E9D5FF' },
  { label: 'Angry', color: '#FECACA' },
  { label: 'Sad', color: '#E5E7EB' },
] as const;

type MoodLabel = (typeof moodLegend)[number]['label'];
type MoodValueMap = Partial<Record<MoodLabel, number>>;

const MOOD_COLORS: Record<MoodLabel, string> = moodLegend.reduce(
  (acc, mood) => {
    acc[mood.label] = mood.color;
    return acc;
  },
  {} as Record<MoodLabel, string>,
);

const MOOD_LABELS = moodLegend.map(mood => mood.label);

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const createMoodSlices = (values: MoodValueMap = {}): MoodSlice[] =>
  moodLegend.map(({ label, color }) => ({
    label,
    color,
    value: values[label] ?? 0,
  }));


const DAYS_IN_WEEK = 7;
const WEEKS_TO_FETCH = 2;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatISODate = (date: Date) => date.toISOString().split('T')[0];

const parseISODate = (iso: string) => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
};

const getWeekEndDate = (weekStart: Date) =>
  new Date(weekStart.getTime() + (DAYS_IN_WEEK - 1) * DAY_IN_MS);

const formatWeekRangeLabel = (weekStart: Date) => {
  const weekEnd = getWeekEndDate(weekStart);
  const formatPart = (date: Date) => `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
  if (weekStart.getFullYear() === weekEnd.getFullYear()) {
    return `${formatPart(weekStart)} - ${formatPart(weekEnd)}, ${weekStart.getFullYear()}`;
  }
  return `${formatPart(weekStart)} ${weekStart.getFullYear()} - ${formatPart(weekEnd)} ${weekEnd.getFullYear()}`;
};

const getMondayStart = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = (day + 6) % 7;
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - diff);
  return start;
};

const buildWeekStartDates = (weeksToBuild: number) => {
  const currentMonday = getMondayStart(new Date());
  return Array.from({ length: weeksToBuild }, (_, index) => {
    const weeksAgo = weeksToBuild - index - 1;
    const weekStart = new Date(currentMonday);
    weekStart.setDate(weekStart.getDate() - weeksAgo * DAYS_IN_WEEK);
    return weekStart;
  });
};

const buildWeekDateStrings = (weekStart: Date) =>
  Array.from({ length: DAYS_IN_WEEK }, (_, offset) =>
    formatISODate(new Date(weekStart.getTime() + offset * DAY_IN_MS)),
  );

const buildPreviousWeekStartDates = (referenceWeekStart: Date, weeksToBuild: number) => {
  const monday = getMondayStart(referenceWeekStart);
  return Array.from({ length: weeksToBuild }, (_, index) => {
    const weeksBack = weeksToBuild - index;
    const weekStart = new Date(monday);
    weekStart.setDate(weekStart.getDate() - weeksBack * DAYS_IN_WEEK);
    return weekStart;
  });
};

const createWeeklyMoodWeek = (weekStart: Date, slices: MoodSlice[]): WeeklyMoodWeek => {
  const weekEnd = getWeekEndDate(weekStart);
  return {
    slices,
    startDateISO: formatISODate(weekStart),
    endDateISO: formatISODate(weekEnd),
    label: formatWeekRangeLabel(weekStart),
  };
};

const buildEmptyWeeklyMoodHistory = (weeks: number) =>
  buildWeekStartDates(weeks).map(weekStart => createWeeklyMoodWeek(weekStart, createMoodSlices()));

const DEFAULT_WEEKLY_MOOD_HISTORY = buildEmptyWeeklyMoodHistory(WEEKS_TO_FETCH);

const isSupportedMoodLabel = (label: string): label is MoodLabel =>
  Object.prototype.hasOwnProperty.call(MOOD_COLORS, label);

const fetchWeekMoodWeek = async (weekStart: Date, token: string): Promise<WeeklyMoodWeek> => {
  const weekDates = buildWeekDateStrings(weekStart);

  const dailyEntries = await Promise.all(
    weekDates.map(async isoDate => {
      const response = await fetch(
        `${API_BASE_URL}/moods/daily?selected_date=${encodeURIComponent(isoDate)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const raw = await response.json().catch(() => []);

      if (!response.ok) {
        const message =
          (raw as { message?: string; detail?: string })?.message ||
          (raw as { message?: string; detail?: string })?.detail ||
          `Failed to load mood entries for ${isoDate}`;
        throw new Error(message);
      }

      return Array.isArray(raw) ? (raw as MoodApiResponse[]) : [];
    }),
  );

  const counts: MoodValueMap = {};
  dailyEntries.flat().forEach(entry => {
    const moodLabel = entry?.mood_type;
    if (moodLabel && isSupportedMoodLabel(moodLabel)) {
      counts[moodLabel] = (counts[moodLabel] ?? 0) + 1;
    }
  });

  return createWeeklyMoodWeek(weekStart, createMoodSlices(counts));
};

const fetchMoodWeeksByStartDates = (startDates: Date[], token: string) =>
  Promise.all(startDates.map(weekStart => fetchWeekMoodWeek(weekStart, token)));

const fetchWeeklyMoodHistory = async (token: string): Promise<WeeklyMoodWeek[]> => {
  const weekStartDates = buildWeekStartDates(WEEKS_TO_FETCH);
  return fetchMoodWeeksByStartDates(weekStartDates, token);
};

const CHART_HEIGHT = 130;
const Y_AXIS_LABEL_WIDTH = 30;
const CHART_HORIZONTAL_PADDING = 10;
const CHART_VERTICAL_PADDING = 12;
const TOP_MARGIN = 12;
const INNER_CHART_HEIGHT = CHART_HEIGHT - TOP_MARGIN;
const PIE_SIZE = 130;
const PIE_CENTER = PIE_SIZE / 2;
const PIE_RADIUS = 52;

const valueToY = (value: number) =>
  TOP_MARGIN + INNER_CHART_HEIGHT - (value / 100) * INNER_CHART_HEIGHT;

const analysisStyles = StyleSheet.create({
  chartSurface: {
    paddingHorizontal: CHART_HORIZONTAL_PADDING,
    paddingTop: CHART_VERTICAL_PADDING,
    paddingBottom: CHART_VERTICAL_PADDING + 12,
  },
  xAxisRow: {
    marginTop: 16,
    alignSelf: 'flex-start',
  },
});

const Analysis: React.FC = () => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [riskWeekIndex, setRiskWeekIndex] = useState(0);
  const [weeklyRiskHistory, setWeeklyRiskHistory] = useState<WeeklyRiskData[]>([]);
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyMoodHistory, setWeeklyMoodHistory] = useState<WeeklyMoodWeek[]>(
    DEFAULT_WEEKLY_MOOD_HISTORY,
  );
  const [moodWeekIndex, setMoodWeekIndex] = useState(
    Math.max(DEFAULT_WEEKLY_MOOD_HISTORY.length - 1, 0),
  );
  const [isLoadingOlderMoodWeeks, setIsLoadingOlderMoodWeeks] = useState(false);
  const [hasReachedMoodHistoryStart, setHasReachedMoodHistoryStart] = useState(false);
  const isFocused = useIsFocused();

  // Fetch weekly risk data from API
  useEffect(() => {
    const fetchWeeklyRiskData = async () => {
      try {
        setIsLoadingRisk(true);
        setError(null);
        
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('authToken');

        if (!userId || !token) {
          console.error('No user ID or token found');
          setWeeklyRiskHistory([]);
          setIsLoadingRisk(false);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/depression-risk-results/${userId}/weekly`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch risk data: ${response.status}`);
        }

        const data = await response.json();
        
        // Store full WeeklyRiskData objects
        if (data.weeks && Array.isArray(data.weeks)) {
          setWeeklyRiskHistory(data.weeks);
        } else {
          // No data available
          setWeeklyRiskHistory([]);
        }
      } catch (err) {
        console.error('Error fetching weekly risk data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // No fallback data
        setWeeklyRiskHistory([]);
      } finally {
        setIsLoadingRisk(false);
      }
    };

    fetchWeeklyRiskData();
  }, []);

  const refreshWeeklyMoodHistory = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        const fallback = buildEmptyWeeklyMoodHistory(WEEKS_TO_FETCH);
        setWeeklyMoodHistory(fallback);
        setMoodWeekIndex(Math.max(fallback.length - 1, 0));
        setHasReachedMoodHistoryStart(true);
        return;
      }

      const weeks = await fetchWeeklyMoodHistory(token);

      if (weeks.length) {
        setWeeklyMoodHistory(weeks);
        setMoodWeekIndex(weeks.length - 1);
        setHasReachedMoodHistoryStart(false);
      } else {
        const fallback = buildEmptyWeeklyMoodHistory(WEEKS_TO_FETCH);
        setWeeklyMoodHistory(fallback);
        setMoodWeekIndex(Math.max(fallback.length - 1, 0));
        setHasReachedMoodHistoryStart(true);
      }
    } catch (err) {
      console.error('Error fetching weekly mood distribution:', err);
      const fallback = buildEmptyWeeklyMoodHistory(WEEKS_TO_FETCH);
      setWeeklyMoodHistory(fallback);
      setMoodWeekIndex(Math.max(fallback.length - 1, 0));
      setHasReachedMoodHistoryStart(true);
    }
  }, []);

  const loadOlderMoodWeeks = useCallback(async () => {
    if (isLoadingOlderMoodWeeks || !weeklyMoodHistory.length || hasReachedMoodHistoryStart) {
      return;
    }

    setIsLoadingOlderMoodWeeks(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setHasReachedMoodHistoryStart(true);
        return;
      }

      const earliestWeek = weeklyMoodHistory[0];
      const earliestDate = parseISODate(earliestWeek.startDateISO);
      const startDates = buildPreviousWeekStartDates(earliestDate, WEEKS_TO_FETCH);
      const olderWeeks = await fetchMoodWeeksByStartDates(startDates, token);

      if (!olderWeeks.length) {
        setHasReachedMoodHistoryStart(true);
        return;
      }

      setWeeklyMoodHistory(prev => [...olderWeeks, ...prev]);
      setMoodWeekIndex(olderWeeks.length - 1);
      setHasReachedMoodHistoryStart(false);
    } catch (err) {
      console.error('Error fetching older mood weeks:', err);
    } finally {
      setIsLoadingOlderMoodWeeks(false);
    }
  }, [hasReachedMoodHistoryStart, isLoadingOlderMoodWeeks, weeklyMoodHistory]);

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    refreshWeeklyMoodHistory();
  }, [isFocused, refreshWeeklyMoodHistory]);

  // Get current week's data (use fetched data or fallback)
  const hasRiskHistory = weeklyRiskHistory.length > 0;
  const currentMoodWeek = weeklyMoodHistory[moodWeekIndex];
  const moodDistribution = currentMoodWeek?.slices || createMoodSlices();
  const moodWeekLabel = currentMoodWeek?.label;
  const lastMoodWeekIndex = Math.max(weeklyMoodHistory.length - 1, 0);
  const isFirstMoodWeek = moodWeekIndex <= 0;
  const isLastMoodWeek = moodWeekIndex >= lastMoodWeekIndex;
  const disablePrevMoodWeek = isLoadingOlderMoodWeeks || (isFirstMoodWeek && hasReachedMoodHistoryStart);
  const hasMoodData = useMemo(
    () => moodDistribution.some(slice => slice.value > 0),
    [moodDistribution],
  );
  const moodSlicesForDisplay = useMemo(() => {
    const filtered = moodDistribution.filter(slice => slice.value > 0);
    return filtered.length ? filtered : moodDistribution;
  }, [moodDistribution]);
  // Get current week's data
  const currentWeekData = weeklyRiskHistory[riskWeekIndex];
  const weeklyRiskData = currentWeekData?.daily_risks || [];
  
  // Filter out future days from graph (but keep all for x-axis labels)
  const pastRiskData = currentWeekData 
    ? filterPastDays(currentWeekData.daily_risks, currentWeekData.week_start_date)
    : [];
  
  // Format date range for display - calculate current week if no data exists
  const dateRangeText = currentWeekData 
    ? formatDateRange(currentWeekData.week_start_date, currentWeekData.week_end_date)
    : (() => {
        // Calculate current week's date range
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get to Monday
        
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() + mondayOffset);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return formatDateRange(weekStart.toISOString().split('T')[0], weekEnd.toISOString().split('T')[0]);
      })();

  // Navigation functions for risk chart
  const nextRiskWeek = () => {
    if (!weeklyRiskHistory.length) {
      return;
    }
    setRiskWeekIndex(prev => Math.min(prev + 1, weeklyRiskHistory.length - 1));
  };
  const prevRiskWeek = () => {
    if (!weeklyRiskHistory.length) {
      return;
    }
    setRiskWeekIndex(prev => Math.max(prev - 1, 0));
  };

  // Navigation functions for mood chart
  const nextMoodWeek = () => {
    setMoodWeekIndex(prev => {
      if (!weeklyMoodHistory.length) {
        return prev;
      }
      return Math.min(prev + 1, weeklyMoodHistory.length - 1);
    });
  };
  const prevMoodWeek = () => {
    if (!weeklyMoodHistory.length) {
      return;
    }
    if (moodWeekIndex > 0) {
      setMoodWeekIndex(prev => prev - 1);
      return;
    }
    loadOlderMoodWeeks();
  };

  const canvasWidth = useMemo(
    () => Math.max(layoutWidth - CHART_HORIZONTAL_PADDING * 2, 0),
    [layoutWidth],
  );

  const chartInnerWidth = useMemo(
    () => Math.max(canvasWidth - Y_AXIS_LABEL_WIDTH, 0),
    [canvasWidth],
  );

  const xAxisLabelStyle = useMemo(() => {
    if (chartInnerWidth <= 0) {
      return undefined;
    }
    return StyleSheet.create({
      row: {
        width: chartInnerWidth,
        marginLeft: Y_AXIS_LABEL_WIDTH,
      },
    }).row;
  }, [chartInnerWidth]);

  const yAxisTicks = useMemo(
    () => Array.from({ length: 10 }, (_, index) => (index + 1) * 20),
    [],
  );

  const polylinePoints = useMemo(() => {
    if (!chartInnerWidth || pastRiskData.length === 0) {
      return '';
    }
    const step = chartInnerWidth / (weeklyRiskData.length - 1);
    return pastRiskData
      .map((point, index) => {
        const x = Y_AXIS_LABEL_WIDTH + step * index;
        const y = valueToY(point.value);
        return `${x},${y}`;
      })
      .join(' ');
  }, [chartInnerWidth, pastRiskData, weeklyRiskData.length]);
  
  const hasRiskData = pastRiskData.length > 0;

  const pieArcs = useMemo(() => {
    const total = moodSlicesForDisplay.reduce((sum, slice) => sum + slice.value, 0);
    if (!total) return [];

    // Special case: only one mood
    if (moodSlicesForDisplay.length === 1) {
      const slice = moodSlicesForDisplay[0];
      return [{
        path: `M ${PIE_CENTER} ${PIE_CENTER} m -${PIE_RADIUS}, 0 a ${PIE_RADIUS},${PIE_RADIUS} 0 1,0 ${PIE_RADIUS * 2},0 a ${PIE_RADIUS},${PIE_RADIUS} 0 1,0 -${PIE_RADIUS * 2},0`,
        color: slice.color,
        labelX: PIE_CENTER,
        labelY: PIE_CENTER,
        value: slice.value,
        key: slice.label,
      }];
    }

    let cumulative = 0;
    const describeArc = (startAngle: number, endAngle: number) => {
      const start = {
        x: PIE_CENTER + PIE_RADIUS * Math.cos(startAngle),
        y: PIE_CENTER + PIE_RADIUS * Math.sin(startAngle),
      };
      const end = {
        x: PIE_CENTER + PIE_RADIUS * Math.cos(endAngle),
        y: PIE_CENTER + PIE_RADIUS * Math.sin(endAngle),
      };
      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
      return `M ${PIE_CENTER} ${PIE_CENTER} L ${start.x} ${start.y} A ${PIE_RADIUS} ${PIE_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };

    return moodSlicesForDisplay.map(slice => {
      const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      cumulative += slice.value;
      const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;

      const midAngle = (startAngle + endAngle) / 2;
      const labelRadius = PIE_RADIUS * 0.55;
      const labelX = PIE_CENTER + labelRadius * Math.cos(midAngle);
      const labelY = PIE_CENTER + labelRadius * Math.sin(midAngle);

      return {
        path: describeArc(startAngle, endAngle),
        color: slice.color,
        labelX,
        labelY,
        value: slice.value,
        key: slice.label,
      };
    });
  }, [moodSlicesForDisplay]);

  const handleChartLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (Math.abs(width - layoutWidth) > 0.5) {
      setLayoutWidth(width);
    }
  };

  return (
    <ScrollView className="flex-1 bg-[#f3f6fb]">
      <View className="px-6 pt-12">
        <View className="items-center pt-4">
          <Text className="text-2xl font-bold text-gray-900">
            Weekly Analysis
          </Text>
          <Text className="mt-1 text-base text-gray-500">
            Your mental wellness insights
          </Text>
        </View>

        <View className="mt-8 rounded-3xl bg-primary p-5">
          <View className="flex-column justify-between items-center">
            <Text className="text-lg font-semibold text-white">
              Weekly Depression Risk Trend
            </Text>
            <Text className="text-sm font-medium text-white">
              {dateRangeText}
            </Text>
            {isLoadingRisk && (
              <ActivityIndicator size="small" color="#ffffff" />
            )}
          </View>

          <View className="mt-5 p-2">
            <View
              className="overflow-hidden rounded-2xl bg-primary"
              style={analysisStyles.chartSurface}
              onLayout={handleChartLayout}
            >
              {chartInnerWidth > 0 && (
                <>
                  <Svg width={canvasWidth} height={CHART_HEIGHT}>
                    <Line
                      x1={Y_AXIS_LABEL_WIDTH}
                      y1={CHART_HEIGHT}
                      x2={canvasWidth}
                      y2={CHART_HEIGHT}
                      stroke="#FFFFFF55"
                      strokeWidth={1}
                    />
                    <Line
                      x1={Y_AXIS_LABEL_WIDTH}
                      y1={0}
                      x2={Y_AXIS_LABEL_WIDTH}
                      y2={CHART_HEIGHT}
                      stroke="#FFFFFF55"
                      strokeWidth={1}
                    />
                    {yAxisTicks.map(tick => {
                      const y = valueToY(tick);

                      return (
                        <React.Fragment key={tick}>
                          <Line
                            x1={Y_AXIS_LABEL_WIDTH}
                            y1={y}
                            x2={canvasWidth}
                            y2={y}
                            stroke="#FFFFFF33"
                            strokeWidth={1}
                            strokeDasharray="4 6"
                          />
                          <SvgText
                            x={Y_AXIS_LABEL_WIDTH - 8}
                            y={y + 2}
                            fill="#FFFFFF"
                            fontSize="10"
                            textAnchor="end"
                          >
                            {`${tick}%`}
                          </SvgText>
                        </React.Fragment>
                      );
                    })}
                    {hasRiskData && (
                      <>
                        <Polyline
                          points={polylinePoints}
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={3}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                        {pastRiskData.map((point, index) => {
                          const step =
                            chartInnerWidth / (weeklyRiskData.length - 1);
                          const x = Y_AXIS_LABEL_WIDTH + step * index;
                          const y = valueToY(point.value);
                          return (
                            <Circle
                              key={point.day}
                              cx={x}
                              cy={y}
                              r={5}
                              fill="#fff"
                              stroke="#FFFFFF"
                              strokeWidth={2}
                            />
                          );
                        })}
                      </>
                    )}
                  </Svg>
                  {hasRiskData ? (
                    <View
                      className="flex-row justify-between"
                      style={[analysisStyles.xAxisRow, xAxisLabelStyle]}
                    >
                      {weeklyRiskData.map(point => (
                        <Text
                          key={point.day}
                          className="text-xs font-semibold text-white"
                        >
                          {point.day}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <View className="items-center justify-center py-8">
                      <Text className="text-sm text-white/70">
                        No test results available for this week
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Pagination for Risk Chart */}
          <View className="flex-row items-center justify-between mt-4 px-2">
            <TouchableOpacity
              onPress={prevRiskWeek}
              disabled={!hasRiskHistory || riskWeekIndex === 0}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <View className={`w-8 h-8 rounded-full items-center justify-center ${!hasRiskHistory || riskWeekIndex === 0 ? 'bg-white/10' : 'bg-white/20'}`}>
                <ChevronLeft size={18} color={!hasRiskHistory || riskWeekIndex === 0 ? '#ffffff80' : '#ffffff'} />
              </View>
              <Text className={`text-xs ${!hasRiskHistory || riskWeekIndex === 0 ? 'text-white/50' : 'text-white'}`}>Previous Week</Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {hasRiskHistory ? (
                weeklyRiskHistory.map((_, idx) => (
                  <View
                    key={idx}
                    className={`h-2 rounded-full ${idx === riskWeekIndex ? 'bg-white w-6' : 'bg-white/40 w-2'}`}
                  />
                ))
              ) : (
                <View className="h-2 rounded-full bg-white/40 w-2" />
              )}
            </View>

            <TouchableOpacity
              onPress={nextRiskWeek}
              disabled={!hasRiskHistory || riskWeekIndex === weeklyRiskHistory.length - 1}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Text className={`text-xs ${!hasRiskHistory || riskWeekIndex === weeklyRiskHistory.length - 1 ? 'text-white/50' : 'text-white'}`}>Next Week</Text>
              
                <View className={`w-8 h-8 rounded-full items-center justify-center ${!hasRiskHistory || riskWeekIndex === weeklyRiskHistory.length - 1 ? 'bg-white/10' : 'bg-white/20'}`}>
                <ChevronRight size={18} color={!hasRiskHistory || riskWeekIndex === weeklyRiskHistory.length - 1 ? '#ffffff80' : '#ffffff'} />
              </View>

            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 mb-8 rounded-xl border border-primary bg-background px-6 py-6 shadow-lg">
          <Text className="text-lg font-semibold text-gray-900 text-center">
            Weekly Mood Distribution
          </Text>
          {moodWeekLabel && (
            <Text className="mt-1 text-sm font-medium text-gray-500 text-center">
              {moodWeekLabel}
            </Text>
          )}

          <View
            className="mt-4 items-center"
            style={{ minHeight: PIE_SIZE, justifyContent: 'center' }}
          >
            {hasMoodData ? (
              <Svg height={PIE_SIZE} width={PIE_SIZE}>
                {pieArcs.map(segment => (
                  <React.Fragment key={segment.key}>
                    <Path d={segment.path} fill={segment.color} />
                    <SvgText
                      x={segment.labelX}
                      y={segment.labelY}
                      fill="#1f2937"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {segment.value}
                    </SvgText>
                  </React.Fragment>
                ))}
              </Svg>
            ) : (
              <Text className="text-base font-medium text-gray-400">
                No moods logged for this week!
              </Text>
            )}
          </View>

          <View className="mt-4 flex-row flex-wrap gap-y-3">
            {moodLegend.map(slice => (
              <View
                key={slice.label}
                className="flex-row items-center gap-2"
                style={{ width: '25%' }}
              >
                <View
                  style={{ backgroundColor: slice.color }}
                  className="h-3 w-3 rounded-full"
                />
                <Text className="text-sm text-gray-700">{slice.label}</Text>
              </View>
            ))}
          </View>

          {/* Pagination for Mood Chart */}
          <View className="flex-row items-center justify-between mt-6">
            <TouchableOpacity
              onPress={prevMoodWeek}
              disabled={disablePrevMoodWeek}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <View className={`w-8 h-8 rounded-full items-center justify-center ${disablePrevMoodWeek ? 'bg-primary/10' : 'bg-primary/20'}`}>
                <ChevronLeft size={18} color={disablePrevMoodWeek ? '#4093D680' : '#4093D6'} />
              </View>
              <Text className={`text-xs ${disablePrevMoodWeek ? 'text-gray-400' : 'text-primary'}`}>
                {isLoadingOlderMoodWeeks ? 'Loading…' : 'Previous Week'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {weeklyMoodHistory.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 rounded-full ${idx === moodWeekIndex ? "bg-primary w-6" : "bg-primary/40 w-2"}`}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={nextMoodWeek}
              disabled={isLastMoodWeek}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Text className={`text-xs ${isLastMoodWeek ? 'text-gray-400' : 'text-primary'}`}>Next Week</Text>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${isLastMoodWeek ? 'bg-primary/10' : 'bg-primary/20'}`}>
                <ChevronRight size={18} color={isLastMoodWeek ? '#4093D680' : '#4093D6'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Analysis;
