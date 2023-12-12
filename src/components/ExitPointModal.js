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
import { Controller, useForm } from 'react-hook-form'
import convertValue from '../utils/convertValue'
import { setCondition } from '../store/slices/blockSlice'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

const ExitPointModal = () => {
    const { exitPointModalOpen, currentExitPoint } = useSelector(
        (state) => state.modals
    )
    const blocks = useSelector((state) => state.blocks)
    const dispatch = useDispatch()
    const { register, handleSubmit, control, setValue, unregister } = useForm()
    const [exitPoint, setExitPoint] = useState(null)

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
    }, [blocks, exitPointModalOpen, currentExitPoint])

    const onSubmit = (data) => {
        if (!data.condition) {
            data.condition = exitPoint.condition[1]
        }
        if (data.condition === 'in') {
            data.value = convertValue(data.value.toString(), 'object')
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
        setValue('variable', exitPoint?.condition[0])
        setValue('value', exitPoint?.condition[2])
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
                        <TextField
                            defaultValue={exitPoint?.condition[0]}
                            {...register('variable')}
                            label="Variable"
                        />

                        <Controller
                            name="condition"
                            control={control}
                            render={({ field: { value, onChange }, field }) => (
                                <Select
                                    {...field}
                                    value={
                                        value
                                            ? value
                                            : exitPoint?.condition[1] ?? ''
                                    }
                                    onChange={onChange}
                                >
                                    <MenuItem value={'='}>=</MenuItem>
                                    <MenuItem value={'in'}>in</MenuItem>
                                </Select>
                            )}
                        />

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
