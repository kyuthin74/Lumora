import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

interface RiskPoint {
  day: string;
  value: number;
}

interface MoodSlice {
  label: string;
  value: number;
  color: string;
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

const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

const moodLegend: Array<{ label: string; color: string }> = [
  { label: 'Neutral', color: '#BFDBFE' }, // light blue
  { label: 'Energetic', color: '#FBCFE8' }, // light pink
  { label: 'Happy', color: '#BBF7D0' }, // light green
  { label: 'Satisfied', color: '#FEF3C7' }, // light yellow
  { label: 'Tired', color: '#FED7AA' }, // light orange
  { label: 'Stressed', color: '#E9D5FF' }, // light purple
  { label: 'Angry', color: '#FECACA' }, // light red
  { label: 'Sad', color: '#E5E7EB' }, // light gray
];

const moodLabelsSet = new Set(moodLegend.map(item => item.label));

const buildMoodSlices = (counts: Record<string, number> = {}): MoodSlice[] =>
  moodLegend.map(({ label, color }) => ({
    label,
    color,
    value: counts[label] ?? 0,
  }));

const toISODate = (date: Date) => date.toISOString().split('T')[0];

const getWeekStartMonday = (offsetWeeks: number) => {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(today);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(today.getDate() - diffToMonday - offsetWeeks * 7);
  return monday;
};

const normalizeMoodLabel = (value?: string) => {
  if (!value) return 'Neutral';
  return moodLabelsSet.has(value) ? value : 'Neutral';
};

// Sample fallback data for risk chart
const weeklyRiskDataWeek1: RiskPoint[] = [
  { day: 'Mon', value: 52 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 38 },
  { day: 'Thu', value: 98 },
  { day: 'Fri', value: 48 },
  { day: 'Sat', value: 42 },
  { day: 'Sun', value: 43 },
];

const weeklyRiskDataWeek2: RiskPoint[] = [
  { day: 'Mon', value: 35 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 40 },
  { day: 'Fri', value: 30 },
  { day: 'Sat', value: 25 },
  { day: 'Sun', value: 28 },
];

const fallbackRiskHistory = [weeklyRiskDataWeek1, weeklyRiskDataWeek2];

const CHART_HEIGHT = 130;
const Y_AXIS_LABEL_WIDTH = 30;
const CHART_HORIZONTAL_PADDING = 10;
const CHART_VERTICAL_PADDING = 12;
const TOP_MARGIN = 12;
const INNER_CHART_HEIGHT = CHART_HEIGHT - TOP_MARGIN;
const MOOD_WEEKS_AVAILABLE = 4;

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
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    width: '25%',
  },
});

const Analysis: React.FC = () => {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [riskWeekIndex, setRiskWeekIndex] = useState(0);
  const [moodWeekIndex, setMoodWeekIndex] = useState(0);
  const [moodDistribution, setMoodDistribution] = useState<MoodSlice[]>(() =>
    buildMoodSlices(),
  );
  const [weeklyRiskHistory, setWeeklyRiskHistory] = useState<RiskPoint[][]>(
    fallbackRiskHistory,
  );
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyRiskData = async () => {
      try {
        setIsLoadingRisk(true);
        setError(null);

        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('authToken');

        if (!userId || !token) {
          setWeeklyRiskHistory(fallbackRiskHistory);
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
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch risk data: ${response.status}`);
        }

        const data = await response.json();

        if (data.weeks && Array.isArray(data.weeks)) {
          const transformed = data.weeks
            .map((week: WeeklyRiskData) => week.daily_risks)
            .filter((week: RiskPoint[]) => week && week.length);
          if (transformed.length) {
            setWeeklyRiskHistory(transformed);
            setRiskWeekIndex(prev => Math.min(prev, transformed.length - 1));
          } else {
            setWeeklyRiskHistory(fallbackRiskHistory);
          }
        } else {
          setWeeklyRiskHistory(fallbackRiskHistory);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setWeeklyRiskHistory(fallbackRiskHistory);
      } finally {
        setIsLoadingRisk(false);
      }
    };

    fetchWeeklyRiskData();
  }, []);

  const weeklyRiskData = weeklyRiskHistory[
    Math.min(riskWeekIndex, Math.max(weeklyRiskHistory.length - 1, 0))
  ] || fallbackRiskHistory[0];

  const moodPaginationSlots = useMemo(
    () => Array.from({ length: MOOD_WEEKS_AVAILABLE }),
    [],
  );

  const nextRiskWeek = () => {
    const maxIndex = Math.max(weeklyRiskHistory.length - 1, 0);
    setRiskWeekIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevRiskWeek = () => {
    setRiskWeekIndex(prev => Math.max(prev - 1, 0));
  };

  const nextMoodWeek = () => {
    setMoodWeekIndex(prev => Math.min(prev + 1, MOOD_WEEKS_AVAILABLE - 1));
  };

  const prevMoodWeek = () => {
    setMoodWeekIndex(prev => Math.max(prev - 1, 0));
  };

  const canvasWidth = useMemo(
    () => Math.max(layoutWidth - CHART_HORIZONTAL_PADDING * 2, 0),
    [layoutWidth],
  );

  const chartInnerWidth = useMemo(
    () => Math.max(canvasWidth - Y_AXIS_LABEL_WIDTH, 0),
    [canvasWidth],
  );

  const fetchMoodDistributionForWeek = useCallback(async (weekOffset: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        setMoodDistribution(buildMoodSlices());
        return;
      }

      const weekStart = getWeekStartMonday(weekOffset);
      const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return toISODate(date);
      });

      const dayRequests = weekDates.map(async dateStr => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/moods/daily?selected_date=${encodeURIComponent(dateStr)}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const payload: MoodApiResponse[] = await response
            .json()
            .catch(() => []);
          if (!response.ok) {
            throw new Error('Failed to load moods');
          }
          return Array.isArray(payload) ? payload : [];
        } catch {
          return [];
        }
      });

      const weekEntries = await Promise.all(dayRequests);
      const counts: Record<string, number> = {};

      weekEntries.forEach(dayEntries => {
        dayEntries.forEach(entry => {
          const moodLabel = normalizeMoodLabel(entry.mood_type);
          counts[moodLabel] = (counts[moodLabel] ?? 0) + 1;
        });
      });

      setMoodDistribution(buildMoodSlices(counts));
    } catch {
      setMoodDistribution(buildMoodSlices());
    }
  }, []);

  useEffect(() => {
    fetchMoodDistributionForWeek(moodWeekIndex);
  }, [fetchMoodDistributionForWeek, moodWeekIndex]);

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
    if (!chartInnerWidth) {
      return '';
    }
    const step = chartInnerWidth / (weeklyRiskData.length - 1);
    return weeklyRiskData
      .map((point, index) => {
        const x = Y_AXIS_LABEL_WIDTH + step * index;
        const y = valueToY(point.value);
        return `${x},${y}`;
      })
      .join(' ');
  }, [chartInnerWidth, weeklyRiskData]);

  const pieArcs = useMemo(() => {
    const activeSlices = moodDistribution.filter(slice => slice.value > 0);
    const total = activeSlices.reduce((sum, slice) => sum + slice.value, 0);
    if (!total) return [];

    const cx = 65;
    const cy = 65;
    const radius = 52;
    let cumulative = 0;

    const describeArc = (startAngle: number, endAngle: number) => {
      const start = {
        x: cx + radius * Math.cos(startAngle),
        y: cy + radius * Math.sin(startAngle),
      };
      const end = {
        x: cx + radius * Math.cos(endAngle),
        y: cy + radius * Math.sin(endAngle),
      };
      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
      return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };

    return activeSlices.map(slice => {
      const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
      cumulative += slice.value;
      const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;

      const midAngle = (startAngle + endAngle) / 2;
      const labelRadius = radius * 0.55;
      const labelX = cx + labelRadius * Math.cos(midAngle);
      const labelY = cy + labelRadius * Math.sin(midAngle);

      return {
        path: describeArc(startAngle, endAngle),
        color: slice.color,
        labelX,
        labelY,
        value: slice.value,
        key: slice.label,
      };
    });
  }, [moodDistribution]);

  const handleChartLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (Math.abs(width - layoutWidth) > 0.5) {
      setLayoutWidth(width);
    }
  };

  const maxRiskIndex = Math.max(weeklyRiskHistory.length - 1, 0);

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
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-white">
              Weekly Depression Risk Trend
            </Text>
            {isLoadingRisk && (
              <ActivityIndicator size="small" color="#ffffff" />
            )}
          </View>

          {error && (
            <Text className="text-xs text-white/80 mt-2">
              Using sample data: {error}
            </Text>
          )}

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
                    <Polyline
                      points={polylinePoints}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {weeklyRiskData.map((point, index) => {
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
                  </Svg>
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
                </>
              )}
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-4 px-2">
            <TouchableOpacity
              onPress={prevRiskWeek}
              disabled={riskWeekIndex === 0}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <View className={`w-8 h-8 rounded-full items-center justify-center ${riskWeekIndex === 0 ? 'bg-white/10' : 'bg-white/20'}`}>
                <ChevronLeft size={18} color={riskWeekIndex === 0 ? '#ffffff80' : '#ffffff'} />
              </View>
              <Text className={`text-xs ${riskWeekIndex === 0 ? 'text-white/50' : 'text-white'}`}>
                Previous Week
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {weeklyRiskHistory.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 rounded-full ${idx === riskWeekIndex ? 'bg-white w-6' : 'bg-white/40 w-2'}`}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={nextRiskWeek}
              disabled={riskWeekIndex === maxRiskIndex}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Text className={`text-xs ${riskWeekIndex === maxRiskIndex ? 'text-white/50' : 'text-white'}`}>
                Next Week
              </Text>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${riskWeekIndex === maxRiskIndex ? 'bg-white/10' : 'bg-white/20'}`}>
                <ChevronRight size={18} color={riskWeekIndex === maxRiskIndex ? '#ffffff80' : '#ffffff'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 mb-8 rounded-xl border border-primary bg-background px-6 py-6 shadow-lg">
          <Text className="text-lg font-semibold text-gray-900">
            Weekly Mood Distribution
          </Text>

          <View className="mt-4 items-center">
            <Svg height={130} width={130}>
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
          </View>

          <View className="mt-4" style={analysisStyles.legendGrid}>
            {moodLegend.map(slice => (
              <View
                key={slice.label}
                style={analysisStyles.legendItem}
                className="flex-row items-center gap-2 mb-3"
              >
                <View
                  style={{ backgroundColor: slice.color }}
                  className="h-3 w-3 rounded-full"
                />
                <Text className="text-sm text-gray-700">{slice.label}</Text>
              </View>
            ))}
          </View>

          <View className="flex-row items-center justify-between mt-6">
            <TouchableOpacity
              onPress={prevMoodWeek}
              disabled={moodWeekIndex === 0}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <View className={`w-8 h-8 rounded-full items-center justify-center ${moodWeekIndex === 0 ? 'bg-primary/10' : 'bg-primary/20'}`}>
                <ChevronLeft size={18} color={moodWeekIndex === 0 ? '#4093D680' : '#4093D6'} />
              </View>
              <Text className={`text-xs ${moodWeekIndex === 0 ? 'text-gray-400' : 'text-primary'}`}>
                Previous Week
              </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {moodPaginationSlots.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 rounded-full ${idx === moodWeekIndex ? 'bg-primary w-6' : 'bg-primary/40 w-2'}`}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={nextMoodWeek}
              disabled={moodWeekIndex === MOOD_WEEKS_AVAILABLE - 1}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Text className={`text-xs ${moodWeekIndex === MOOD_WEEKS_AVAILABLE - 1 ? 'text-gray-400' : 'text-primary'}`}>
                Next Week
              </Text>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${moodWeekIndex === MOOD_WEEKS_AVAILABLE - 1 ? 'bg-primary/10' : 'bg-primary/20'}`}>
                <ChevronRight size={18} color={moodWeekIndex === MOOD_WEEKS_AVAILABLE - 1 ? '#4093D680' : '#4093D6'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Analysis;
