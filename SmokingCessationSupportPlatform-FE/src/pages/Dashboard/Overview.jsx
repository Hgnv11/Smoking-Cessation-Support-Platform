import React from 'react'
import { Typography } from 'antd'
import OverviewStats from '../../components/OverviewStats/OverviewStats.jsx'
import PerformanceIndex from '../../components/PerformanceIndex/PerformanceIndex.jsx'
import QuickNotifications from '../../components/QuickNotifications/QuickNotifications.jsx'

const { Title } = Typography

const Overview = () => {
  return (
    <div className="overview-page">
      {/* User Overview section */}
      <OverviewStats />

      {/* Performance & Stability Index section */}
      <Title level={2} style={{ marginTop: '48px', marginBottom: '24px', fontWeight: 600 }}>
        Performance & Stability Index
      </Title>
      <PerformanceIndex />

      {/* Quick Notifications section */}
      <QuickNotifications />
    </div>
  )
}

export default Overview