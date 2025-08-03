import React from 'react';
import { Button, Avatar, Tooltip, Popconfirm, Tag, Row, Col, Space } from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from './ScheduleManagement.module.css';

const MAX_SLOTS_PER_DAY = 4;

const slotStatusColor = {
  available: '#d1fae5', // xanh nhạt
  booked: '#dbeafe',   // xanh dương nhạt
  completed: '#f3f4f6', // xám nhạt
  cancelled: '#fee2e2', // đỏ nhạt
};

const slotTextColor = {
  available: '#059669',
  booked: '#2563eb',
  completed: '#6b7280',
  cancelled: '#dc2626',
};

function getWeekDays(currentDate) {
  // Trả về mảng 7 ngày (chủ nhật -> thứ 7) của tuần chứa currentDate
  const startOfWeek = dayjs(currentDate).startOf('week');
  return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
}

function getCoachSlotsForDay(schedules, coachEmail, date) {
  // Lấy các slot của coach theo ngày
  return schedules.filter(
    s => s.mentorEmail === coachEmail && dayjs(s.date).isSame(date, 'day')
  );
}

const ScheduleTable = ({
  schedules = [],
  loading = false,
  onEdit,
  onDelete,
  onView,
  viewMode,
  // truyền thêm mentorOptions, currentDate nếu cần
  mentorOptions = [],
  currentDate = dayjs(),
  onAddSlot, // callback khi bấm Add Slot
}) => {
  const weekDays = getWeekDays(currentDate);

  return (
    <div className={styles.scheduleTableContainer} style={{ padding: 24, marginTop: 8 }}>
      <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Weekly Schedule Overview</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ minWidth: 220, textAlign: 'left', padding: 12, fontWeight: 600 }}>COACH</th>
              {weekDays.map((d) => (
                <th key={d.format('YYYY-MM-DD')} style={{ minWidth: 140, textAlign: 'center', padding: 12, fontWeight: 600 }}>
                  <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{d.format('ddd').toUpperCase()}</div>
                  <div style={{ fontSize: 16, color: '#0f172a', fontWeight: 600 }}>{d.format('MMM DD')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mentorOptions.map((coach) => (
              <tr key={coach.email} style={{ borderBottom: '1px solid #f1f5f9' }}>
                {/* Coach info */}
                <td style={{ padding: 16, verticalAlign: 'top', background: '#fff', minWidth: 220 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} icon={<UserOutlined />} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{coach.name}</div>
                      <div style={{ color: '#64748b', fontSize: 13 }}>{coach.specialization}</div>
                    </div>
                  </div>
                </td>
                {/* Slots for each day */}
                {weekDays.map((date) => {
                  const slots = getCoachSlotsForDay(schedules, coach.email, date);
                  return (
                    <td key={date.format('YYYY-MM-DD')} style={{ padding: 8, background: '#fcfcfd', minWidth: 140, verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {/* Hiển thị các slot */}
                        {slots.map((slot) => (
                          <div key={slot.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Tooltip title={slot.status === 'booked' ? slot.clientName : slot.description}>
                              <Button
                                size="small"
                                style={{
                                  background: slotStatusColor[slot.status] || '#f3f4f6',
                                  color: slotTextColor[slot.status] || '#0f172a',
                                  fontWeight: 600,
                                  width: 90,
                                  justifyContent: 'flex-start',
                                }}
                                onClick={() => onEdit && onEdit(slot)}
                              >
                                {slot.time}
                              </Button>
                            </Tooltip>
                            <Popconfirm
                              title="Delete this slot?"
                              onConfirm={() => onDelete && onDelete(slot.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined style={{ color: '#dc2626' }} />}
                                style={{ padding: 0 }}
                              />
                            </Popconfirm>
                          </div>
                        ))}
                        {/* Add Slot button nếu chưa đủ 4 slot */}
                        {slots.length < MAX_SLOTS_PER_DAY && (
                          <Button
                            type="dashed"
                            size="small"
                            icon={<PlusOutlined />}
                            style={{ width: 90, color: '#64748b', borderColor: '#cbd5e1', background: '#fff' }}
                            onClick={() => onAddSlot && onAddSlot({ coach, date })}
                          >
                            Add Slot
                          </Button>
                        )}
                        {/* Số slot/4 */}
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, textAlign: 'center' }}>{slots.length}/4 slots</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col><Tag color="#d1fae5" style={{ color: '#059669', fontWeight: 500 }}>Available Slot</Tag></Col>
        <Col><Tag color="#dbeafe" style={{ color: '#2563eb', fontWeight: 500 }}>Booked Slot</Tag></Col>
        <Col><Tag color="#f3f4f6" style={{ color: '#6b7280', fontWeight: 500 }}>Completed Slot</Tag></Col>
        <Col><Tag color="#fee2e2" style={{ color: '#dc2626', fontWeight: 500 }}>Cancelled Slot</Tag></Col>
        <Col><Tag icon={<PlusOutlined />} style={{ borderStyle: 'dashed', color: '#64748b', fontWeight: 500 }}>Add New Slot</Tag></Col>
      </Row>
    </div>
  );
};

export default ScheduleTable; 