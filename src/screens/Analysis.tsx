import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Line,
  Polyline,
  Circle,
  Text as SvgText,
  Path,
} from 'react-native-svg';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface RiskPoint {
  day: string;
  value: number;
}

interface MoodSlice {
  label: string;
  value: number;
  color: string;
}

// Week 1 data for Depression Risk Trend
const weeklyRiskDataWeek1: RiskPoint[] = [
  { day: 'Mon', value: 52 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 38 },
  { day: 'Thu', value: 98 },
  { day: 'Fri', value: 48 },
  { day: 'Sat', value: 42 },
  { day: 'Sun', value: 43 },
];

// Week 2 data for Depression Risk Trend
const weeklyRiskDataWeek2: RiskPoint[] = [
  { day: 'Mon', value: 35 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 40 },
  { day: 'Fri', value: 30 },
  { day: 'Sat', value: 25 },
  { day: 'Sun', value: 28 },
];

const allRiskData = [weeklyRiskDataWeek1, weeklyRiskDataWeek2];

// Week 1 data for Mood Distribution
const moodDistributionWeek1: MoodSlice[] = [
  { label: 'Happy', value: 3, color: '#FEC9A7' },
  { label: 'Stressed', value: 1, color: '#FCA5A5' },
  { label: 'Satisfied', value: 2, color: '#BBF7D0' },
  { label: 'Sad', value: 1, color: '#BFDBFE' },
  { label: 'Neutral', value: 2, color: '#E5E7EB' },
  { label: 'Tired', value: 1, color: '#D1D5DB' },
  { label: 'Energetic', value: 1, color: '#FACC15' },
];

// Week 2 data for Mood Distribution
const moodDistributionWeek2: MoodSlice[] = [
  { label: 'Happy', value: 4, color: '#FEC9A7' },
  { label: 'Stressed', value: 0, color: '#FCA5A5' },
  { label: 'Satisfied', value: 3, color: '#BBF7D0' },
  { label: 'Sad', value: 0, color: '#BFDBFE' },
  { label: 'Neutral', value: 1, color: '#E5E7EB' },
  { label: 'Tired', value: 2, color: '#D1D5DB' },
  { label: 'Energetic', value: 2, color: '#FACC15' },
];

const allMoodData = [moodDistributionWeek1, moodDistributionWeek2];

const CHART_HEIGHT = 130;
const Y_AXIS_LABEL_WIDTH = 30;
const CHART_HORIZONTAL_PADDING = 10;
const CHART_VERTICAL_PADDING = 12;
const TOP_MARGIN = 12;
const INNER_CHART_HEIGHT = CHART_HEIGHT - TOP_MARGIN;

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
  const [moodWeekIndex, setMoodWeekIndex] = useState(0);

  // Get current week's data
  const weeklyRiskData = allRiskData[riskWeekIndex];
  const moodDistribution = allMoodData[moodWeekIndex];

  // Navigation functions for risk chart
  const nextRiskWeek = () => {
    setRiskWeekIndex((prev) => (prev + 1) % allRiskData.length);
  };
  const prevRiskWeek = () => {
    setRiskWeekIndex((prev) => (prev - 1 + allRiskData.length) % allRiskData.length);
  };

  // Navigation functions for mood chart
  const nextMoodWeek = () => {
    setMoodWeekIndex((prev) => (prev + 1) % allMoodData.length);
  };
  const prevMoodWeek = () => {
    setMoodWeekIndex((prev) => (prev - 1 + allMoodData.length) % allMoodData.length);
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
    const total = moodDistribution.reduce((sum, slice) => sum + slice.value, 0);
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

    return moodDistribution.map(slice => {
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
          <Text className="text-lg font-semibold text-white">
            Weekly Depression Risk Trend
          </Text>

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

          {/* Pagination for Risk Chart */}
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
              <Text className={`text-xs ${riskWeekIndex === 0 ? 'text-white/50' : 'text-white'}`}>Previous Week</Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {allRiskData.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 rounded-full ${idx === riskWeekIndex ? "bg-white w-6" : "bg-white/40 w-2"}`}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={nextRiskWeek}
              disabled={riskWeekIndex === allRiskData.length - 1}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Text className={`text-xs ${riskWeekIndex === allRiskData.length - 1 ? 'text-white/50' : 'text-white'}`}>Next Week</Text>
              
                <View className={`w-8 h-8 rounded-full items-center justify-center ${riskWeekIndex === 0 ? 'bg-white/10' : 'bg-white/20'}`}>
                <ChevronRight size={18} color={riskWeekIndex === 0 ? '#ffffff80' : '#ffffff'} />
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

          <View className="mt-4 flex-row flex-wrap gap-y-3">
            {moodDistribution.map(slice => (
              <View
                key={slice.label}
                className="mr-6 flex-row items-center gap-2"
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
              disabled={moodWeekIndex === 0}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <View className={`w-8 h-8 rounded-full items-center justify-center ${moodWeekIndex === 0 ? 'bg-primary/10' : 'bg-primary/20'}`}>
                <ChevronLeft size={18} color={moodWeekIndex === 0 ? '#4093D680' : '#4093D6'} />
              </View>
              <Text className={`text-xs ${moodWeekIndex === 0 ? 'text-gray-400' : 'text-primary'}`}>Previous Week</Text>
            </TouchableOpacity>

            <View className="flex-row gap-2">
              {allMoodData.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 rounded-full ${idx === moodWeekIndex ? "bg-primary w-6" : "bg-primary/40 w-2"}`}
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={nextMoodWeek}
              disabled={moodWeekIndex === allMoodData.length - 1}
              className="flex-row items-center gap-1"
              activeOpacity={0.7}
            >
              <Text className={`text-xs ${moodWeekIndex === allMoodData.length - 1 ? 'text-gray-400' : 'text-primary'}`}>Next Week</Text>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${moodWeekIndex === allMoodData.length - 1 ? 'bg-primary/10' : 'bg-primary/20'}`}>
                <ChevronRight size={18} color={moodWeekIndex === allMoodData.length - 1 ? '#4093D680' : '#4093D6'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Analysis;
