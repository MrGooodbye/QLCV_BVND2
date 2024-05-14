import React, { useEffect, useState, useContext } from 'react'
import _, { assign, cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import moment from 'moment';
import { ImageConfig } from '../../../config/ImageConfig.js';
import Dayjs from "dayjs";
//bs5
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
//mui theme
import Fade from '@mui/material/Fade';
import Tooltip from '@mui/material/Tooltip';
import ButtonMui from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
//date time picker function
import DateTimePicker from "../../FunctionComponents/DateTimePicker/MuiDateTimePicker.js";
//create filter options
//api
import { createTaskCategory, getTaskCategory } from '../../../services/taskService.js';
import { getUserInDepartment } from '../../../services/departmentService.js';

function ModalAssignDivineWorkPublic(props) {
    const filter = createFilterOptions();

    const { user, logoutContext } = useContext(UserContext);

    const dataAssignDivineWorkPublicDefault = {
        document_Send_Id: '',
        task_Catagory_Id: '',
        task_Catagory_Name: '',
        task_Content: '',
        task_DateEnd: '',
        task_DateSend: '',
        task_DateStart: '',
        task_Id: '',
        task_Title: '',
        userReceive_Id: '',
        userReceive_FullName: '',
        userSend_Id: '',
        userSend_FullName: '',
        fileIds: []
    }

    const [doSomething, setDoSomething] = useState(false);
    const [dataAssignDivineWorkPublic, setDataAssignDivineWorkPublic] = useState(dataAssignDivineWorkPublicDefault);
    const [dataAssignDivineWorkPublicEdit, setdataAssignDivineWorkPublicEdit] = useState(null); // dùng khi nhấn nút cập nhật để check xem cái trên với cái dưới có trùng nhau không

    const [listUserInDepartment, setListUserInDepartment] = useState([]);
    const [indexUserReceive, setIndexUserReceive] = useState(null);

    const [listTaskCategory, setListTaskCategory] = useState([]);
    const [indexTaskCategory, setIndexTaskCategory] = useState(null);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const [fileListState, setFileListState] = useState([]);

    const handleOnHide = () => {
        setDataAssignDivineWorkPublic(dataAssignDivineWorkPublicDefault);
        setFileListState([]);
        props.setDataModalAssignDivineWorkPublic({});
        props.closeModalAssignDivineWorkPublic(false);
    }

    const handleOnchange = (value, inputName) => {
        let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
        _dataModalAssignDivineWorkPublic[inputName] = value;
        setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
    }

    const onSelectFile = (e) => {
        let newListFile = e.target.files;

        // Lọc ra những object mới từ mảng data mới, khác với object trong mảng của state
        let newObjects = _.differenceBy(newListFile, fileListState, 'name');

        if (newObjects.length !== 0) {
            let updatedList = [...fileListState, ...newObjects];
            setFileListState(updatedList);

            let inputName = 'fileListState';

            let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
            _dataModalAssignDivineWorkPublic[inputName] = updatedList;
            setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
        }
    }

    const onDeleteFile = (itemFile) => {
        let updatedList = [...fileListState];
        //tìm vị trí của itemFile trong mảng updatedList, trả về vị trí chỉ mục, splice để xóa phần tử mà có vị trí chỉ mục đã trả về, 1 là chỉ xóa 1 phần tử khỏi mảng
        updatedList.splice(fileListState.indexOf(itemFile), 1);
        setFileListState(updatedList);

        let inputName = 'fileListState';

        let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
        _dataModalAssignDivineWorkPublic[inputName] = updatedList;
        setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
    }

    const onClickCheckBox = (checked, idFile) => {
        let inputName = 'not_CheckFile';
        if (checked === false) {
            let _dataAssignDivineWorkPublicFile = _.cloneDeep(dataAssignDivineWorkPublic.fileIds);
            for (let i = 0; i < _dataAssignDivineWorkPublicFile.length; i++) {
                if (_dataAssignDivineWorkPublicFile[i].file_Id === idFile) {
                    _dataAssignDivineWorkPublicFile[i].not_Check = true;
                    break;
                }
            }

            let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
            _dataModalAssignDivineWorkPublic[inputName] = true;
            _dataModalAssignDivineWorkPublic.fileIds = _dataAssignDivineWorkPublicFile;
            setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
        }
        else {
            let _dataAssignDivineWorkPublicFile = _.cloneDeep(dataAssignDivineWorkPublic.fileIds);
            _dataAssignDivineWorkPublicFile = _dataAssignDivineWorkPublicFile.map(obj => {
                if (obj.file_Id === idFile) {
                    delete obj.not_Check;
                }
                return obj;
            })

            let check = _dataAssignDivineWorkPublicFile.some(file => file.not_Check === true);
            if (check === false) {
                let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
                _dataModalAssignDivineWorkPublic[inputName] = false;
                _dataModalAssignDivineWorkPublic.fileIds = _dataAssignDivineWorkPublicFile;
                setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
            }
            else {
                let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
                _dataModalAssignDivineWorkPublic.fileIds = _dataAssignDivineWorkPublicFile;
                setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
            }
        }
    }

    const handleUpdateData = () => {
        let check = _.isEqual(dataAssignDivineWorkPublic, dataAssignDivineWorkPublicEdit);
        if (check !== true) {
            toast.info(`Đã cập nhật công việc ${dataAssignDivineWorkPublic.task_Title} thành công!`);
            props.setDataObjDivineWorkEdit(dataAssignDivineWorkPublic);
            setdataAssignDivineWorkPublicEdit(dataAssignDivineWorkPublic);
        }
        else {
            toast.warning('Hiện không có gì để cập nhật!');
        }
    }

    const handleGetListTaskCategory = async () => {
        if (listTaskCategory.length === 0) {
            let resultListTaskCategory = await getTaskCategory();
            setListTaskCategory(resultListTaskCategory);
        }
    }

    const handleGetListUserInDepartment = async (departmentId) => {
        if (listUserInDepartment.length === 0) {
            let listUserInDepartment = await getUserInDepartment(departmentId);
            setListUserInDepartment(listUserInDepartment.users);
        }
    }

    const handleSelectedTaskCategory = (e, value) => {
        if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
                toggleOpen(true);
                setDialogValue({
                    category_Name: newValue,
                });
            });
        } else if (value && value.inputValue) {
            toggleOpen(true);
            setDialogValue({
                category_Name: value.inputValue,
            });
        }
        else {
            if (value !== null) {
                let input_task_Catagory_Id = 'task_Catagory_Id';
                let input_task_Catagory_Name = 'task_Catagory_Name';
                let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
                _dataModalAssignDivineWorkPublic[input_task_Catagory_Id] = value.task_Category_Id;
                _dataModalAssignDivineWorkPublic[input_task_Catagory_Name] = value.category_Name;
                let indexCategory = listTaskCategory.findIndex(object => object.task_Category_Id === value.task_Category_Id)
                setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
                setIndexTaskCategory(indexCategory);
            } else {
                let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
                setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
            }
        }
    }

    const handleSelectedUserReceive = (e, value) => {
        if (value !== null) {
            let input_UserReceive_Id = 'userReceive_Id';
            let input_userReceive_FullName = 'userReceive_FullName';
            let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
            _dataModalAssignDivineWorkPublic[input_UserReceive_Id] = value.user_Id;
            _dataModalAssignDivineWorkPublic[input_userReceive_FullName] = value.user_FullName;
            let index = listUserInDepartment.findIndex(object => object.user_Id === value.user_Id)
            setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
            setIndexUserReceive(index);
        }
        else {
            let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataAssignDivineWorkPublic);
            setDataAssignDivineWorkPublic(_dataModalAssignDivineWorkPublic);
        }
    }

    const handleFindIndexTaskCategory = (task_Catagory_Id) => {
        let indexCategory = listTaskCategory.findIndex(object => object.task_Category_Id === task_Catagory_Id);
        setIndexTaskCategory(indexCategory);
    }

    const handleFindIndexUserReceive = (userReceive_Id) => {
        let index = listUserInDepartment.findIndex(object => object.user_Id === userReceive_Id)
        setIndexUserReceive(index);
    }

    useEffect(() => {
        if (Object.keys(props.dataModalAssignDivineWorkPublic).length !== 0) {
            setDataAssignDivineWorkPublic(props.dataModalAssignDivineWorkPublic);
            setdataAssignDivineWorkPublicEdit(props.dataModalAssignDivineWorkPublic);
            if (props.dataModalAssignDivineWorkPublic.fileListState) {
                setFileListState(props.dataModalAssignDivineWorkPublic.fileListState);
            }
            handleGetListUserInDepartment(user.account.departmentId);
            handleGetListTaskCategory();
            handleFindIndexTaskCategory(props.dataModalAssignDivineWorkPublic.task_Catagory_Id);
            handleFindIndexUserReceive(props.dataModalAssignDivineWorkPublic.userReceive_Id);
        }
    }, [props.dataModalAssignDivineWorkPublic])

    return (
        <Modal size='lg' animation={false} show={props.activeModalAssignDivineWorkPublic} onHide={() => handleOnHide()} style={{ background: 'rgba(0, 0, 0, 0.6)' }}
            backdrop={'static'} keyboard={false} >
            <Modal.Header closeButton>
                <Modal.Title><div className='text-primary text-uppercase'>Thông tin giao việc</div>
                    {props.dataModalDivineWorkPublic.documentSend.document_Send_TimeStart !== "" ?
                        <p style={{ margin: 0, marginLeft: '3px', fontFamily: 'sans-serif', fontSize: '15px', color: 'black' }}>
                            {`Hiệu lực ${Dayjs(props.dataModalDivineWorkPublic.documentSend.document_Send_TimeStart).format('DD/MM/YYYY')} - ${Dayjs(props.dataModalDivineWorkPublic.documentSend.document_Send_Deadline).format('DD/MM/YYYY')}`}
                        </p>
                        :
                        null
                    }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="user-info-container col-xs-12">
                    <div className="container" >
                        <div className="row d-flex justify-content-center form-group">
                            <div className="mb-3 col-sm-12">
                                <Form.Group>
                                    <Form.Label>Tên công việc <span className='text-danger'>(*)</span></Form.Label>
                                    <Form.Control type="text" defaultValue={dataAssignDivineWorkPublic.task_Title || ""} onChange={(e) => handleOnchange(e.target.value, 'task_Title')} />
                                </Form.Group>
                            </div>
                            <div className="mb-4 col-sm-12">
                                <Form.Group>
                                    <Form.Label>Nội dung công việc <span className='text-danger'>(*)</span></Form.Label>
                                    <Form.Control as="textarea" defaultValue={dataAssignDivineWorkPublic.task_Content || ""} onChange={(e) => handleOnchange(e.target.value, 'task_Content')} rows={4} />
                                </Form.Group>
                            </div>
                            <div className="mb-3 col-sm-12">
                                <fieldset className="border rounded-3 p-4">
                                    <legend className="float-none w-auto"
                                        style={{ fontWeight: "bold", color: "#dc3545", fontSize: "1.1rem" }}>Thời hạn xử lý</legend>
                                    <div className="row date-expire-input">
                                        <DateTimePicker stateExtra1={dataAssignDivineWorkPublic} setStateExtra1={setDataAssignDivineWorkPublic} dataModalDivineWork={props.dataModalDivineWorkPublic}></DateTimePicker>
                                    </div>
                                </fieldset>
                            </div>

                            <div className='col-sm-6 mt-3'>
                                <Form.Group>
                                    <Autocomplete
                                        options={listTaskCategory}
                                        value={dataAssignDivineWorkPublic.task_Catagory_Name !== '' ? listTaskCategory[indexTaskCategory] : null}
                                        getOptionLabel={(option) => option?.category_Name}
                                        renderOption={(props, option) => <li {...props}>{option.category_Name}</li>}
                                        onChange={(e, value) => handleSelectedTaskCategory(e, value)}
                                        onInputChange={(event, newInputValue) => {
                                            dataAssignDivineWorkPublic.task_Catagory_Name = newInputValue;
                                        }}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);
                                            if (params.inputValue === '') {
                                                //chạy khi input đang rỗng hoặc xóa hết ô input
                                                return filtered;
                                            }
                                            else if (params.inputValue !== '') {
                                                const result = options.filter((obj) => obj.category_Name.toLowerCase().includes(params.inputValue.toLowerCase()));
                                                //nếu tìm trong options không có thì sẽ vào phía dưới để tạo data mới
                                                if (result.length === 0) {
                                                    let newInputValue = [];
                                                    newInputValue.push({
                                                        inputValue: params.inputValue,
                                                        category_Name: `Thêm loại công việc "${params.inputValue}"`,
                                                    });
                                                    return newInputValue;
                                                }
                                                else {
                                                    return filtered;
                                                }
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Loại công việc" />}
                                    />
                                </Form.Group>
                            </div>

                            <div className='col-sm-6 mt-3 mb-1'>
                                <Form.Group>
                                    <Autocomplete
                                        options={listUserInDepartment}
                                        value={dataAssignDivineWorkPublic.userReceive_FullName !== '' ? listUserInDepartment[indexUserReceive] : null}
                                        getOptionLabel={(option) => option?.user_FullName}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={dataAssignDivineWorkPublic.userReceive_Id !== '' ? dataAssignDivineWorkPublic.userReceive_Id === option.user_Id : selected}
                                                />
                                                {option.user_FullName}
                                            </li>
                                        )}
                                        onChange={(e, value) => handleSelectedUserReceive(e, value)}
                                        onInputChange={(event, newInputValue) => {
                                            dataAssignDivineWorkPublic.userReceive_FullName = newInputValue;
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Người thực hiện" />}
                                    />
                                </Form.Group>
                            </div>

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
                                            dataAssignDivineWorkPublic.fileIds.length > 0 || fileListState.length > 0 ? (
                                                <div className='selected-file-preview-item col-sm-12 row' style={{ marginTop: '.70rem' }}>
                                                    {
                                                        dataAssignDivineWorkPublic.fileIds.map((itemFile, index) => {
                                                            return (
                                                                <Tooltip TransitionComponent={Fade} arrow title={itemFile.file_Name} key={index}>
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
                                                                        <Checkbox checked={itemFile.not_Check ? false : true} size="small" sx={{ ":hover": { backgroundColor: 'unset' } }} onChange={(e) => onClickCheckBox(e.target.checked, itemFile.file_Id)} />
                                                                        {/* <span className='selected-file-preview-delete-item fa fa-times-circle' onClick={() => onDeleteFile(itemFile)}></span> */}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        fileListState.map((itemFileState, index) => {
                                                            return (
                                                                <Tooltip TransitionComponent={Fade} arrow title={itemFileState.name} key={index}>
                                                                    <div className='selected-file-preview-item-info col-sm-5 mt-2'>
                                                                        <div className='selected-file-preview-item-info-img-type-file'>
                                                                            <img alt='' src={ImageConfig[itemFileState.type] || ImageConfig['default']} />
                                                                        </div>
                                                                        <div className='selected-file-preview-item-info-label'>
                                                                            <Typography className='selected-file-preview-item-info-label-file-name' component="span" variant="body1">
                                                                                {itemFileState.name}
                                                                            </Typography>
                                                                            {/* <p className='selected-file-preview-item-info-label-file-size'>{itemFile.size} B</p> */}
                                                                        </div>
                                                                        <span className='selected-file-preview-delete-item fa fa-times-circle' onClick={() => onDeleteFile(itemFileState)}></span>
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                                :
                                                null
                                        }
                                    </div>
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <ButtonMui sx={{ textTransform: 'none' }} variant="contained" color="warning" onClick={(e) => handleUpdateData()}>Cập nhật</ButtonMui>
                <Button variant="secondary" onClick={() => handleOnHide()}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAssignDivineWorkPublic

