import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Checkbox,
  DatePicker,
  Button,
  Row,
  Col,
  Space,
} from "antd";
import { CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const BatchCreateSlotsModal = ({
  visible,
  onCancel,
  onSubmit,
  mentorOptions = [],
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "day"));

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSelectedSlots([]);
      setSelectedDate(dayjs().add(1, "day"));
    }
  }, [visible, form]);

  // Default time slots configuration
  const timeSlots = [
    { id: 1, label: "Slot 1", time: "7:00 AM - 9:30 AM" },
    { id: 2, label: "Slot 2", time: "9:30 AM - 12:00 PM" },
    { id: 3, label: "Slot 3", time: "13:00 PM - 15:30 PM" },
    { id: 4, label: "Slot 4", time: "15:30 PM - 18:00 PM" },
  ];

  const handleSlotChange = (checkedValues) => {
    setSelectedSlots(checkedValues);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Prepare slot data
      const slots = selectedSlots.map((slotId) => ({
        mentorEmail: values.mentorEmail,
        slotNumber: slotId,
        slotDate: selectedDate.format("YYYY-MM-DD"),
      }));

      // Call parent's onSubmit with slot data
      await onSubmit(slots);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedSlots([]);
    setSelectedDate(dayjs().add(1, "day"));
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  // Function to disable dates before tomorrow
  const disabledDate = (current) => {
    return current && current < dayjs().add(1, "day").startOf("day");
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "16px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CalendarOutlined style={{ color: "#0A52B5", fontSize: "20px" }} />
            <span
              style={{ fontSize: "18px", fontWeight: "600", color: "#0A52B5" }}
            >
              Batch Create Consultation Slots
            </span>
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCancel}
            style={{ color: "#8c8c8c" }}
            size="large"
          />
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={750}
      closable={false}
      bodyStyle={{ padding: 0 }}
      headStyle={{ padding: "24px 24px 0", borderBottom: "none" }}
    >
      <div style={{ padding: "0 24px 24px" }}>
        <Form form={form} layout="vertical" style={{ marginTop: "24px" }}>
          {/* Mentor Email Selection */}
          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: "#262626",
                marginBottom: "12px",
              }}
            >
              Select Mentor <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <Form.Item
              name="mentorEmail"
              rules={[{ required: true, message: "Please select a mentor" }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Choose a mentor from the list..."
                size="large"
                style={{ width: "100%", height: "48px" }}
              >
                {mentorOptions.map((mentor) => (
                  <Option key={mentor.email} value={mentor.email}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>{mentor.name}</span>
                      <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                        {mentor.email}
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Slot Numbers Selection */}
          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: "#262626",
                marginBottom: "16px",
              }}
            >
              Select Time Slots <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <Checkbox.Group
              value={selectedSlots}
              onChange={handleSlotChange}
              style={{ width: "100%" }}
            >
              <Row gutter={[16, 16]}>
                {timeSlots.map((slot) => (
                  <Col span={12} key={slot.id}>
                    <div
                      style={{
                        border: "2px solid #d9d9d9",
                        borderRadius: "8px",
                        padding: "16px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#0A52B5";
                        e.currentTarget.style.backgroundColor = "#e6f0ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "#d9d9d9";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Checkbox value={slot.id} style={{ width: "100%" }}>
                        <div style={{ marginLeft: "8px" }}>
                          <div
                            style={{
                              fontWeight: "600",
                              color: "#262626",
                              fontSize: "16px",
                            }}
                          >
                            {slot.label}
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#8c8c8c",
                              marginTop: "4px",
                            }}
                          >
                            {slot.time}
                          </div>
                        </div>
                      </Checkbox>
                    </div>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>

          {/* Date Selection */}
          <div
            style={{
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "16px",
                fontWeight: "600",
                color: "#262626",
                marginBottom: "12px",
              }}
            >
              Select Date <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              format="DD/MM/YYYY"
              size="large"
              style={{ width: "100%", height: "48px" }}
              placeholder="Select consultation date"
              disabledDate={disabledDate}
              showToday={false}
            />
          </div>
        </Form>

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "1px solid #f0f0f0",
            marginTop: "24px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#8c8c8c" }}>
            {selectedSlots.length > 0 && (
              <span
                style={{
                  backgroundColor: "#e6f0ff",
                  color: "#0A52B5",
                  padding: "4px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {selectedSlots.length} slot(s) selected
              </span>
            )}
          </div>
          <Space size={12}>
            <Button
              size="large"
              onClick={handleCancel}
              style={{
                padding: "0 32px",
                height: "48px",
                fontWeight: "500",
                borderRadius: "6px",
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<CalendarOutlined />}
              onClick={handleSubmit}
              disabled={selectedSlots.length === 0}
              loading={loading}
              style={{
                padding: "0 32px",
                height: "48px",
                fontWeight: "500",
                borderRadius: "6px",
                backgroundColor: "#0A52B5",
                borderColor: "#0A52B5",
              }}
            >
              Create {selectedSlots.length} Slot
              {selectedSlots.length > 1 ? "s" : ""}
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default BatchCreateSlotsModal;
