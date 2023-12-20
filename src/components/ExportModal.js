import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import { setExportModalOpen } from '../store/slices/modalSlice'
import { Button, IconButton, List, ListItem, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { setModelExport } from '../store/slices/modelSlice'
import { toast } from 'sonner'

const ExportModal = () => {
    const { exportModalOpen } = useSelector((state) => state.modals)
    const { modelExport } = useSelector((state) => state.models)
    const dispatch = useDispatch()
    const [fieds, setFields] = useState(null)
    const [exports, setExports] = useState()
    const { register, unregister, handleSubmit } = useForm()

    const handleClose = () => {
        dispatch(setExportModalOpen(false))
        clearRegister()
        setFields(null)
        setExports(null)
    }

    useEffect(() => {
        if (exports) {
            if (Object.keys(exports).length === 0) {
                setFields(<ListItem>Нет экспортов</ListItem>)
            } else {
                setFields(
                    Object.keys(exports).map((key, index) => {
                        let type = Array.isArray(exports[key])
                            ? 'array'
                            : typeof exports[key]
                        return (
                            <ListItem
                                key={index}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr auto',
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
                                            ? JSON.stringify(exports[key])
                                            : exports[key]
                                    }
                                    label="Значение"
                                />
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
            setFields(<ListItem>Нет экспортов</ListItem>)
        }
    }, [exports])

    useEffect(() => {
        if (exportModalOpen) setExports(modelExport)
    }, [modelExport, exportModalOpen])

    const onDelete = (i) => {
        let temp = { ...exports }
        Object.keys(exports).map((key, index) => {
            if (i === index) delete temp[key]
        })
        clearRegister()
        setFields(null)
        setExports(temp)
    }

    const clearRegister = () => {
        let i = 0
        for (let {} in exports) {
            unregister(`name_${i}`)
            unregister(`value_${i}`)
            i++
        }
    }

    const onAdd = () => {
        let i = 0
        for (let {} in exports) {
            i++
        }
        const temp = { ...exports }
        temp[`new_item_${i}`] = ''
        setExports(temp)
    }

    const onSubmit = (data) => {
        try {
            const newData = {}
            let i = 0
            while (true) {
                if (!data[`name_${i}`]) break
                newData[data[`name_${i}`]] = data[`value_${i}`]
                i++
            }
            dispatch(setModelExport(newData))
            toast.success('Успешно сохранено!')
            handleClose(data)
        } catch (error) {
            toast.error('Неправильный формат JSON')
        }
    }

    return (
        <ModalWindow
            title="Экспорты"
            isOpen={exportModalOpen}
            onClose={handleClose}
        >
            <List>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {fieds}
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

export default ExportModal
