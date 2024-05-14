import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Modal from 'react-bootstrap/Modal';
//mui
import Typography from "@mui/material/Typography";
//css
import "./SCSS/ModalConfirm.scss";
//modal task
import ModalCreateTaskPublic from "./ModalCreateTaskPublic";
import ModalCreateTaskPrivate from "./ModalCreateTaskPrivate";

function ModalCofirmCreateTask(props) {
    const dataModalConfirmCreateTaskDefault = {
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
        },
        fileIds: []
    }

    const [dataModalConfirmCreateTask, setDataModalConfirmCreateTask] = useState(dataModalConfirmCreateTaskDefault);
    const [done, setDone] = useState(false);

    //config modal create task public
    const [showModalCreateTaskPublic, setShowModalCreateTaskPublic] = useState(false);
    const [dataModalCreateTaskPublic, setDataModalCreateTaskPublic] = useState({});

    const handleHideModal = () => {
        props.closeModalConfirmCreateTask(false);
    }

    const confirmCreateTaskPublic = () => {
        setDataModalCreateTaskPublic(dataModalConfirmCreateTask);
        props.closeModalConfirmCreateTask(false);
        props.closeModalProposeReceiveOut(false);
        setShowModalCreateTaskPublic(true);
    }

    const confirmCreateTaskPrivate = () => {

    }

    useEffect(() => {
        if (Object.keys(props.dataModalConfirmCreateTask).length !== 0) {
            setDataModalConfirmCreateTask({ ...props.dataModalConfirmCreateTask })
        }
    }, [props.dataModalConfirmCreateTask])

    useEffect(() => {
        if (done === true) {
            setDataModalConfirmCreateTask(dataModalConfirmCreateTaskDefault);
            setDone(false);
        }
    }, [done])

    return (
        <>
            <Modal show={props.activeModalConfirmCreateTask} onHide={() => handleHideModal()} style={{ background: 'rgba(0, 0, 0, 0.6)' }} backdrop={'static'} keyboard={false} centered dialogClassName="modal-confirm">
                <Modal.Header closeButton>
                    <Modal.Title><div className='text-danger text-uppercase position-relative start-50'>Đồng ý tiếp nhận?</div></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Typography variant="subtitle1">
                        Tạo công việc {`${props.typeModalConfirmCreateTask === "PUBLIC" ? "" : "nội bộ"}`} cho đề xuất
                        "<strong style={{ fontFamily: '"DM Sans", sans-serif' }}>{`${dataModalConfirmCreateTask.documentIncomming.document_Incomming_Title}`}</strong>"?
                    </Typography>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-center'>
                    {props.typeModalConfirmCreateTask === "PUBLIC" ?
                        <Button variant="primary" onClick={() => confirmCreateTaskPublic()}>Có, tạo đi, hỏi lắm</Button>
                        :
                        <Button variant="primary" onClick={() => confirmCreateTaskPrivate()}>Có, tạo đi, hỏi lắm</Button>
                    }
                    <Button variant="secondary" onClick={() => handleHideModal()}>Không, tao click nhầm</Button>
                </Modal.Footer>
            </Modal>

            <ModalCreateTaskPublic
                activeModalCreateTaskPublic={showModalCreateTaskPublic}
                closeModalCreateTaskPublic={setShowModalCreateTaskPublic}
                dataModalCreateTaskPublic={dataModalCreateTaskPublic}
                makeModalCreateTaskPublic={setDone}

                makeModalConfirmCreateTaskDoing={setDone}

                activeModalProposeReceiveOut={props.closeModalProposeReceiveOut}
                makeListProposeReceiveOutDoing={props.makeListProposeReceiveOutDoing}
            />
        </>
    )
}

export default ModalCofirmCreateTask