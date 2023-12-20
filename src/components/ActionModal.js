import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setActionModalOpen,
    setConfigModalOpen,
    setCurrentConfigs,
} from '../store/slices/modalSlice'
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
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
    const {
        register,
        handleSubmit,
        formState: { errors },
        unregister,
        setValue,
    } = useForm()
    const dispatch = useDispatch()
    const [action, setAction] = useState('')
    const [start, setStart] = useState('')
    const [isCustom, setIsCustom] = useState(false)

    const handleClose = () => {
        unregister('name')
        unregister('action')
        unregister('type')
        dispatch(setActionModalOpen(false))
    }

    useEffect(() => {
        if (blocks)
            actions = blocks[currentAction?.name]?.actions[currentAction?.index]
        setValue('name', actions?.name)
        setAction(actions?.action || '')
        setStart(actions?.start_on || '')
        setValue('action', actions?.action || '')
        setValue('type', actions?.type || '')
        setIsCustom(!Object.keys(ACTIONS).includes(actions?.action))
    }, [actionModalOpen])

    useEffect(() => {
        if (!isCustom) setAction('astersay.actions.CaptureAction')
    }, [isCustom])

    const onSubmit = (data) => {
        if (!isCustom) {
            if (ACTIONS[action]) {
                data.type = ACTIONS[action].type
            } else {
                data.type = ''
            }
            data.action = action
        }
        if (!Array.isArray(start)) data.start_on = convertValue(start, 'array')
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
                            {...register('name', {
                                required: 'Заполните поле',
                            })}
                            error={!!errors.name}
                            fullWidth
                            label="Название"
                        />
                    </ListItem>
                    {isCustom ? (
                        <>
                            <ListItem>
                                <TextField
                                    label="Действие"
                                    {...register('action')}
                                    fullWidth
                                />
                            </ListItem>
                            <ListItem>
                                <TextField
                                    label="Тип"
                                    {...register('type')}
                                    fullWidth
                                />
                            </ListItem>
                        </>
                    ) : (
                        <ListItem>
                            <FormControl fullWidth>
                                <InputLabel id="action-label">
                                    Действие
                                </InputLabel>
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
                    )}
                    <ListItem>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isCustom}
                                    onChange={(e) =>
                                        setIsCustom(e.target.checked)
                                    }
                                />
                            }
                            label="Кастомное действие"
                        />
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
                                {blocks ? (
                                    blocks[currentAction?.name]?.actions.map(
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
                                    )
                                ) : (
                                    <></>
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
