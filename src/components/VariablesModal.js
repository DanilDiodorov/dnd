import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import { setVariablesModalOpen } from '../store/slices/modalSlice'
import {
    Button,
    IconButton,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { setModelVariables } from '../store/slices/modelSlice'
import convertValue from '../utils/convertValue'
import { toast } from 'sonner'

const VariablesModal = () => {
    const { variablesModalOpen } = useSelector((state) => state.modals)
    const { modelVariables } = useSelector((state) => state.models)
    const [fields, setFields] = useState(null)
    const { register, unregister, handleSubmit } = useForm()
    const [variables, setVariables] = useState(null)
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setVariablesModalOpen(false))
        clearRegister()
        setFields(null)
        setVariables(null)
    }

    useEffect(() => {
        if (variables) {
            if (Object.keys(variables).length === 0) {
                setFields(<ListItem>Нет переменных</ListItem>)
            } else {
                setFields(
                    Object.keys(variables).map((key, index) => {
                        let type = Array.isArray(variables[key])
                            ? 'array'
                            : typeof variables[key]
                        return (
                            <ListItem
                                key={index}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr 1fr auto',
                                    gap: '10px',
                                }}
                            >
                                <TextField
                                    {...register(`name_${index}`, {
                                        required: true,
                                    })}
                                    defaultValue={key}
                                    label="Имя"
                                    id={`name_${index}`}
                                />
                                <TextField
                                    {...register(`value_${index}`)}
                                    defaultValue={
                                        type === 'object'
                                            ? JSON.stringify(variables[key])
                                            : variables[key]
                                    }
                                    label="Значение"
                                />
                                <Select
                                    {...register(`type_${index}`)}
                                    defaultValue={type}
                                >
                                    <MenuItem value="number">number</MenuItem>
                                    <MenuItem value="string">string</MenuItem>
                                    <MenuItem value="boolean">boolean</MenuItem>
                                    <MenuItem value="array">array</MenuItem>
                                    <MenuItem value="object">object</MenuItem>
                                </Select>
                                <IconButton
                                    onClick={() => onDelete(index)}
                                    aria-label="delete"
                                    size="large"
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                            </ListItem>
                        )
                    })
                )
            }
        } else {
            setFields(<ListItem>Нет переменных</ListItem>)
        }
    }, [variables])

    useEffect(() => {
        if (variablesModalOpen) setVariables(modelVariables)
    }, [modelVariables, variablesModalOpen])

    const onDelete = (i) => {
        let temp = { ...variables }
        Object.keys(variables).map((key, index) => {
            if (i === index) delete temp[key]
        })
        clearRegister()
        setFields(null)
        setVariables(temp)
    }

    const clearRegister = () => {
        let i = 0
        for (let {} in variables) {
            unregister(`name_${i}`)
            unregister(`value_${i}`)
            unregister(`type_${i}`)
            i++
        }
    }

    const onAdd = () => {
        let i = 0
        for (let {} in variables) {
            i++
        }
        const temp = { ...variables }
        temp[`new_item_${i}`] = ''
        setVariables(temp)
    }

    const onSubmit = (data) => {
        try {
            const newData = {}
            let i = 0
            while (true) {
                if (!data[`name_${i}`]) break
                try {
                    newData[data[`name_${i}`]] = convertValue(
                        data[`value_${i}`],
                        data[`type_${i}`]
                    )
                } catch (error) {
                    throw new Error('Ошибка')
                }
                i++
            }
            dispatch(setModelVariables(newData))
            toast.success('Успешно сохранено!')
            handleClose(data)
        } catch (error) {
            toast.error('Неправильный формат JSON')
        }
    }
    return (
        <ModalWindow
            title="Переменные"
            isOpen={variablesModalOpen}
            onClose={handleClose}
        >
            <List>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fields}
                    <ListItem>
                        <Button
                            onClick={onAdd}
                            variant="outlined"
                            startIcon={<AddIcon />}
                        >
                            Добавить
                        </Button>
                    </ListItem>
                    <ListItem
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px',
                        }}
                    >
                        <Button variant="text" onClick={handleClose}>
                            Отмена
                        </Button>
                        <Button type="submit" variant="contained">
                            Сохранить
                        </Button>
                    </ListItem>
                </form>
            </List>
        </ModalWindow>
    )
}

export default VariablesModal
