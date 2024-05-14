import React, { useEffect, useState, useContext, useMemo } from 'react'
import _, { assign, cloneDeep, forEach, set, debounce } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import moment from 'moment';
import Dayjs from "dayjs";
import { v4 as uuidv4 } from 'uuid';
//function components
import CircularProgressWithBackdrop from '../../FunctionComponents/ProgressBar/CircularProgressWithBackdrop';
//bs5
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//mui theme
import Tooltip from '@mui/material/Tooltip';
import Typography from "@mui/material/Typography";
import ButtonMui from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Box from '@mui/material/Box';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Avatar from "@mui/material/Avatar";
import Divider from '@mui/material/Divider';
//mui icon
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import Person2Icon from '@mui/icons-material/Person2';
import CheckIcon from '@mui/icons-material/Check';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//css
import "../SCSS/DivineWork.scss";
//modal
import ModalAssignDivineWorkPublic from './ModalAssignDivineWorkPublic';
import ModalCompleteInfoDivineWork from './ModalCompleteInfoDivineWork';
//api
import { createSendDiscuss, assignDivineWork, getListTaskByDocSendId, getDocByDocId, getListDiscussByTaskId } from '../../../services/taskService';
//cdn
<style>
  @import url('https://www.w3schools.com/w3css/4/w3.css');
</style>


function ModalDivineWorkPublic(props) {
  const { user } = useContext(UserContext);

  const dataModalDivineWorkPublicDefault = {
    documentSend: {
      document_Send_Id: '',
      document_Send_Title: '',
      document_Send_Content: '',
      document_Send_Time: '',
      document_Send_TimeStart: '',
      document_Send_Deadline: '',
      document_Send_UserSend: '',
      userSend_FullName: '',
      department_Name_Receive: '',
      catagory_Name: '',
      document_Send_Comment: '',
      document_Send_State: '',
      document_Send_TimeUpdate: '',
      document_Send_Percent: '',
    },
    fileIds: [],
    userIdReceive: ''
  }

  //config this modal
  const [dataModalDivineWorkPublic, setDataModalDivineWorkPublic] = useState(dataModalDivineWorkPublicDefault);
  const [doSomething, setDoSomething] = useState(false);

  //config divine work
  const [divineWork, setDivineWork] = useState(''); //1 divine work
  const [objDivineWork, setObjDivineWork] = useState({}); //1 obj divine work
  const [objDivineWorkEdit, setObjDivineWorkEdit] = useState(null); //1 obj divine work eidt dùng khi cập nhật thông tin của 1 task
  let [listDivineWork, setListDivineWork] = useState([]); //1 list chứa 1 đống obj divine work

  //config modal assign divine work public
  const [showModalAssignDivineWorkPublic, setShowModalAssignDivineWorkPublic] = useState(false);
  const [dataModalAssignDivineWorkPublic, setDataModalAssignDivineWorkPublic] = useState({});

  //config modal complete divine work
  const [showModalCompleteInfoDivineWork, setShowModalCompleteInfoDivineWork] = useState(false);
  const [dataModalCompleteInfoDivineWork, setDataModalCompleteInfoDivineWork] = useState({});

  //config backdrop when submit
  const [progress, setProgress] = useState(0);
  const [openBackdrop, setOpenBackdrop] = useState();

  //config discuss
  let [listDiscuss, setListDiscuss] = useState([]);

  let screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  const getExpireDateTime = (task_DateEnd) => {
    const expiration = moment(task_DateEnd);
    // get the difference between the moments
    const diff = expiration.diff(moment());
    //express as a duration
    const diffDuration = moment.duration(diff);
    return diffDuration;
  }

  const handleHideModal = () => {
    props.closeModalDivineWorkPublic(false);
  }

  const handlePressEnter = (event) => {
    if (event.which === 13 && event.code === "Enter") {
      createDivineWork();
    }
  }

  //tạo công việc
  const createDivineWork = () => {
    //create new obj devine work
    let _objDivineWork = _.cloneDeep(objDivineWork);
    _objDivineWork = {
      document_Send_Id: props.taskSendId,
      task_Id: `task-clone ${uuidv4()}`,
      task_Title: divineWork,
      task_Content: '',
      task_DateSend: moment(),
      task_DateStart: '',
      task_DateEnd: '',
      task_Catagory_Id: '',
      task_Catagory_Name: '',
      userReceive_Id: '',
      userReceive_FullName: '',
      userSend_Id: user.account.userId,
      userSend_FullName: user.account.fullName,
      task_file: '',
      fileIds: dataModalDivineWorkPublic.fileIds,
      task_Clone: true
    }
    setObjDivineWork(_objDivineWork);

    //push obj to listDivineWork array
    let _listDivineWork = _.cloneDeep(listDivineWork);
    _listDivineWork.unshift(_objDivineWork);

    setListDivineWork(_listDivineWork);
    setDivineWork('');
  }

  const updateDivineWork = () => {
    let check = _.isEqual(dataModalAssignDivineWorkPublic, objDivineWorkEdit);
    if (check === true) {

    }
    else {
      const result = listDivineWork.map((item) => {
        return item.task_Id === objDivineWorkEdit.task_Id ? objDivineWorkEdit : item;
      });

      let _listDivineWork = _.cloneDeep(listDivineWork);
      _listDivineWork = result;
      setListDivineWork(_listDivineWork);
    }
  }

  const deleteDivineWork = (task_Id_Value, event) => {
    event.stopPropagation();
    let _listDivineWork = _.cloneDeep(listDivineWork);
    _listDivineWork = _.filter(_listDivineWork, function (currentObject) {
      return currentObject.task_Id !== task_Id_Value;
    })
    setListDivineWork(_listDivineWork);
  }

  //mở modal hoàn thành công việc
  const completeInfoDivineWork = (e, itemValue) => {
    e.stopPropagation();
    console.log(itemValue);
  }

  //mở modal giao việc
  const assignInfoDivineWork = (e, itemValue) => {
    e.stopPropagation();
    setDataModalAssignDivineWorkPublic(itemValue)
    setShowModalAssignDivineWorkPublic(true);
  }

  //mở modal giao việc với gọi api đã lưu id công việc
  const editInfoDivineWork = (e, itemValue) => {
    e.stopPropagation();
    let taskId = itemValue.task_Id;

    console.log(itemValue);
  }

  //tạo giá trị tiến trình trong quá trình gửi
  const handleOnUploadProgress = (progressEvent) => {
    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setProgress(percentCompleted);
  }

  //hoàn thành công việc (docSend)
  const handleCompleteListDivineWork = () => {

  }

  //lưu công việc đã tạo
  const handleSaveListDivineWork = async () => {
    //tìm những obj có key clone là true
    let arrayToHandleDivineWork = _.filter(listDivineWork, (item) => item.task_Clone === true);

    let formArrayIdFileToKeep = new FormData();
    arrayToHandleDivineWork.forEach(work => {
      work.fileIds.forEach(file => {
        if (file.not_Check !== true) {
          formArrayIdFileToKeep.append('fileDocSends', file.file_Id);
        }
      })
      work.filesKeep = formArrayIdFileToKeep;
      formArrayIdFileToKeep = new FormData();
    })

    let formArrayFileToSend = new FormData();
    arrayToHandleDivineWork.forEach(work => {
      work.fileListState.forEach(file => {
        formArrayFileToSend.append('files', file);
      })
      work.filesSend = formArrayFileToSend;
      formArrayFileToSend = new FormData();
    })

    let formArrayFile = new FormData();

    arrayToHandleDivineWork.forEach(work => {
      for (let fileKeep of work.filesKeep.entries()) {
        formArrayFile.append(fileKeep[0], fileKeep[1]);
      }
      for (let fileSend of work.filesSend.entries()) {
        formArrayFile.append(fileSend[0], fileSend[1]);
      }
      work.fileArray = formArrayFile;
      formArrayFile = new FormData();
    })

    // arrayToHandleDivineWork.forEach(item => {
    //   const filesSendObject = item.fileArray;
    //   for (let pair of filesSendObject) {
    //     console.log(pair[0] + ', ' + pair[1]);
    //   }
    // })

    let count = 0;
    setOpenBackdrop(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2 * 1000));
      for (let item of arrayToHandleDivineWork) {
        let response = await assignDivineWork(item, handleOnUploadProgress);
        if (response === 200) {
          count++;
          console.log(count)
          if (count === arrayToHandleDivineWork.length) {
            await new Promise(resolve => setTimeout(resolve, 1 * 1000));
            toast.success('Lưu công việc thành công!');
            setDoSomething(true);
            setOpenBackdrop(false);
          }
        }
      }

    } catch (error) {
      console.log(error);
    }
  }

  //gửi bình luận
  const delayedHandleChange = debounce((taskId, value) => {
    const updatedList = listDiscuss.map(itemDiscuss => itemDiscuss.task_Id === taskId ? { ...itemDiscuss, task_DiscussContent: value } : itemDiscuss);
    setListDiscuss(updatedList);
  })

  const handleClickAccordion = (event, expanded, taskId) => {
    if (expanded === true) {
      // Lấy thẻ div cần cuộn
      let scrollableDiv = document.getElementById(`discuss ${taskId}`);

      // Đặt giá trị scrollTop để đưa thanh cuộn xuống cuối thẻ div
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }
  }

  const handleOnChangeDiscussContent = (taskId, value) => {
    delayedHandleChange(taskId, value)
  }

  const handleOnKeyDownEnter = (event, task_Id) => {
    if (event.which === 13 && event.code === "Enter") {
      event.preventDefault();
      handleSendDiscuss(task_Id);
    }
  }

  const handleSendDiscuss = async (task_Id) => {
    let _listDiscuss = _.cloneDeep(listDiscuss);
    let _listDiscussUpdated = _listDiscuss.filter(item => item.task_Id === task_Id);
    let _listDivineWorkSendDisucss = _listDiscussUpdated[0];
    let response = await createSendDiscuss(_listDivineWorkSendDisucss);
    if (response === 200) {
      handleGetListDicussAfterCreate(task_Id);
      let inputAreaByTaskId = document.getElementById(`input-area ${task_Id}`);
      const updatedList = listDiscuss.map(itemDiscuss => itemDiscuss.task_Id === task_Id ? { ...itemDiscuss, task_DiscussContent: '' } : itemDiscuss);
      setListDiscuss(updatedList);
      inputAreaByTaskId.textContent = '';
    }
  }

  //format dán text
  const pasteAsPlainText = (event) => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text)
  }

  //lấy danh sách bình luận bởi từng id công việc
  const handleGetListTaskByDocSendId = async (docSendId) => {
    let resultListDivineWork = await getListTaskByDocSendId(docSendId);
    let resultListDiscuss = []; //n list discuss
    let discussByTask; //1 list discuss

    if (resultListDivineWork.length !== 0) {
      //gọi n lần api discuss và dùng biến resultListDiscuss hứng bằng cách đẩy vào array
      for (let object of resultListDivineWork) {
        discussByTask = await getListDiscussByTaskId(object.task_Id);
        resultListDiscuss.push(discussByTask);
      }

      let resultListDivineWorkWithDiscuss = resultListDivineWork.map(task => {
        let resultListDiscussForTask = resultListDiscuss.find(discuss => discuss.some(discuss => discuss.discuss_Task === task.task_Id));
        return {
          ...task,
          task_Discuss: resultListDiscussForTask || []
        };
      });

      setListDivineWork(resultListDivineWorkWithDiscuss);

      let findTaskId = resultListDivineWorkWithDiscuss.map(task => ({ "task_Id": task.task_Id, "task_DiscussContent": '' }));
      setListDiscuss(findTaskId);
    }
    else {
      setListDivineWork(resultListDivineWork);
    }
  }

  const handleGetListDicussAfterCreate = async (taskId) => {
    let _listDivineWork = _.cloneDeep(listDivineWork);
    let listDiscussByTaskId = await getListDiscussByTaskId(taskId);

    let lastListDiscussByTaskId = listDiscussByTaskId[listDiscussByTaskId.length - 1];

    let foundTask = _listDivineWork.find(task => task.task_Id === lastListDiscussByTaskId.discuss_Task);
    if (foundTask) {
      foundTask.task_Discuss.push(lastListDiscussByTaskId);
    }
    setListDivineWork(_listDivineWork);

    // Lấy thẻ div cần cuộn
    let scrollableDiv = document.getElementById(`discuss ${taskId}`);

    // Đặt giá trị scrollTop để đưa thanh cuộn xuống cuối thẻ div
    scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
  }

  const handleGetDetailsTaskByDocSendId = async (docSendId) => {
    let resultDetailsTask = await getDocByDocId(docSendId);
    setDataModalDivineWorkPublic(resultDetailsTask);
  }

  useEffect(() => {
    if (props.taskSendId.length !== 0) {
      handleGetListTaskByDocSendId(props.taskSendId);
      handleGetDetailsTaskByDocSendId(props.taskSendId);
    }

    if (doSomething === true) {
      handleGetListTaskByDocSendId(props.taskSendId);
      handleGetDetailsTaskByDocSendId(props.taskSendId);
      setDoSomething(false);
    }
  }, [props.taskSendId, doSomething])

  useEffect(() => {
    if (objDivineWorkEdit !== null) {
      updateDivineWork();
    }
  }, [objDivineWorkEdit])

  const memoizedData = useMemo(() => listDivineWork, [listDivineWork]);

  return (
    <>
      <CircularProgressWithBackdrop open={openBackdrop} setOpen={setOpenBackdrop} progressValue={progress} setProgressValue={setProgress} />
      <Modal size='md' className='mt-4' show={props.activeModalDivineWorkPublic} onHide={() => handleHideModal()} backdrop={'static'} keyboard={false} >
        <Modal.Header closeButton>
          <Modal.Title style={{ width: '100%' }}>
            <div className='text-primary text-uppercase d-flex justify-content-center'>{`${dataModalDivineWorkPublic.documentSend.document_Send_Title} 
              (${Dayjs(dataModalDivineWorkPublic.documentSend.document_Send_TimeStart).format('DD/MM/YYYY')} - 
              ${Dayjs(dataModalDivineWorkPublic.documentSend.document_Send_Deadline).format('DD/MM/YYYY')})`}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={screenWidth >= 1900 ? listDivineWork.length !== 0 ? listDivineWork.length >= 8 ? "responsive-screen-body-modal" : "" : "" : listDivineWork.length !== 0 ? listDivineWork.length >= 6 ? "responsive-screen-body-modal" : "" : ""}>
          <div className="col-xs-12">
            <div className='row d-flex justify-content-center'>
              <div className='row col-8 p-0'>
                <Form.Group>
                  <Form.Label >Thêm công việc</Form.Label>
                  <Stack direction="row" spacing={0.5}>
                    <Form.Control type="text" value={divineWork || ""} onChange={(e) => setDivineWork(e.target.value)} onKeyDown={(event) => handlePressEnter(event)} />
                    <IconButton color='primary' size="medium" onClick={() => createDivineWork()}><AddCircleIcon fontSize="inherit" sx={{ transform: 'Scale(1.4)' }} /></IconButton>
                  </Stack>
                </Form.Group>
              </div>
              <div className='list-task mt-2'>
                <div className='list-task-div'>
                  {listDivineWork.length !== 0 ?
                    <>
                      <Typography variant="h6" color='red' sx={{ mb: 0.8 }}>Danh sách công việc</Typography>
                      {Object.entries(memoizedData).map(([itemKey, itemValue]) => {
                        let expire = getExpireDateTime(itemValue.task_DateEnd)
                        return (
                          <Accordion key={`task-${itemValue.task_Id}`} className={`list-title ${itemKey > 0 ? 'mt-4' : ''}`} sx={{ wordBreak: 'break-all', boxShadow: 3 }}
                            onChange={itemValue.task_Person_Receive !== itemValue.task_Person_Send ?
                              itemValue.task_Discuss.length >= 5 ? (event, expanded) => handleClickAccordion(event, expanded, itemValue.task_Id) : null : null}>
                            <div className='list-parent-task p-1'>
                              <AccordionSummary>
                                <Typography className={`item child ${itemValue.task_Id} text-uppercase text-white fw-bolder col-7 px-0`} sx={{ fontSize: '17px' }}>
                                  {itemValue.task_Title}
                                </Typography>
                                <Typography className='col-4'>

                                </Typography>
                                <Box className='text-white d-flex flex-row col-1 justify-content-end p-0'>
                                  {itemValue.task_State === 5 ?
                                    <Tooltip title="Công việc đã hoàn thành">
                                      <CheckIcon className='mr-2' sx={{ width: '1.15em', height: '1.15em' }} onClick={(e) => completeInfoDivineWork(e, itemValue)} />
                                    </Tooltip>
                                    :
                                    null
                                  }
                                  <Tooltip title="Thông tin giao việc">
                                    <AssignmentIndIcon className='mr-2' sx={{ width: '1.15em', height: '1.15em' }} onClick={(e) => itemValue.userReceive_FullName === "" || itemValue.task_Clone === true ? assignInfoDivineWork(e, itemValue) : editInfoDivineWork(e, itemValue)} />
                                  </Tooltip>
                                  {itemValue.userReceive_FullName === "" || itemValue.task_Clone === true ?
                                    <Tooltip title="Xóa công việc">
                                      <DeleteIcon sx={{ width: '1.15em', height: '1.15em' }} onClick={(event) => deleteDivineWork(itemValue.task_Id, event)} />
                                    </Tooltip>
                                    :
                                    ""
                                  }
                                </Box>
                              </AccordionSummary>
                            </div>
                            <div className='list-children-task border border-top-0 rounded-bottom'>
                              <AccordionDetails>
                                <div className='task-content'>
                                  <Typography variant="h6">{itemValue.task_Content}</Typography>
                                </div>

                                <div className='details-task-receive mt-1 py-1' style={{ borderTop: '1.8px solid silver' }}>
                                  <Stack direction="row" sx={{ mt: 0.5 }} spacing={1}>
                                    <Typography variant='subtitle1' color='#0e9193'>Ngày tạo công việc: </Typography>
                                    <Typography variant="subtitle1">{`${itemValue.task_DateSend !== '' ? moment(itemValue.task_DateSend).format('LLLL') : ""} - `}</Typography>
                                    <Typography variant='subtitle1' color='#0e9193'>Loại công việc: </Typography>
                                    <Typography variant="subtitle1">{itemValue.task_Catagory_Name}</Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={0.6}>
                                    <Typography variant='subtitle1' color='#0e9193'>Thời hạn: </Typography>
                                    <Typography variant="subtitle1">
                                      {itemValue.task_DateStart && itemValue.task_DateEnd !== '' ?
                                        moment() > moment(itemValue.task_DateEnd) ?
                                          `${moment(itemValue.task_DateStart).format('L')} - ${moment(itemValue.task_DateEnd).format('L')} (hết hạn)`
                                          :
                                          `${moment(itemValue.task_DateStart).format('L')} - ${moment(itemValue.task_DateEnd).format('L')} 
                                          (còn lại ${expire.days() !== 0 ? expire.days() + ' ngày' : expire.hours() + ' giờ'}) -`
                                        :
                                        ""
                                      }
                                    </Typography>
                                    <Typography variant='subtitle1' color='#0e9193'>Người thực hiện: </Typography>
                                    <Typography variant="subtitle1">{itemValue.userReceive_FullName}</Typography>
                                  </Stack>
                                  <Stack direction="row" spacing={0.6}>

                                  </Stack>
                                </div>

                                {itemValue.task_Person_Receive !== itemValue.task_Person_Send ?
                                  <div className='task-discuss mt-1' >
                                    {
                                      itemValue.task_Discuss.length !== 0 ?
                                        <div id={`discuss ${itemValue.task_Id}`} className={itemValue.task_Discuss.length >= 5 ? "discuss-show" : ""}>
                                          {
                                            itemValue.task_Discuss.map((discuss, index) => {
                                              return (
                                                <div className='warp-comment' key={index}>
                                                  <List sx={{ mt: 0, p: 0 }}>
                                                    <ListItem sx={{ px: 0, paddingBottom: 0, overflowY: 'hidden' }}>
                                                      <ListItemAvatar sx={{ minWidth: '48px' }}><Avatar sx={{ bgcolor: discuss.discuss_User === user.account.userId ? 'rgb(11, 229, 222)' : 'rgb(183, 96, 77)', width: 36, height: 36 }}></Avatar></ListItemAvatar>
                                                      <Box className='discuss-box'>
                                                        <ListItemText className='dissucss-content'
                                                          primary={discuss.userSend_Fullname}
                                                          secondary={discuss.discuss_Content} />
                                                      </Box>
                                                    </ListItem>
                                                    <span className='discuss-time-send'>{moment(discuss.discuss_Time).startOf().fromNow()}</span>
                                                  </List>
                                                </div>
                                              )
                                            })
                                          }
                                        </div>
                                        :
                                        <div className='empty-comment '>
                                          <QuestionAnswerIcon sx={{ height: 70, width: 70, color: 'slategray' }} />
                                          <Typography sx={{ color: "rgb(176, 179, 184", fontFamily: "Arimo, sans-serif" }}>Hiện chưa có bình luận.</Typography>
                                        </div>
                                    }

                                    {
                                      listDiscuss.map((itemDiscuss, index) => {
                                        if (itemDiscuss.task_Id === itemValue.task_Id) {
                                          return (
                                            <div className='task-discuss-input d-flex ' key={index}>
                                              <div className='input-area'>
                                                <div className={`child-1 ${itemDiscuss.task_Id}`} id={`input-area ${itemDiscuss.task_Id}`} contentEditable='true' aria-label='Viết bình luận...' onPaste={(e) => pasteAsPlainText(e)}
                                                  onInput={(e) => handleOnChangeDiscussContent(itemDiscuss.task_Id, e.currentTarget.textContent)} onKeyPress={(e) => handleOnKeyDownEnter(e, itemValue.task_Id)}>
                                                </div>
                                              </div>
                                              <div className='input-send-icon' style={itemDiscuss.task_DiscussContent === "" ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}>
                                                <IconButton color={itemDiscuss.task_DiscussContent === "" ? 'default' : 'primary'}
                                                  disabled={itemDiscuss.task_DiscussContent === "" ? true : false} size="large" onClick={() => handleSendDiscuss(itemDiscuss.task_Id)}>
                                                  <SendIcon />
                                                </IconButton>
                                              </div>
                                            </div>)
                                        }
                                        else {
                                          return null
                                        }
                                      })
                                    }
                                  </div>
                                  :
                                  null
                                }
                              </AccordionDetails>
                            </div>

                          </Accordion>
                        )
                      })}
                    </>
                    :
                    <Typography variant="h6" color='red' className='text-center mt-2'>Hiện chưa có danh sách công việc, hãy thêm mới</Typography>
                  }
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonMui sx={{ textTransform: 'none' }} variant="contained" color="success" onClick={(e) => handleCompleteListDivineWork()}>Hoàn thành</ButtonMui>
          <ButtonMui sx={{ textTransform: 'none' }} variant="contained" color="primary" onClick={(e) => handleSaveListDivineWork()}>Lưu</ButtonMui>
          <Button variant="secondary" onClick={() => handleHideModal()}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      <ModalAssignDivineWorkPublic
        activeModalAssignDivineWorkPublic={showModalAssignDivineWorkPublic}
        closeModalAssignDivineWorkPublic={setShowModalAssignDivineWorkPublic}
        dataModalAssignDivineWorkPublic={dataModalAssignDivineWorkPublic}
        setDataModalAssignDivineWorkPublic={setDataModalAssignDivineWorkPublic}
        dataModalDivineWorkPublic={dataModalDivineWorkPublic}

        setDataObjDivineWorkEdit={setObjDivineWorkEdit}
      />

      <ModalCompleteInfoDivineWork
        activeModalCompleteInfoDivineWork={showModalCompleteInfoDivineWork}
        closeModalCompleteInfoDivineWork={setShowModalCompleteInfoDivineWork}
        dataModalCompleteInfoDivineWork={dataModalCompleteInfoDivineWork}
      />
    </>
  )
}

export default ModalDivineWorkPublic