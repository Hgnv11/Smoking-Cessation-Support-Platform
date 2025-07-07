import React from "react";
import { Radio, DatePicker, Button, Space, Select, Row, Col } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const ScheduleControlPanel = ({
  viewMode,
  setViewMode,
  currentDate,
  setCurrentDate,
  selectedMentor,
  setSelectedMentor,
  mentorOptions = [],
  onBatchCreate,
}) => {
  const handleToday = () => {
    setCurrentDate(dayjs());
  };

  const handleNext = () => {
    const newDate = dayjs(currentDate);
    switch (viewMode) {
      case "day":
        newDate.add(1, "day");
        break;
      case "week":
        newDate.add(1, "week");
        break;
      case "month":
        newDate.add(1, "month");
        break;
      default:
        newDate.add(1, "day");
    }
    setCurrentDate(newDate);
  };

  const handlePrevious = () => {
    const newDate = dayjs(currentDate);
    switch (viewMode) {
      case "day":
        newDate.subtract(1, "day");
        break;
      case "week":
        newDate.subtract(1, "week");
        break;
      case "month":
        newDate.subtract(1, "month");
        break;
      default:
        newDate.subtract(1, "day");
    }
    setCurrentDate(newDate);
  };

  const getDisplayText = () => {
    switch (viewMode) {
      case "day":
        return currentDate.format("MMMM DD, YYYY");
      case "week": {
        const startOfWeek = dayjs(currentDate).startOf("week");
        const endOfWeek = dayjs(currentDate).endOf("week");
        return `${startOfWeek.format("MMM DD")} - ${endOfWeek.format(
          "MMM DD, YYYY"
        )}`;
      }
      case "month":
        return currentDate.format("MMMM YYYY");
      default:
        return currentDate.format("MMMM DD, YYYY");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <Row gutter={[16, 16]} align="middle">
        {/* View Mode Selection */}
        <Col xs={24} sm={12} md={8}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              View Mode
            </label>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              size="large"
            >
              <Radio.Button value="day">Day</Radio.Button>
              <Radio.Button value="week">Week</Radio.Button>
              <Radio.Button value="month">Month</Radio.Button>
            </Radio.Group>
          </div>
        </Col>

        {/* Date Navigation */}
        <Col xs={24} sm={12} md={8}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Navigation
            </label>
            <Space size="small">
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrevious}
                size="large"
              />
              <Button
                onClick={handleToday}
                size="large"
                className="min-w-[80px]"
              >
                Today
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={handleNext}
                size="large"
              />
            </Space>
          </div>
        </Col>

        {/* Batch Create Button */}
        <Col xs={24} sm={24} md={8}>
          <div className="space-y-2">
            <Button
              type="primary"
              icon={<CalendarOutlined />}
              onClick={onBatchCreate}
              size="large"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Slots
            </Button>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} align="middle" className="mt-4">
        {/* Current Period Display */}
        <Col xs={24} sm={12} md={8}>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {getDisplayText()}
            </div>
          </div>
        </Col>

        {/* Mentor Filter */}
        <Col xs={24} sm={12} md={8}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Filter by Mentor
            </label>
            <Select
              placeholder="All mentors"
              style={{ width: "100%" }}
              allowClear
              value={selectedMentor}
              onChange={setSelectedMentor}
              size="large"
            >
              {mentorOptions.map((mentor) => (
                <Option key={mentor.email} value={mentor.email}>
                  {mentor.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        {/* Date Range Picker */}
        <Col xs={24} sm={24} md={8}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Custom Range
            </label>
            <DatePicker
              value={currentDate}
              onChange={setCurrentDate}
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              size="large"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ScheduleControlPanel;
