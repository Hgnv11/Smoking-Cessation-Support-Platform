import React from 'react';
import { Modal, Form, Select, DatePicker, TimePicker, Input, Button, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditSlotModal = ({ 
  visible, 
  onCancel, 
  onSave, 
  initialValues, 
  mentorOptions = [] 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm A'),
      };
      onSave(formattedValues);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Format initial values for the form
  const formattedInitialValues = initialValues ? {
    ...initialValues,
    date: initialValues.date ? dayjs(initialValues.date) : undefined,
    time: initialValues.time ? dayjs(initialValues.time, 'HH:mm A') : undefined,
  } : {};

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            {initialValues ? 'Edit Consultation Slot' : 'Create Consultation Slot'}
          </span>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          />
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      closable={false}
    >
      <div className="p-6 space-y-6">
        <Form
          form={form}
          layout="vertical"
          initialValues={formattedInitialValues}
          className="space-y-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label={<span className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></span>}
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker 
                  format="DD/MM/YYYY"
                  className="w-full"
                  size="large"
                  placeholder="Select date"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label={<span className="text-sm font-medium text-gray-700">Time <span className="text-red-500">*</span></span>}
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <TimePicker 
                  format="HH:mm A"
                  className="w-full"
                  size="large"
                  placeholder="Select time"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="mentorEmail"
            label={<span className="text-sm font-medium text-gray-700">Mentor <span className="text-red-500">*</span></span>}
            rules={[{ required: true, message: 'Please select a mentor' }]}
          >
            <Select 
              placeholder="Select a mentor"
              className="w-full"
              size="large"
            >
              {mentorOptions.map(mentor => (
                <Option key={mentor.email} value={mentor.email}>
                  {mentor.name} ({mentor.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="slotLabel"
                label={<span className="text-sm font-medium text-gray-700">Slot Label</span>}
              >
                <Input 
                  placeholder="e.g., Slot 1, Morning Session"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span className="text-sm font-medium text-gray-700">Status</span>}
                initialValue="available"
              >
                <Select size="large">
                  <Option value="available">Available</Option>
                  <Option value="booked">Booked</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="clientName"
            label={<span className="text-sm font-medium text-gray-700">Client Name</span>}
          >
            <Input 
              placeholder="Client name (if booked)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="text-sm font-medium text-gray-700">Description</span>}
          >
            <TextArea 
              rows={4} 
              placeholder="Additional notes or description"
              className="resize-none"
            />
          </Form.Item>
        </Form>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button 
            size="large"
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            type="primary" 
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            {initialValues ? 'Update Slot' : 'Create Slot'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditSlotModal; 