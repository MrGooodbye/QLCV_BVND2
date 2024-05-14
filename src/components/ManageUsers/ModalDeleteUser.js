import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const ModalDeleteUser = (props) => {
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title><p className="text-danger">Thông báo</p></Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn xóa người dùng "<strong>{props.dataModal.fullName}</strong>" không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={props.confirmDeleteUser}>
                        Có
                    </Button>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Không
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalDeleteUser;