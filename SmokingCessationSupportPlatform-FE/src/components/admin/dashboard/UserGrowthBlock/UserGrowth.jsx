import React, { useState } from "react";
import { Select, Space, Typography } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { USER_GROWTH_DATA, USER_GROWTH_7_DAYS, USER_GROWTH_30_DAYS } from "../../../data/mockData";

const { Text } = Typography;

// Color constants for maintainability - Desert Sand Theme
const SUCCESS_COLOR = "#5572AF";  // Secondary text blue - cho growth positive
const FAILED_COLOR = "#FFC658";   // Desert Sand yellow - cho growth negative  
const PRIMARY_CHART_COLOR = "#062A74"; // Primary text navy - màu chính cho chart
const SECONDARY_CHART_COLOR = "#5572AF"; // Secondary text blue - màu phụ cho chart
const TEXT_COLOR = "#062A74";      // Primary text navy

const UserGrowth = () => {
  const [timeFilter, setTimeFilter] = useState('7days'); // Mặc định là 7 ngày
  
  // Lựa chọn data theo filter
  const getDataByFilter = () => {
    switch (timeFilter) {
      case '7days':
        return {
          data: USER_GROWTH_7_DAYS,
          xKey: 'period',
          lastKey: 'last_period',
          thisKey: 'this_period',
          lastLabel: 'Last Week',
          thisLabel: 'This Week'
        };
      case '30days':
        return {
          data: USER_GROWTH_30_DAYS,
          xKey: 'period',
          lastKey: 'last_period',
          thisKey: 'this_period',
          lastLabel: 'Last Month',
          thisLabel: 'This Month'
        };
      default:
        return {
          data: USER_GROWTH_DATA,
          xKey: 'month',
          lastKey: 'last_month',
          thisKey: 'this_month',
          lastLabel: 'Last Month',
          thisLabel: 'This Month'
        };
    }
  };

  // Tính toán growth statistics
  const calculateGrowthStats = () => {
    const { data, lastKey, thisKey } = getDataByFilter();
    
    // Tính tổng users của last period và this period
    const totalLastPeriod = data.reduce((sum, item) => sum + item[lastKey], 0);
    const totalThisPeriod = data.reduce((sum, item) => sum + item[thisKey], 0);
    
    // Tính growth
    const newUsers = totalThisPeriod - totalLastPeriod;
    const growthPercentage = totalLastPeriod > 0 ? ((newUsers / totalLastPeriod) * 100).toFixed(1) : 0;
    
    return {
      newUsers,
      growthPercentage: parseFloat(growthPercentage),
      totalThisPeriod,
      totalLastPeriod
    };
  };

  const { data, xKey, lastKey, thisKey, lastLabel, thisLabel } = getDataByFilter();
  const { newUsers, growthPercentage, totalThisPeriod, totalLastPeriod } = calculateGrowthStats();

  // Màu sắc dựa trên growth
  const growthColor = newUsers >= 0 ? SUCCESS_COLOR : FAILED_COLOR;

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24 }}>
      {/* Filter Controls */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text strong style={{ fontSize: 16, color: TEXT_COLOR }}>User Growth Analytics</Text>
          <div style={{ marginTop: 4 }}>
            <Space>
              <Text
                style={{
                  fontSize: 16,
                  color: growthColor,
                  fontWeight: "500"
                }}
              >
                {newUsers >= 0 ? (
                  <>
                    <span style={{ marginRight: 4 }}>↑</span>
                    +{newUsers} new users
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: 4 }}>↓</span>
                    {newUsers} new users
                  </>
                )}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: growthColor,
                  fontWeight: "500"
                }}
              >
                ({growthPercentage >= 0 ? '+' : ''}{growthPercentage}%)
              </Text>
            </Space>
          </div>
        </div>
        <Space>
          <Text type="secondary">Time Period:</Text>
          <Select
            value={timeFilter}
            onChange={setTimeFilter}
            style={{ width: 120 }}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: '7days', label: '7 Days' },
              { value: '30days', label: '30 Days' },
            ]}
          />
        </Space>
      </div>
      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={FAILED_COLOR} stopOpacity={0.2} />
              <stop offset="95%" stopColor={FAILED_COLOR} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={SUCCESS_COLOR} stopOpacity={0.2} />
              <stop offset="95%" stopColor={SUCCESS_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey={lastKey}
            stroke={FAILED_COLOR}
            fillOpacity={1}
            fill="url(#colorLast)"
            name={`${lastLabel}`}
          />
          <Area
            type="monotone"
            dataKey={thisKey}
            stroke={SUCCESS_COLOR}
            fillOpacity={1}
            fill="url(#colorThis)"
            name={`${thisLabel}`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowth;
