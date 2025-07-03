import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from "recharts";
import { Select, Space, Typography } from "antd";
import { 
  SUCCESS_RATE_ALL_USERS, 
  SUCCESS_RATE_FREE_MEMBERS, 
  SUCCESS_RATE_PREMIUM_MEMBERS 
} from "../../../data/mockData";

const { Text } = Typography;

// Color constants for maintainability - Updated for better visual consistency
const PRIMARY_COLOR = "#062A74";  // Primary text navy
const SUCCESS_COLOR = "#52C41A";  // Green for success/growth
const FAILED_COLOR = "#FF4D4F";   // Red for failure/decline  
const TARGET_COLOR = "#FFAA00";   // Orange for target line
const FREE_COLOR = "#5572AF";     // Blue for free members
const PREMIUM_COLOR = "#FFC658";  // Yellow for premium members
const TEXT_COLOR = "#062A74";     // Primary text navy

const SuccessRate = () => {
  const [userTypeFilter, setUserTypeFilter] = useState('all');

  // Get data based on filter
  const getDataByFilter = () => {
    switch (userTypeFilter) {
      case 'free':
        return { 
          data: SUCCESS_RATE_FREE_MEMBERS, 
          lineColor: FREE_COLOR,
          label: 'Free Members Success Rate'
        };
      case 'premium':
        return { 
          data: SUCCESS_RATE_PREMIUM_MEMBERS, 
          lineColor: PREMIUM_COLOR,
          label: 'Premium Members Success Rate'
        };
      case 'comparison':
        // Merge data for comparison view
        return {
          data: SUCCESS_RATE_ALL_USERS.map((item, index) => ({
            ...item,
            freeRate: SUCCESS_RATE_FREE_MEMBERS[index]?.successRate || 0,
            premiumRate: SUCCESS_RATE_PREMIUM_MEMBERS[index]?.successRate || 0
          })),
          isComparison: true
        };
      default:
        return { 
          data: SUCCESS_RATE_ALL_USERS, 
          lineColor: SUCCESS_COLOR,
          label: 'Overall Success Rate'
        };
    }
  };

  // Calculate month-over-month change
  const calculateChange = () => {
    const { data } = getDataByFilter();
    if (data.length < 2) return { change: 0, isPositive: true };
    
    // Lấy 2 tháng gần nhất
    const currentMonth = data[data.length - 1].successRate;  // June: 25%
    const previousMonth = data[data.length - 2].successRate; // May: 22%
    
    // Tính chênh lệch tuyệt đối: 25 - 22 = +3
    const change = currentMonth - previousMonth;
    
    return {
      change: Math.abs(change).toFixed(1),
      isPositive: change >= 0,                       // true (xanh) hoặc false (đỏ)
      percentage: ((change / previousMonth) * 100).toFixed(1) 
    };
  };

  // Custom label component for data points
  const DataLabel = (props) => {
    const { x, y, value } = props;
    return (
      <text 
        x={x} 
        y={y - 10} 
        textAnchor="middle" 
        fontSize={11} 
        fontWeight={500}
        fill={TEXT_COLOR}
      >
        {value}%
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "8px 12px",
            border: `1px solid ${SUCCESS_COLOR}`,
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ margin: 0, color: TEXT_COLOR, fontWeight: 500 }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: "4px 0 0 0", color: entry.color, fontWeight: 600 }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const { data, lineColor, label, isComparison } = getDataByFilter();
  const { change, isPositive, percentage } = calculateChange();

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Summary Section and Filter */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 16 
      }}>
        {/* Summary Section */}
        <div>
          <Text 
            style={{ 
              color: isPositive ? SUCCESS_COLOR : FAILED_COLOR,
              fontWeight: 600,
              fontSize: 14
            }}
          >
            {isPositive ? '+' : '-'}{change}% Success Rate
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            (vs. last month {isPositive ? '+' : ''}{percentage}%)
          </Text>
        </div>

        {/* User Type Filter */}
        <Space align="center">
          <Text type="secondary" style={{ fontSize: 12 }}>User Type:</Text>
          <Select
            value={userTypeFilter}
            onChange={setUserTypeFilter}
            style={{ width: 140 }}
            size="small"
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'free', label: 'Free Members' },
              { value: 'premium', label: 'Premium Members' },
              { value: 'comparison', label: 'Compare Both' },
            ]}
          />
        </Space>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e8e8e8"
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: "#999999",
              fontWeight: 400
            }}
            interval={0}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ 
              fontSize: 12, 
              fill: "#999999",
              fontWeight: 400
            }}
            domain={[0, 40]}
            tickFormatter={(value) => `${value}%`}
          />
          
          {/* Target Line at 30% */}
          <ReferenceLine 
            y={30} 
            stroke={TARGET_COLOR} 
            strokeDasharray="5 5" 
            strokeWidth={2}
            label={{ 
              value: "Target: 30%", 
              position: "topRight",
              style: { fontSize: 11, fill: TARGET_COLOR, fontWeight: 500 }
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* Render lines based on filter */}
          {isComparison ? (
            <>
              <Line
                type="monotone"
                dataKey="freeRate"
                stroke={FREE_COLOR}
                strokeWidth={3}
                dot={{ fill: FREE_COLOR, strokeWidth: 2, stroke: "#fff", r: 5 }}
                activeDot={{ r: 7, fill: FREE_COLOR, stroke: "#fff", strokeWidth: 2 }}
                name="Free Members"
              >
                <LabelList content={<DataLabel />} dataKey="freeRate" />
              </Line>
              <Line
                type="monotone"
                dataKey="premiumRate"
                stroke={PREMIUM_COLOR}
                strokeWidth={3}
                dot={{ fill: PREMIUM_COLOR, strokeWidth: 2, stroke: "#fff", r: 5 }}
                activeDot={{ r: 7, fill: PREMIUM_COLOR, stroke: "#fff", strokeWidth: 2 }}
                name="Premium Members"
              >
                <LabelList content={<DataLabel />} dataKey="premiumRate" />
              </Line>
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="successRate"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ fill: lineColor, strokeWidth: 2, stroke: "#fff", r: 6 }}
              activeDot={{ r: 8, fill: lineColor, stroke: "#fff", strokeWidth: 2 }}
              name={label}
            >
              <LabelList content={<DataLabel />} />
            </Line>
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Color Legend */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: 20,
        marginTop: 8,
        fontSize: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ 
            color: PREMIUM_COLOR, 
            fontSize: 16, 
            fontWeight: 'bold' 
          }}>●</span>
          <Text style={{ fontSize: 14, color: TEXT_COLOR }}>Premium</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ 
            color: FREE_COLOR, 
            fontSize: 16, 
            fontWeight: 'bold' 
          }}>●</span>
          <Text style={{ fontSize: 14, color: TEXT_COLOR }}>Free</Text>
        </div>
      </div>
    </div>
  );
};

export default SuccessRate;
