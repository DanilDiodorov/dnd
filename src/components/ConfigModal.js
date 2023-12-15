import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setConfigModalOpen,
    setCurrentConfigs,
} from '../store/slices/modalSlice'
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
import convertValue from '../utils/convertValue'
import AddIcon from '@mui/icons-material/Add'
import { setConfigs } from '../store/slices/blockSlice'
import { toast } from 'sonner'
import DeleteIcon from '@mui/icons-material/Delete'

const ConfigModal = () => {
    const { configModalOpen, currentConfigs } = useSelector(
        (state) => state.modals
    )
    const blocks = useSelector((state) => state.blocks)
    const { register, handleSubmit, unregister } = useForm()
    const dispatch = useDispatch()
    const [fields, setFields] = useState(null)
    const [configs, setConfig] = useState(null)

    const handleClose = (data) => {
        dispatch(setConfigModalOpen(false))
        dispatch(setCurrentConfigs(null))
        setFields(null)
        clearRegister()
    }

    useEffect(() => {
        if (blocks) {
            setConfig(
                blocks[currentConfigs?.block]?.actions[currentConfigs?.index]
                    .config
            )
            if (
                !blocks[currentConfigs?.block]?.actions[currentConfigs?.index]
                    .config
            )
                setFields(<ListItem>Нет конфигураций</ListItem>)
        }
    }, [configModalOpen, blocks])

    useEffect(() => {
        if (configs) {
            if (Object.keys(configs).length === 0) {
                setFields(<ListItem>Нет конфигураций</ListItem>)
            } else {
                setFields(
                    Object.keys(configs).map((key, index) => {
                        let type = Array.isArray(configs[key])
                            ? 'array'
                            : typeof configs[key]
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
                                            ? JSON.stringify(configs[key])
                                            : configs[key]
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
            setFields(<ListItem>Нет конфигураций</ListItem>)
        }
    }, [configs])

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
            dispatch(
                setConfigs({
                    block: currentConfigs.block,
                    index: currentConfigs.index,
                    config: newData,
                })
            )
            toast.success('Успешно сохранено!')
            handleClose(data)
        } catch (error) {
            toast.error('Неправильный формат JSON')
        }
    }

    const onDelete = (i) => {
        let temp = { ...configs }
        Object.keys(configs).map((key, index) => {
            if (i === index) delete temp[key]
        })
        clearRegister()
        setFields(null)
        setConfig(temp)
    }

    const clearRegister = () => {
        let i = 0
        for (let {} in configs) {
            unregister(`name_${i}`)
            unregister(`value_${i}`)
            unregister(`type_${i}`)
            i++
        }
    }

    const onAdd = () => {
        let i = 0
        for (let {} in configs) {
            i++
        }
        const temp = { ...configs }
        temp[`new_item_${i}`] = ''
        setConfig(temp)
    }

    return (
        <ModalWindow
            title="Конфигурации"
            isOpen={configModalOpen}
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

export default ConfigModal
