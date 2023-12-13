import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setActionModalOpen,
    setConfigModalOpen,
    setCurrentConfigs,
} from '../store/slices/modalSlice'
import {
    Button,
    FormControl,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { setBlockAction } from '../store/slices/blockSlice'
import { toast } from 'sonner'
import ACTIONS from '../configs/actions'
import convertValue from '../utils/convertValue'

let actions = null

const ActionModal = () => {
    const { actionModalOpen, currentAction } = useSelector(
        (state) => state.modals
    )
    const blocks = useSelector((state) => state.blocks)
    const { register, handleSubmit, setValue } = useForm()
    const dispatch = useDispatch()
    const [action, setAction] = useState('')
    const [start, setStart] = useState('')

    const handleClose = () => {
        dispatch(setActionModalOpen(false))
    }

    useEffect(() => {
        if (blocks)
            actions = blocks[currentAction?.name]?.actions[currentAction?.index]
        setValue('name', actions?.name)
        setAction(actions?.action || '')
        setStart(actions?.start_on || '')
    }, [actionModalOpen])

    const onSubmit = (data) => {
        data.type = ACTIONS[action].type
        data.action = action
        if (!Array.isArray(start)) data.start_on = convertValue(start, 'object')
        else data.start_on = start
        dispatch(
            setBlockAction({
                block: currentAction?.name,
                index: currentAction?.index,
                ...data,
            })
        )
        toast.success('Успешно сохранено!')
        handleClose()
    }

    return (
        <ModalWindow
            title="Действия"
            isOpen={actionModalOpen}
            onClose={handleClose}
        >
            <List>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ListItem>
                        <TextField
                            {...register('name')}
                            fullWidth
                            label="Название"
                        />
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel id="action-label">Действие</InputLabel>
                            <Select
                                labelId="action-label"
                                onChange={(e) => setAction(e.target.value)}
                                value={action}
                                label="Действие"
                                fullWidth
                            >
                                {Object.keys(ACTIONS).map((key) => (
                                    <MenuItem value={key}>
                                        {ACTIONS[key].name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <FormControl fullWidth>
                            <InputLabel id="action-label">
                                Начать после
                            </InputLabel>
                            <Select
                                labelId="action-label"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                fullWidth
                                label="Начать после"
                            >
                                <MenuItem value="block_start">
                                    В начале
                                </MenuItem>
                                {blocks[currentAction?.name]?.actions.map(
                                    (act) => {
                                        if (act.name !== actions?.name)
                                            return (
                                                <MenuItem
                                                    value={`${act.name}__finish`}
                                                >
                                                    {act.name}
                                                </MenuItem>
                                            )
                                    }
                                )}
                            </Select>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button
                            variant="text"
                            onClick={() => {
                                dispatch(
                                    setCurrentConfigs({
                                        block: currentAction?.name,
                                        index: currentAction?.index,
                                    })
                                )
                                dispatch(setConfigModalOpen(true))
                            }}
                        >
                            Конфигурации
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

export default ActionModal
