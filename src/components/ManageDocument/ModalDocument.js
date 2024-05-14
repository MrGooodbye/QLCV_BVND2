import "./Document.scss";
import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import _, { set } from 'lodash';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import moment from "moment";
import Modal from 'react-bootstrap/Modal';
import ModalPreviewDocument from './ModalPreviewDocument';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
//import components react datepicker
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMonths } from 'date-fns';
import vi from "date-fns/locale/vi";
//import some shit to create assign to department
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
//import react file icon
import { FileIcon, defaultStyles } from 'react-file-icon';
//import doc service api
import { createDocIncoming } from "../../services/docService";
import { Box } from "@mui/material";
import { NIL } from "uuid";
// registerLocale("vi", vi);

function ModalAddDoc(props) {
    const { assignDataDocEdit } = props
    const { user } = useContext(UserContext);

    //set default value đại diện cho các ô input
    const defaultDocData = {
        docName: '',
        docExpireStart: '',
        docExpireEnd: '',
        docDes: '',
        files: '',
        docHandOver: ''
    }

    //biến để check validate khi submit, khi onChange
    const validateInputDefault = {
        docName: true,
        docFile: true,
        docExpireStart: true,
        docExpireEnd: true,
        docDes: true,
        docHandOver: true,
    }

    //tạo state cho defaultDocData để mỗi khi event onChange được gọi sẽ set data lại
    const [docData, setdocData] = useState(defaultDocData);
    //tạo state cho valid input 
    const [validInput, setValidInput] = useState(validateInputDefault);

    //pdf onChange inputFile state
    const [fileName, setFileName] = useState();
    const [dataFile, setDataFile] = useState([]);
    const [pdfFile, setPdfFile] = useState();
    const [ext, setExt] = useState();

    //config modalPreview
    const [isShowModalPreviewDoc, setIsShowModalPreviewDoc] = useState(false);
    const [isAllow, setIsAllow] = useState(false);

    //config reactDatePicker
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const onChangeStart = (dateStart) => {
        if (dateStart === null) {
            setStartDate('');
        }
        else {
            let startDate = new Date((dateStart));
            setStartDate(startDate);
        }
    };

    const onChangeEnd = (dateEnd) => {
        if (dateEnd === null) {
            setEndDate('');
        }
        else {
            let endDate = new Date((dateEnd));
            setEndDate(endDate);
        }
    };

    //config react mui checkboxes
    const icon = <CheckBoxOutlineBlankIcon fontSize="medium" />
    const checkedIcon = <CheckBoxIcon fontSize="medium" />

    const dataPhongKhoa = [
        {
            "idPhongKhoa": 1,
            "tenPhongKhoa": "Phòng Kế hoạch tổng hợp"
        },
        {
            "idPhongKhoa": 2,
            "tenPhongKhoa": "Phòng Tổ chức cán bộ"
        },
        {
            "idPhongKhoa": 3,
            "tenPhongKhoa": "Phòng Tài chính kế toán"
        },
        {
            "idPhongKhoa": 4,
            "tenPhongKhoa": "Phòng Hành chính quản trị"
        },
        {
            "idPhongKhoa": 5,
            "tenPhongKhoa": "Phòng Điều dưỡng"
        },
        {
            "idPhongKhoa": 6,
            "tenPhongKhoa": "Phòng Công nghệ thông tin"
        },
        {
            "idPhongKhoa": 7,
            "tenPhongKhoa": "Phòng Quản lý chất lượng"
        },
        {
            "idPhongKhoa": 8,
            "tenPhongKhoa": "Phòng Chỉ đạo tuyến"
        },
        {
            "idPhongKhoa": 9,
            "tenPhongKhoa": "Phòng Vật tư, trang thiết bị y tế"
        },
        {
            "idPhongKhoa": 10,
            "tenPhongKhoa": "Phòng Công tác xã hội"
        },
        {
            "idPhongKhoa": 11,
            "tenPhongKhoa": "Khoa Khám bệnh"
        },
        {
            "idPhongKhoa": 12,
            "tenPhongKhoa": "Khoa Sức khỏe trẻ em"
        },
        {
            "idPhongKhoa": 13,
            "tenPhongKhoa": "Khoa Phòng khám chất lượng cao - Tâm lý"
        },
        {
            "idPhongKhoa": 14,
            "tenPhongKhoa": "Khoa Ngoại tổng hợp"
        },
        {
            "idPhongKhoa": 15,
            "tenPhongKhoa": "Khoa Bỏng - Chính trực"
        },
        {
            "idPhongKhoa": 16,
            "tenPhongKhoa": "Khoa Thận niệu"
        },
        {
            "idPhongKhoa": 17,
            "tenPhongKhoa": "Khoa Ngoại thần kinh"
        },
        {
            "idPhongKhoa": 18,
            "tenPhongKhoa": "Khoa Liên chuyên khoa (Mắt, Tai Mũi Họng, Răng Hàm Mặt)"
        },
        {
            "idPhongKhoa": 19,
            "tenPhongKhoa": "Khoa Gây mê hồi sức"
        },
        {
            "idPhongKhoa": 20,
            "tenPhongKhoa": "Khoa Hồi sức tích cực - Chống độc"
        },
        {
            "idPhongKhoa": 21,
            "tenPhongKhoa": "Khoa Hồi sức sơ sinh"
        },
        {
            "idPhongKhoa": 22,
            "tenPhongKhoa": "Khoa Cấp cứu"
        },
        {
            "idPhongKhoa": 23,
            "tenPhongKhoa": "Khoa Điều trị ban ngày"
        },
        {
            "idPhongKhoa": 24,
            "tenPhongKhoa": "Khoa Sơ sinh"
        },
        {
            "idPhongKhoa": 25,
            "tenPhongKhoa": "Khoa thận nội tiết"
        },
        {
            "idPhongKhoa": 26,
            "tenPhongKhoa": "Khoa Hô hấp 1"
        },
        {
            "idPhongKhoa": 27,
            "tenPhongKhoa": "Khoa hô hấp 2"
        },
        {
            "idPhongKhoa": 28,
            "tenPhongKhoa": "Khoa Nội tổng hợp"
        },
        {
            "idPhongKhoa": 29,
            "tenPhongKhoa": "Khoa Thần kinh"
        },
        {
            "idPhongKhoa": 30,
            "tenPhongKhoa": "Khoa Tim mạch"
        },
        {
            "idPhongKhoa": 31,
            "tenPhongKhoa": "Khoa Nhiễm"
        },
        {
            "idPhongKhoa": 32,
            "tenPhongKhoa": "Khoa Ung bướu huyết học"
        },
        {
            "idPhongKhoa": 33,
            "tenPhongKhoa": "Khoa Tiêu hóa"
        },
        {
            "idPhongKhoa": 34,
            "tenPhongKhoa": "Khoa Nội 1"
        },
        {
            "idPhongKhoa": 35,
            "tenPhongKhoa": "Khoa Nội 2"
        },
        {
            "idPhongKhoa": 36,
            "tenPhongKhoa": "Khoa Nội 3"
        },
        {
            "idPhongKhoa": 37,
            "tenPhongKhoa": "Khoa Phẫu thuật trong ngày"
        },
        {
            "idPhongKhoa": 38,
            "tenPhongKhoa": "Khoa Dinh dưỡng"
        },
        {
            "idPhongKhoa": 39,
            "tenPhongKhoa": "Khoa Gan, mật, tụy và ghép gan"
        },
        {
            "idPhongKhoa": 40,
            "tenPhongKhoa": "Khoa COVID-19"
        },
        {
            "idPhongKhoa": 41,
            "tenPhongKhoa": "Khoa Hồi sức tích cực Nhiễm và COVID-19"
        },
        {
            "idPhongKhoa": 42,
            "tenPhongKhoa": "Khoa Kiểm soát nhiễm khuẩn"
        },
        {
            "idPhongKhoa": 43,
            "tenPhongKhoa": "Khoa Dược"
        },
        {
            "idPhongKhoa": 44,
            "tenPhongKhoa": "Khoa Huyết học"
        },
        {
            "idPhongKhoa": 45,
            "tenPhongKhoa": "Khoa Hóa sinh"
        },
        {
            "idPhongKhoa": 46,
            "tenPhongKhoa": "Khoa Vi sinh"
        },
        {
            "idPhongKhoa": 47,
            "tenPhongKhoa": "Khoa Giải phẫu bệnh"
        },
        {
            "idPhongKhoa": 48,
            "tenPhongKhoa": "Khoa Chuẩn đoán hình ảnh"
        }
    ];

    const checkPDF = 'application/pdf';
    const checkXLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const checkDoc = 'application/msword';
    const checkDocx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const checkJPG = 'image/jpeg';
    const checkPNG = 'image/png';

    const checkDocType =
        ['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/msword', 'application/pdf', 'image/jpeg', 'image/png'
        ]; //docx, xlsx, doc, pdf, jpeg, png

    const handleOnchangeInput = (value, inputName) => {
        setValidInput(validateInputDefault);
        let _docData = _.cloneDeep(docData);
        _docData[inputName] = value;
        setdocData(_docData);
        // {
        //code này dùng để hiện class in-valid khi đang nhập input khác
        //     if (value.length === 0 && inputName === 'docName' || value.length < 5 && inputName === 'docName') {
        //         let _validInput = _.cloneDeep(validInput);
        //         _validInput.docName = false;
        //         setValidInput(_validInput);
        //     }

        //     if (value.length >= 5 && inputName === 'docName') {
        //         let _validInput = _.cloneDeep(validInput);
        //         _validInput.docName = true;
        //         setValidInput(_validInput);
        //     }

        //     if (value.length === 0 && inputName === 'docDes') {
        //         let _validInput = _.cloneDeep(validInput);
        //         _validInput.docDes = false;
        //         setValidInput(_validInput);
        //     }

        //     if (value.length !== 0 && inputName === 'docDes') {
        //         let _validInput = _.cloneDeep(validInput);
        //         _validInput.docDes = true;
        //         setValidInput(_validInput);
        //     }
        // }

        if (value.length === 0 && inputName === 'docName' || value.length < 5 && inputName === 'docName') {
            let _validInput = _.cloneDeep(validateInputDefault);
            _validInput.docName = false;
            setValidInput(_validInput);
        }

        if (value.length >= 5 && inputName === 'docName') {
            let _validInput = _.cloneDeep(validateInputDefault);
            _validInput.docName = true;
            setValidInput(_validInput);
        }
    }

    const handleOnfocusInput = (event) => {
        setValidInput(validateInputDefault);
        let inputName = event.target.name;
        if (event.target.value.length === 0 && inputName === "title") {
            let _validInput = _.cloneDeep(validateInputDefault);
            _validInput.docName = true;
            setValidInput(_validInput);
        }
        else if (event.target.value.length < 5 && inputName === "title") {
            let _validInput = _.cloneDeep(validateInputDefault);
            _validInput.docName = false;
            setValidInput(_validInput);
        }
    }

    const handleOnClickInputFile = (event) => {
        setValidInput(validateInputDefault);
        try {
            let fileType = event.target.files[0].type
            if (fileType && checkPDF.includes(fileType)) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.docFileData = true;
                setValidInput(_validInput);
            }

            else if (fileType && checkDocType.includes(fileType)) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.docFileData = false;
                setValidInput(_validInput);
            }

            else {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.docFileData = false;
                setValidInput(_validInput);
            }

        } catch (error) {
            // console.log('chua chon file');
        }
    }

    //xử lý file, đọc file để preview file
    const handleFile = (event) => {
        let selectedFile = event.target.files;

        if (selectedFile) {
            let i;
            let count = 0;
            for (i = 0; i < selectedFile.length; i++) {
                if (`${selectedFile[i].type}` === checkPDF) {
                    //set lại docName của state docData
                    let fileName = selectedFile[i].name.split(".");
                    docData.docName = fileName[0];
                    setdocData(docData);
                    setIsAllow(true);
                    count++;
                    break;
                }
            }

            if (count === 0) {
                toast.error('Hãy chọn ít nhất một file pdf!');
                docData.docName = '';
                docData.files = selectedFile;
                setdocData(docData);
                setIsAllow(false);
            }

            else {
                setDataFile([...dataFile, selectedFile]);
                docData.files = selectedFile;
                setdocData(docData);
                setIsAllow(true);

            }
        }
        else {
            toast.warning('Xin hãy chọn văn bản!');
            docData.docName = '';
            setdocData(docData);
            setIsAllow(false);
        }
    }

    const formatDateISO8601 = () => {
        //lấy value của 2 ô input date start và date end
        let docExpireStartValue = document.getElementById("dateStart").value;
        let docExpireEndValue = document.getElementById("dateFinish").value;

        //cắt value
        let docExpireStartValueFormat = docExpireStartValue.split("/");
        let docExpireEndValueFormat = docExpireEndValue.split("/");

        //template string chuỗi đã cắt thành chuỗi yyyy/mm/dd
        let docStartDate = `${docExpireStartValueFormat[2]}${docExpireStartValueFormat[1]}${docExpireStartValueFormat[0]}`;
        let docEndDate = `${docExpireEndValueFormat[2]}${docExpireEndValueFormat[1]}${docExpireEndValueFormat[0]}`;

        //format chuỗi yyyy/mm/dd sang ISO-8601
        let stringDateStart = moment(docStartDate)
        let TimeStart = moment(docStartDate).format("YYYY-MM-DDTHH:mm:ssZ");

        let stringDateEnd = moment(docEndDate)
        let TimeEnd = moment(docEndDate).format("YYYY-MM-DDT23:59:ssZ");

        docData.docExpireStart = TimeStart;
        docData.docExpireEnd = TimeEnd;
    }

    //đóng modal này
    const handleOnCloseModal = () => {
        props.close(false);
        setdocData(defaultDocData);
        setStartDate('');
        setEndDate('');
        setValidInput(validateInputDefault);
        setIsAllow(false);
    }

    const checkValidInputWhenSubmit = () => {
        setValidInput(validateInputDefault)
        let count = 0;
        let check = true;
        for (const key of Object.keys(docData)) {
            if (docData.docName.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.docName = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa đặt tên cho văn bản!");
                check = false;
                break;
            }
            else if (docData.docDes.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.docDes = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa nhập mô tả cho văn bản!");
                check = false;
                break;
            }
            else if (docData.files.length === 0) {
                let _validInput = _.cloneDeep(validateInputDefault);
                _validInput.docFile = false;
                setValidInput(_validInput);

                toast.error("Bạn chưa chọn văn bản!");
                check = false;
                break;
            }
            else if (docData.files.length !== 0) {
                for (const keyFile of Object.keys(docData.files)) {
                    if (docData.files[keyFile].type === checkPDF) {
                        count++
                        break;
                    }
                }
                if (count === 0) {
                    toast.error('Bạn chưa chọn file pdf!');
                }
                break;
            }
        }
        return check;
    }

    const btnSubmit = async () => {
        let check = checkValidInputWhenSubmit();
        if (check === true) {
            formatDateISO8601();
            let formDataFile = new FormData();

            let i;
            for (i = 0; i < dataFile.length; i++) {
                formDataFile.append('files', dataFile[i])
            }

            docData.files = formDataFile;

            let result = await createDocIncoming(docData);
            if (result === 200) {
                toast.success('Tạo văn bản thành công!');
                setdocData(defaultDocData);
                document.getElementById("doc").value = "";
                setStartDate('');
                setEndDate('');
                setDataFile('');
                setIsAllow(false);
            }
            else {
                toast.error('Tạo văn bản thất bại, vui lòng thử lại!')
            }
        }
        else {
            console.log('khong duoc submit')
        }
    }

    const btnHandOver = () => {
        alert('ban giao');
    }

    const showPDF = () => {
        setIsShowModalPreviewDoc(true);
    }

    const mergeArray = (dataFilee) => {
        dataFilee.map((itemDataFile, indexDataFile) => {
            for (let i = 0; i < dataFilee.length; i++) {
                console.log('zxcvzxcvzxcvxzc', dataFilee[i])
            }
        })
    }

    useEffect(() => {
        if (props.setActionModalDoc === "EDIT" || props.setActionModalDoc === "INFO") {
            setdocData({ ...assignDataDocEdit })
            setStartDate(false) //set giá trị cho state startDate để enabled cho ô input expireDate
            setEndDate(false)
        }
    }, [assignDataDocEdit])

    return (
        <>
            <div>
                <Modal show={props.active} onHide={() => handleOnCloseModal()} size="lg" style={props.setActionModalDoc === 'EDIT' || props.setActionModalDoc === 'CREATE' ? '' : { marginTop: '2.5rem' }}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {(() => {
                                if (props.setActionModalDoc === "CREATE") {
                                    return (
                                        <div className='text-primary text-uppercase'>Tạo văn bản</div>
                                    )
                                } else if (props.setActionModalDoc === "EDIT") {
                                    return (
                                        <div className='text-primary text-uppercase'>Sửa văn bản</div>
                                    )
                                } else if (props.setActionModalDoc === "DELETE") {
                                    return (
                                        <div className='text-primary text-uppercase'>Xóa văn bản</div>
                                    )
                                } else if (props.setActionModalDoc === "INFO") {
                                    return (
                                        <div className='text-primary text-uppercase'>Thông tin văn bản</div>
                                    )
                                } else if (props.setActionModalDoc === "FEEDBACK") {
                                    return (
                                        <div className='text-primary text-uppercase'>Phản hồi văn bản</div>
                                    )
                                } else {
                                    return (
                                        <div className='text-primary text-uppercase'>Bàn giao văn bản</div>
                                    )
                                }
                            })()}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="user-info-container col-xs-12" >
                            <form method="POST" action="/user/create-user" autoComplete='off' >
                                <div className="container" style={{ overflow: "visible" }}>
                                    <div className="row d-flex justify-content-center form-group">
                                        {(() => {
                                            if (props.setActionModalDoc === "CREATE" || props.setActionModalDoc === "EDIT" || props.setActionModalDoc === "INFO") {
                                                return (
                                                    <>
                                                        <div className="row">
                                                            <div className='col-sm-12'>
                                                                <label htmlFor="tit" className="form-label">Tên văn bản</label>
                                                                <input type="text" className={validInput.docName ? 'form-control' : 'form-control is-invalid'} id="tit" name="title" value={docData.docName || ""}
                                                                    onChange={(event) => handleOnchangeInput(event.target.value, "docName")}
                                                                    onFocus={(event) => handleOnfocusInput(event)}
                                                                    // onBlur={(event) => handleOutfocusInput(event)}
                                                                    autoComplete="off"
                                                                    required
                                                                />
                                                            </div>
                                                            {props.setActionModalDoc === "INFO" ?
                                                                <></>
                                                                :
                                                                <>
                                                                    <div className="mt-3 col-sm-12">
                                                                        <label htmlFor="doc" className="form-label">Văn bản</label>
                                                                        <input type="file" name="document" id="doc" className={validInput.docFile ? 'form-control' : 'form-control is-invalid'}
                                                                            onChange={(event) => handleFile(event)}
                                                                            onClick={(event) => handleOnClickInputFile(event)}
                                                                            autoComplete="off"
                                                                            accept=".xls,.xlsx,.doc,.docx,.pdf,.ppt,pptx,.jpg,.jpeg,.png"
                                                                            multiple
                                                                        />
                                                                    </div>
                                                                </>
                                                            }
                                                            <div className="mt-4 mb-3 col-sm-12 " >
                                                                <div className="date-expire-group">
                                                                    <fieldset className="border rounded-3 p-4 ">
                                                                        <legend className="float-none w-auto"
                                                                            style={{ fontWeight: "bold", color: "#dc3545", fontSize: "1.1rem" }}>Thời hạn xử lý</legend>
                                                                        <div className="row date-expire-input d-flex">
                                                                            <div className="date-start-group col-sm-6">
                                                                                <div className="input-date-start">
                                                                                    <div className="mx-2" style={{ display: "inline-block" }}>
                                                                                        <label htmlFor="dateStart" >Từ ngày</label>
                                                                                    </div>
                                                                                    <DatePicker
                                                                                        className={validInput.docExpireStart ? 'form-control' : 'form-control is-invalid'}
                                                                                        autoComplete="off"
                                                                                        showPopperArrow={true}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        locale="vi"
                                                                                        minDate={new Date()}
                                                                                        maxDate={addMonths(new Date(), 12)}
                                                                                        todayButton="Hôm nay"
                                                                                        selected={startDate !== false || docData.docExpireStart === undefined ? startDate : new Date(docData.docExpireStart)}
                                                                                        onChange={onChangeStart}
                                                                                        startDate={startDate}
                                                                                        showMonthYearDropdown //không viết tắt của tháng
                                                                                        // useShortMonthInDropdown //viết tắt của tháng 
                                                                                        showTwoColumnMonthYearPicker
                                                                                        disabledKeyboardNavigation
                                                                                        isClearable={true}
                                                                                        id='dateStart'
                                                                                        onKeyDown={(event) => { event.preventDefault() }}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            <div className="date-finish-group col-sm-6">
                                                                                <div className="input-date-finish">
                                                                                    <div className="mx-2" style={{ display: "inline-block" }}>
                                                                                        <label htmlFor="dateFinish" className="form-label">Đến ngày</label>
                                                                                    </div>
                                                                                    <DatePicker
                                                                                        className={validInput.docExpireEnd ? 'form-control' : 'form-control is-invalid'}
                                                                                        autoComplete="off"
                                                                                        showPopperArrow={true}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        locale="vi"
                                                                                        minDate={startDate === false ? new Date(docData.docExpireStart) : startDate}
                                                                                        maxDate={addMonths(new Date(), 12)}
                                                                                        todayButton="Hôm nay"
                                                                                        selected={endDate !== false || docData.docExpireEnd === undefined ? endDate : new Date(docData.docExpireEnd)}
                                                                                        onChange={onChangeEnd}
                                                                                        endDate={endDate}
                                                                                        showMonthYearDropdown //không viết tắt của tháng
                                                                                        // useShortMonthInDropdown //viết tắt của tháng 
                                                                                        showTwoColumnMonthYearPicker
                                                                                        disabledKeyboardNavigation
                                                                                        isClearable={true}
                                                                                        id='dateFinish'
                                                                                        disabled={startDate === "" ? true : false}
                                                                                        onKeyDown={(event) => { event.preventDefault() }}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </fieldset>
                                                                </div>
                                                            </div >
                                                            <div className="mb-2 mt-2 col-sm-12">
                                                                <label htmlFor="des" className="form-label">Mô tả văn bản</label>
                                                                <textarea className={validInput.docDes ? 'form-control' : 'form-control is-invalid'} id="des" name="description" rows="4" value={docData.docDes || ""} onChange={(event) => handleOnchangeInput(event.target.value, "docDes")} autoComplete="off" ></textarea>
                                                            </div>
                                                            {props.setActionModalDoc === "INFO" ?
                                                                <>
                                                                    <div className="mb-2 mt-2 col-sm-12">
                                                                        <p className="fs-5 fw-bolder" style={{ color: '#212529' }}>Các file đính kèm</p>
                                                                        <div className="wrap-type-icon-file" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="doc" {...defaultStyles.doc} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="docx" {...defaultStyles.docx} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte filaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="pdf" {...defaultStyles.pdf} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="xls" {...defaultStyles.xls} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0 mr-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="xlsx" {...defaultStyles.xlsx} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="doc" {...defaultStyles.doc} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="pptx" {...defaultStyles.pptx} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon extension="ppt" {...defaultStyles.ppt} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon color="lavender" extension="jpeg" {...defaultStyles.jpeg} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                            <div className="display-type-file-icon col-2 px-0 py-0 mr-0">
                                                                                <Tooltip title="day la full title cua van ban khi hover vao icon" TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                    <Box>
                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                            <FileIcon color="lavender" extension="jpg" {...defaultStyles.jpg} />
                                                                                        </div>
                                                                                    </Box>
                                                                                </Tooltip>
                                                                                <p className="mt-2 tilte-doc">tilte fileaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </>
                                                                :
                                                                null
                                                            }

                                                            {props.setActionModalDoc === "CREATE" || props.setActionModalDoc === "EDIT" ?
                                                                dataFile.length > 0 ?
                                                                    <>
                                                                        {mergeArray(dataFile)}
                                                                        <div className="mb-2 mt-2 col-sm-12">
                                                                            <p className="fs-6 fw-bolder" style={{ color: '#212529' }}>Các file đính kèm</p>
                                                                            <div className="wrap-type-icon-file" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
                                                                                {dataFile.map((itemDataFile, indexDataFile) => {
                                                                                    for (let i = 0; i < itemDataFile.length; i++) {
                                                                                        return (
                                                                                            <div className="display-type-file-icon col-2 px-0 py-0" key={`file-${indexDataFile}`}>
                                                                                                <Tooltip title={itemDataFile[i].name} TransitionComponent={Fade} TransitionProps={{ timeout: 550 }} arrow>
                                                                                                    <Box>
                                                                                                        <div style={{ width: '60%', margin: 'auto' }}>
                                                                                                            {(() => {
                                                                                                                if (itemDataFile[i].type === checkPDF) {
                                                                                                                    return (
                                                                                                                        <><FileIcon extension="pdf" {...defaultStyles.pdf} /></>
                                                                                                                    )
                                                                                                                }
                                                                                                                else if (itemDataFile[i].type === checkDoc) {
                                                                                                                    return (
                                                                                                                        <><FileIcon extension="doc" {...defaultStyles.doc} /></>
                                                                                                                    )
                                                                                                                }
                                                                                                                else if (itemDataFile[i].type === checkDocx) {
                                                                                                                    return (
                                                                                                                        <><FileIcon extension="docx" {...defaultStyles.docx} /></>
                                                                                                                    )
                                                                                                                }
                                                                                                                else if (itemDataFile[i].type === checkXLSX) {
                                                                                                                    return (
                                                                                                                        <><FileIcon extension="xlsx" {...defaultStyles.xlsx} /></>
                                                                                                                    )
                                                                                                                }
                                                                                                                else if (itemDataFile[i].type === checkJPG) {
                                                                                                                    return (
                                                                                                                        <><FileIcon color="lavender" extension="jpg" {...defaultStyles.jpg} /></>
                                                                                                                    )
                                                                                                                }
                                                                                                                else if (itemDataFile[i].type === checkPNG) {
                                                                                                                    return (
                                                                                                                        <><FileIcon color="lavender" extension="png" {...defaultStyles.png} /></>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()}
                                                                                                        </div>
                                                                                                    </Box>
                                                                                                </Tooltip>
                                                                                                <p className="mt-2 tilte-doc">{itemDataFile[i].name}</p>
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    null
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            }

                                            else if (props.setActionModalDoc === "DELETE") {
                                                return (
                                                    <Modal.Body style={{ textAlign: "center" }}>Bạn có chắc muốn xóa văn bản "<strong>{props.assignDataDoc.docName}</strong>" này không?</Modal.Body>
                                                )
                                            }

                                            else if (props.setActionModalDoc === "FEEDBACK") {
                                                return (
                                                    <Modal.Body style={{ textAlign: "center" }}>đây là nội dung mà phòng giám đốc sẽ phản hồi cho phòng văn thư nếu có, nó sẽ hiển thị khi văn bản đang ở trạng thái từ chối, trả về chỉnh sửa, đã duyệt</Modal.Body>
                                                )
                                            }

                                            else {
                                                return (
                                                    <>
                                                        <div className="row row d-flex justify-content-center">
                                                            <div className="mt-2 col-sm-12">
                                                                <label htmlFor="mention" className="form-label">Bàn giao tới phòng khoa</label>
                                                                <Autocomplete
                                                                    multiple
                                                                    id="mention"
                                                                    options={dataPhongKhoa}
                                                                    disableCloseOnSelect
                                                                    getOptionLabel={(option) => option.tenPhongKhoa}
                                                                    renderOption={(props, option, { selected }) => (
                                                                        <li {...props}>
                                                                            <Checkbox
                                                                                icon={icon}
                                                                                checkedIcon={checkedIcon}
                                                                                style={{ marginRight: 8 }}
                                                                                checked={selected}
                                                                            />
                                                                            {option.tenPhongKhoa}
                                                                        </li>
                                                                    )}
                                                                    style={{ width: 715 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row mt-4 row d-flex justify-content-center">
                                                            <div className="col-sm-12">
                                                                <label htmlFor="mention" className="form-label">Bàn giao tới cá nhân</label>
                                                                <Autocomplete
                                                                    multiple
                                                                    id="mention"
                                                                    options={dataPhongKhoa}
                                                                    disableCloseOnSelect
                                                                    getOptionLabel={(option) => option.tenPhongKhoa}
                                                                    renderOption={(props, option, { selected }) => (
                                                                        <li {...props}>
                                                                            <Checkbox
                                                                                icon={icon}
                                                                                checkedIcon={checkedIcon}
                                                                                style={{ marginRight: 8 }}
                                                                                checked={selected}
                                                                            />
                                                                            {option.tenPhongKhoa}
                                                                        </li>
                                                                    )}
                                                                    style={{ width: 715 }}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} />
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                        })()}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body >

                    <Modal.Footer>
                        {(() => {
                            if (props.setActionModalDoc === "CREATE") {
                                return (
                                    <>
                                        {isAllow === true ?
                                            <Button variant="light" onClick={() => showPDF()} style={{ backgroundColor: "#4dd4ac", borderColor: "white" }}>Xem trước văn bản</Button>
                                            :
                                            <></>
                                        }
                                        <Button variant="primary" onClick={() => btnSubmit()}>Tạo</Button>
                                    </>
                                )
                            } else if (props.setActionModalDoc === "EDIT") {
                                return (
                                    <>
                                        <Button variant="primary" onClick={() => btnSubmit()}>Sửa</Button>
                                    </>
                                )

                            } else if (props.setActionModalDoc === "DELETE") {
                                return (
                                    <>
                                        <Button variant="primary" onClick={() => btnSubmit()}>Xóa</Button>
                                    </>
                                )
                            } else if (props.setActionModalDoc === "INFO") {
                                return (
                                    <>
                                        {docData.docStatus === 0 && user.isAuthenticated === true && user.account.departmentName === "Phòng Giám đốc" ?
                                            <><Button variant="primary">Duyệt</Button></>
                                            :
                                            <></>
                                        }
                                    </>
                                )
                            } else if (props.setActionModalDoc === "FEEDBACK") {
                                return (
                                    <></>
                                )
                            } else {
                                return (
                                    <>
                                        <Button variant="primary" onClick={() => btnHandOver()}>Bàn giao</Button>
                                    </>
                                )
                            }
                        })()}
                        <Button variant="btn btn-secondary" onClick={() => handleOnCloseModal()}>Đóng</Button>
                    </Modal.Footer>
                </Modal >

                {/* có thể truyền cả phương thức của 1 state qua cho component khác */}
                < ModalPreviewDocument
                    open={isShowModalPreviewDoc}
                    close={setIsShowModalPreviewDoc}
                    dataModalPreviewDoc={pdfFile}
                    setExt={ext}
                    resetdataModalPreviewDoc={setPdfFile}
                    resetExt={setExt}
                />
            </div >
        </>
    )
}

export default ModalAddDoc