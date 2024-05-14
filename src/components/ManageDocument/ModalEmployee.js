import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const ModalEmployee = (isOpen, onClose) => {
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const handleModal = () =>{
    console.log('clicked!!!');
    onClose();
  }

  const handleDateStartChange = (e) =>{
    setDateStart(e.target.value);
  }

  const handleDateEndChange = (e) =>{
    setDateEnd(e.target.value);
  }


  return (
    <>
     <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Example Modal"
    >
      <div>
        <label>
          Name:
          <input type="text"  onChange={handleDateStartChange} />
        </label>
      </div>
      <div>
        <label>
          Age:
          <input type="text" onChange={handleDateEndChange} />
        </label>
      </div>
      <button onClick={handleModal}>Submit</button>
    </Modal>
    </>
  )
}

export default ModalEmployee
