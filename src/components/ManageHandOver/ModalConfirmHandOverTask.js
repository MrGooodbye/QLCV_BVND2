import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Modal from 'react-bootstrap/Modal';
//mui
import Typography from "@mui/material/Typography";
//css
import "./SCSS/ModalConfirmHandOver.scss";
//modal handover task
// import ModalHandOverTask from "./ModalHandOverTask.js";

const ModalConfirmHandOverTask = (props) => {
    const dataModalConfirmHandOverTaskDefault = {
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

    const [dataModalConfirmHandOverTask, setDataModalConfirmHandOverTask] = useState(dataModalConfirmHandOverTaskDefault);

    //config modal handover task
    const [showModalHandOverTask, setShowModalHandOverTask] = useState(false);
    const [dataModalHandOverTask, setDataModalModalHandOverTask] = useState({});

    const handleHideModal = () => {
        props.closeModalConfirmHandOverTask(false);
    }

    const confirmCreateHandOverTask = () => {
        setDataModalModalHandOverTask();
        props.closeModalConfirmHandOverTask(false);
        props.closeModalProposeReceiveOut(false);
        setDataModalConfirmHandOverTask(dataModalConfirmHandOverTaskDefault);
    }
}

export default ModalConfirmHandOverTask