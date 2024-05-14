import React, { useState, useEffect, useContext } from 'react';
import ModalDeleteUser from '../ManageUsers/ModalDeleteUser';
import ModalUser from '../ManageUsers/ModalUser';
import ReactPaginate from 'react-paginate';
import './SCSS/ListUser.scss';
import { toast, ToastContainer } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import Typography from '@mui/material/Typography';

const ListUser = (props) => {
    const { user } = useContext(UserContext);

    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    //Modal delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});

    //Modal update, create
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});


    useEffect(() => {
        fetchUsers();
    }, [currentPage])

    const fetchUsers = async () => {

    }

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
    };

    //nhấn vào nút sửa
    const btnEditUserFunc = (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    }

    const btnCloseEdit = async () => {
        setIsShowModalUser(false);
        setDataModalUser({});
        await fetchUsers();
    }

    //nhấn vào nút xóa
    const btnDeleteFunc = async (user) => {
        setDataModal(user);
        setIsShowModalDelete(true);
    }

    //không đồng ý xóa user
    const handleClose = () => {
        setDataModal({});
        setIsShowModalDelete(false);
    }

    //đồng ý xóa user
    const handleConfirmDeleteUser = async () => {
        // let response = await deleteUserById(dataModal)
        // if (response && response.data.EC === 0) {
        //     toast.success(response.data.EM)
        //     await fetchUsers();
        //     setIsShowModalDelete(false);
        // }
        // else {
        //     toast.error(response.data.EM)
        // }
    }

    return (
        <>
            {/* <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            /> */}

            <div className="container mt-4">
                <div className='manage-users-container'>
                    <div className='user-header'>
                        <h3 className="row text-primary text-uppercase mb-3">{`Danh sách người dùng ${user.account.departmentName}`}</h3>
                        <div className='actions'>
                            <button className='btn btn-primary mb-3 add-user' onClick={() => { setIsShowModalUser(true); setActionModalUser("CREATE") }}><i className="fa fa-plus i-add"></i>Thêm người dùng</button>
                        </div>
                    </div>
                    <div className='user-body'>
                        <div className="row">
                            {listUsers && listUsers.length > 0 ?
                                <table className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope='col'>STT</th>
                                            <th scope="col">Họ tên</th>
                                            <th scope="col">Tên người dùng</th>
                                            <th scope="col">Số điện thoại</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Vai trò</th>
                                            <th scope="col">Vị trí</th>
                                            <th scope="col">Khoa phòng</th>
                                            <th scope="col">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <>
                                            {listUsers.map((itemUserList, indexUserList) => {
                                                return (
                                                    <tr key={`row-${indexUserList}`}>
                                                        <td>{(currentPage - 1) * currentLimit + indexUserList + 1}</td>
                                                        <td>{itemUserList.fullName}</td>
                                                        <td>{itemUserList.userName}</td>
                                                        <td>{itemUserList.phone}</td>
                                                        <td>{itemUserList.email}</td>
                                                        <td>{itemUserList.role ? itemUserList.role.roleName : ''}</td>
                                                        <td>{itemUserList.position ? itemUserList.position.positionName : ''}</td>
                                                        <td>{itemUserList.department ? itemUserList.department.departmentName : ''}</td>
                                                        <td>
                                                            <button className="btn btn-warning" onClick={() => btnEditUserFunc(itemUserList)}> <i className="fa-solid fa-pen-to-square text-white"></i></button>
                                                            <button className="btn btn-danger mx-2" onClick={() => btnDeleteFunc(itemUserList)}> <i className="fa-solid fa-trash"></i></button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </>
                                    </tbody>
                                </table>
                                :
                                <><Typography variant='body1' fontSize={17} color='black' className='text-center'>Không tìm thấy danh sách người dùng, hãy thêm mới!</Typography></>
                            }
                        </div>
                    </div>
                    {totalPages > 0 &&
                        <div className='user-footer'>
                            <ReactPaginate
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={4}
                                pageCount={totalPages}
                                previousLabel="< previous"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                            />
                        </div>
                    }
                </div>
            </div>

            {/* {gọi components} */}
            <ModalDeleteUser
                //dưới này dùng 1 tên cụ thể nào đó để gọi components gốc lấy đó làm props, vd props.show
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDeleteUser={handleConfirmDeleteUser}
                dataModal={dataModal}
            />

            <ModalUser
                show={isShowModalUser}
                onHide={btnCloseEdit}
                setActionModalUser={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </>
    );
}

export default ListUser;



