import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Typography } from "antd";
import { 
  OVERALL_MEMBERS_DISTRIBUTION,
  MEMBERS_STATS 
} from "../../../data/mockData";

const { Text, Title } = Typography;

// Color constants for maintainability - updated with new theme
const FREE_MEMBERS_COLOR = "#1814F3";  // Primary blue for Free Members
const PREMIUM_MEMBERS_COLOR = "#FFD600"; // Yellow for Premium Members
const TEXT_COLOR = "#333";      // Dark text for better readability

const OverallMembers = ({ colors, theme }) => {
  // Use passed colors or default colors
  const chartColors = {
    primary: colors?.primary || theme?.primary || FREE_MEMBERS_COLOR,
    secondary: colors?.secondary || theme?.warning || PREMIUM_MEMBERS_COLOR,
    text: theme?.secondary || TEXT_COLOR
  };
  
  // Define colors for Overall Members
  const OVERALL_COLORS = [chartColors.primary, chartColors.secondary]; // Free, Premium

  // Add colors to data
  const overallWithColors = OVERALL_MEMBERS_DISTRIBUTION.map((item, index) => ({
    ...item,
    fill: OVERALL_COLORS[index]
  }));

  return (
    <div style={{ width: "100%", height: "100%", padding: "20px 0" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={overallWithColors}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                startAngle={90}
                endAngle={-270}
              >
                {overallWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value} members`, name]} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none"
          }}>
            <div style={{ fontSize: 24, fontWeight: "bold", color: chartColors.text }}>
              {MEMBERS_STATS.overall.total}
            </div>
            <div style={{ fontSize: 14, color: "#8C8C8C" }}>
              {MEMBERS_STATS.overall.overallSuccessRate}% Success
            </div>
          </div>
        </div>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          gap: 30,
          marginTop: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ 
              backgroundColor: chartColors.primary,
              width: 12,
              height: 12,
              borderRadius: "50%",
              display: "inline-block"
            }}></span>
            <Text style={{ fontWeight: "500" }}>
              Free: {MEMBERS_STATS.free.total}
            </Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ 
              backgroundColor: chartColors.secondary,
              width: 12,
              height: 12,
              borderRadius: "50%",
              display: "inline-block"
            }}></span>
            <Text style={{ fontWeight: "500" }}>
              Premium: {MEMBERS_STATS.premium.total}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallMembers;
