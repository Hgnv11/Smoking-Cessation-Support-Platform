import React, { useState, useEffect } from 'react';
import './MembershipPayment.css';
import { FaHourglassHalf, FaChartLine, FaCrown, FaUserFriends } from 'react-icons/fa';
import ReusableTable from '../../components/ReusableTable/ReusableTable.jsx';
import SearchFilterRow from '../../components/SearchFilterRow/SearchFilterRow.jsx';
import { Modal, Descriptions, Tag, Form, Select, Divider, Space, Button, message } from 'antd';
import { membershipService } from '../../services/membershipService';

const statusColors = {
  'COMPLETED': 'status-completed',
  'PENDING': 'status-pending',
  'FAIL': 'status-fail',
  'ACTIVE': 'status-active',
  'INACTIVE': 'status-inactive',
};

const paymentFilterConfig = [
  { key: 'search', type: 'text', placeholder: 'Search by Transaction ID, Email, User ID...', value: '' },
  { key: 'package', type: 'select', value: '', options: [
    { value: '', label: 'Registration package' },
    { value: 'Premium monthly', label: 'Premium monthly' },
    { value: 'Premium Year', label: 'Premium Year' },
    { value: 'Basic Free', label: 'Basic Free' },
  ] },
  { key: 'status', type: 'select', value: '', options: [
    { value: '', label: 'Account status' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FAIL', label: 'Fail' },
  ] },
  { key: 'startDate', type: 'date', value: '', placeholder: 'Start date' },
  { key: 'endDate', type: 'date', value: '', placeholder: 'End date' },
];

const planFilterConfig = [
  { key: 'package', type: 'select', value: '', options: [
    { value: '', label: 'Registration package' },
    { value: 'Premium monthly', label: 'Premium monthly' },
    { value: 'Premium Year', label: 'Premium Year' },
    { value: 'Basic Free', label: 'Basic Free' },
  ] },
  { key: 'status', type: 'select', value: '', options: [
    { value: '', label: 'Account status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
  ] },
];

const MembershipPayment = () => {
  const [activeTab, setActiveTab] = useState('history');
  const [payments, setPayments] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [statistics, setStatistics] = useState({
    pendingPayments: 0,
    monthlyRevenue: 0,
    premiumMembers: 0,
    freeUsers: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    package: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // Fetch payments data
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await membershipService.getPayments(filters);
      setPayments(response.data);
    } catch (error) {
      message.error('Failed to fetch payments');
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch plans data
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await membershipService.getPlans(filters);
      setPlans(response.data);
    } catch (error) {
      message.error('Failed to fetch plans');
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await membershipService.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      message.error('Failed to fetch statistics');
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      fetchPayments();
    } else {
      fetchPlans();
    }
    fetchStatistics();
  }, [activeTab, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewTransaction = async (transaction) => {
    try {
      const details = await membershipService.getPaymentById(transaction.id);
      setSelectedTransaction(details);
      setIsModalVisible(true);
      form.setFieldsValue({ status: details.status });
    } catch (error) {
      message.error('Failed to fetch transaction details');
      console.error('Error fetching transaction details:', error);
    }
  };

  const handleStatusUpdate = async (values) => {
    try {
      await membershipService.updatePaymentStatus(selectedTransaction.id, values.status);
      message.success('Transaction status updated successfully');
      setIsModalVisible(false);
      fetchPayments();
    } catch (error) {
      message.error('Failed to update transaction status');
      console.error('Error updating transaction status:', error);
    }
  };

  const handleRefund = async () => {
    try {
      await membershipService.processRefund(selectedTransaction.id, {});
      message.success('Refund processed successfully');
      setIsModalVisible(false);
      fetchPayments();
    } catch (error) {
      message.error('Failed to process refund');
      console.error('Error processing refund:', error);
    }
  };

  const handlePlanStatusUpdate = async (planId, status) => {
    try {
      await membershipService.updatePlanStatus(planId, status);
      message.success('Plan status updated successfully');
      fetchPlans();
    } catch (error) {
      message.error('Failed to update plan status');
      console.error('Error updating plan status:', error);
    }
  };

  const summary = [
    { label: 'Payment Is Pending', value: statistics.pendingPayments, icon: <FaHourglassHalf /> },
    { label: 'Revenue This Month', value: statistics.monthlyRevenue, icon: <FaChartLine /> },
    { label: 'Premium Member', value: statistics.premiumMembers, icon: <FaCrown /> },
    { label: 'Free Users', value: statistics.freeUsers, icon: <FaUserFriends /> },
  ];

  const paymentColumns = [
    { title: 'Transaction ID', dataIndex: 'id' },
    { title: 'Package name', dataIndex: 'package' },
    { title: 'User ID', dataIndex: 'userId' },
    { title: 'Email Users', dataIndex: 'email' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Payment Date', dataIndex: 'date' },
    { title: 'Status', dataIndex: 'status', render: (value) => (
      <span className={`status-badge ${statusColors[value]}`}>{value}</span>
    ) },
    { title: 'Action', dataIndex: 'action', render: (_, row) => (
      <button className="action-btn view" onClick={() => handleViewTransaction(row)}>👁 View/Process</button>
    ) },
  ];

  const planColumns = [
    { title: 'Transaction ID', dataIndex: 'id' },
    { title: 'Package name', dataIndex: 'package' },
    { title: 'Describe', dataIndex: 'describe' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Duration', dataIndex: 'duration' },
    { title: 'Status', dataIndex: 'status', render: (value) => (
      <span className={`status-badge ${statusColors[value]}`}>{value}</span>
    ) },
    { title: 'Action', dataIndex: 'action', render: (_, row) => (
      <>
        <button className="action-btn edit">✏️ Edit</button>
        <button 
          className="action-btn deactivate"
          onClick={() => handlePlanStatusUpdate(row.id, row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
        >
          {row.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </button>
      </>
    ) },
  ];

  return (
    <div className="membership-payment-page">
      <h2>Membership & Payment</h2>
      <div className="summary-cards-row">
        {summary.map((item, idx) => (
          <div className="summary-card" key={idx}>
            <div className="summary-label">{item.label}</div>
            <div className="summary-center">
              <span className="summary-icon-circle">{item.icon}</span>
              <div className="summary-value">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="tabs-row">
        <div
          className={`tab${activeTab === 'history' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Payment History
        </div>
        <div
          className={`tab${activeTab === 'plan' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          Payment Plan Management
        </div>
      </div>
      <SearchFilterRow
        filters={activeTab === 'history' ? paymentFilterConfig : planFilterConfig}
        onFilterChange={handleFilterChange}
      />
      <div className="payment-table-wrapper">
        <ReusableTable
          columns={activeTab === 'history' ? paymentColumns : planColumns}
          data={activeTab === 'history' ? payments : plans}
          loading={loading}
        />
      </div>

      <Modal
        title={selectedTransaction ? `Transaction Details: ${selectedTransaction.id}` : 'Transaction Details'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedTransaction && (
          <>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Payment ID">{selectedTransaction.id}</Descriptions.Item>
              <Descriptions.Item label="User ID">{selectedTransaction.userId}</Descriptions.Item>
              <Descriptions.Item label="Plan Name">{selectedTransaction.package}</Descriptions.Item>
              <Descriptions.Item label="Amount">{selectedTransaction.amount}</Descriptions.Item>
              <Descriptions.Item label="Payment Date">{selectedTransaction.date}</Descriptions.Item>
              <Descriptions.Item label="Current Status">
                <Tag color={
                  selectedTransaction.status === 'COMPLETED' ? 'success' :
                  selectedTransaction.status === 'PENDING' ? 'warning' :
                  selectedTransaction.status === 'FAIL' ? 'error' : 'default'
                }>
                  {selectedTransaction.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Actions</Divider>

            <Form
              form={form}
              onFinish={handleStatusUpdate}
              layout="vertical"
            >
              <Form.Item
                name="status"
                label="Update Transaction Status"
                rules={[{ required: true, message: 'Please select a status' }]}
              >
                <Select>
                  <Select.Option value="COMPLETED">Completed</Select.Option>
                  <Select.Option value="PENDING">Pending</Select.Option>
                  <Select.Option value="FAIL">Failed</Select.Option>
                  <Select.Option value="REFUNDED">Refunded</Select.Option>
                </Select>
              </Form.Item>

              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                {selectedTransaction.status === 'PENDING' && (
                  <Button type="primary" ghost>
                    Verify Payment
                  </Button>
                )}
                {(selectedTransaction.status === 'COMPLETED' || selectedTransaction.status === 'PENDING') && (
                  <Button danger onClick={handleRefund}>
                    Handle Refund
                  </Button>
                )}
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save Status Change
                </Button>
              </Space>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MembershipPayment; 