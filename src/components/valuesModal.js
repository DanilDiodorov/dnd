import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setConfigModalOpen,
    setCurrentConfigs,
} from '../store/slices/modalSlice'
import {
    Button,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import convertValue from '../utils/convertValue'

const ValuesModal = () => {
    const { configModalOpen, currentConfigs } = useSelector(
        (state) => state.modals
    )
    const { register, handleSubmit, unregister } = useForm()
    const dispatch = useDispatch()
    const [fields, setFields] = useState(null)

    const handleClose = (data) => {
        dispatch(setConfigModalOpen(false))
        dispatch(setCurrentConfigs(null))

        let i = 0

        for (let {} in currentConfigs) {
            unregister(`name_${i}`)
            unregister(`value_${i}`)
            unregister(`type_${i}`)
            i++
        }
    }

    useEffect(() => {
        if (currentConfigs) {
            setFields(
                Object.keys(currentConfigs).map((key, index) => {
                    let type = typeof currentConfigs[key]

                    return (
                        <ListItem
                            key={index}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '10px',
                            }}
                        >
                            <TextField
                                {...register(`name_${index}`)}
                                key={key}
                                defaultValue={key}
                                label="Имя"
                                id={`name_${index}`}
                            />
                            <TextField
                                {...register(`value_${index}`)}
                                key={index}
                                defaultValue={currentConfigs[key]}
                                label="Значение"
                            />
                            <Select
                                {...register(`type_${index}`)}
                                defaultValue={type}
                            >
                                <MenuItem value="number">number</MenuItem>
                                <MenuItem value="string">string</MenuItem>
                                <MenuItem value="boolean">boolean</MenuItem>
                                <MenuItem value="object">array</MenuItem>
                            </Select>
                        </ListItem>
                    )
                })
            )
        }
    }, [currentConfigs, configModalOpen])

    const onSubmit = (data) => {
        dispatch(setCurrentConfigs(null))
        const newData = {}
        let i = 0
        while (true) {
            newData[data[`name_${i}`]] = convertValue(
                data[`value_${i}`],
                data[`type_${i}`]
            )
            i++
            if (!data[`name_${i}`]) break
        }
        handleClose(data)
        console.log(newData)
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

export default ValuesModal
