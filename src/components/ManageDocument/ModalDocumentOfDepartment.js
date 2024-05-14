import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import "./Document.scss";
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
// import "./SCSS/Task.scss";
import AccordionSummary from "@mui/material/AccordionSummary";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, List, ListItem, ListItemText, Typography, useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Mention } from 'primereact/mention';
import { toast } from 'react-toastify';
import { dataNhanVien } from '../../assets/data/dataNhanVien';


const ModalDocumentOfDepartment = (props) => {
    const defaultDataModal = {
        idDoc: '',
        docName: "",
        docFile: "",
        docDes: "",
        docExpireStart: "",
        docExpireEnd: "",
        docHandOver: "",
        docStatus: "",
        docProgress: ""
    }

    //config data for this modal
    const [dataModal, setDataModal] = useState(defaultDataModal);
    const [tasks, setTasks] = useState(); //1 task 
    const [listTask, setListTask] = useState({}); //1 đống task

    //config state for mention
    const [value, setValue] = useState('');
    const [customers, setCustomers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const handleCloseModal = () => {
        props.close(false);
    }

    const handlePressEnter = (event) => {
        if (event.which === 13 && event.code === "Enter") {
            createTask();
            setTasks('');
        }
    }

    const createTask = () => {
        let _listTask = _.cloneDeep(listTask);
        _listTask[`task ${uuidv4()}`] = {
            taskName: tasks,
            employee: ''
        }
        setListTask(_listTask);
    }

    const editTask = (name, value, itemKey, event) => {
        event.stopPropagation();
        // let _listTask = _.cloneDeep(listTask);
        // _listTask[itemKey][name] = value;
        // setListTask(_listTask);
        // event.stopPropagation();
    }

    const delTask = (itemKey, event) => {
        event.stopPropagation();
        let _listTask = _.cloneDeep(listTask);
        delete _listTask[itemKey];
        setListTask(_listTask);
    }

    const saveTask = () => {
        //console.log(listTask);
        toast.success("Đã lưu công việc!");
    }

    const onSearch = (event) => {
        //in a real application, make a request to a remote url with the query and return suggestions, for demo we filter at client side
        setTimeout(() => {
            const query = event.query;
            let suggestions;

            if (!query.trim().length) {
                suggestions = [...customers];
            }
            else {
                suggestions = customers.filter((customer) => {
                    return customer.nickname.toLowerCase().startsWith(query.toLowerCase());
                });
            }

            setSuggestions(suggestions);
        }, 250);
    }

    const itemTemplate = (suggestion) => {
        // const src = 'https://primefaces.org/cdn/primereact/images/avatar/' + suggestion.representative.image;

        return (
            <div className="flex align-items-center">
                {/* <img alt={suggestion.name} src={src} width="32" /> */}
                <span className="flex flex-column ml-2">
                    {suggestion.name}
                    <small style={{ fontSize: '1rem', color: 'var(--text-color-secondary)' }}>@{suggestion.nickname}</small>
                </span>
            </div>
        );
    }

    useEffect(() => {
        dataNhanVien.getCustomersSmall().then(data => {
            data.forEach(d => d['nickname'] = `${d.name.replace(/\s+/g, '').toLowerCase()}_${d.id}`);
            setCustomers(data);
        });
    }, [])

    useEffect(() => {
        if (props.action === "ASSIGN") {
            setDataModal({ ...props.dataModalDocumentOfDepartment });
        }
    }, [props.dataModalDocumentOfDepartment])

    return (
        <>
            <div>
                <Modal show={props.open} size="lg" onHide={() => handleCloseModal()} dialogClassName="modal-55mw mt-0">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <div className='text-primary text-uppercase'>{`Công việc cho ${(dataModal.docName)}`}</div>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="task-info container col-xs-12" >
                            <div className='row d-flex justify-content-center mt-1'>
                                <div className='col-7 d-flex justify-content-center add-task'>
                                    <input type="text"
                                        className='form-control px-2 py-2 input-add-task'
                                        autoComplete='off'
                                        value={tasks || ""}
                                        placeholder="&#xf044; Thêm công việc..."
                                        style={{ fontFamily: "Arial, FontAwesome" }}
                                        onChange={(e) => setTasks(e.target.value)}
                                        onKeyDown={(event) => handlePressEnter(event)}
                                    />
                                    {/* <button className='btn btn-primary ml-2' style={{boxShadow:'0 1px 6px 0 rgba(0,0,0,.38)'}}>Thêm</button> */}
                                </div>
                            </div>

                            <div className='list-task'>
                                <h4 className="row text-primary text-uppercase mt-3">Danh sách công việc</h4>
                                <div className='list-task-div'>
                                    {
                                        Object.entries(listTask).map(([itemKey, itemValue]) => {
                                            return (
                                                <Accordion className='list-title mt-4 rounded-3' key={`task-${itemKey}`} style={{ boxShadow: 'none', wordBreak: 'break-all' }}>
                                                    <div className='list-parent-task p-1'>
                                                        <AccordionSummary>
                                                            <Typography className={`item child ${itemKey} text-uppercase text-white fw-bolder col-11 px-0`} style={{ fontSize: '17px' }}>
                                                                {itemValue.taskName}
                                                            </Typography>
                                                            <Box className='text-white d-flex ms-auto align-items-center col-0'>
                                                                <EditIcon className='mr-1' fontSize='medium' onClick={(event) => editTask('taskName', event.currentTarget.textContent, itemKey, event)} />
                                                                <DeleteIcon fontSize='medium' color="inherit" onClick={(event) => delTask(itemKey, event)} />
                                                            </Box>
                                                        </AccordionSummary>
                                                    </div>
                                                    <div className='list-children-task border border-top-0 rounded-bottom' style={{ backgroundColor: "#fff" }}>
                                                        <AccordionDetails>
                                                            <Typography component={'div'}>
                                                                {/* đây là phần tag người dùng và thảo luận (comment), đặt loại công việc, chọn ngày hết hạn về task đó cho người dùng */}
                                                                <label htmlFor={`assign ${itemKey}`} className='form-label'>Bàn giao công việc</label>
                                                                <Mention id={`assign ${itemKey}`}
                                                                    value={value}
                                                                    onChange={(e) => setValue(e.target.value)}
                                                                    suggestions={suggestions}
                                                                    onSearch={onSearch}
                                                                    field="nickname"
                                                                    placeholder="Gõ @ để tag người dùng"
                                                                    rows={3.5}
                                                                    cols={50}
                                                                    itemTemplate={itemTemplate}
                                                                />
                                                                <label htmlFor={`discuss ${itemKey}`} className='form-label mt-3'>Thảo luận công việc</label>
                                                                <Mention id={`assign ${itemKey}`} placeholder="Nhập để thảo luận" rows={3.5} cols={50} />
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </div>
                                                </Accordion>
                                            )
                                            {/* <div className={`list-title form-control mt-3 d-flex justify-content-between py-2`} key={`task-${itemKey}`}>
                                                        <div className={`item child ${itemKey} text-uppercase text-white fw-bolder py-1 col-11`}
                                                            contentEditable={true}
                                                            style={{ fontSize: '17px' }}
                                                            // onBlur={(event) => editTask('taskName', event.currentTarget.textContent, itemKey)}
                                                        >
                                                            {itemValue.taskName}
                                                        </div>
                                                        <div className='icons d-flex' style={{fontSize: '20px'}}>
                                                            <button className='mr-2'><i className="fa fa-pencil text-white" onClick={() => editTask()}></i></button>
                                                            <button><i className="fa fa-times text-white" onClick={() => delTask(itemKey)}></i></button>
                                                        </div>
                                                    </div> */}
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer className='mt-3'>
                        <>
                            <div className=''>
                                <button className='btn btn-primary mr-2' onClick={() => saveTask()}>Lưu</button>
                                <button className='btn btn-secondary' onClick={() => handleCloseModal()}>Đóng</button>
                            </div>
                        </>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default ModalDocumentOfDepartment
