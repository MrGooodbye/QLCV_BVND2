import React, { useState, useContext, useEffect, useRef } from 'react';
import _, { cloneDeep } from 'lodash';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import viLocale from '@fullcalendar/core/locales/vi';
import moment from 'moment';
//bs5
import * as bootstrap from "bootstrap";
//mui theme
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
//css
import "./SCSS/Work.scss";
//modal
import ModalWork from '../ManageWork/ModalWork';
//api
import { getListTaskReceiveCurrentMonth, getListTaskReceiveByMonthAndYear, getByTaskId } from '../../services/taskService';

function MyWorkCalendar() {
    const [workCalenderList, setWorkCalenderList] = useState([]);
    const [eventList, setEventList] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const [unfinishedTask, setUnfinishedTask] = useState([]);
    const [nearingDeadlineTask, setNearingDeadlineTask] = useState([]);
    const [overdueTask, setOverdueTask] = useState([]);
    const [completedTask, setCompletedTask] = useState([]);

    const [doSomething, setDoSomething] = useState(false);

    const calendarRef = useRef();

    //config Modal Work
    const [openModalWork, setOpenModalWork] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [filterOptions, setFilterOptions] = useState({
        completed: true,
        nearingDeadline: true,
        overdue: true,
        unfinished: true,
    });

    const handleGetTaskScheduleByUserId = async () => {
        let responseWorkCalenderList = await getListTaskReceiveCurrentMonth();
        setWorkCalenderList(responseWorkCalenderList);

        let events = responseWorkCalenderList.map((task) => ({
            id: task.task_Id,
            title: task.task_Title,
            description: task.task_Content,
            start: task.task_DateStart,
            end: task.task_State === 5 ? task.time_Update : task.task_DateEnd,
            taskEnd: task.task_DateEnd,
            timeEnd: task.time_Update,
            state: task.task_State,
            stateTask: handleRenderTaskState(task.task_DateEnd, task.task_DateStart, task.task_State),
            titleColor: 'black',
            backgroundColor: handleRenderColor(task.task_DateEnd, task.task_DateStart, task.task_State),
            borderColor: handleRenderColor(task.task_DateEnd, task.task_DateStart, task.task_State)
        }))

        setEventList(events);

        let title = document.querySelector('.fc-toolbar-title').innerText;
        let matches = title.match(/tháng (\d+) năm (\d+)/); // Sử dụng biểu thức chính quy để tìm kiếm
        let month = matches[1];
        let year = matches[2];
        setSelectedMonth(month);
        setSelectedYear(year);

        let myDiv = document.querySelector('.fc-toolbar-title');
        myDiv.prepend("Lịch công việc ");
    }

    const handleGetTaskScheduleByMonthAndYear = async (month, year) => {
        let listTaskSchedule = await getListTaskReceiveByMonthAndYear(month, year);
        setWorkCalenderList(listTaskSchedule);

        let events = listTaskSchedule.map((task) => ({
            id: task.task_Id,
            title: task.task_Title,
            description: task.task_Content,
            start: task.task_DateStart,
            end: task.task_State === 5 ? task.time_Update : task.task_DateEnd,
            taskEnd: task.task_DateEnd,
            timeEnd: task.time_Update,
            state: task.task_State,
            stateTask: handleRenderTaskState(task.task_DateEnd, task.task_DateStart, task.task_State),
            titleColor: 'black',
            backgroundColor: handleRenderColor(task.task_DateEnd, task.task_DateStart, task.task_State),
            borderColor: handleRenderColor(task.task_DateEnd, task.task_DateStart, task.task_State)
        }))

        setEventList(events);
    }

    const handleRenderColor = (end, start, state) => {
        let startDay = moment(start).startOf('day');
        let endDay = moment(end).startOf('day');
        let today = moment().startOf('day');

        if (state === 5) {
            return '#66bb6a'; // Màu cho trạng thái 5
        }
        else if (endDay.diff(today, 'days') < 0) {
            return '#ef5350'; // Màu cho hết hạn
        }
        else if (endDay.diff(today, 'days') === 0) {
            return '#ffa726'; // Màu cho gần hết hạn
        }
        else {
            return '#4fc3f7'; // Màu cho đang thực hiện
        }
    }

    const handleRenderTaskState = (end, start, state) => {
        let endDay = moment(end).startOf('day');
        let today = moment().startOf('day');

        if (state === 5) {
            return 5;
        }
        else if (endDay.diff(today, 'days') < 0) {
            return 4;
        }
        else if (endDay.diff(today, 'days') === 0) {
            return 3.5;
        }
        else {
            return 3;
        }
    }

    const handlePrevClickButton = () => {
        let currentView = calendarRef.current.getApi().view.type;
        calendarRef.current.getApi().prev();

        if (currentView === 'dayGridMonth') {
            let title = document.querySelector('.fc-toolbar-title').innerText;
            let matches = title.match(/tháng (\d+) năm (\d+)/); // Sử dụng biểu thức chính quy để tìm kiếm
            let month = matches[1];
            let year = matches[2];

            setSelectedMonth(month);
            setSelectedYear(year);
            setFilterOptions({
                completed: true,
                nearingDeadline: true,
                overdue: true,
                unfinished: true,
            })

            handleGetTaskScheduleByMonthAndYear(month, year);
        }
        else {
            let title = document.querySelector('.fc-toolbar-title').innerText;
            let matches = title.match(/(\d+), (\d+)/); // Sử dụng biểu thức chính quy để tìm kiếm
            let month = matches[1]; // Lấy số đầu tiên từ mảng kết quả
            let year = matches[2]; // Lấy số thứ hai từ mảng kết quả

            if (month !== selectedMonth || year !== selectedYear) {
                setSelectedMonth(month);
                setSelectedYear(year);
                handleGetTaskScheduleByMonthAndYear(month, year);
            }
        }
    }

    const handleNextClickButton = () => {
        let currentView = calendarRef.current.getApi().view.type;
        calendarRef.current.getApi().next();

        if (currentView === 'dayGridMonth') {
            let title = document.querySelector('.fc-toolbar-title').innerText;
            let matches = title.match(/tháng (\d+) năm (\d+)/); // Sử dụng biểu thức chính quy để tìm kiếm
            let month = matches[1];
            let year = matches[2];

            setSelectedMonth(month);
            setSelectedYear(year);
            setFilterOptions({
                completed: true,
                nearingDeadline: true,
                overdue: true,
                unfinished: true,
            })

            handleGetTaskScheduleByMonthAndYear(month, year);
        }
        else {
            let title = document.querySelector('.fc-toolbar-title').innerText;
            let matches = title.match(/(\d+), (\d+)/); // Sử dụng biểu thức chính quy để tìm kiếm
            let month = matches[1]; // Lấy số đầu tiên từ mảng kết quả
            let year = matches[2]; // Lấy số thứ hai từ mảng kết quả

            if (month !== selectedMonth || year !== selectedYear) {
                setSelectedMonth(month);
                setSelectedYear(year);
                handleGetTaskScheduleByMonthAndYear(month, year);
            }
        }
    }

    const handleMouseEnter = (info) => {
        return new bootstrap.Popover(info.el, {
            title: info.event.title,
            placement: "right",
            trigger: 'hover',
            customClass: "popoverStyle",
            content: `<p class='popoverContent'>${info.event._def.extendedProps.description}</p> <p class='popoverContent'>${moment(info.event.start).format('DD/MM/YYYY HH:mm')} - ${moment(info.event._def.extendedProps.taskEnd).format('DD/MM/YYYY HH:mm')}</p> <p class='popoverContent'>${info.event._def.extendedProps.state === 5 ? `Hoàn thành lúc: ${moment(info.event._def.extendedProps.timeEnd).format('DD/MM/YYYY HH:mm')}` : ''}</p>`,
            html: true
        });
    }

    const handleEventClick = (info) => {
        setTaskId(info.event.id);
        setOpenModalWork(true);
    }

    const handleDateClick = (info) => {
        const calendarApi = info.view.calendar;
        calendarApi.changeView('dayGridDay', info.date);
    }

    const handleCheckboxOnChange = (event, filterKey) => {
        setFilterOptions((prevOptions) => ({
            ...prevOptions,
            [filterKey]: event.target.checked,
        }))
        if (filterKey === 'unfinished') {
            if (event.target.checked === false) {
                let _eventList = cloneDeep(eventList);
                let filterEventList = _eventList.filter(task => task.stateTask !== 3);
                let filterUnfinishedTask = _eventList.filter(task => task.stateTask === 3);
                setEventList(filterEventList);
                setUnfinishedTask(filterUnfinishedTask);
            }
            else {
                let _eventList = cloneDeep(eventList);
                let updatedEventList = [..._eventList, ...unfinishedTask];
                setEventList(updatedEventList);
                setUnfinishedTask([]);
            }
        }
        else if (filterKey === 'nearingDeadline') {
            if (event.target.checked === false) {
                let _eventList = cloneDeep(eventList);
                let filterEventList = _eventList.filter(task => task.stateTask !== 3.5);
                let filterNearingDeadlineTask = _eventList.filter(task => task.stateTask === 3.5);
                setEventList(filterEventList);
                setNearingDeadlineTask(filterNearingDeadlineTask);
            }
            else {
                let _eventList = cloneDeep(eventList);
                let updatedEventList = [..._eventList, ...nearingDeadlineTask];
                setEventList(updatedEventList);
                setNearingDeadlineTask([]);
            }
        }
        else if (filterKey === 'overdue') {
            if (event.target.checked === false) {
                let _eventList = cloneDeep(eventList);
                let filterEventList = _eventList.filter(task => task.stateTask !== 4);
                let filterOverdueTask = _eventList.filter(task => task.stateTask === 4);
                setEventList(filterEventList);
                setOverdueTask(filterOverdueTask);
            }
            else {
                let _eventList = cloneDeep(eventList);
                let updatedEventList = [..._eventList, ...overdueTask];
                setEventList(updatedEventList);
                setOverdueTask([]);
            }
        }
        else {
            if (event.target.checked === false) {
                let _eventList = cloneDeep(eventList);
                let filterEventList = _eventList.filter(task => task.stateTask !== 5);
                let filterCompletedTask = _eventList.filter(task => task.stateTask === 5);

                setEventList(filterEventList);
                setCompletedTask(filterCompletedTask);
            }
            else {
                let _eventList = cloneDeep(eventList);
                let updatedEventList = [..._eventList, ...completedTask];
                setEventList(updatedEventList);
                setCompletedTask([]);
            }
        }
    }

    useEffect(() => {
        if (doSomething === true) {
            handleGetTaskScheduleByUserId();
            setDoSomething(false);
        }
        else {
            handleGetTaskScheduleByUserId();
        }
    }, [doSomething])

    return (
        <>
            <div className='mt-3 d-flex container-working-list-calendar'>
                <div className='instruction'>
                    <FormGroup>
                        <Typography variant="body1" sx={{ color: '#e91e63', fontSize: '24px' }}>Bộ lọc</Typography>
                        <FormControlLabel control={<Checkbox checked={filterOptions.unfinished} onChange={(event) => handleCheckboxOnChange(event, 'unfinished')} sx={{
                            color: '#03a9f4',
                            fill: '#03a9f4',
                            '&.Mui-checked': {
                                color: '#03a9f4',
                            },
                        }} />} label="Đang thực hiện" />

                        <FormControlLabel control={<Checkbox checked={filterOptions.nearingDeadline} onChange={(event) => handleCheckboxOnChange(event, 'nearingDeadline')} sx={{
                            color: '#ff9800',
                            fill: '#ff9800',
                            '&.Mui-checked': {
                                color: '#ff9800',
                            },
                            fontSize: '10px'
                        }} />} label="Gần hết hạn" />

                        <FormControlLabel control={<Checkbox checked={filterOptions.overdue} onChange={(event) => handleCheckboxOnChange(event, 'overdue')} sx={{
                            color: 'red',
                            fill: 'red',
                            '&.Mui-checked': {
                                color: 'red',
                            },
                        }} />} label="Hết hạn" />

                        <FormControlLabel control={<Checkbox checked={filterOptions.completed} onChange={(event) => handleCheckboxOnChange(event, 'completed')} sx={{
                            color: '#4caf50',
                            fill: '#4caf50',
                            '&.Mui-checked': {
                                color: '#4caf50',
                            },
                        }} />} label="Hoàn thành" />

                    </FormGroup>
                </div>
                <div className='working-list-calendar pl-3 pr-3' style={{ width: '85%' }}>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            start: 'today,prev,next',
                            center: 'title',
                            right: 'dayGridDay,dayGridWeek,dayGridMonth,listWeek',
                        }}
                        customButtons={{
                            prev: { click: handlePrevClickButton },
                            next: { click: handleNextClickButton }
                        }}
                        views={
                            {
                                dayGridMonth: { dayHeaderFormat: { weekday: 'long' }, dayMaxEvents: 6 },
                                dayGridWeek: { titleFormat: { year: 'numeric', month: 'long', day: 'numeric' } }
                            }
                        }
                        //showNonCurrentDates={false}
                        fixedWeekCount={false}
                        displayEventEnd={true}
                        eventTimeFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        }}
                        locale={viLocale}
                        events={eventList}
                        eventClick={handleEventClick}
                        dateClick={handleDateClick}
                        eventDidMount={handleMouseEnter}
                    />
                </div>
            </div>

            <ModalWork
                taskId={taskId}
                activeModalWork={openModalWork}
                closeModalWork={setOpenModalWork}

                makeMyWorkCalendarDo={setDoSomething}
            />
        </>

    )
}

export default MyWorkCalendar