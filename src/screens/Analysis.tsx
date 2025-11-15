import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import Svg, {
  Line,
  Polyline,
  Circle,
  Text as SvgText,
  Path,
} from 'react-native-svg';

interface RiskPoint {
  day: string;
  value: number;
}

interface MoodSlice {
  label: string;
  value: number;
  color: string;
}

const weeklyRiskData: RiskPoint[] = [
  { day: 'Mon', value: 52 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 38 },
  { day: 'Thu', value: 98 },
  { day: 'Fri', value: 48 },
  { day: 'Sat', value: 42 },
  { day: 'Sun', value: 43 },
];

const moodDistribution: MoodSlice[] = [
  { label: 'Happy', value: 3, color: '#FEC9A7' },
  { label: 'Stressed', value: 1, color: '#FCA5A5' },
  { label: 'Satisfied', value: 2, color: '#BBF7D0' },
  { label: 'Sad', value: 1, color: '#BFDBFE' },
  { label: 'Neutral', value: 2, color: '#E5E7EB' },
  { label: 'Tired', value: 1, color: '#D1D5DB' },
  { label: 'Energetic', value: 1, color: '#FACC15' },
];

const CHART_HEIGHT = 200;
const Y_AXIS_LABEL_WIDTH = 30;
const CHART_HORIZONTAL_PADDING = 10;
const CHART_VERTICAL_PADDING = 20;
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
  }, [chartInnerWidth]);

  const pieArcs = useMemo(() => {
    const total = moodDistribution.reduce((sum, slice) => sum + slice.value, 0);
    if (!total) return [];

    const cx = 100;
    const cy = 100;
    const radius = 80;
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
  }, []);

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
        </View>

        <View className="mt-6 mb-8 rounded-xl border border-primary bg-background px-6 py-6 shadow-lg">
          <Text className="text-lg font-semibold text-gray-900">
            Weekly Mood Distribution
          </Text>

          <View className="mt-6 items-center">
            <Svg height={200} width={200}>
              {pieArcs.map(segment => (
                <React.Fragment key={segment.key}>
                  <Path d={segment.path} fill={segment.color} />
                  <SvgText
                    x={segment.labelX}
                    y={segment.labelY}
                    fill="#1f2937"
                    fontSize="12"
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
        </View>
      </View>
    </ScrollView>
  );
};

export default Analysis;
