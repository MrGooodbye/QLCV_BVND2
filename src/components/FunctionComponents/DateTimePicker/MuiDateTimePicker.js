import React, { useEffect, useState } from 'react';
import _, { assign, cloneDeep, set } from 'lodash';
import Dayjs from "dayjs";
//mui react date time picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
//mui theme
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';

export default function DateTimePickerViewRenderers(props) {
    //config data was sent by Modal AssignDivineWorkPublic

    const [dataModalAssignDivineWorkPublic, setDataModalAssignDivineWorkPublic] = useState(null);

    const [docDateStart, setDocDateStart] = useState();
    const [docDateEnd, setDocDateEnd] = useState();

    const [taskDateStart, setTaskDateStart] = useState();
    const [taskDateEnd, setTaskDateEnd] = useState();

    const handleSelectedDateTimeStartAssignWork = (dateTime) => {
        let hour = Dayjs().hour();
        let minutes = Dayjs().minute();

        if (taskDateStart) {
            if (docDateStart.$D > dateTime.$D || docDateEnd.$D < dateTime.$D || docDateStart.$M > dateTime.$M || docDateEnd.$M < dateTime.$M || docDateStart.$y > dateTime.$y || docDateEnd.$y < dateTime.$y) {
                toast.error('Ngày bắt đầu công việc không hợp lệ.');
            }
            else {
                setTaskDateStart(dateTime);
                handleSaveDateTimeStartAssignWork(dateTime);
            }
        }
        else {
            let DateSelectedWithCurrentTime = Dayjs().set('date', dateTime.$D).set('month', dateTime.$M).set('hour', hour).set('minute', minutes);
            setTaskDateStart(DateSelectedWithCurrentTime);
            handleSaveDateTimeStartAssignWork(DateSelectedWithCurrentTime);
        }
    }

    const handleSelectedDateTimeEndAssignWork = (dateTime) => {
        if (taskDateEnd) {
            if (docDateStart.$D > dateTime.$D || docDateEnd.$D < dateTime.$D || docDateStart.$M > dateTime.$M || docDateEnd.$M < dateTime.$M || docDateStart.$y > dateTime.$y || docDateEnd.$y < dateTime.$y) {
                toast.error('Ngày kết thúc công việc không hợp lệ.');
            }
            else {
                setTaskDateEnd(dateTime);
                handleSaveDateTimeEndAssignWork(dateTime);
            }
        }
        else {
            let DateSelectedWithCurrentTime = Dayjs().set('date', dateTime.$D).set('month', dateTime.$M).set('hour', 23).set('minute', 59);
            setTaskDateEnd(DateSelectedWithCurrentTime);
            handleSaveDateTimeEndAssignWork(DateSelectedWithCurrentTime);
        }
    }

    const handleSaveDateTimeStartAssignWork = (TaskDateStart) => {
        let value = JSON.stringify(TaskDateStart);

        let replaceFirst = _.replace(value, "\"", "");
        let replaceSecond = _.replace(replaceFirst, "\"", "");

        let input_task_DateStart = 'task_DateStart';
        let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataModalAssignDivineWorkPublic);
        _dataModalAssignDivineWorkPublic[input_task_DateStart] = replaceSecond;
        props.setStateExtra1(_dataModalAssignDivineWorkPublic);
    }

    const handleSaveDateTimeEndAssignWork = (TaskDateEnd) => {
        let value = JSON.stringify(TaskDateEnd);

        let replaceFirst = _.replace(value, "\"", "");
        let replaceSecond = _.replace(replaceFirst, "\"", "");

        let input_task_DateStart = 'task_DateEnd';
        let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataModalAssignDivineWorkPublic);
        _dataModalAssignDivineWorkPublic[input_task_DateStart] = replaceSecond;
        props.setStateExtra1(_dataModalAssignDivineWorkPublic);
    }

    useEffect(() => {
        if (Object.values(props.stateExtra1).every(value => value !== null || value !== '')) {
            setDataModalAssignDivineWorkPublic(props.stateExtra1);
            setDocDateStart(Dayjs(props.dataModalDivineWork.documentSend.document_Send_TimeStart));
            setDocDateEnd(Dayjs(props.dataModalDivineWork.documentSend.document_Send_Deadline));
        }
    }, [props.stateExtra1])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker', 'DateTimePicker']} sx={{ paddingBottom: '14px', paddingTop: '0px' }}>
                <div className='row col-12 pt-2'>
                    <div className='col-6' style={{ left: '30px' }}>
                        <DateTimePicker ampm={false} format='DD/MM/YYYY HH:mm' label="Từ ngày" views={['month', 'day']} value={props.stateExtra1.task_DateStart !== "" ? Dayjs(props.stateExtra1.task_DateStart) : taskDateStart ? taskDateStart : null}
                            minDate={Dayjs(props.dataModalDivineWork.documentSend.document_Send_TimeStart)} maxDate={Dayjs(props.dataModalDivineWork.documentSend.document_Send_Deadline)}
                            onChange={(e) => handleSelectedDateTimeStartAssignWork(e)} />
                    </div>
                    <div className='col-6' style={{ left: '25px' }}>
                        <DateTimePicker ampm={false} format='DD/MM/YYYY HH:mm' label="Đến ngày" views={['month', 'day']} value={props.stateExtra1.task_DateEnd !== "" ? Dayjs(props.stateExtra1.task_DateEnd) : taskDateEnd ? taskDateEnd : null}
                            minDate={Dayjs(taskDateStart)} maxDate={Dayjs(props.dataModalDivineWork.documentSend.document_Send_Deadline)}
                            onChange={(e) => handleSelectedDateTimeEndAssignWork(e)} />
                    </div>
                </div>
            </DemoContainer>
        </LocalizationProvider>

    );
}