import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setCurrentExitPoint,
    setExitPointModalOpen,
} from '../store/slices/modalSlice'
import {
    Button,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import convertValue from '../utils/convertValue'
import { setCondition } from '../store/slices/blockSlice'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const ExitPointModal = () => {
    const { exitPointModalOpen, currentExitPoint } = useSelector(
        (state) => state.modals
    )
    const blocks = useSelector((state) => state.blocks)
    const dispatch = useDispatch()
    const { register, handleSubmit, setValue, unregister } = useForm()
    const [exitPoint, setExitPoint] = useState(null)
    const [localCondition, setLocalCondition] = useState('')
    const [variable, setVariable] = useState('')

    const handleClose = () => {
        setExitPoint(null)
        dispatch(setExitPointModalOpen(false))
        dispatch(setCurrentExitPoint(null))
        unregister('block')
        unregister('variable')
        unregister('condition')
        unregister('value')
    }

    useEffect(() => {
        if (blocks)
            setExitPoint(
                blocks[currentExitPoint?.name]?.exit_points[
                    currentExitPoint?.index
                ]
            )
    }, [exitPointModalOpen])

    const onSubmit = (data) => {
        data.condition = localCondition
        data.variable = variable
        if (data.condition === 'in') {
            data.value = convertValue(data.value.toString(), 'array')
            data.value = data.value.map((val) => {
                return convertValue(val, 'boolean')
            })
        } else {
            data.value = convertValue(data.value, 'boolean')
        }

        const newData = [data.variable, data.condition, data.value]

        dispatch(
            setCondition({
                index: currentExitPoint.index,
                block: currentExitPoint.name,
                condition: newData,
            })
        )
        handleClose()
        toast.success('Успешно сохранено!')
    }

    useEffect(() => {
        setValue('block', exitPoint?.block)
        setValue('value', exitPoint?.condition[2])
        setLocalCondition(exitPoint?.condition[1] || '=')
        setVariable(exitPoint?.condition[0] || '')
    }, [exitPoint])

    return (
        <ModalWindow
            title="Exit point"
            isOpen={exitPointModalOpen}
            onClose={handleClose}
        >
            <List>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ListItem>
                        <TextField
                            disabled
                            style={{ width: '100%' }}
                            label="Block"
                            {...register('block')}
                        />
                    </ListItem>
                    <ListItem
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '3fr 1fr 3fr',
                            gap: '10px',
                        }}
                    >
                        <Select
                            value={variable}
                            onChange={(e) => setVariable(e.target.value)}
                            defaultValue={''}
                        >
                            <MenuItem value={''}>Не выбрано</MenuItem>
                            {blocks[currentExitPoint?.name]?.actions ? (
                                blocks[currentExitPoint?.name]?.actions.map(
                                    (action) => (
                                        <MenuItem
                                            value={`${action.name + '_result'}`}
                                        >
                                            {`${action.name}_result`}
                                        </MenuItem>
                                    )
                                )
                            ) : (
                                <></>
                            )}
                            {blocks[currentExitPoint?.name]?.actions ? (
                                blocks[currentExitPoint?.name]?.actions.map(
                                    (action) => (
                                        <MenuItem
                                            value={`${action.name + '_value'}`}
                                        >
                                            {`${action.name}_value`}
                                        </MenuItem>
                                    )
                                )
                            ) : (
                                <></>
                            )}
                        </Select>
                        <Select
                            value={localCondition}
                            onChange={(e) => setLocalCondition(e.target.value)}
                        >
                            <MenuItem value="=">=</MenuItem>
                            <MenuItem value="in">in</MenuItem>
                        </Select>
                        <TextField
                            {...register('value')}
                            defaultValue={exitPoint?.condition[2]}
                            label="Value"
                        />
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

export default ExitPointModal
