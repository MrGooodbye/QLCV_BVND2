import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import Modal from 'react-bootstrap/Modal';
import { ImageConfig } from '../../../config/ImageConfig.js';
//function component
import CircularProgressWithBackdrop from '../../FunctionComponents/ProgressBar/CircularProgressWithBackdrop.js';
//mui theme
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
//api
import { getProposeReceiveById } from '../../../services/proposeService';
import { getAllDepartmentByType } from '../../../services/departmentService';

function ModalProposeEdit(props) {
    const { user } = useContext(UserContext);

    const dataModalProposeEditDefault = {
        documentIncomming: {
            document_Incomming_Id: '',
            document_Incomming_Title: '',
            document_Incomming_Content: '',
            document_Incomming_Time: '',
            document_Incomming_UserSend_FullName: '',
            deparment_NameSend: '',
            deparment_NameReceive: '',
            document_Incomming_State: '',
            document_Incomming_Comment: '',
            document_Incomming_TimeUpdate: '',
        },
        fileIds: []
    }

    //config this modal
    const [dataModalProposeEdit, setDataModalProposeEdit] = useState(dataModalProposeEditDefault);

    const [listDepartmentByType, setListDepartmentByType] = useState([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

    //config select file before append to form data
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

    const handleHideModal = () => {
        props.closeModalProposeEdit(false);
    }

    const handleOnchange = (value, name) => {
        let _dataProposeEdit = _.cloneDeep(dataModalProposeEdit);
        _dataProposeEdit.documentIncomming[name] = value;
        setDataModalProposeEdit(_dataProposeEdit);
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

    const handleChangeSelectedDepartment = (e, value) => {
        setSelectedDepartmentId(value.department_ID);
    };

    const getProposeEditById = async (proposeId) => {
        let propose = await getProposeReceiveById(proposeId);
        setDataModalProposeEdit(propose);
        if (user.account.userId === user.account.departmentHead) {
            getDepartmentByType();
        }
    }

    //sửa đề xuất bởi nhân viên
    const handleEditProposeByEmploy = async () => {

    }

    //lấy list phòng chức năng
    const getDepartmentByType = async () => {
        let resultListDepartment = await getAllDepartmentByType(2);
        if (resultListDepartment.length !== 0) {
            setListDepartmentByType(resultListDepartment);
        }
    }

    //sửa đề xuất bởi trưởng phòng
    const handleEditProposeByHeader = async () => {

    }

    useEffect(() => {
        if (props.sendIdToModalProposeEdit !== null) {
            getProposeEditById(props.sendIdToModalProposeEdit);
        }
    }, [props.sendIdToModalProposeEdit])

    return (
        <>
            <CircularProgressWithBackdrop open={openBackdrop} setOpen={setOpenBackdrop} progressValue={progress} setProgressValue={setProgress} />
            <Modal show={props.activeModalProposeEdit} onHide={() => handleHideModal()} backdrop="static" keyboard={false} size='lg' className='mt-4'>
                <Modal.Header closeButton>
                    <Modal.Title><div className='text-primary text-uppercase'>Sửa thông tin đề xuất</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="user-info-container col-xs-12">
                        <div className="container" >
                            <div className="row d-flex justify-content-center form-group">
                                <div className="row">
                                    <div className='col-sm-12'>
                                        <label className='form-label fs-5' htmlFor='propose'>Tên đề xuất <span className='text-danger'>(*)</span></label>
                                        <input type='text' className='form-control' id="propose" autoComplete='off' value={dataModalProposeEdit.documentIncomming.document_Incomming_Title} onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Title')} />
                                    </div>
                                    <div className='col-sm-12 mt-3'>
                                        <label className='form-label fs-5' htmlFor='document_Incomming_Content'>Nội dung đề xuất <span className='text-danger'>(*)</span></label>
                                        <textarea className='form-control' id="document_Incomming_Content" rows="5" autoComplete='off' value={dataModalProposeEdit.documentIncomming.document_Incomming_Content} onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Content')} />
                                    </div>
                                    {user && user.isAuthenticated === true && user.account.userId === user.account.departmentHead ?
                                        <>
                                            <div className="col-sm-12 mt-3 mb-1">
                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Gửi lên phòng chức năng</Typography>
                                                <Autocomplete
                                                    autoComplete={false}
                                                    value={{ department_Name: dataModalProposeEdit.documentIncomming.deparment_NameReceive }}
                                                    defaultChecked={true}
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
                                                        <Typography variant='subtitle2' fontWeight='600' color='gray' fontSize='0.8rem'>Nhấn vào để chọn file</Typography>
                                                    </div>
                                                    <div className='file-input'>
                                                        <input type='file' accept=".xls,.xlsx,.doc,.docx,.pdf,.ppt,pptx,.jpg,.jpeg,.png" multiple onChange={(e) => onSelectFile(e)}></input>
                                                    </div>
                                                </div>
                                                {
                                                    dataModalProposeEdit.fileIds.length > 0 ? (
                                                        <div className='selected-file-preview-item col-sm-12 row' style={{ marginTop: '.75rem' }}>
                                                            {
                                                                dataModalProposeEdit.fileIds.map((itemFile, index) => {
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
                        <Button variant="primary" onClick={() => handleEditProposeByHeader()}>Sửa</Button>
                        :
                        <Button variant="primary" onClick={() => handleEditProposeByEmploy()}>Sửa</Button>}
                    <Button variant="secondary" onClick={() => handleHideModal()}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalProposeEdit