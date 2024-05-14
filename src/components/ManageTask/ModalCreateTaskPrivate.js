import React, { useState, useEffect, useContext, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import _, { cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Modal from 'react-bootstrap/Modal';

function ModalCreateTaskPrivate(props) {
    return (
        <>
            <Modal>
                <Modal.Header closeButton>
                    <Modal.Title>Tạo công việc nội bộ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Woohoo, you are reading this text in a modal!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" >Tạo công việc</Button>
                    <Button variant="secondary">Đóng</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalCreateTaskPrivate