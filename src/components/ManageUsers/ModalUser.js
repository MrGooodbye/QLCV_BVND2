import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import _, { update } from "lodash";

const ModalUser = (props) => {

    const { setActionModalUser, dataModalUser } = props

    const [listRole, setListRole] = useState([]);
    const [listPosition, setListPosition] = useState([]);
    const [listDepartment, setDepartment] = useState([]);

    const defaultUserData = {
        fullName: '',
        userName: '',
        password: '',
        phone: '',
        email: '',
        role: '',
        position: '',
        department: '',
        image: '',

    }

    const validateInputDefault = {
        fullName: true,
        userName: true,
        password: true,
        phone: true,
        email: true,
        role: true,
        position: true,
        department: true,
        validImage: true,
    }

    const [userDataDefault, setuserDataDefault] = useState(defaultUserData);
    const [validInput, setValidInput] = useState(validateInputDefault);

    useEffect(() => {
        getListRole();
        getListPosition();
        getListDepartment();
    }, [])

    useEffect(() => {
        if (setActionModalUser === 'UPDATE') {
            setuserDataDefault({ ...dataModalUser, role: dataModalUser.role ? dataModalUser.role.id : '', position: dataModalUser.position ? dataModalUser.position.id : '', department: dataModalUser.department ? dataModalUser.department.id : '' })
        }
    }, [dataModalUser])

    const getListRole = async () => {
        // let resListRole = await fetchRoleList();
        // if (resListRole && resListRole.EC === 0) {
        //     setListRole(resListRole.DT)
        // }
        // else {
        //     toast.error(resListRole.EM)
        // }
    }

    const getListPosition = async () => {
        // let resListPosition = await fetchPositionList();
        // if (resListPosition && resListPosition.EC === 0) {
        //     setListPosition(resListPosition.DT);
        // }
        // else {
        //     toast.error(resListPosition.EM);
        // }
    }

    const getListDepartment = async () => {
        // let resListDepartment = await fetchDepartmentList();
        // if (resListDepartment && resListDepartment.EC === 0) {
        //     setDepartment(resListDepartment.DT)
        // }
        // else {
        //     toast.error(resListDepartment.EM);
        // }
    }

    const handleOnchangeForm = (value, inputName) => {
        //dùng hàm clonedeep để copy các phần tử (số nhiều) bên trong obj
        let _userDataDefault = _.cloneDeep(userDataDefault);
        _userDataDefault[inputName] = value;
        setuserDataDefault(_userDataDefault);
    }

    const checkValidateInput = () => {
        //valid tạo người dùng
        if (setActionModalUser === 'UPDATE')
            return true;
        setValidInput(validateInputDefault); //set lại validData các input về mặc định mỗi khi component này được render ra
        let check = true;

        function isPhone(number) {
            return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(number);
        }

        function isEmail(email) {
            return /(.+)@(.+){2,}\.(.+){2,}/.test(email);
        }

        for (const key of Object.keys(userDataDefault)) {
            if (userDataDefault.fullName.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.fullName = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa nhập họ tên!");
                check = false;
                break;
            }

            if (userDataDefault.userName.length < 5) {
                //cập nhật biến array
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.userName = false;
                setValidInput(_validInput);

                toast.error("Tên người dùng phải tối thiểu 5 ký tự!");
                check = false;
                break;
            }

            if (userDataDefault.password.length < 5) {
                //cập nhật biến array
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.password = false;
                setValidInput(_validInput);

                toast.error("Mật khẩu phải tối thiểu 5 ký tự!");
                check = false;
                break;
            }

            if (!isPhone(userDataDefault.phone)) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.phone = false;
                setValidInput(_validInput);

                toast.error("Số điện thoại không đúng định dạng!");
                check = false;
                break;
            }

            if (!isEmail(userDataDefault.email)) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.email = false;
                setValidInput(_validInput);

                toast.error("Email không đúng định dạng!");
                check = false;
                break;
            }

            if (userDataDefault.role.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.role = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa chọn vai trò!");
                check = false;
                break;
            }

            if (userDataDefault.position.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.position = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa chọn vị trí!");
                check = false;
                break;
            }

            if (userDataDefault.department.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.department = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa chọn khoa phòng!");
                check = false;
                break;
            }
            return check;
        }
    }

    const handleBtnSubmit = async () => {
        // let check = checkValidateInput();
        // if (check === true) {
        //     if (setActionModalUser === 'CREATE') {
        //         let response = await createNewUser(userDataDefault)
        //         if (response.EC === 1) {
        //             toast.warning(response.EM);
        //         }
        //         else if (response.EC === 2) {
        //             toast.error(response.EM);
        //         }
        //         else {
        //             toast.success(response.EM);
        //             props.onHide();
        //             setuserDataDefault(defaultUserData);
        //         }
        //     }
        //     else {
        //         let response = await updateUserById(userDataDefault)
        //         if (response.EC === 1) {
        //             toast.warning(response.EM);
        //         }
        //         else if (response.EC === 2) {
        //             toast.error(response.EM);
        //         }
        //         else {
        //             toast.success(response.EM);
        //             props.onHide();
        //             setuserDataDefault(defaultUserData);
        //         }
        //     }
        // }
    }

    const handleCloseModalUser = () => {
        props.onHide();
        setuserDataDefault(userDataDefault);
        setValidInput(validateInputDefault);
    }

    return (
        <>
            <Modal size='lg' show={props.show} onHide={() => handleCloseModalUser()}>
                <Modal.Header closeButton>
                    <Modal.Title><div className='text-primary text-uppercase'>{props.setActionModalUser === 'CREATE' ? 'Thêm người dùng' : 'Sửa người dùng'}</div></Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {(() => {
                        if (props.setActionModalUser === 'CREATE' || props.setActionModalUser === 'UPDATE') {
                            return (
                                <>
                                    <div className="user-info-container col-xs-12">
                                        <form method="POST" action="/user/create-user">
                                            <div className="container">
                                                <div className="row d-flex justify-content-center form-group">
                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="fullName" className="form-label">Họ tên</label>
                                                        <input type="text" className={validInput.fullName ? 'form-control' : 'form-control is-invalid'} id="fullName" name="fullName" value={userDataDefault.fullName} required
                                                            onChange={(event) => handleOnchangeForm(event.target.value, "fullName")}
                                                        />
                                                    </div>
                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="userName" className="form-label">Tên người dùng</label>
                                                        <input disabled={setActionModalUser === 'CREATE' ? false : true} type="text" className={validInput.userName ? 'form-control' : 'form-control is-invalid'} id="userName" name="userName" value={userDataDefault.userName} required
                                                            onChange={(event) => handleOnchangeForm(event.target.value, "userName")}
                                                        />
                                                    </div>
                                                    <div className="mb-3 col-sm-4 form-group">
                                                        {setActionModalUser === 'CREATE' &&
                                                            <>
                                                                <label htmlFor="userPassword" className="form-label">Password</label>
                                                                <input type="password" className={validInput.password ? 'form-control' : 'form-control is-invalid'} id="userPassword" name="userPassword" autoComplete="on" value={userDataDefault.password} required
                                                                    onChange={(event) => handleOnchangeForm(event.target.value, "password")}
                                                                />
                                                            </>
                                                        }
                                                    </div>
                                                </div>

                                                <div className="row mt-3 row mt-3 d-flex justify-content-center">
                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="userPhone" className="form-label">Số điện thoại</label>
                                                        <input type="tel" className={validInput.phone ? 'form-control' : 'form-control is-invalid'} id="userPhone" name="userPhone" value={userDataDefault.phone} required
                                                            onChange={(event) => handleOnchangeForm(event.target.value, "phone")}
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="userEmail" className="form-label">Email</label>
                                                        <input type="email" className={validInput.email ? 'form-control' : 'form-control is-invalid'} id="userEmail" name="userEmail" value={userDataDefault.email} required
                                                            onChange={(event) => handleOnchangeForm(event.target.value, "email")}
                                                        />
                                                    </div>

                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="userRole" className="form-label">Vai trò</label>
                                                        <select name="userRole" id="userRole" className={validInput.role ? 'form-control' : 'form-control is-invalid'} onChange={(event) => handleOnchangeForm(event.target.value, "role")} value={userDataDefault.role}>
                                                            <option defaultValue="" hidden>Hãy chọn vai trò</option>
                                                            {listRole.length > 0 &&
                                                                listRole.map((itemRoleList, indexRoleList) => {
                                                                    return (
                                                                        <option key={`role-${indexRoleList}`} value={itemRoleList.id}>{itemRoleList.roleName}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="row mt-3 row mt-3 d-flex justify-content-center">
                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="userPosition" className="form-label">Vị trí</label>
                                                        <select name="userPosition" id="userPosition" className={validInput.position ? 'form-control' : 'form-control is-invalid'} onChange={(event) => handleOnchangeForm(event.target.value, "position")} value={userDataDefault.position}>
                                                            <option defaultValue="" hidden>Hãy chọn vị trí</option>
                                                            {listPosition.length > 0 && listPosition.map((itemPositionList, indexPositionList) => {
                                                                return (
                                                                    <option key={`position-${indexPositionList}`} value={itemPositionList.id}>{itemPositionList.positionName}</option>
                                                                )
                                                            })
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className="mb-3 col-sm-4 form-group">
                                                        <label htmlFor="userDepartment" className="form-label">Khoa Phòng</label>
                                                        <select name="userDepartment" id="userDepartment" className={validInput.department ? 'form-control' : 'form-control is-invalid'} onChange={(event) => handleOnchangeForm(event.target.value, "department")} value={userDataDefault.department}>
                                                            <option defaultValue="" hidden>Hãy chọn khoa phòng</option>
                                                            {listDepartment.length > 0 && listDepartment.map((itemDepartmentList, indexDepartmentList) => {
                                                                return (
                                                                    <option key={`department-${indexDepartmentList}`} value={itemDepartmentList.id}>{itemDepartmentList.departmentName}</option>
                                                                )
                                                            })
                                                            }
                                                        </select>
                                                    </div>

                                                    <div className="mb-3 col-sm-4">
                                                        <label htmlFor="userImage" className="form-label">Ảnh chân dung</label>
                                                        <input type="file" className="form-control" id="userImage" name="userImage" />
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </>
                            )
                        }
                    })()}
                </Modal.Body>

                <Modal.Footer>
                    {setActionModalUser === 'CREATE' ?
                        <Button variant="primary" onClick={() => handleBtnSubmit()}>Thêm</Button>
                        :
                        <Button variant="success" onClick={() => handleBtnSubmit()}>Sửa</Button>
                    }
                    <Button variant="secondary" onClick={() => handleCloseModalUser()}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalUser;
