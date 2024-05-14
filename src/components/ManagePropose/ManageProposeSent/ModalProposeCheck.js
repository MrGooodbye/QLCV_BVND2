import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../../context/UserContext';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
//import some theme from mui
import Typography from '@mui/material/Typography';
//api
import { getProposeReceiveById } from '../../../services/proposeService';


function ModalProposeInfo(props) {
    const { user } = useContext(UserContext);

    const dataModalProposeCheckDefault = {
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
            document_Incomming_TimeUpdate: ''
        }
    }

    const [dataModalProposeCheck, setDataModalProposeCheck] = useState(dataModalProposeCheckDefault);

    const handleHideModal = () => {
        props.closeModalProposeCheck(false);
    }

    const getProposeCheckedById = async (proposeId) => {
        let propse = await getProposeReceiveById(proposeId);
        setDataModalProposeCheck(propse);
    }

    useEffect(() => {
        if (props.sendIdToModalProposeCheck.length !== 0) {
            getProposeCheckedById(props.sendIdToModalProposeCheck);
        }
    }, [props.sendIdToModalProposeCheck])

    return (
        <Modal show={props.activeModalProposeCheck} onHide={() => handleHideModal()} size='lg' className='mt-4'>
            <Modal.Body>
                <div className="user-info-container col-xs-12">
                    <div className="container" style={{ overflow: "visible" }}>
                        <div className="row d-flex justify-content-center form-group">
                            <div className="row">
                                <div className='d-flex flex-row-reverse'>
                                    {`Ngày ${moment(dataModalProposeCheck.documentIncomming.document_Incomming_Time).format('LL')}`}
                                </div>
                                <div className='col-sm-12'>
                                    <div className='text-primary text-uppercase h3 d-flex justify-content-center'>Phiếu đề xuất</div>
                                </div>
                                <div className='col-sm-12'>
                                    <Typography variant='body1' fontSize={17} color='FireBrick'>Kính gởi</Typography>
                                    <Typography variant='body1' className='form-control mt-1'>{dataModalProposeCheck.documentIncomming.deparment_NameReceive}</Typography>
                                </div>
                                <div className='col-sm-12 mt-3'>
                                    <Typography variant='body1' fontSize={17} color='FireBrick'>Người đề xuất</Typography>
                                    <Typography variant='body1' className='form-control mt-1'>{dataModalProposeCheck.documentIncomming.document_Incomming_UserSend_FullName}</Typography>
                                </div>
                                <div className='col-sm-12 mt-3'>
                                    <Typography variant='body1' fontSize={17} color='FireBrick'>Đơn vị</Typography>
                                    <Typography variant='body1' className='form-control mt-1'>{dataModalProposeCheck.documentIncomming.deparment_NameSend}</Typography>
                                </div>
                                <div className='col-sm-12 mt-3'>
                                    <Typography variant='body1' fontSize={17} color='FireBrick'>Nội dung đề xuất</Typography>
                                    <Typography variant='body1' className='form-control mt-1'>{dataModalProposeCheck.documentIncomming.document_Incomming_Content}</Typography>
                                </div>
                                <div className='col-sm-12 mt-3 mb-3'>
                                    <Typography variant='body1' fontSize={17} color='FireBrick'>Ý kiến giải quyết của cấp trên</Typography>
                                    <Typography variant='body1' className='form-control mt-1'>
                                        {dataModalProposeCheck.documentIncomming.document_Incomming_Comment}
                                    </Typography>
                                </div>
                                <div className='d-flex flex-row-reverse'>
                                    {`Ngày ${moment(dataModalProposeCheck.documentIncomming.document_Incomming_TimeUpdate).format('LL')}`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleHideModal()}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalProposeInfo
