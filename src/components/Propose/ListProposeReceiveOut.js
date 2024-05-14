import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../context/UserContext';
import ModalProposeReceiveOut from '../ManagePropose/ModalProposeReceiveOut';
import "./SCSS/ListPropose.scss";
import moment from 'moment';
import { Box, Typography } from "@mui/material";
import { DataGrid, GridToolbar, viVN } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import { getProposeReceiveOut } from '../../services/proposeService';
import { toast } from 'react-toastify';

function ListProposeReceiveOut() {
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
        { field: "stt", headerName: "STT", width: 100, valueGetter: (params) => params.row.stt },
        { field: "document_Incomming_Title", headerName: "Tên đề xuất", width: 280 },
        { field: "document_Incomming_Content", headerName: "Nội dung đề xuất", width: 410, renderCell: (params) => <ExpandableCell {...params} /> },
        { field: "deparment_NameSend", headerName: "Nơi gửi", width: 205 },
        { field: "document_Incomming_Time", headerName: "Thời gian gửi", width: 190, valueFormatter: (params) => moment(params.value).format('llll') },
        {
            field: "document_Incomming_State", headerName: "Trạng thái", headerAlign: 'center', width: 132, renderCell: (params) => {
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
                else if (params.row.document_Incomming_State === 4) {
                    return (
                        <><span className="status rounded-pill move-up">Chuyển tiếp</span></>
                    )
                }
                else if (params.row.document_Incomming_State === 5) {
                    return (
                        <><span className="status rounded-pill processing">Đang xử lý...</span></>
                    )
                }
                else if (params.row.document_Incomming_State === 6) {
                    return (
                        <><span className="status rounded-pill processed">Đã xử lý <i className="fa">&#xf00c;</i></span></>
                    )
                }
                else {
                    return (
                        <><span className="status rounded-pill wait">TH này chưa biết</span></>
                    )
                }
            }
        }
    ]
    const [listPropose, setListPropose] = useState([]);

    //config modal propose receive out
    const [showModalPropose, setShowModalPropose] = useState(false);
    const [actionModalPropose, setActionModalPropose] = useState("INFO");
    const [dataModalPropose, setDataModalPropose] = useState("");
    const [done, setDone] = useState(false);

    const btnActiveModalProposeActionInfo = (itemListPropose) => {
        setActionModalPropose("INFO")
        setDataModalPropose(itemListPropose.document_Incomming_Id);
        setShowModalPropose(true);
    }

    const fetchAllPropose = async () => {
        let resultListPropose = await getProposeReceiveOut();
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
                                    <h3 className="row text-primary text-uppercase mb-2">Đề xuất nhận từ phòng khoa</h3>
                                </div>
                            </div>

                            <div className="row mt-2">
                                <Box className="px-0 py-0 mt-2" sx={{ height: 'auto', width: '100%', '& .center': { justifyContent: 'center!important' } }}>
                                    <DataGrid
                                        style={{ fontSize: '15px' }}
                                        localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                                        rows={listPropose.map((row, index) => ({
                                            ...row,
                                            stt: index + 1,
                                        }))}
                                        columns={columns}
                                        getRowHeight={() => 'auto'}
                                        getCellClassName={(params) => {
                                            if (params.field === 'document_Incomming_State') {
                                                return 'center';
                                            }
                                            return '';
                                        }}
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

            <ModalProposeReceiveOut
                activeModalProposeReceiveOut={showModalPropose}
                closeModalProposeReceiveOut={setShowModalPropose}
                actionModalProposeReceiveOut={actionModalPropose}
                makeModalProposeReceiveOutDoing={setDone}
                dataModalProposeReceiveOut={dataModalPropose}
            />
        </>
    )
}

export default ListProposeReceiveOut