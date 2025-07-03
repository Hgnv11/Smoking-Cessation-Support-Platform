import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Row, Col, Typography } from "antd";
import { 
  FREE_MEMBERS_DISTRIBUTION, 
  PREMIUM_MEMBERS_DISTRIBUTION,
  MEMBERS_STATS 
} from "../../../data/mockData";

const { Text, Title } = Typography;

// Color constants for maintainability - Desert Sand Theme
const SUCCESS_COLOR = "#5572AF";  // Secondary text blue - cho success
const FAILED_COLOR = "#FFC658";   // Desert Sand yellow - cho failed
const FREE_MEMBERS_COLOR = "#062A74";  // Primary text navy cho Free Members
const PREMIUM_MEMBERS_COLOR = "#FFC658"; // Desert Sand yellow cho Premium Members
const TEXT_COLOR = "#062A74";      // Primary text navy

const DoughnutChart = ({ data, title, centerText, centerSubText }) => (
  <div style={{ textAlign: "center" }}>
    <Title level={5} style={{ marginBottom: 16, color: TEXT_COLOR }}>{title}</Title>
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
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
          {centerText}
        </div>
        <div style={{ fontSize: 12, color: "#8C8C8C" }}>
          {centerSubText}
        </div>
      </div>
    </div>
  </div>
);

const QuitRate = () => {
  // Định nghĩa màu sắc cho từng loại chart
  const FREE_MEMBERS_COLORS = [SUCCESS_COLOR, FAILED_COLOR]; // Success, Failed
  const PREMIUM_MEMBERS_COLORS = [SUCCESS_COLOR, FAILED_COLOR]; // Success, Failed

  // Thêm màu vào data
  const freeWithColors = FREE_MEMBERS_DISTRIBUTION.map((item, index) => ({
    ...item,
    fill: FREE_MEMBERS_COLORS[index]
  }));

  const premiumWithColors = PREMIUM_MEMBERS_DISTRIBUTION.map((item, index) => ({
    ...item,
    fill: PREMIUM_MEMBERS_COLORS[index]
  }));

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
      <Row gutter={[24, 24]}>
        {/* Biểu đồ 1: Free Members */}
        <Col xs={24} md={12}>
          <DoughnutChart
            data={freeWithColors}
            title="Free Members"
            centerText={MEMBERS_STATS.free.total}
            centerSubText={`${MEMBERS_STATS.free.successRate}% Success`}
          />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <Text style={{ color: SUCCESS_COLOR, fontWeight: "500" }}>
              ✓ {MEMBERS_STATS.free.success} Success
            </Text>
            <br />
            <Text style={{ color: FAILED_COLOR, fontWeight: "500" }}>
              ✗ {MEMBERS_STATS.free.failed} Failed
            </Text>
          </div>
        </Col>

        {/* Biểu đồ 2: Premium Members */}
        <Col xs={24} md={12}>
          <DoughnutChart
            data={premiumWithColors}
            title="Premium Members"
            centerText={MEMBERS_STATS.premium.total}
            centerSubText={`${MEMBERS_STATS.premium.successRate}% Success`}
          />
          <div style={{ marginTop: 12, textAlign: "center" }}>
            <Text style={{ color: SUCCESS_COLOR, fontWeight: "500" }}>
              ✓ {MEMBERS_STATS.premium.success} Success
            </Text>
            <br />
            <Text style={{ color: FAILED_COLOR, fontWeight: "500" }}>
              ✗ {MEMBERS_STATS.premium.failed} Failed
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default QuitRate;
