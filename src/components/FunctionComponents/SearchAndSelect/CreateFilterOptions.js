import React, { useEffect, useState } from 'react';
import _, { assign, cloneDeep, set } from 'lodash';
import { toast } from 'react-toastify';
//bs5
import Button from 'react-bootstrap/Button';
//mui theme
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ButtonMui from '@mui/material/Button';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
//api
import { createTaskCategory, getTaskCategory } from '../../../services/taskService';

const filter = createFilterOptions();

export default function CreateFilterOptions(props) {
    //config data was sent by Modal AssignDivineWorkPublic
    const [listTaskCategory, setListTaskCategory] = useState([]);
    //config thêm loại công việc
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({ category_Name: '' });

    const [indexTaskCategory, setIndexTaskCategory] = useState('');

    const getListTaskCategory = async () => {
        let resultListTaskCategory = await getTaskCategory();
        setListTaskCategory(resultListTaskCategory);
    }

    const handleClose = () => {
        setDialogValue({
            category_Name: '',
        });
        toggleOpen(false);
    };

    const handleFindIndexTaskCategory = (task_Catagory_Id) => {
        let index = listTaskCategory.findIndex(object => object.task_Catagory_Id === task_Catagory_Id);
        console.log(index)
        setIndexTaskCategory(index);
    }

    const handleSubmit = async (event) => {
        let response = await createTaskCategory(dialogValue.category_Name);
        if (response === 200) {
            toast.success('Thêm loại công việc thành công!');
            getListTaskCategory();
            // setValue({
            //     category_Name: dialogValue.title,
            //     year: parseInt(dialogValue.year, 10),
            // });
            handleClose();
        }
    };

    useEffect(() => {
        getListTaskCategory();
        if (props.stateExtra2.task_Catagory_Id !== '') {
            handleFindIndexTaskCategory(props.stateExtra2.task_Catagory_Id);
        }
    }, [props.stateExtra2])

    return (
        <>
            <Autocomplete
                options={listTaskCategory}
                value={indexTaskCategory !== '' ? listTaskCategory[indexTaskCategory] : null}
                getOptionLabel={(option) => option?.category_Name}
                renderOption={(props, option) => <li {...props}>{option.category_Name}</li>}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            toggleOpen(true);
                            setDialogValue({
                                category_Name: newValue,
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            category_Name: newValue.inputValue,
                        });
                    } else {
                        //setValue(newValue);
                        if (newValue !== null) {
                            props.stateExtra2.task_Catagory_Id = newValue.task_Category_Id;
                            props.stateExtra2.task_Catagory_Name = newValue.category_Name;

                            let index = listTaskCategory.findIndex(object => object.task_Category_Id === newValue.task_Category_Id)
                            console.log(props.stateExtra2);
                            props.setStateExtra2(props.stateExtra2);
                            setIndexTaskCategory(index);
                        }
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue === '') {
                        return filtered;
                    }
                    else if (params.inputValue !== '') {
                        const result = options.filter((obj) => obj.category_Name.toLowerCase().includes(params.inputValue.toLowerCase()));
                        //nếu tìm trong options không có thì sẽ vào phía dưới để tạo data mới
                        if (result.length === 0) {
                            let newInputValue = [];
                            newInputValue.push({
                                inputValue: params.inputValue,
                                category_Name: `Thêm loại công việc "${params.inputValue}"`,
                            });
                            return newInputValue;
                        }
                        else {
                            return filtered;
                        }
                    }
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys={false}
                renderInput={(params) => <TextField {...params} label="Loại công việc" />}
            />
            {/* <Autocomplete
                style={{ width: '100%' }}
                value={dataModalAssignDivineWorkPublic.task_Catagory_Name !== '' ? listTaskCategory[indexTaskCategory] : null}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        // timeout to avoid instant validation of the dialog's form.
                        setTimeout(() => {
                            toggleOpen(true);
                            setDialogValue({
                                category_Name: newValue,
                            });
                        });
                    } else if (newValue && newValue.inputValue) {
                        toggleOpen(true);
                        setDialogValue({
                            category_Name: newValue.inputValue,
                        });
                    } else {
                        //setValue(newValue);
                        if (newValue !== null) {
                            //set stateExtra2 và truyền ngược lại cho ModalAssignDivineWorkPublic
                            let input_task_Catagory_Id = 'task_Catagory_Id';
                            let input_task_Catagory_Name = 'task_Catagory_Name';

                            let _dataModalAssignDivineWorkPublic = _.cloneDeep(dataModalAssignDivineWorkPublic);
                            _dataModalAssignDivineWorkPublic[input_task_Catagory_Id] = newValue.task_Category_Id;
                            _dataModalAssignDivineWorkPublic[input_task_Catagory_Name] = newValue.category_Name;
                            let index = listTaskCategory.findIndex(object => object.task_Catagory_Id === newValue.task_Category_Id)
                            setIndexTaskCategory(index);
                            props.setStateExtra2(_dataModalAssignDivineWorkPublic);
                        }
                        else {
                            setDataModalAssignDivineWorkPublic(props.stateExtra2);
                        }
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    if (params.inputValue === '') {
                        return filtered;
                    }
                    else if (params.inputValue !== '') {
                        const result = options.filter((obj) => obj.category_Name.toLowerCase().includes(params.inputValue.toLowerCase()));
                        //nếu tìm trong options không có thì sẽ vào phía dưới để tạo data mới
                        if (result.length === 0) {
                            let newInputValue = [];
                            newInputValue.push({
                                inputValue: params.inputValue,
                                category_Name: `Thêm loại công việc "${params.inputValue}"`,
                            });
                            return newInputValue;
                        }
                        else {
                            return filtered;
                        }
                    }
                }}
                options={listTaskCategory}
                getOptionLabel={(option) => option?.category_Name}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys={false}
                renderOption={(props, option) => <li {...props}>{option.category_Name}</li>}
                renderInput={(params) => <TextField {...params} label="Loại công việc" />}
            /> */}
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Thêm loại công việc</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" id="name" value={dialogValue.category_Name} label="Tên loại công việc" type="text" variant="standard"
                            onChange={(event) =>
                                setDialogValue({
                                    ...dialogValue,
                                    category_Name: event.target.value,
                                })} />
                    </DialogContent>
                    <DialogActions>
                        <ButtonMui onClick={handleSubmit} variant='contained' color='primary'>Thêm</ButtonMui>
                        <Button onClick={handleClose} variant="secondary" >Hủy</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
