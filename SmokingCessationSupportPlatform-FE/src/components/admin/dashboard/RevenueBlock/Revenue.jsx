import React from "react";
import { REVENUE_DATA } from "../../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Default colors (will be overridden by props if provided)
const DEFAULT_COLORS = {
  premium: "#1814F3",  // Primary blue for Premium
  text: "#5572AF",     // Secondary text blue
  grid: "#f8f8f9"      // Light grid color
};

const formatTooltipValue = (value) => `${value} $`;
const formatYAxisLabel = (value) => `${value} $`;

const Revenue = ({ colors, theme }) => {
  // Use passed colors or default colors
  const chartColors = {
    premium: colors?.primary || theme?.primary || DEFAULT_COLORS.premium,
    text: theme?.secondary || DEFAULT_COLORS.text,
    grid: colors?.grid || DEFAULT_COLORS.grid
  };
  
  return (
  <div style={{ width: "100%", height: 250, marginTop: 30 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={REVENUE_DATA}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        <CartesianGrid stroke={chartColors.grid} horizontal vertical={false} strokeDasharray="3 0" />
        <XAxis
          dataKey="week"
          tickSize={0}
          axisLine={false}
          tick={{ fill: chartColors.text, fontSize: 14 }}
        />
        <YAxis
          tickFormatter={formatYAxisLabel}
          tickCount={4}
          axisLine={false}
          tickSize={0}
          tick={{ fill: chartColors.text, fontSize: 14 }}
          interval={0}
          ticks={[0, 20, 40, 60]}
        />
        <Tooltip cursor={{ fill: "transparent" }} formatter={formatTooltipValue} />
        <Bar
          dataKey="premium"
          fill={chartColors.premium}
          radius={[4, 4, 4, 4]}
          barSize={18}
          name="Premium Plan"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
  );
};

export default Revenue;
