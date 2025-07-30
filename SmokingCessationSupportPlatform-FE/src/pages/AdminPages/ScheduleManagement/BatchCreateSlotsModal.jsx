import React, { useState } from 'react';
import { Modal, Form, Select, Checkbox, DatePicker, Button, Row, Col, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, CalendarOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const BatchCreateSlotsModal = ({ visible, onCancel, onSubmit, mentorOptions = [] }) => {
  const [form] = Form.useForm();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dates, setDates] = useState([dayjs()]);
  
  // Default time slots configuration
  const timeSlots = [
    { id: 1, label: 'Slot 1', time: '09:00 AM' },
    { id: 2, label: 'Slot 2', time: '11:00 AM' },
    { id: 3, label: 'Slot 3', time: '02:00 PM' },
    { id: 4, label: 'Slot 4', time: '04:00 PM' },
  ];
  
  const handleSlotChange = (checkedValues) => {
    setSelectedSlots(checkedValues);
  };
  
  const addDate = () => {
    setDates([...dates, dayjs()]);
  };
  
  const removeDate = (indexToRemove) => {
    if (dates.length > 1) {
      setDates(dates.filter((_, index) => index !== indexToRemove));
    }
  };
  
  const updateDate = (index, newDate) => {
    const updatedDates = [...dates];
    updatedDates[index] = newDate;
    setDates(updatedDates);
  };
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      const createdSlots = [];
      
      // Generate all slot combinations based on selected dates and times
      dates.forEach(date => {
        selectedSlots.forEach(slotId => {
          const slot = timeSlots.find(s => s.id === slotId);
          createdSlots.push({
            mentorEmail: values.mentorEmail,
            date: date.format('YYYY-MM-DD'),
            time: slot.time,
            slotNumber: slot.id,
            slotLabel: slot.label
          });
        });
      });
      
      onSubmit(createdSlots);
      handleReset();
    });
  };
  
  const handleReset = () => {
    form.resetFields();
    setSelectedSlots([]);
    setDates([dayjs()]);
  };
  
  const handleCancel = () => {
    handleReset();
    onCancel();
  };
  
  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Batch Create Consultation Slots
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
      width={700}
      closable={false}
      className="batch-create-modal"
    >
      <div className="p-6 space-y-6">
        <Form
          form={form}
          layout="vertical"
          className="space-y-6"
        >
          {/* Mentor Email Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mentor Email <span className="text-red-500">*</span>
            </label>
            <Form.Item
              name="mentorEmail"
              rules={[{ required: true, message: 'Please select a mentor' }]}
              className="mb-0"
            >
              <Select 
                placeholder="Select a mentor..."
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
          </div>
          
          {/* Slot Numbers Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slot Numbers <span className="text-red-500">*</span>
            </label>
            <Checkbox.Group onChange={handleSlotChange} className="w-full">
              <Row gutter={[16, 16]}>
                {timeSlots.map(slot => (
                  <Col span={12} key={slot.id}>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <Checkbox value={slot.id} className="w-full">
                        <div className="ml-2">
                          <div className="font-medium text-gray-900">{slot.label}</div>
                          <div className="text-sm text-gray-500">{slot.time}</div>
                        </div>
                      </Checkbox>
                    </div>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </div>
          
          {/* Dates Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dates <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {dates.map((date, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <DatePicker 
                    value={date}
                    onChange={(newDate) => updateDate(index, newDate)}
                    format="DD/MM/YYYY"
                    className="flex-1"
                    size="large"
                    placeholder="Select date"
                  />
                  {dates.length > 1 && (
                    <Button 
                      type="text"
                      danger
                      icon={<DeleteOutlined />} 
                      onClick={() => removeDate(index)}
                      className="flex items-center"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button 
                type="dashed" 
                onClick={addDate} 
                icon={<PlusOutlined />}
                className="w-32"
                size="large"
              >
                Add Date
              </Button>
            </div>
          </div>
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
            icon={<CalendarOutlined />}
            onClick={handleSubmit}
            disabled={selectedSlots.length === 0 || dates.length === 0}
            className="px-6 bg-blue-600 hover:bg-blue-700"
          >
            Create {selectedSlots.length * dates.length} Slots
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BatchCreateSlotsModal; 