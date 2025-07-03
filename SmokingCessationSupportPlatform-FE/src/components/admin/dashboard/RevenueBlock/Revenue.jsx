import React from "react";
import { REVENUE_DATA } from "../../../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Color constants for maintainability - Desert Sand Theme
const PREMIUM_COLOR = "#062A74";  // Primary text navy cho Premium
const FREE_COLOR = "#FFC658";     // Desert Sand yellow cho Free
const TEXT_COLOR = "#5572AF";     // Secondary text blue

const formatTooltipValue = (value) => `${value}M VND`;
const formatYAxisLabel = (value) => `${value}M`;
const formatLegendValue = (value) => value === "premium" ? "Premium Plan" : "Free Plan";

const Revenue = () => (
  <div style={{ width: "100%", height: 250, marginTop: 30 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={REVENUE_DATA}
        margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
      >
        <CartesianGrid stroke="#f8f8f9" horizontal vertical={false} strokeDasharray="3 0" />
        <XAxis
          dataKey="month"
          tickSize={0}
          axisLine={false}
          tick={{ fill: TEXT_COLOR, fontSize: 14 }}
        />
        <YAxis
          tickFormatter={formatYAxisLabel}
          tickCount={6}
          axisLine={false}
          tickSize={0}
          tick={{ fill: TEXT_COLOR, fontSize: 14 }}
          interval={0}
          ticks={[0, 50, 100, 150, 200]}
        />
        <Tooltip cursor={{ fill: "transparent" }} formatter={formatTooltipValue} />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={formatLegendValue}
          style={{ paddingTop: "10px" }}
        />
        <Bar
          dataKey="premium"
          fill={PREMIUM_COLOR}
          radius={[4, 4, 4, 4]}
          barSize={18}
          name="Premium Plan"
        />
        <Bar
          dataKey="free"
          fill={FREE_COLOR}
          radius={[4, 4, 4, 4]}
          barSize={18}
          name="Free Plan"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default Revenue;
