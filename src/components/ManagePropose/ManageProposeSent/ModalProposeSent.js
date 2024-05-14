import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import Modal from 'react-bootstrap/Modal';
import { ImageConfig } from '../../../config/ImageConfig.js';
//function component
import CircularProgressWithBackdrop from '../../FunctionComponents/ProgressBar/CircularProgressWithBackdrop.js';
import PreviewFile from '../../FunctionComponents/PreviewFile/PreviewFile.js';
//import some theme from mui
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
//import some shit to create assign to department
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
//import some api
import { createPropose, createProposeByHeader } from '../../../services/proposeService';
import { getAllDepartmentByType } from '../../../services/departmentService';

const ModalProposeSent_Delete = (props) => {
    const { user } = useContext(UserContext);

    const dataProposeSentDefault = {
        document_Incomming_Title: '',
        document_Incomming_Content: '',
        proposeFile: ''
    }

    //config this modal
    const [dataModalProposeSent, setDataModalProposeSent] = useState(dataProposeSentDefault);

    const [listDepartmentByType, setListDepartmentByType] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

    //config select file before append to form data and assign to dataModalProposeSent
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

    //config react mui checkboxes
    const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />
    const checkedIcon = <CheckBoxIcon fontSize="medium" />

    //config backdrop when submit
    const [progress, setProgress] = useState(0);
    const [openBackdrop, setOpenBackdrop] = useState();

    //config preview file
    const [fileDetails, setFileDetails] = useState();
    const [showModalPreviewFile, setModalPreviewFile] = useState(false);

    const handleHideModal = () => {
        props.closeModalProposeSent(false)
        setDataModalProposeSent(dataProposeSentDefault);
        setFileListState([]);
    }

    const handleOnchange = (value, name) => {
        let _dataPropose = cloneDeep(dataModalProposeSent);
        _dataPropose[name] = value;
        setDataModalProposeSent(_dataPropose);
    }

    const onSelectFile = (e) => {
        let newListFile = e.target.files;
        // Lọc ra những object mới từ mảng data mới, khác với object trong mảng của state
        let newObjects = _.differenceBy(newListFile, fileListState, 'name');
        if (newObjects.length !== 0) {
            let updatedList = [...fileListState, ...newObjects];
            setFileListState(updatedList);
        }
        else {
            // console.log('không có file nào được thêm vào.');
            // console.log('luc dau: ', fileListState)
        }
    }

    const onDeleteFile = (itemFile) => {
        let updatedList = [...fileListState];
        //tìm vị trí của itemFile trong mảng updatedList, trả về vị trí chỉ mục, splice để xóa phần tử mà có vị trí chỉ mục đã trả về, 1 là chỉ xóa 1 phần tử khỏi mảng
        updatedList.splice(fileListState.indexOf(itemFile), 1);
        setFileListState(updatedList);
    }

    const onPreviewFile = (itemFile) => {
        setFileDetails(itemFile);
        setModalPreviewFile(true);
        //console.log(itemFile);
        // let objectURL = URL.createObjectURL(itemFile);








        // console.log(objectURL);
        //let fileName = itemFile.name;
        // setType(fileName.split('.').pop());
        // setUri(objectURL);
        // setShow(true);
        //console.log(objectURL);
        // let base64DataFile = await readFile(itemFile);
        // let objectURL = URL.createObjectURL();
    }

    const readFile = async (file) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }

    const handleChangeSelectedDepartment = (e, value) => {
        setSelectedDepartmentId(value.department_ID);
    };

    //tạo giá trị tiến trình trong quá trình gửi đề xuất
    const handleOnUploadProgress = (progressEvent) => {
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
    }

    //gửi đề xuất bởi nhân viên
    const handleCreateProposeByEmploy = async () => {
        setOpenBackdrop(true);

        let formDataFilePropose = new FormData();
        let i;
        for (i = 0; i < fileListState.length; i++) {
            formDataFilePropose.append('files', fileListState[i]);
        }

        dataModalProposeSent.proposeFile = formDataFilePropose;

        try {
            // Sử dụng Promise để đảm bảo thời gian chờ được hoàn thành
            await new Promise(resolve => setTimeout(resolve, 2 * 1000));

            let response = await createPropose(dataModalProposeSent, handleOnUploadProgress);
            if (response === 200) {
                await new Promise(resolve => setTimeout(resolve, 1 * 1000));

                toast.success('Gửi đề xuất thành công!');
                setOpenBackdrop(false);
                props.makeModalProposeSentDoing(true);
                setDataModalProposeSent(dataProposeSentDefault);
                setFileListState([]);
            } else {
                console.log(response);
            }

        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error);
        }
    }

    //lấy list phòng chức năng
    const getDepartmentByType = async () => {
        let resultListDepartment = await getAllDepartmentByType(2);
        if (resultListDepartment.length !== 0) {
            setListDepartmentByType(resultListDepartment);
        }
    }

    //gửi đề xuất bởi trưởng phòng
    const handleCreateProposeByHeader = async () => {
        setOpenBackdrop(true);
        let formDataFilePropose = new FormData();
        let i;
        for (i = 0; i < fileListState.length; i++) {
            formDataFilePropose.append('files', fileListState[i]);
        }

        dataModalProposeSent.proposeFile = formDataFilePropose;

        try {
            // Sử dụng Promise để đảm bảo thời gian chờ được hoàn thành
            await new Promise(resolve => setTimeout(resolve, 2 * 1000));

            let response = await createProposeByHeader(dataModalProposeSent, selectedDepartmentId, handleOnUploadProgress);
            if (response === 200) {
                await new Promise(resolve => setTimeout(resolve, 1 * 1000));

                toast.success('Gửi đề xuất thành công!');
                setOpenBackdrop(false);
                props.makeModalProposeSentDoing(true);
                setDataModalProposeSent(dataProposeSentDefault);
                setFileListState([]);
            } else {
                console.log(response);
            }

        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error);
        }
    }

    useEffect(() => {
        if (user.account.userId === user.account.departmentHead) {
            getDepartmentByType();
        }
    }, [props.activeModalProposeSent])

    return (
        <>
            <CircularProgressWithBackdrop open={openBackdrop} setOpen={setOpenBackdrop} progressValue={progress} setProgressValue={setProgress} />
            <Modal show={props.activeModalProposeSent} onHide={() => handleHideModal()} size='lg' className='mt-2'>
                <Modal.Header closeButton>
                    <Modal.Title><div className='text-primary text-uppercase'>Gửi đề xuất</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="user-info-container col-xs-12">
                        <div className="container" >
                            <div className="row d-flex justify-content-center form-group">
                                <div className="row">
                                    <div className='col-sm-12'>
                                        <label className='form-label fs-5' htmlFor='propose'>Tên đề xuất <span className='text-danger'>(*)</span></label>
                                        <input type='text' className='form-control' id="propose" onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Title')} value={dataModalProposeSent.document_Incomming_Title || ""} autoComplete='off'></input>
                                    </div>
                                    <div className='col-sm-12 mt-3'>
                                        <label className='form-label fs-5' htmlFor='document_Incomming_Content'>Nội dung đề xuất <span className='text-danger'>(*)</span></label>
                                        <textarea className='form-control' id="document_Incomming_Content" rows="5" onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Content')} value={dataModalProposeSent.document_Incomming_Content || ""} autoComplete='off'></textarea>
                                    </div>
                                    {user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead ?
                                        <>
                                            <div className="col-sm-12 mt-3 mb-1">
                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Gửi lên phòng chức năng</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    options={listDepartmentByType}
                                                    getOptionLabel={(option) => option.department_Name}
                                                    renderOption={(props, option, { selected }) => (
                                                        <li {...props}>
                                                            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                                                            {option.department_Name}
                                                        </li>
                                                    )}
                                                    style={{ width: 718 }}
                                                    onChange={(e, value) => handleChangeSelectedDepartment(e, value)}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Gõ hoặc nhấn chọn một phòng chức năng..." />
                                                    )}
                                                />
                                            </div>
                                        </>
                                        :
                                        null
                                    }
                                    <div className='col-sm-12 mt-4'>
                                        <Box sx={{ boxShadow: 'rgba(0, 0, 0, 0.20) 0px 5px 15px', height: 'auto', p: 1, m: 0, borderRadius: 2, textAlign: 'center' }}>
                                            <div className='wrap' style={{ width: '100%', margin: 'auto' }}>
                                                <Typography variant='body1' fontSize='1.1rem' color='black'>File đính kèm</Typography>
                                                <div className='file-input-container'>
                                                    <div className='file-input-label'>
                                                        <CloudUploadIcon sx={{ color: 'darkturquoise', fontSize: '70px' }}></CloudUploadIcon>
                                                        <Typography variant='subtitle2' fontWeight='600' color='gray' fontSize='0.8rem'>Nhấn vào đây để chọn file</Typography>
                                                    </div>
                                                    <div className='file-input'>
                                                        <input type='file' accept=".xls,.xlsx,.doc,.docx,.pdf,.ppt,pptx,.jpg,.jpeg,.png" multiple onChange={(e) => onSelectFile(e)}></input>
                                                    </div>
                                                </div>
                                                {
                                                    fileListState.length > 0 ? (
                                                        <div className='selected-file-preview-item col-sm-12 row' style={{ marginTop: '.70rem' }}>
                                                            {
                                                                fileListState.map((itemFile, index) => {
                                                                    return (
                                                                        <Tooltip TransitionComponent={Fade} arrow slotProps={slotPropsPopper} title={itemFile.name} key={index}>
                                                                            <div className='selected-file-preview-item-info col-sm-5 mt-2' onClick={() => onPreviewFile(itemFile)}>
                                                                                <div className='selected-file-preview-item-info-img-type-file'>
                                                                                    <img alt='' src={ImageConfig[itemFile.type] || ImageConfig['default']} />
                                                                                </div>
                                                                                <div className='selected-file-preview-item-info-label'>
                                                                                    <Typography className='selected-file-preview-item-info-label-file-name' component="span" variant="body1">
                                                                                        {itemFile.name}
                                                                                    </Typography><p className='selected-file-preview-item-info-label-file-size'>{itemFile.size} B</p>
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
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead ?
                        <Button variant="primary" onClick={() => handleCreateProposeByHeader()}>Gửi</Button>
                        :
                        <Button variant="primary" onClick={() => handleCreateProposeByEmploy()}>Gửi</Button>}
                    <Button variant="secondary" onClick={() => handleHideModal()}>Đóng</Button>
                </Modal.Footer>
            </Modal>

            <PreviewFile
                active={showModalPreviewFile}
                close={setModalPreviewFile}
                fileDetails={fileDetails}
            />
        </>
    )
}

export default ModalProposeSent_Delete