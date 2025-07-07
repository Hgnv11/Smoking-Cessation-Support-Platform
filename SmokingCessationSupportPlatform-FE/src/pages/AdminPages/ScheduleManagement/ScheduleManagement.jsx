import React, { useState, useEffect, useCallback } from "react";
import { message, Row, Col, Space, Divider, Card } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AdminLayout from "../../../components/layout/AdminLayout.jsx";
import api from "../../../config/axios.js";

// Import components
import ScheduleControlPanel from "./ScheduleControlPanel";
import ScheduleTable from "./ScheduleTable";
import BatchCreateSlotsModal from "./BatchCreateSlotsModal";
import EditSlotModal from "./EditSlotModal";

const ScheduleManagement = () => {
  // State management
  const [viewMode, setViewMode] = useState("month");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mentorOptions, setMentorOptions] = useState([]);

  // Modal states
  const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);

  // Fetch mentor list from API
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await api.get("/admin/mentors");
        // Map API response to mentorOptions format
        setMentorOptions(
          (res.data || []).map((mentor) => ({
            email: mentor.email,
            name: mentor.fullName || mentor.profileName || mentor.email,
            specialization: mentor.note || "",
            avatarUrl: mentor.avatarUrl || "",
            ...mentor,
          }))
        );
      } catch {
        message.error("Failed to load mentors");
      }
    };
    fetchMentors();
  }, []);

  // Load initial data
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockSchedules = [
        {
          id: "1",
          date: "2025-07-06",
          time: "09:00 AM",
          slotNumber: 1,
          slotLabel: "Slot 1",
          mentorEmail: "sarah.j@example.com",
          mentorName: "Dr. Sarah Johnson",
          status: "available",
          description: "Morning consultation slot",
        },
        {
          id: "2",
          date: "2025-07-06",
          time: "11:00 AM",
          slotNumber: 2,
          slotLabel: "Slot 2",
          mentorEmail: "sarah.j@example.com",
          mentorName: "Dr. Sarah Johnson",
          status: "booked",
          clientName: "John Doe",
          description: "Consultation for smoking cessation",
        },
        {
          id: "3",
          date: "2025-07-07",
          time: "02:00 PM",
          slotNumber: 3,
          slotLabel: "Slot 3",
          mentorEmail: "mark.w@example.com",
          mentorName: "Dr. Mark Williams",
          status: "completed",
          clientName: "Jane Smith",
          description: "Follow-up session",
        },
        {
          id: "4",
          date: "2025-07-08",
          time: "04:00 PM",
          slotNumber: 4,
          slotLabel: "Slot 4",
          mentorEmail: "lisa.t@example.com",
          mentorName: "Lisa Thompson",
          status: "cancelled",
          description: "Cancelled by client",
        },
      ];

      // Filter by mentor if selected
      const filteredSchedules = selectedMentor
        ? mockSchedules.filter(
            (schedule) => schedule.mentorEmail === selectedMentor
          )
        : mockSchedules;

      setSchedules(filteredSchedules);
    } catch (error) {
      message.error("Failed to fetch schedule data");
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMentor]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Handler for batch slot creation - NOW WITH REAL API CALLS
  const handleBatchCreateSlots = async (slots) => {
    try {
      setLoading(true);

      // Process slots sequentially to stop on first error
      const createdSlots = [];
      let hasError = false;
      let errorMessage = "";

      for (let i = 0; i < slots.length; i++) {
        const slotData = slots[i];

        try {
          const response = await api.post(
            `admin/consultation-slots?mentorEmail=${encodeURIComponent(
              slotData.mentorEmail
            )}&slotNumber=${slotData.slotNumber}&slotDate=${slotData.slotDate}`
          );

          // If successful, add to created slots
          createdSlots.push({
            data: response.data,
            slotData: slotData,
          });
        } catch (error) {
          if (error.response && error.response.status === 500) {
            hasError = true;
            errorMessage = "Slot already exists for this coach";
            break; // Stop processing remaining slots
          } else {
            hasError = true;
            errorMessage = `Failed to create slot: ${error.message}`;
            break; // Stop processing remaining slots
          }
        }
      }

      // If there's an error, show error message and don't create any slots
      if (hasError) {
        message.error(errorMessage);
        return; // Exit early, don't close modal
      }

      // If all slots created successfully
      if (createdSlots.length > 0) {
        message.success(`Successfully created ${createdSlots.length} slot(s)`);

        // Add successful slots to schedules
        const newSlots = createdSlots.map((result, index) => ({
          id: `batch-${Date.now()}-${index}`,
          date: result.slotData.slotDate,
          time: getSlotTime(result.slotData.slotNumber),
          slotNumber: result.slotData.slotNumber,
          slotLabel: `Slot ${result.slotData.slotNumber}`,
          mentorEmail: result.slotData.mentorEmail,
          mentorName:
            mentorOptions.find((m) => m.email === result.slotData.mentorEmail)
              ?.name || "Unknown",
          status: "available",
          description: "Batch created consultation slot",
        }));

        setSchedules((prev) => [...prev, ...newSlots]);

        // Close modal only if all slots were created successfully
        setIsBatchModalVisible(false);
      }
    } catch (error) {
      message.error("Failed to create consultation slots");
      console.error("Error creating slots:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get slot time based on slot number
  const getSlotTime = (slotNumber) => {
    const timeSlots = {
      1: "7:00 AM - 9:30 AM",
      2: "9:30 AM - 12:00 PM",
      3: "13:00 PM - 15:30 PM",
      4: "15:30 PM - 18:00 PM",
    };
    return timeSlots[slotNumber] || "";
  };

  // Handler for editing a slot
  const handleEditSlot = (slot) => {
    setCurrentSlot(slot);
    setIsEditModalVisible(true);
  };

  // Handler for saving edited slot
  const handleSaveSlot = async (updatedSlot) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (currentSlot) {
        // Update existing slot
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === currentSlot.id
              ? {
                  ...schedule,
                  ...updatedSlot,
                  mentorName:
                    mentorOptions.find(
                      (m) => m.email === updatedSlot.mentorEmail
                    )?.name || "Unknown",
                }
              : schedule
          )
        );
        message.success("Consultation slot updated successfully");
      } else {
        // Create new slot
        const newSlot = {
          id: `new-${Date.now()}`,
          ...updatedSlot,
          mentorName:
            mentorOptions.find((m) => m.email === updatedSlot.mentorEmail)
              ?.name || "Unknown",
        };
        setSchedules((prev) => [...prev, newSlot]);
        message.success("Consultation slot created successfully");
      }

      setIsEditModalVisible(false);
      setCurrentSlot(null);
    } catch (error) {
      message.error("Failed to save consultation slot");
      console.error("Error saving slot:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a slot
  const handleDeleteSlot = async (slotId) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSchedules((prev) => prev.filter((schedule) => schedule.id !== slotId));
      message.success("Consultation slot deleted successfully");
    } catch (error) {
      message.error("Failed to delete consultation slot");
      console.error("Error deleting slot:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handler for viewing slot details
  const handleViewSlot = (slot) => {
    console.log("Viewing slot details:", slot);
  };

  // Handler for thêm slot nhanh qua API
  const handleAddSlotQuick = async ({ coach, date }) => {
    const slotDate = date.format("YYYY-MM-DD");
    // Lấy các slot đã có trong ngày đó
    const slotsInDay = schedules.filter(
      (s) => s.mentorEmail === coach.email && s.date === slotDate
    );
    // Tìm slotNumber còn trống (1-4)
    const usedNumbers = slotsInDay.map((s) => s.slotNumber);
    const nextSlotNumber = [1, 2, 3, 4].find((n) => !usedNumbers.includes(n));
    if (!nextSlotNumber) {
      message.warning("Đã đủ 4 slot cho ngày này!");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/admin/consultation-slots", null, {
        params: {
          mentorEmail: coach.email,
          slotNumber: nextSlotNumber,
          slotDate,
        },
      });
      // Thêm slot mới vào schedules (nếu response trả về slot mới)
      if (res.data) {
        setSchedules((prev) => [
          ...prev,
          {
            id: res.data.slotId,
            date: res.data.slotDate,
            time: "", // Nếu backend trả về time thì lấy, không thì để rỗng
            slotNumber: res.data.slotNumber,
            slotLabel: `Slot ${res.data.slotNumber}`,
            mentorEmail: res.data.mentor?.email || coach.email,
            mentorName: res.data.mentor?.fullName || coach.name,
            status: "available",
            description: "",
          },
        ]);
      }
      message.success("Tạo slot thành công!");
    } catch {
      message.error("Tạo slot thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Schedule Management" showBreadcrumb={false}>
      <div style={{ background: "#f7f8fa", minHeight: "100vh", padding: 0 }}>
        {/* Header */}
        <Card
          style={{
            borderRadius: 16,
            margin: "24px 0 0 0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
          bodyStyle={{ padding: 32, paddingBottom: 20 }}
        >
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col>
              <Space align="center">
                <CalendarOutlined style={{ fontSize: 32, color: "#3b82f6" }} />
                <div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#222",
                      marginBottom: 2,
                    }}
                  >
                    Schedule Management
                  </div>
                  <div style={{ fontSize: 15, color: "#64748b" }}>
                    Manage consultation schedules and mentor availability
                  </div>
                </div>
              </Space>
            </Col>
            <Col>
              <Space size={16}>
                <ScheduleControlPanel
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  currentDate={currentDate}
                  setCurrentDate={setCurrentDate}
                  selectedMentor={selectedMentor}
                  setSelectedMentor={setSelectedMentor}
                  mentorOptions={mentorOptions}
                  onBatchCreate={() => setIsBatchModalVisible(true)}
                  compact
                />
              </Space>
            </Col>
          </Row>
        </Card>

        <div style={{ maxWidth: 1400, margin: "32px auto", padding: "0 16px" }}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
            bodyStyle={{ padding: 32 }}
          >
            <ScheduleTable
              schedules={schedules}
              loading={loading}
              onEdit={handleEditSlot}
              onDelete={handleDeleteSlot}
              onView={handleViewSlot}
              viewMode={viewMode}
              mentorOptions={mentorOptions}
              currentDate={currentDate}
              onAddSlot={handleAddSlotQuick}
            />
          </Card>
        </div>

        {/* Modals */}
        <BatchCreateSlotsModal
          visible={isBatchModalVisible}
          onCancel={() => setIsBatchModalVisible(false)}
          onSubmit={handleBatchCreateSlots}
          mentorOptions={mentorOptions}
          loading={loading}
        />

        <EditSlotModal
          visible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setCurrentSlot(null);
          }}
          onSave={handleSaveSlot}
          initialValues={currentSlot}
          mentorOptions={mentorOptions}
        />
      </div>
    </AdminLayout>
  );
};

export default ScheduleManagement;
