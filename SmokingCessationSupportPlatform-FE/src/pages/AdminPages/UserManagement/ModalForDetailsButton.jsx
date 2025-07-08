import React from "react";
import { Modal, Tag, Row, Col, Card, Spin } from "antd";
import dayjs from "dayjs";
import styles from "./ModalForDetailsButton.module.css";

// Cải thiện function tính tuổi cho Customer
function getAgeFromBirthDate(smokingHistoryByDate) {
  if (!smokingHistoryByDate || typeof smokingHistoryByDate !== 'object') return "N/A";
  
  // Lấy key đầu tiên từ smokingHistoryByDate
  const firstKey = Object.keys(smokingHistoryByDate)[0];
  const user = smokingHistoryByDate[firstKey]?.[0]?.user;
  
  if (!user?.birthDate) return "N/A";
  
  try {
    const birth = new Date(user.birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return "N/A";
  }
}

// Function tính tuổi cho Admin/Coach từ userDetail
function getAgeFromUserDetail(userDetail) {
  if (!userDetail?.birthDate) return "N/A";
  
  try {
    const birth = new Date(userDetail.birthDate);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (
      now.getMonth() < birth.getMonth() ||
      (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return "N/A";
  }
}

// Function để tính số năm hút thuốc (reserved for future use)
// function getYearsSmoked(userDetail) {
//   if (!userDetail?.startDate) return "N/A";
//   
//   try {
//     const startDate = new Date(userDetail.startDate);
//     const now = new Date();
//     const years = now.getFullYear() - startDate.getFullYear();
//     return years > 0 ? years : "Less than 1";
//   } catch {
//     return "N/A";
//   }
// }

const ModalForDetailsButton = ({ open, onClose, selectedUser, userDetail, loadingDetail }) => {
  const isCustomer = selectedUser?.role === "Customer" || selectedUser?.role === "user";
  const isAdminOrCoach = selectedUser?.role === "Admin" || selectedUser?.role === "Coach";

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      className={styles.modalCustom}
    >
      <div className={styles.modalContent}>
        {loadingDetail ? (
          <div className={styles.loadingWrapper}><Spin size="large" /></div>
        ) : (
          <>
            {/* Header */}
            <h2 className={styles.title}>User Details</h2>
            <div className={styles.headerRow}>
              <div className={styles.avatar}>
                <span className="anticon anticon-user" />
              </div>
              <div>
                <div className={styles.userName}>{selectedUser?.name || "N/A"}</div>
                <div className={styles.userEmail}>{selectedUser?.email || "N/A"}</div>
                <div className={styles.userTags}>
                  <Tag color="blue">{selectedUser?.membership || "Free"}</Tag>
                  <Tag color={selectedUser?.role === "Customer" || selectedUser?.role === "user" ? "green" : 
                             selectedUser?.role === "Coach" ? "blue" : "purple"}>
                    {selectedUser?.role || "Customer"}
                  </Tag>
                  <Tag color={selectedUser?.status === "active" ? "green" : "red"}>
                    {selectedUser?.status === "active" ? "Active" : "Locked"}
                  </Tag>
                </div>
              </div>
            </div>
            <hr className={styles.hr} />

            {/* Account Information */}
            <div className={styles.sectionTitle}>
              <span className="anticon anticon-calendar" style={{ marginRight: 6 }} />
              Account Information
            </div>
            <div className={styles.infoBox}>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <span className={styles.label}>User ID:</span> 
                    <b>#{selectedUser?.id || "N/A"}</b>
                  </div>
                  <div>
                    <span className={styles.label}>Joined Date:</span> 
                    <b>
                      {selectedUser?.joinDate 
                        ? dayjs(selectedUser.joinDate).format("DD/MM/YYYY")
                        : "N/A"
                      }
                    </b>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <span className={styles.label}>Last Active:</span> 
                    <b>
                      {selectedUser?.lastActivity 
                        ? dayjs(selectedUser.lastActivity).format("DD/MM/YYYY")
                        : "N/A"
                      }
                    </b>
                  </div>
                  <div>
                    <span className={styles.label}>Role:</span> 
                    <Tag color={selectedUser?.role === "Customer" || selectedUser?.role === "user" ? "green" : 
                               selectedUser?.role === "Coach" ? "blue" : "purple"}>
                      {selectedUser?.role || "Customer"}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Personal Information */}
            <div className={styles.sectionTitle}>Personal Information</div>
            <div className={styles.infoBox}>
              <Row gutter={16}>
                <Col span={12}>
                  <div>
                    <span className={styles.label}>Full Name:</span> 
                    <b>{isAdminOrCoach ? userDetail?.fullName : selectedUser?.name || "N/A"}</b>
                  </div>
                  <div>
                    <span className={styles.label}>Profile Name:</span> 
                    <b>{isAdminOrCoach ? userDetail?.profileName : selectedUser?.profile || "N/A"}</b>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <span className={styles.label}>Age:</span> 
                    <b>
                      {isCustomer 
                        ? `${getAgeFromBirthDate(userDetail?.smokingHistoryByDate)} years old`
                        : `${getAgeFromUserDetail(userDetail)} years old`
                      }
                    </b>
                  </div>
                  <div>
                    <span className={styles.label}>Gender:</span> 
                    <b>{isAdminOrCoach ? userDetail?.gender || "N/A" : "N/A"}</b>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Contact Information - For Admin/Coach */}
            {isAdminOrCoach && (
              <>
                <div className={styles.sectionTitle}>Contact Information</div>
                <div className={styles.infoBox}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <span className={styles.label}>Email:</span> 
                        <b>{userDetail?.email || "N/A"}</b>
                      </div>
                      <div>
                        <span className={styles.label}>Phone:</span> 
                        <b>{userDetail?.phone || "Not provided"}</b>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <span className={styles.label}>Email Verified:</span> 
                        <Tag color={userDetail?.isVerified ? "green" : "red"}>
                          {userDetail?.isVerified ? "Verified" : "Not Verified"}
                        </Tag>
                      </div>
                      <div>
                        <span className={styles.label}>Account Status:</span> 
                        <Tag color={userDetail?.isBlock ? "red" : "green"}>
                          {userDetail?.isBlock ? "Blocked" : "Active"}
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* System Information */}
                <div className={styles.sectionTitle}>System Information</div>
                <div className={styles.infoBox}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <span className={styles.label}>Login Type:</span> 
                        <b>{userDetail?.typeLogin || "Standard"}</b>
                      </div>
                      <div>
                        <span className={styles.label}>Created At:</span> 
                        <b>
                          {userDetail?.createdAt 
                            ? dayjs(userDetail.createdAt).format("DD/MM/YYYY HH:mm")
                            : "N/A"
                          }
                        </b>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <span className={styles.label}>Last Updated:</span> 
                        <b>
                          {userDetail?.updatedAt 
                            ? dayjs(userDetail.updatedAt).format("DD/MM/YYYY HH:mm")
                            : "N/A"
                          }
                        </b>
                      </div>
                      <div>
                        <span className={styles.label}>Has Active:</span> 
                        <Tag color={userDetail?.hasActive ? "green" : "red"}>
                          {userDetail?.hasActive ? "Yes" : "No"}
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Notes */}
                {userDetail?.note && (
                  <>
                    <div className={styles.sectionTitle}>Notes</div>
                    <div className={styles.infoBox}>
                      <div className={styles.noteContent}>
                        {userDetail.note}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Customer Progress - Only for Customer */}
            {isCustomer && (
              <>
                <div className={styles.sectionTitle}>
                  <span className="anticon anticon-line-chart" style={{ marginRight: 6 }} />
                  Current Progress
                </div>
                <Row gutter={16} className={styles.progressRow}>
                  <Col span={8}>
                    <Card className={styles.progressCard} bodyStyle={{ padding: 12 }}>
                      <div className={styles.progressValueGreen}>
                        {userDetail?.daysSinceStart ?? 0}
                      </div>
                      <div className={styles.progressLabel}>Days Smoke-Free</div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className={styles.progressCardBlue} bodyStyle={{ padding: 12 }}>
                      <div className={styles.progressValueBlue}>
                        {userDetail?.cigarettesAvoided ?? 0}
                      </div>
                      <div className={styles.progressLabel}>Cigarettes Avoided</div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card className={styles.progressCard} bodyStyle={{ padding: 12 }}>
                      <div className={styles.progressValueMoney}>
                        ${userDetail?.moneySaved ?? 0}
                      </div>
                      <div className={styles.progressLabel}>Money Saved</div>
                    </Card>
                  </Col>
                </Row>

                {/* Smoking History */}
                <div className={styles.sectionTitle}>Smoking History</div>
                <div className={styles.infoBox}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div>
                        <span className={styles.label}>Target Days:</span> 
                        <b>{userDetail?.targetDays ?? "Not set"}</b>
                      </div>
                      <div>
                        <span className={styles.label}>Cigarettes per Day:</span> 
                        <b>{userDetail?.cigarettesPerDay ?? "N/A"}</b>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <span className={styles.label}>Pack Cost:</span> 
                        <b>${userDetail?.cigarettePackCost ?? "0.00"}</b>
                      </div>
                      <div>
                        <span className={styles.label}>Program Status:</span> 
                        <Tag color={userDetail?.status === "active" ? "blue" : "orange"}>
                          {userDetail?.status ?? "Unknown"}
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {/* For other roles */}
            {!isCustomer && !isAdminOrCoach && (
              <>
                <div className={styles.sectionTitle}>Additional Information</div>
                <div className={styles.infoBox}>
                  <div className={styles.noAdditionalData}>
                    <p>Limited information available for this user role.</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalForDetailsButton;
