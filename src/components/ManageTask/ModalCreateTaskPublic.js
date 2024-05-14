import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { v4 as uuidv4 } from 'uuid';
import { ImageConfig } from '../../config/ImageConfig';
//mui theme
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
//import components react datepicker
import moment from "moment";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from 'date-fns';
import vi from "date-fns/locale/vi";
//css
import "./SCSS/ModalCreateTask.scss";
//api
import { createDocSendPublicByDocIn } from '../../services/docSendService';
import { getTaskCategory } from '../../services/docSendService';

function ModalCreateTaskPublic(props) {
    const dataModalCreateTaskPublicDefault = {
        documentIncomming: {
            document_Incomming_Id: '',
            document_Incomming_Title: '',
            document_Incomming_Content: '',
            document_Incomming_UserSend: '',
            document_Incomming_UserSend_FullName: '',
            document_Incomming_UserReceive: '',
            document_Incomming_State: '',
            document_Incomming_Comment: '',
            document_Incomming_Transition_Reason: '',
            document_Incomming_Time: '',
            document_Incomming_TimeStart: '',
            document_Incomming_Deadline: '',
            document_Incomming_Category: '',
            filesDocSend: ''
        },
        fileIds: []
    }

    const [dataModalCreateTaskPublic, setDataModalCreateTaskPublic] = useState(dataModalCreateTaskPublicDefault);

    //config thời hạn xử lý
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    //config select file before push to obj propose file for clicking create task
    const [fileListState, setFileListState] = useState([]);

    //config slotPropsPopper
    const slotPropsPopper = {
        popper: {
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, -20],
                    },
                },
            ],
        },
    }

    const onChangeStart = (dateStart) => {
        if (dateStart === null) {
            setStartDate('');
        }
        else {
            let startDate = new Date((dateStart));
            setStartDate(startDate);
        }
    };

    const onChangeEnd = (dateEnd) => {
        if (dateEnd === null) {
            setEndDate('');
        }
        else {
            let endDate = new Date((dateEnd));
            setEndDate(endDate);
        }
    };

    const formatDateISO8601 = () => {
        //lấy value của 2 ô input date start và date end
        let docExpireStartValue = document.getElementById("dateStart").value;
        let docExpireEndValue = document.getElementById("dateFinish").value;

        //cắt value
        let docExpireStartValueFormat = docExpireStartValue.split("/");
        let docExpireEndValueFormat = docExpireEndValue.split("/");

        //template string chuỗi đã cắt thành chuỗi yyyy/mm/dd
        let docStartDate = `${docExpireStartValueFormat[2]}${docExpireStartValueFormat[1]}${docExpireStartValueFormat[0]}`;
        let docEndDate = `${docExpireEndValueFormat[2]}${docExpireEndValueFormat[1]}${docExpireEndValueFormat[0]}`;

        //format chuỗi yyyy/mm/dd sang ISO
        let TimeStart = moment(moment(docStartDate).format("YYYY-MM-DDT00:00:ssZ")).toISOString();

        let TimeEnd = moment(moment(docEndDate).format("YYYY-MM-DDT23:59:ssZ")).toISOString();

        dataModalCreateTaskPublic.documentIncomming.document_Incomming_TimeStart = TimeStart;
        dataModalCreateTaskPublic.documentIncomming.document_Incomming_Deadline = TimeEnd;
    }

    //config chọn loại công việc
    const [taskType, setTaskType] = useState();
    const [listTaskCategory, setListTaskCategory] = useState([]);

    const handleOnchange = (value, name) => {
        let _dataModalCreateTaskPublic = _.cloneDeep(dataModalCreateTaskPublic);
        _dataModalCreateTaskPublic.documentIncomming[name] = value;
        setDataModalCreateTaskPublic(_dataModalCreateTaskPublic);
    }

    const onSelectFile = (e) => {
        let newListFile = e.target.files;
        let newObjects = _.differenceBy(newListFile, fileListState, 'name');

        if (newObjects.length !== 0) {
            newObjects.forEach((object) => {
                object.file_Id = `File-Clone ${uuidv4()}`;
            })

            let updatedList = [...fileListState, ...newObjects];
            setFileListState(updatedList);
        }
    }

    const onDeleteFile = (itemFile) => {
        let _fileListState = _.cloneDeep(fileListState);

        _fileListState = _fileListState.fileIds = _fileListState.filter((object) => {
            return object.file_Id !== itemFile.file_Id
        });

        setFileListState(_fileListState);
    }

    const handleHideModal = () => {
        props.closeModalCreateTaskPublic(false);
        props.activeModalProposeReceiveOut(true);
    }

    const handleCreateDocSend = async () => {
        //lấy all id của file đề xuất để tạo công việc lớn
        let formArrayFile = new FormData();
        dataModalCreateTaskPublic.fileIds.forEach(item => {
            formArrayFile.append('filesDocIn', item.file_Id);
        })

        //lấy data các file đã chọn từ máy để tạo công việc lớn
        let i;
        for (i = 0; i < fileListState.length; i++) {
            formArrayFile.append('files', fileListState[i]);
        }

        formatDateISO8601();

        dataModalCreateTaskPublic.documentIncomming.document_Incomming_Category = taskType;
        dataModalCreateTaskPublic.fileIds = formArrayFile;
        // dataModalCreateTaskPublic.taskFile = formDataFileTask;
        // dataModalCreateTaskPublic.proposeFileRecive = formArrayProposeFile;

        let response = await createDocSendPublicByDocIn(dataModalCreateTaskPublic);
        if (response === 200) {
            toast.success('Tạo công việc thành công!');
            props.makeModalConfirmCreateTaskDoing(true);
            props.makeListProposeReceiveOutDoing(true);
            props.closeModalCreateTaskPublic(false);
        }
        else {
            toast.error(response);
        }
    }

    const getTaskCategoryFunc = async () => {
        let resultListTaskCategory = await getTaskCategory();
        setListTaskCategory(resultListTaskCategory);
    }

    useEffect(() => {
        if (Object.keys(props.dataModalCreateTaskPublic).length !== 0) {
            setDataModalCreateTaskPublic({ ...props.dataModalCreateTaskPublic })
            getTaskCategoryFunc();
        }
    }, [props.dataModalCreateTaskPublic])

    return (
        <>
            <div>
                <Modal size='lg' className='mt-1' show={props.activeModalCreateTaskPublic} onHide={() => handleHideModal()} backdrop={'static'} keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title><div className='text-primary text-uppercase'>Tạo công việc</div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="user-info-container col-xs-12">
                            <Form autoComplete='off'>
                                <div className="container" style={{ overflow: "visible" }}>
                                    <div className="row d-flex justify-content-center form-group">
                                        <div className="row">
                                            <Form.Group className="mb-3">
                                                <Form.Label className='label-input-create-task'>Tên công việc <span className='text-danger'>(*)</span></Form.Label>
                                                <Form.Control type="text" value={dataModalCreateTaskPublic.documentIncomming.document_Incomming_Title || ""} onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Title')} />
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label className='label-input-create-task'>Nội dung công việc <span className='text-danger'>(*)</span></Form.Label>
                                                <Form.Control as="textarea" value={dataModalCreateTaskPublic.documentIncomming.document_Incomming_Content || ""} onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Content')} rows={4} />
                                            </Form.Group>
                                            <Form.Group className="date-expire-group mb-3">
                                                <fieldset className="border rounded-3 p-4 ">
                                                    <legend className="float-none w-auto"
                                                        style={{ fontWeight: "bold", color: "#dc3545", fontSize: "1.1rem" }}>Thời hạn xử lý</legend>
                                                    <div className="row date-expire-input d-flex" style={{ position: 'relative', bottom: '8px' }}>
                                                        <div className="date-start-group col-sm-6">
                                                            <div className="input-date-start">
                                                                <div className="mx-2" style={{ display: "inline-block" }}>
                                                                    <label htmlFor="dateStart" >Từ ngày</label>
                                                                </div>
                                                                <DatePicker
                                                                    className="form-control"
                                                                    autoComplete="off"
                                                                    showPopperArrow={true}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    locale={vi}
                                                                    minDate={new Date()}
                                                                    maxDate={addMonths(new Date(), 12)}
                                                                    todayButton="Hôm nay"
                                                                    selected={startDate !== false || dataModalCreateTaskPublic.docExpireStart === undefined ? startDate : new Date(dataModalCreateTaskPublic.docExpireStart)}
                                                                    onChange={onChangeStart}
                                                                    startDate={startDate}
                                                                    showMonthYearDropdown //không viết tắt của tháng
                                                                    // useShortMonthInDropdown //viết tắt của tháng 
                                                                    showTwoColumnMonthYearPicker
                                                                    disabledKeyboardNavigation
                                                                    isClearable={true}
                                                                    id='dateStart'
                                                                    onKeyDown={(event) => { event.preventDefault() }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="date-finish-group col-sm-6">
                                                            <div className="input-date-finish">
                                                                <div className="mx-2" style={{ display: "inline-block" }}>
                                                                    <label htmlFor="dateFinish" className="form-label">Đến ngày</label>
                                                                </div>
                                                                <DatePicker
                                                                    className="form-control"
                                                                    autoComplete="off"
                                                                    showPopperArrow={true}
                                                                    dateFormat="dd/MM/yyyy"
                                                                    locale={vi}
                                                                    minDate={startDate === false ? new Date(dataModalCreateTaskPublic.docExpireStart) : startDate}
                                                                    maxDate={addMonths(new Date(), 12)}
                                                                    todayButton="Hôm nay"
                                                                    selected={endDate !== false || dataModalCreateTaskPublic.docExpireEnd === undefined ? endDate : new Date(dataModalCreateTaskPublic.docExpireEnd)}
                                                                    onChange={onChangeEnd}
                                                                    endDate={endDate}
                                                                    showMonthYearDropdown //không viết tắt của tháng
                                                                    // useShortMonthInDropdown //viết tắt của tháng 
                                                                    showTwoColumnMonthYearPicker
                                                                    disabledKeyboardNavigation
                                                                    isClearable={true}
                                                                    id='dateFinish'
                                                                    disabled={startDate === "" ? true : false}
                                                                    onKeyDown={(event) => { event.preventDefault() }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label className='label-input-create-task'>Loại công việc <span className='text-danger'>(*)</span></Form.Label>
                                                <Form.Select onChange={(e) => setTaskType(+e.currentTarget.value)}>
                                                    <option hidden>Chọn 1 loại công việc</option>
                                                    {listTaskCategory.map((item, index) => {
                                                        return (<option key={item.task_Category_Id} value={item.task_Category_Id}>{item.category_Name}</option>)
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                            <div className='select-file' style={{ marginTop: '.80rem' }}>
                                                <Box sx={{ boxShadow: 'rgba(0, 0, 0, 0.20) 0px 5px 15px', height: 'auto', p: 1, m: 0, borderRadius: 2, textAlign: 'center' }}>
                                                    <div className='wrap' style={{ width: '100%', margin: 'auto' }}>
                                                        <Typography variant='body1' fontSize='1.1rem' color='black'>File đính kèm</Typography>
                                                        <div className='file-input-container'>
                                                            <div className='file-input-label'>
                                                                <CloudUploadIcon sx={{ color: 'darkturquoise', fontSize: '70px' }}></CloudUploadIcon>
                                                                <Typography variant='subtitle2' fontWeight='600' color='gray' fontSize='0.8rem'>Nhấn vào để chọn file</Typography>
                                                            </div>
                                                            <div className='file-input'>
                                                                <input type='file' accept=".xls,.xlsx,.doc,.docx,.pdf,.ppt,pptx,.jpg,.jpeg,.png" multiple onChange={(e) => onSelectFile(e)}></input>
                                                            </div>
                                                        </div>
                                                        {
                                                            dataModalCreateTaskPublic.fileIds.length > 0 ? (
                                                                <div className='selected-file-preview-item col-sm-12 row' style={{ marginTop: '.60rem' }}>
                                                                    {
                                                                        dataModalCreateTaskPublic.fileIds.map((itemFile, index) => {
                                                                            return (
                                                                                <Tooltip TransitionComponent={Fade} arrow slotProps={slotPropsPopper} title={itemFile.file_Name} key={index}>
                                                                                    <div className='selected-file-preview-item-info col-sm-5 mt-2'>
                                                                                        <div className='selected-file-preview-item-info-img-type-file'>
                                                                                            <img alt='' src={ImageConfig[itemFile.contentType] || ImageConfig['default']} />
                                                                                        </div>
                                                                                        <div className='selected-file-preview-item-info-label'>
                                                                                            <Typography className='selected-file-preview-item-info-label-file-name' component="span" variant="body1">
                                                                                                {itemFile.file_Name}
                                                                                            </Typography>
                                                                                            {/* <p className='selected-file-preview-item-info-label-file-size'>{itemFile.size} B</p> */}
                                                                                        </div>
                                                                                        {itemFile.file_Id.startsWith("File-Clone") ?
                                                                                            <span className='selected-file-preview-delete-item fa fa-times-circle' onClick={() => onDeleteFile(itemFile)}></span>
                                                                                            :
                                                                                            null
                                                                                        }
                                                                                    </div>
                                                                                </Tooltip>
                                                                            )
                                                                        })
                                                                    }
                                                                    {
                                                                        fileListState.map((itemFile, index) => {
                                                                            return (
                                                                                <Tooltip TransitionComponent={Fade} arrow slotProps={slotPropsPopper} title={itemFile.name} key={index}>
                                                                                    <div className='selected-file-preview-item-info col-sm-5 mt-2'>
                                                                                        <div className='selected-file-preview-item-info-img-type-file'>
                                                                                            <img alt='' src={ImageConfig[itemFile.type] || ImageConfig['default']} />
                                                                                        </div>
                                                                                        <div className='selected-file-preview-item-info-label'>
                                                                                            <Typography className='selected-file-preview-item-info-label-file-name' component="span" variant="body1">
                                                                                                {itemFile.name}
                                                                                            </Typography>
                                                                                            {/* <p className='selected-file-preview-item-info-label-file-size'>{itemFile.size} B</p> */}
                                                                                        </div>
                                                                                        <span className='selected-file-preview-delete-item fa fa-times-circle' onClick={() => onDeleteFile(itemFile)}></span>
                                                                                    </div>
                                                                                </Tooltip>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            ) : null
                                                        }
                                                    </div>
                                                </Box>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => handleCreateDocSend()}>Tạo</Button>
                        <Button variant="secondary" onClick={() => handleHideModal()}>Đóng</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default ModalCreateTaskPublic