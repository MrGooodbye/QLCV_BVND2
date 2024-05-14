import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Modal from 'react-bootstrap/Modal';
//import some theme from mui
import Typography from '@mui/material/Typography';
//import some shit to create assign to department
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
//import api for propose
import { updateProposeState, moveupProposeByHeader } from '../../services/proposeService';
import { getAllDepartmentByType } from '../../services/departmentService';

function ModalProposeReceiveIn(props) {
    const { user, logoutContext } = useContext(UserContext);

    //config react mui checkboxes
    const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />
    const checkedIcon = <CheckBoxIcon fontSize="medium" />

    const dataModalProposeReceiveDefault = {
        document_Incomming_Id: '',
        document_Incomming_Title: '',
        document_Incomming_Content: '',
        document_Incomming_UserSend: '',
        document_Incomming_UserSend_FullName: '',
        document_Incomming_UserReceive: '',
        document_Incomming_State: '',
        document_Incomming_Comment: '',
        document_Incomming_Comment_Forward: '',
        document_Incomming_Time: '',
    }

    const [dataModalProposeReceive, setDataModalProposeReceive] = useState(dataModalProposeReceiveDefault);
    const [listDepartmentByType, setListDepartmentByType] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);

    const handleOnchange = (value, inputName) => {
        let _dataModalProposeReceive = cloneDeep(dataModalProposeReceive);
        _dataModalProposeReceive[inputName] = value;
        setDataModalProposeReceive(_dataModalProposeReceive);
    }

    const handleChangeSelectedDepartment = (e, value) => {
        setSelectedDepartment(value);
    };

    const proposeCheck = async (dataModalProposeReceive) => {
        let response = await updateProposeState(dataModalProposeReceive, 3)
        if (response === 200) {
            toast.success('Đã duyệt đề xuất!');
            props.makeModalProposeReceiveInDoing(true);
            setDataModalProposeReceive(dataModalProposeReceiveDefault);
        }
    }

    const proposeRefuse = async (dataModalProposeReceive) => {
        let response = await updateProposeState(dataModalProposeReceive, 1)
        if (response === 200) {
            toast.error('Đã từ chối đề xuất!');
            props.makeModalProposeReceiveInDoing(true);
            setDataModalProposeReceive(dataModalProposeReceiveDefault);
        }
    }

    const proposeReturn = async (dataModalProposeReceive) => {
        let response = await updateProposeState(dataModalProposeReceive, 2)
        if (response === 200) {
            toast.warning('Đã trả đề xuất về!');
            props.makeModalProposeReceiveInDoing(true);
            setDataModalProposeReceive(dataModalProposeReceiveDefault);
        }
    }

    const proposeMoveUp = async (dataModalProposeReceive) => {
        let response = await moveupProposeByHeader(dataModalProposeReceive, selectedDepartment.department_ID)
        if (response === 200) {
            toast.info(`Đã chuyển đề xuất lên ${selectedDepartment.department_Name}!`);
            props.makeModalProposeReceiveInDoing(true);
            setDataModalProposeReceive(dataModalProposeReceiveDefault);
        }
    }

    const handleHideModal = () => {
        props.closeModalProposeReceiveIn(false);
        setDataModalProposeReceive(dataModalProposeReceiveDefault);
    }

    const getDepartmentByType = async () => {
        let resultListDepartment = await getAllDepartmentByType(2);
        if (resultListDepartment.length !== 0) {
            setListDepartmentByType(resultListDepartment);
        }
    }

    useEffect(() => {
        getDepartmentByType();
        setDataModalProposeReceive({ ...props.dataModalProposeReceiveIn });
    }, [props.dataModalProposeReceiveIn])

    return (
        <>
            <div>
                <Modal show={props.activeModalProposeReceiveIn} onHide={() => handleHideModal()} size='lg' className='mt-4'>
                    <Modal.Header closeButton>
                        <Modal.Title><div className='text-primary text-uppercase'>Thông tin đề xuất</div></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="user-info-container col-xs-12">
                            <form method="POST" action="/user/create-user" autoComplete='off'>
                                <div className="container" style={{ overflow: "visible" }}>
                                    <div className="row d-flex justify-content-center form-group">
                                        <div className="row">
                                            <div className='col-sm-12'>
                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Tên đề xuất</Typography>
                                                <Typography variant='body1' className='form-control mt-1'>{dataModalProposeReceive.document_Incomming_Title}</Typography>
                                            </div>
                                            <div className='col-sm-12 mt-3'>
                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Nội dung đề xuất</Typography>
                                                <Typography variant='body1' className='form-control mt-1'>{dataModalProposeReceive.document_Incomming_Content}</Typography>
                                            </div>
                                            {(() => {
                                                if (dataModalProposeReceive.document_Incomming_State === 0 || dataModalProposeReceive.document_Incomming_State === 1 || dataModalProposeReceive.document_Incomming_State === 2) {
                                                    return (
                                                        <>
                                                            <div className='col-sm-12 mt-3 mb-3'>
                                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Ý kiến giải quyết</Typography>
                                                                <Typography >
                                                                    <textarea className='form-control mt-1 fs-6' id="document_Incomming_Comment" rows="4"
                                                                        onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Comment')} value={dataModalProposeReceive.document_Incomming_Comment || ""}></textarea>
                                                                </Typography>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                else if (dataModalProposeReceive.document_Incomming_State === 3) {
                                                    return (
                                                        <>
                                                            <div className='col-sm-12 mt-3 mb-3'>
                                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Ý kiến giải quyết</Typography>
                                                                <Typography >
                                                                    <textarea className='form-control mt-1 fs-6' id="document_Incomming_Comment" rows="4"
                                                                        onChange={(e) => handleOnchange(e.target.value, 'document_Incomming_Comment')} value={dataModalProposeReceive.document_Incomming_Comment_Forward || ""}></textarea>
                                                                </Typography>
                                                            </div>
                                                            <div className="col-sm-12 mt-3 mb-3">
                                                                <Typography variant='body1' fontSize={17} color='FireBrick'>Gửi lên phòng chức năng</Typography>
                                                                <Autocomplete
                                                                    options={listDepartmentByType}
                                                                    getOptionLabel={(option) => option.department_Name}
                                                                    renderOption={(props, option, { selected }) => (
                                                                        <li {...props}>
                                                                            <Checkbox
                                                                                icon={icon}
                                                                                checkedIcon={checkedIcon}
                                                                                style={{ marginRight: 8 }}
                                                                                checked={selected}
                                                                            />
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
                                                    )
                                                }
                                                else {
                                                    return <></>
                                                }
                                            })()}
                                            <div className='col-sm-12'>
                                                <Typography variant='body1' fontSize={17} color='FireBrick'>File đính kèm</Typography>
                                                {/* <input type='file' className='form-control' id="proposeFile"
                                                accept=".xls,.xlsx,.doc,.docx,.pdf,.ppt,pptx,.jpg,.jpeg,.png" multiple></input> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className='mb-2'>
                        {(() => {
                            if (dataModalProposeReceive.document_Incomming_State === 0) {
                                return (
                                    <>
                                        <Button variant="success" onClick={() => proposeCheck(dataModalProposeReceive)}>Duyệt đề xuất</Button>
                                        <Button variant="danger" onClick={() => proposeRefuse(dataModalProposeReceive)}>Từ chối đề xuất</Button>
                                        <Button variant="warning" onClick={() => proposeReturn(dataModalProposeReceive)}>Trả đề xuất về</Button>
                                    </>
                                )
                            }
                            else if (dataModalProposeReceive.document_Incomming_State === 1) {
                                return (
                                    <>
                                        <Button variant="success" onClick={() => proposeCheck(dataModalProposeReceive)}>Duyệt đề xuất</Button>
                                        <Button variant="warning" onClick={() => proposeReturn(dataModalProposeReceive)}>Trả đề xuất về</Button>
                                    </>
                                )
                            }
                            else if (dataModalProposeReceive.document_Incomming_State === 2) {
                                return (
                                    <>
                                        <Button variant="success" onClick={() => proposeCheck(dataModalProposeReceive)}>Duyệt đề xuất</Button>
                                        <Button variant="danger" onClick={() => proposeRefuse(dataModalProposeReceive)}>Từ chối đề xuất</Button>
                                    </>
                                )
                            }
                            else if (dataModalProposeReceive.document_Incomming_State === 3) {
                                return (
                                    <>
                                        <Button variant="success" onClick={() => proposeMoveUp(dataModalProposeReceive)}>Bàn giao nội bộ</Button>
                                        <Button variant="info" onClick={() => proposeMoveUp(dataModalProposeReceive)}>Chuyển tiếp đề xuất </Button>
                                    </>
                                )
                            }
                            else {
                                return (<>trường hợp này chưa biết</>)
                            }
                        })()}
                        <Button variant="secondary" onClick={() => handleHideModal()}>Đóng</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default ModalProposeReceiveIn