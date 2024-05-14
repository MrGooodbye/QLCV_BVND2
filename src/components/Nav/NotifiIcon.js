import React, { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from '../../context/UserContext';
//mui
import { Box } from "@mui/material";
import moment from "moment";
//notifi icon
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
//notifi icon bottom app bar
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
//css
import './SCSS/NotifiIcon.scss';
//some icon
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskIcon from '@mui/icons-material/Task';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
//api
import { getTotalNotification } from "../../services/userService";
import { getProposeReceiveNotification, updateProposeStateSeen, } from "../../services/proposeService";
import { getHandOverNotification, updateHandOverStateSeen } from "../../services/handoverService";
import { getTaskReceiveNotification, updateTaskStateSeen } from "../../services/taskService";
import { getDisscussReceiveNotification, updateDiscussStateSeen } from "../../services/discussService";
//cdn
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
</style>

function NotifiIcon() {
  const { user } = useContext(UserContext);

  const [dataNotification, setDataNotification] = useState({});
  const [totalNotificationEach, setTotalNotification] = useState({});
  const [notificationType, setNotificationType] = useState("UNSET");
  const [showNotifiIconBottom, setShowNotifiIconBottom] = useState(false);
  const [getData, checkGetData] = useState(false);
  const [doSomething, setDoSomething] = useState(false);
  //config real time state
  const [listNotificationPrev, setListNotificationPrev] = useState(null);
  const [realTimeNotification, setRealTimeNotification] = useState(false);

  //config detect ref
  const menuRef = useRef();

  //config moment render
  moment.updateLocale("vi", {
    relativeTime: {
      d: "1 ngày",
    },
  });

  const clickToShowNotifiIconBottom = () => {
    if (showNotifiIconBottom === false) {
      setShowNotifiIconBottom(true);
      setNotificationType("PROPOSE");
    } else {
      setShowNotifiIconBottom(false);
      setNotificationType("UNSET");
    }
  };

  const getTotalNotificationFunc = async () => {
    let listTotal = await getTotalNotification();
    setTotalNotification(listTotal);
  }

  const getProposeReceiveNotificationFunc = async () => {
    let listProposeNotSeen = await getProposeReceiveNotification();
    setDataNotification(listProposeNotSeen);
    checkGetData(true);
    setDoSomething(false);
  };

  const getHandOverNotificationFunc = async () => {
    let listHandOverNotSeen = await getHandOverNotification();
    setDataNotification(listHandOverNotSeen);
    checkGetData(true);
    setDoSomething(false);
  };

  const getTaskNotificationFunc = async () => {
    let listTask = await getTaskReceiveNotification();
    setDataNotification(listTask);
    checkGetData(true);
    setDoSomething(false);
  }

  const getDiscussNotificationFunc = async () => {
    let listDiscuss = await getDisscussReceiveNotification();
    setDataNotification(listDiscuss);
    checkGetData(true);
    setDoSomething(false);
  }

  const updateStateProposeSeen = async (proposeId) => {
    let response = await updateProposeStateSeen(proposeId);
    if (response === 200) {
      setDoSomething(true);
    }
  };

  const updateStateHandoverSeen = async (handoverId) => {
    let response = await updateHandOverStateSeen(handoverId);
    if (response === 200) {
      setDoSomething(true);
    }
  }

  const updateTaskSeen = async (taskId) => {
    let response = await updateTaskStateSeen(taskId);
    if (response === 200) {
      setDoSomething(true);
    }
  }

  const updateDiscussSeen = async (taskId) => {
    let response = await updateDiscussStateSeen(taskId);
    if (response === 200) {
      setDoSomething(true);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setShowNotifiIconBottom(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    if (notificationType === "PROPOSE") {
      getTotalNotificationFunc();
      getProposeReceiveNotificationFunc();
    } else if (notificationType === "HANDOVER") {
      getTotalNotificationFunc();
      getHandOverNotificationFunc();
    } else if (notificationType === "TASK") {
      getTotalNotificationFunc();
      getTaskNotificationFunc();
    } else if (notificationType === "DISCUSS") {
      getTotalNotificationFunc();
      getDiscussNotificationFunc();
    }
  }, [notificationType, doSomething]);

  useEffect(() => {
    getTotalNotificationFunc();
  }, [])

  return (
    <>
      <Box className="notifiicon" ref={menuRef}>
        <div className="notifiicon-header">
          <Box>
            <IconButton size="large" style={{ color: "white" }} onClick={() => clickToShowNotifiIconBottom()} className={showNotifiIconBottom ? "active" : ""}>
              <Badge badgeContent={totalNotificationEach.totalNumber} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </div>

        {/* ẩn, hiện bottom của icon */}
        {showNotifiIconBottom ?
          <div className='notifiicon-bottom'>
            <div id="notifiicon-bottom-box" style={getData ? null : { overflowY: 'hidden' }}>
              <Typography variant="h5" className="py-2 text-dark" sx={{ fontFamily: "Inter, sans-serif", fontWeight: "bolder", fontSize: "24.5px", marginLeft: "0.75rem", }}>Thông báo</Typography>
              <Stack direction="row" sx={{ ml: 1.2, mt: 0.3 }} spacing={1}>
                {/* spacing dùng để giãn cách giữa các chip */} {/* hiện thông tổng số thông báo */}
                <Badge badgeContent={totalNotificationEach.numberDocIn} color="primary">
                  <Chip color={notificationType === "PROPOSE" ? "secondary" : "default"} variant={notificationType === "PROPOSE" ? "filled" : "outlined"} label="Đề xuất"
                    className={notificationType === "PROPOSE" ? "active-type-chip" : ""} onClick={() => [setNotificationType("PROPOSE"), notificationType === "PROPOSE" ? checkGetData(true) : checkGetData(false)]} />
                </Badge>
                <Badge badgeContent={totalNotificationEach.numberDocSend} color="primary">
                  <Chip color={notificationType === "HANDOVER" ? "secondary" : "default"} variant={notificationType === "HANDOVER" ? "filled" : "outlined"} label="Bàn giao"
                    className={notificationType === "HANDOVER" ? "active-type-chip" : ""} onClick={() => [setNotificationType("HANDOVER"), notificationType === "HANDOVER" ? checkGetData(true) : checkGetData(false)]} />
                </Badge>
                <Badge badgeContent={totalNotificationEach.numberTask} color="primary">
                  <Chip color={notificationType === "TASK" ? "secondary" : "default"} variant={notificationType === "TASK" ? "filled" : "outlined"} label="Công việc"
                    className={notificationType === "TASK" ? "active-type-chip" : ""} onClick={() => [setNotificationType("TASK"), notificationType === "TASK" ? checkGetData(true) : checkGetData(false)]} />
                </Badge>
                <Badge badgeContent={totalNotificationEach.numberDiscuss} color="primary">
                  <Chip color={notificationType === "DISCUSS" ? "secondary" : "default"} variant={notificationType === "DISCUSS" ? "filled" : "outlined"} label="Thảo luận"
                    className={notificationType === "DISCUSS" ? "active-type-chip" : ""} onClick={() => [setNotificationType("DISCUSS"), notificationType === "DISCUSS" ? checkGetData(true) : checkGetData(false)]} />
                </Badge>
              </Stack >
              {/* ẩn hiện Skeleton */}
              {getData ?
                <>
                  <List sx={{ pb: "0px", pl: "0px" }}>

                    {(() => {
                      //bắt đầu lặp tùy theo loại
                      if (dataNotification.hasOwnProperty('documentIncomming')) {
                        if (dataNotification.documentIncomming.length !== 0) {
                          return (
                            Object.entries(dataNotification.documentIncomming).map(([itemKey, itemValue]) => {
                              return (
                                <ListItem button alignItems="flex-start" onClick={() => updateStateProposeSeen(itemValue.document_Incomming_Id)} key={itemKey}>
                                  <ListItemAvatar><Avatar alt="Profile Picture" sx={{ bgcolor: 'rgb(160, 166, 255)' }}><TipsAndUpdatesIcon /></Avatar></ListItemAvatar>
                                  <ListItemText
                                    sx={{ margin: "0px" }}
                                    primary={
                                      <>
                                        <Typography
                                          sx={{ display: "inline", fontSize: "1rem", color: "rgb(252, 95, 106)", fontWeight: "600" }}>
                                          {(() => {
                                            if (user.account.userId === user.account.departmentHead && user.account.departmentType === 2) {
                                              //trưởng phòng chức năng gửi qua phòng chức năng khác
                                              if (itemValue.departmentSend_Name === user.account.departmentName && itemValue.document_Incomming_State === 3) {
                                                return null
                                              }
                                              //các nhân viên trong phòng chức năng gửi đến trưởng phòng
                                              else if (itemValue.departmentSend_Name === null) {
                                                return (`Nhân viên ${itemValue.document_Incomming_UserSend_FullName}`)
                                              }
                                              //các khoa phòng khác gửi đến
                                              else if (itemValue.departmentSend_Name !== null) {
                                                return (itemValue.departmentSend_Name)
                                              }
                                            }
                                            else if (user.account.userId === user.account.departmentHead && user.account.departmentType === 3) {
                                              if (itemValue.departmentSend_Name === null) {
                                                return (`Nhân viên ${itemValue.document_Incomming_UserSend_FullName}`)
                                              }
                                              else if (itemValue.departmentSend_Name === user.account.departmentName && itemValue.document_Incomming_State === 3) {
                                                return null
                                              }
                                            } else {
                                              return null
                                            }
                                          })()}
                                        </Typography>
                                      </>}
                                    secondary={
                                      <>
                                        <span className="message-notifi" style={{ fontSize: "16px", color: "rgb(5, 5, 5)", fontFamily: "Arimo, sans-serif" }}>
                                          {(() => {
                                            if (itemValue.document_Incomming_State === 0) {
                                              return (<>Bạn nhận được đề xuất với tiêu đề: <span className="result-notification-title">{`${itemValue.document_Incomming_Title}`}</span></>);
                                            }
                                            else if (itemValue.document_Incomming_State === 1) {
                                              return (<>Đề xuất <span className="result-notification-title">{`"${itemValue.document_Incomming_Title}"`}</span> đã bị từ chối</>);
                                            }
                                            else if (itemValue.document_Incomming_State === 2) {
                                              return (<>Đề xuất <span className="result-notification-title">{`"${itemValue.document_Incomming_Title}"`}</span> đã bị trả về để chỉnh sửa</>);
                                            }
                                            else if (itemValue.document_Incomming_State === 3) {
                                              return (<>Đề xuất <span className="result-notification-title">{`"${itemValue.document_Incomming_Title}"`}</span> đã được duyệt</>);
                                            }
                                            else if (itemValue.document_Incomming_State === 4) {
                                              return (<>Đề xuất <span className="result-notification-title">{`"${itemValue.document_Incomming_Title}"`}</span> đã được chuyển lên</>);
                                            }
                                            else {
                                              return (<>Đề xuất <span className="result-notification-title">{`"${itemValue.document_Incomming_Title}"`}</span> đã được xử lý</>);
                                            }
                                          })()}
                                        </span>
                                        <span style={{ fontSize: "14px", color: "rgb(8, 102, 255)", fontFamily: "Arimo, sans-serif", lineHeight: '1.7' }}>
                                          {itemValue.document_Incomming_State === 0 ?
                                            moment(itemValue.document_Incomming_Time).startOf().fromNow()
                                            :
                                            moment(itemValue.document_Incomming_TimeUpdate).startOf().fromNow()
                                          }
                                        </span>
                                      </>
                                    }
                                  />
                                </ListItem>
                              )
                            })
                          )
                        } else {
                          return (
                            <Box className='mr-1 center-screen'>
                              <NotificationsIcon sx={{ height: 70, width: 70 }} style={{ display: 'block', margin: 'auto', color: 'slategray' }} />
                              <Typography sx={{ color: "rgb(176, 179, 184", fontFamily: "Arimo, sans-serif" }}>Bạn không có thông báo nào, hãy quay lại sau.</Typography>
                            </Box>
                          )
                        }
                      }

                      else if (dataNotification.hasOwnProperty('documentSend')) {
                        if (dataNotification.documentSend.length !== 0) {
                          return (
                            Object.entries(dataNotification.documentSend).map(([itemKey, itemValue]) => {
                              return (
                                <ListItem button alignItems="flex-start" onClick={() => updateStateHandoverSeen(itemValue.document_Send_Id)} key={itemKey}>
                                  <ListItemAvatar><Avatar alt="Profile Picture" sx={{ bgcolor: 'rgb(84, 160, 191)' }} ><AssignmentIcon /></Avatar></ListItemAvatar>
                                  <ListItemText
                                    sx={{ marginTop: "0px" }}
                                    primary={
                                      <>
                                        <Typography
                                          sx={{ display: "inline", fontSize: "1rem", color: "rgb(252, 95, 106)", fontWeight: "600" }}>
                                          {itemValue.department_Name_Receive}
                                        </Typography>
                                      </>}
                                    secondary={
                                      <>
                                        <span className="message-notifi" style={{ fontSize: "15.5px", color: "rgb(5, 5, 5)", fontFamily: "Arimo, sans-serif", }}>
                                          Bạn nhận được văn bản với tiêu đề <span className="result-notification-title">{`${itemValue.document_Send_Title}`}</span>
                                        </span>
                                        <span style={{ fontSize: "13.5px", color: "rgb(8, 102, 255)", fontFamily: "Arimo, sans-serif", pt: 0.15, lineHeight: '1.54' }}>
                                          {moment(itemValue.document_Send_Time).startOf().fromNow()}
                                        </span>
                                      </>
                                    }
                                  />
                                </ListItem>
                              )
                            })
                          )
                        } else {
                          return (
                            <Box className='mr-1 center-screen'>
                              <NotificationsIcon sx={{ height: 70, width: 70 }} style={{ display: 'block', margin: 'auto', color: 'slategray' }} />
                              <Typography sx={{ color: "rgb(176, 179, 184", fontFamily: "Arimo, sans-serif" }}>Bạn không có thông báo nào, hãy quay lại sau.</Typography>
                            </Box>
                          )
                        }
                      }

                      else if (dataNotification.hasOwnProperty('task')) {
                        if (dataNotification.task.length !== 0) {
                          return (
                            Object.entries(dataNotification.task).map(([itemKey, itemValue]) => {
                              return (
                                <ListItem button alignItems="flex-start" onClick={() => updateTaskSeen(itemValue.task_Id)} key={itemKey}>
                                  <ListItemAvatar><Avatar alt="Profile Picture" sx={{ bgcolor: 'rgb(255, 71, 101)' }} ><TaskIcon /></Avatar></ListItemAvatar>
                                  <ListItemText
                                    sx={{ marginTop: "0px" }}
                                    // primary={
                                    //   <>
                                    //     <Typography
                                    //       sx={{ display: "inline", fontSize: "1.1rem", color: "#000", }}>
                                    //       {itemValue.userSend_FullName}
                                    //     </Typography>
                                    //   </>}
                                    secondary={
                                      <>
                                        <span className="message-notifi" style={{ fontSize: "15.5px", color: "rgb(5, 5, 5)", fontFamily: "Arimo, sans-serif", }}>
                                          Bạn nhận được công việc với tiêu đề <span className="result-notification-title">{`${itemValue.task_Title}`}</span>
                                        </span>
                                        <span style={{ fontSize: "13.5px", color: "rgb(8, 102, 255)", fontFamily: "Arimo, sans-serif", pt: 0.15, lineHeight: '1.54' }}>
                                          {moment(itemValue.task_DateSend).startOf().fromNow()}
                                        </span>
                                      </>
                                    }
                                  />
                                </ListItem>
                              )
                            })
                          )
                        } else {
                          return (
                            <Box className='mr-1 center-screen'>
                              <NotificationsIcon sx={{ height: 70, width: 70 }} style={{ display: 'block', margin: 'auto', color: 'slategray' }} />
                              <Typography sx={{ color: "rgb(176, 179, 184", fontFamily: "Arimo, sans-serif" }}>Bạn không có thông báo nào, hãy quay lại sau.</Typography>
                            </Box>
                          )
                        }
                      }

                      else {
                        if (dataNotification.discuss.length !== 0) {
                          return (
                            Object.entries(dataNotification.discuss).map(([itemKey, itemValue]) => {
                              return (
                                <ListItem button alignItems="flex-start" onClick={() => updateDiscussSeen(itemValue.discuss_Task)} key={itemKey}>
                                  <ListItemAvatar><Avatar alt="Profile Picture" sx={{ bgcolor: 'rgb(40, 193, 112)' }} ><ChatBubbleIcon /></Avatar></ListItemAvatar>
                                  <ListItemText
                                    sx={{ marginTop: "0px" }}
                                    secondary={
                                      <>
                                        <span className="message-notifi" style={{ fontSize: "15.5px", color: "rgb(5, 5, 5)", fontFamily: "Arimo, sans-serif", }}>
                                          <span className="result-notification-title" style={{ fontSize: "15.5px", color: "rgb(5, 5, 5)", fontFamily: "Arimo, sans-serif", }}>
                                            {`${itemValue.userSend_Fullname} `}
                                          </span>
                                          đã bình luận về một công việc
                                        </span>
                                        <span style={{ fontSize: "13.5px", color: "rgb(8, 102, 255)", fontFamily: "Arimo, sans-serif", pt: 0.15, lineHeight: '1.54' }}>
                                          {moment(itemValue.discuss_Time).startOf().fromNow()}
                                        </span>
                                      </>
                                    }
                                  />
                                </ListItem>
                              )
                            })
                          )
                        } else {
                          return (
                            <Box className='mr-1 center-screen'>
                              <NotificationsIcon sx={{ height: 70, width: 70 }} style={{ display: 'block', margin: 'auto', color: 'slategray' }} />
                              <Typography sx={{ color: "rgb(176, 179, 184", fontFamily: "Arimo, sans-serif" }}>Bạn không có thông báo nào, hãy quay lại sau.</Typography>
                            </Box>
                          )
                        }
                      }
                    })()}

                  </List>
                </>
                :
                <>
                  <Stack spacing={2.2} sx={{ pl: "4px", my: 1.5 }} id="skeleton">
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={260} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={260} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={220} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={174} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={260} height={16} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={260} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={130} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={220} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={174} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={174} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={260} height={15} />
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>
                      <Box sx={{ marginRight: '11px' }}>
                        <Skeleton variant="circular" width={56} height={56} />
                      </Box>
                      <Box>
                        <Skeleton variant="rounded" width={130} height={15} />
                      </Box>
                    </Box>
                  </Stack>
                </>
              }
            </div>
          </div>
          :
          null
        }
      </Box>
    </>
  );
}

export default NotifiIcon;
