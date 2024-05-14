import React, { useState, useContext, useEffect } from 'react'
import moment from 'moment';
import 'moment/locale/vi';
import { UserContext } from '../../context/UserContext';
import ReactPaginate from 'react-paginate';
import "./SCSS/ListDoc.scss";
import ModalDocument from '../ManageDocument/ModalDocument';
import { getListByUserLimitNumberPage } from '../../services/docService'


function ListDoc() {
    const { user } = useContext(UserContext);
    //set ẩn hiện cho modal
    const [isShowModalDoc, setIsShowModalDoc] = useState(false);

    //set phương thức thực hiện cho modal
    const [actionModalDoc, setActionModalDoc] = useState("CREATE");

    //set paginate 
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [listDoc, setListDoc] = useState([]);

    //lấy data trong table row để truyền qua modal khác để edit
    const [dataDocEdit, setDataDocEdit] = useState({});

    //lấy data trong table row để truyền qua modal khác
    const [dataDoc, setDataDoc] = useState({});

    //config search field
    const [searchValue, setSearchValue] = useState('');
    const keys = ["document_Incomming_Title", "document_Incomming_Content", "document_Incomming_TimeStart", "document_Incomming_Deadline", "document_Incomming_Time"];

    const btnActiveModalAddDoc = () => {
        setActionModalDoc("CREATE");
        setIsShowModalDoc(true);
    }

    const btnInActiveModalAddDoc = () => {
        setDataDocEdit({});
        fetchAllDoc();
    }

    const btnEdit = (itemListDoc) => {
        setActionModalDoc("EDIT");
        setDataDocEdit(itemListDoc)
        setIsShowModalDoc(true);
    }

    const btnInfo = (itemListDoc) => {
        setActionModalDoc("INFO");
        setDataDocEdit(itemListDoc)
        setIsShowModalDoc(true);
    }

    const btnFeedBack = (itemListDoc) => {
        setActionModalDoc("FEEDBACK");
        setDataDoc(itemListDoc);
        setIsShowModalDoc(true);
    }

    const btnDel = (itemListDoc) => {
        setActionModalDoc("DELETE");
        setDataDoc(itemListDoc);
        setIsShowModalDoc(true);
    }

    const btnHandOver = () => {
        setActionModalDoc("HANDOVER");
        setIsShowModalDoc(true);
    }

    const handlePageClick = (event) => {
        setCurrentPage(+event.selected + 1)
    };

    const fetchAllDoc = async () => {
        let result = await getListByUserLimitNumberPage(currentLimit, currentPage);
        if (result.documents.length !== 0) {
            setTotalPages(result.totalPages);
            setListDoc(result.documents)
        }
    }

    useEffect(() => {
        fetchAllDoc();
    }, [currentPage])

    return (
        <>
            <div>
                <div className='table-index'>
                    <div className='container mt-3'>
                        <div className='user-body'>
                            <div className='row mb-2 mt-1'>
                                <div className='col-4'>
                                    <h3 className="row text-primary text-uppercase mb-2">Danh sách văn bản</h3>
                                </div>
                                <div className='col-4 mt-1'>
                                    <form method='GET' autoComplete='off'>
                                        <div className='d-flex'>
                                            <input type="text" className="form-control fa py-2" placeholder="&#xF002; Tìm văn bản..." name="keyDoc" onChange={(e) => setSearchValue(e.target.value)} style={{ fontFamily: "Arial, FontAwesome" }} />
                                            {/* <button type="button" className="btn btn-warning ml-2 py-2 "><i className="fa fa-search text-white"></i></button> */}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="row">
                                {user && user.isAuthenticated === true && user.account.departmentId === 'HCQT' ?
                                    <>
                                        <div className='px-0' style={{ display: "block", zIndex: "100" }}>
                                            <button className='btn btn-primary mb-3 col-1 add-doc' style={{ paddingRight: "7.1rem" }} onClick={() => btnActiveModalAddDoc()} ><i className="fa fa-plus i-add"></i>Tạo văn bản</button>
                                        </div>
                                    </>
                                    :
                                    <></>
                                }
                                <div className="row  mt-2">
                                    <table className="table table-hover table-bordered ">
                                        <thead>
                                            <tr>
                                                <th scope='col'>STT</th>
                                                <th scope="col">Tên văn bản</th>
                                                <th scope="col">Mô tả văn bản</th>
                                                <th scope="col">Thời hạn xử lý</th>
                                                <th scope="col">Thời gian gửi lên</th>
                                                <th scope="col">Trạng thái</th>
                                                <th scope="col">Phản hồi</th>
                                                {user && user.isAuthenticated === true && user.account.departmentName === 'Phòng Hành chính quản trị' ?
                                                    <><th scope="col">Thao tác</th></>
                                                    :
                                                    null
                                                }
                                            </tr>
                                        </thead>

                                        <tbody className='text-start'>
                                            {listDoc.filter((itemListDoc) => {
                                                // return searchValue.toLocaleLowerCase() === '' ? itemListDoc : itemListDoc.docName.toLocaleLowerCase().includes(searchValue)
                                                return keys.some(key => itemListDoc[key].toLowerCase().includes(searchValue))
                                            }).map((itemListDoc, indexListDoc) => {
                                                return (
                                                    <tr key={`row-${indexListDoc}`}>
                                                        <td>{(currentPage - 1) * currentLimit + indexListDoc + 1}</td>
                                                        <td style={{ width: '20.4%' }}><button className='title-doc text-start' onClick={() => btnInfo(itemListDoc)}>{itemListDoc.document_Incomming_Title}</button></td>
                                                        <td style={{ width: '22.8%' }}>{itemListDoc.document_Incomming_Content}</td>
                                                        <td className='align-middle'>{`${moment(itemListDoc.document_Incomming_TimeStart).format('L')} ${moment(itemListDoc.document_Incomming_Deadline).format('L')}`}</td>
                                                        <td className='align-middle'>{`${moment(itemListDoc.document_Incomming_Time).format('llll')}`}</td>
                                                        {/* <td>{itemListDoc.docHandOver.length !== 0 ? itemListDoc.docHandOver : null}</td> */}
                                                        <td className='align-middle'>
                                                            {(() => {
                                                                if (itemListDoc.document_Incomming_State === 0) {
                                                                    return (
                                                                        <>
                                                                            <span className="status rounded-pill wait">Chờ duyệt</span>
                                                                        </>
                                                                    )
                                                                }
                                                                else if (itemListDoc.document_Incomming_State === 1) {
                                                                    return (
                                                                        <>
                                                                            <span className="status rounded-pill checked">Đã duyệt</span>
                                                                        </>
                                                                    )
                                                                }
                                                                else if (itemListDoc.document_Incomming_State === 2) {
                                                                    return (
                                                                        <>
                                                                            <span className="status rounded-pill ahead">Bàn giao</span>
                                                                        </>
                                                                    )
                                                                }
                                                                else {
                                                                    return (
                                                                        <>
                                                                            <span className="status rounded-pill success">Hoàn thành</span>
                                                                        </>
                                                                    )
                                                                }
                                                            })()}
                                                        </td>

                                                        <td className='align-middle text-center'>
                                                            <button className="btn btn-info" onClick={() => btnFeedBack(itemListDoc)}> <i className="fa-solid fa fa-envelope text-white"></i></button>
                                                        </td>

                                                        {user && user.isAuthenticated === true && user.account.departmentName === 'Phòng Hành chính quản trị' ?
                                                            <td className='align-middle'>
                                                                {(() => {
                                                                    if (itemListDoc.document_Incomming_State === 0) {
                                                                        return (
                                                                            <>
                                                                                <button className="btn btn-warning" onClick={() => btnEdit(itemListDoc)}> <i className="fa-solid fa-pen-to-square text-white"></i></button>
                                                                                <button className="btn btn-danger mx-2" onClick={() => btnDel(itemListDoc)} > <i className="fa-solid fa-trash text-white"></i></button>
                                                                            </>
                                                                        )
                                                                    } else if (itemListDoc.document_Incomming_State === 1) {
                                                                        return (
                                                                            <>
                                                                                <button className="btn btn-share" style={{ backgroundColor: "#d63384" }} onClick={() => btnHandOver()}> <i className="fa-solid fa fa fa-share text-white"></i></button>
                                                                            </>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            null
                                                                        )
                                                                    }
                                                                })()}
                                                            </td>
                                                            :
                                                            <></>
                                                        }
                                                    </tr>
                                                )
                                            })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {totalPages > 0 &&
                            <div className='table-footer row d-flex justify-content-center mt-2'>
                                <div className='col-6 d-flex justify-content-center table-paginate'>
                                    <ReactPaginate
                                        nextLabel=">"
                                        onPageChange={handlePageClick}
                                        pageRangeDisplayed={3}
                                        marginPagesDisplayed={4}
                                        pageCount={totalPages}
                                        previousLabel="<"
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
                            </div>
                        }
                    </div>
                </div>
            </div>

            <ModalDocument
                active={isShowModalDoc}
                //reset lại data cho modal theo action edit
                inactive={btnInActiveModalAddDoc}
                close={setIsShowModalDoc}
                setActionModalDoc={actionModalDoc}
                assignDataDocEdit={dataDocEdit}
                assignDataDoc={dataDoc}
            />
        </>
    )
}

export default ListDoc
