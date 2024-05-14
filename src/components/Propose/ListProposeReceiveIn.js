import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/UserContext';
import ReactPaginate from 'react-paginate';
import ModalProposeReceiveIn from '../ManagePropose/ModalProposeReceiveIn';
import "./SCSS/ListPropose.scss";
import moment from 'moment';
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import { getProposeReceiveIn } from '../../services/proposeService';
import { toast } from 'react-toastify';

const ListPropose = () => {
    const { user } = useContext(UserContext);

    //config default number propose to display in gridview
    const [pageSize, setPageSize] = useState(10);

    //config expand document_Incomming_Content
    const ExpandableCell = ({ value }) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <div>
                {expanded ? value : value.slice(0, 100)}
                {value.length > 100 && (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <Link
                        type="button"
                        component="button"
                        sx={{ fontSize: 'inherit' }}
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? 'bớt' : 'thêm'}
                    </Link>
                )}
            </div>
        );
    }

    //config datagrid columns name
    const columns = [
        { field: "stt", headerName: "STT", width: 100, flex: 1, valueGetter: (params) => params.row.stt },
        { field: "document_Incomming_Title", headerName: "Tên đề xuất", width: 300 },
        { field: "document_Incomming_Content", headerName: "Nội dung đề xuất", width: 420, renderCell: (params) => <ExpandableCell {...params} /> },
        { field: "document_Incomming_UserSend_FullName", headerName: "Người gửi", width: 180 },
        { field: "document_Incomming_Time", headerName: "Thời gian gửi", width: 185, valueFormatter: (params) => moment(params.value).format('llll') },
        {
            field: "document_Incomming_State", headerName: "Trạng thái", width: 132, renderCell: (params) => {
                if (params.row.document_Incomming_State === 0) {
                    return (
                        <><span className="status rounded-pill wait">Chờ duyệt</span></>
                    )
                }
                else if (params.row.document_Incomming_State === 1) {
                    return (
                        <><span className="status rounded-pill reject">Từ chối</span></>
                    )
                }
                else if (params.row.document_Incomming_State === 2) {
                    return (
                        <><span className="status rounded-pill edit">Chỉnh sửa</span></>
                    )
                }
                else if (params.row.document_Incomming_State === 3) {
                    return (
                        <><span className="status rounded-pill browse">Đã duyệt</span></>
                    )
                }
                else {
                    return (
                        <><span className="status rounded-pill move-up">Chuyển tiếp</span></>
                    )
                }
            }
        }
    ]

    const [listPropose, setListPropose] = useState([]);

    //config modal propose receive in
    const [showModalPropose, setShowModalPropose] = useState(false);
    const [dataModalPropose, setDataModalPropose] = useState({});
    const [actionModalPropose, setActionModalPropose] = useState("INFO");
    const [done, setDone] = useState(false);

    const btnActiveModalProposeActionInfo = (itemListPropose) => {
        setActionModalPropose("INFO");
        setDataModalPropose(itemListPropose);
        setShowModalPropose(true);
    }

    const fetchAllPropose = async () => {
        let resultListPropose = await getProposeReceiveIn();
        if (resultListPropose.length !== 0) {
            setListPropose(resultListPropose);
        }
    }

    useEffect(() => {
        if (done === true) {
            fetchAllPropose();
            setDone(false);
        }
        fetchAllPropose();
    }, [done])

    return (
        <>
            <div>
                <div className='table-index'>
                    <div className='container mt-3'>
                        <div className='user-body'>
                            <div className='row mb-2 mt-1'>
                                <div className='col-4'>
                                    <h3 className="row text-primary text-uppercase mb-2">Đề xuất nhận từ nhân viên</h3>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <Box className="px-0 py-0 mt-2" sx={{ height: 'auto', width: '100%' }}>
                                    <DataGrid
                                        style={{ fontSize: '15px' }}
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                        rows={listPropose.map((row, index) => ({
                                            ...row,
                                            stt: index + 1,
                                        }))}
                                        columns={columns}
                                        getRowHeight={() => 'auto'}
                                        components={{ Toolbar: GridToolbar }}
                                        //autoPageSize={true}
                                        autoHeight={true}
                                        pagination={true}
                                        pageSize={pageSize}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        rowsPerPageOptions={[5, 10, 15, 20, 30, 50, 100]}
                                        getRowId={(row) => row.document_Incomming_Id}
                                        onRowDoubleClick={(value) => btnActiveModalProposeActionInfo(value.row)}
                                        sx={{
                                            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                                                py: '10px',
                                            },
                                            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                                                py: '22px',
                                            },
                                        }}
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalProposeReceiveIn
                activeModalProposeReceiveIn={showModalPropose}
                closeModalProposeReceiveIn={setShowModalPropose}
                actionModalProposeReceiveIn={actionModalPropose}
                makeModalProposeReceiveInDoing={setDone}
                dataModalProposeReceiveIn={dataModalPropose}
            />
        </>
    )
}

export default ListPropose
