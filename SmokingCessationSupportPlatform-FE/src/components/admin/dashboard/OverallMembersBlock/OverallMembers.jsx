import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Typography } from "antd";
import { 
  OVERALL_MEMBERS_DISTRIBUTION,
  MEMBERS_STATS 
} from "../../../data/mockData";

const { Text, Title } = Typography;

// Color constants for maintainability - Desert Sand Theme
const FREE_MEMBERS_COLOR = "#5572AF";  // Primary text navy cho Free Members
const PREMIUM_MEMBERS_COLOR = "#FFC658"; // Desert Sand yellow cho Premium Members
const TEXT_COLOR = "#062A74";      // Primary text navy

const OverallMembers = () => {
  // Định nghĩa màu sắc cho Overall Members
  const OVERALL_COLORS = [FREE_MEMBERS_COLOR, PREMIUM_MEMBERS_COLOR]; // Free, Premium

  // Thêm màu vào data
  const overallWithColors = OVERALL_MEMBERS_DISTRIBUTION.map((item, index) => ({
    ...item,
    fill: OVERALL_COLORS[index]
  }));

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <Title level={5} style={{ marginBottom: 16, color: TEXT_COLOR }}>Overall Members</Title>
        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={overallWithColors}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
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
            <div style={{ fontSize: 20, fontWeight: "bold", color: TEXT_COLOR }}>
              {MEMBERS_STATS.overall.total}
            </div>
            <div style={{ fontSize: 12, color: "#8C8C8C" }}>
              {MEMBERS_STATS.overall.overallSuccessRate}% Success
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, textAlign: "center" }}>
          <Text style={{ color: FREE_MEMBERS_COLOR, fontWeight: "500" }}>
            Free: {MEMBERS_STATS.free.total}
          </Text>
          <br />
          <Text style={{ color: PREMIUM_MEMBERS_COLOR, fontWeight: "500" }}>
            Premium: {MEMBERS_STATS.premium.total}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default OverallMembers;
