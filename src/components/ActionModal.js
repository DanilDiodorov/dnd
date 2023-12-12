import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setActionModalOpen,
    setConfigModalOpen,
    setCurrentConfigs,
} from '../store/slices/modalSlice'
import { Button, List, ListItem, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { setBlockAction } from '../store/slices/blockSlice'
import { toast } from 'sonner'

let actions = null

const ActionModal = () => {
    const { actionModalOpen, currentAction } = useSelector(
        (state) => state.modals
    )
    const blocks = useSelector((state) => state.blocks)
    const { register, handleSubmit, setValue } = useForm()
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setActionModalOpen(false))
    }

    useEffect(() => {
        if (blocks)
            actions = blocks[currentAction?.name]?.actions[currentAction?.index]
        setValue('name', actions?.name)
        setValue('action', actions?.action)
        setValue('type', actions?.type)
        setValue('start_on', actions?.start_on)
    }, [actionModalOpen, blocks])

    const onSubmit = (data) => {
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
                            label="Name"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            {...register('action')}
                            fullWidth
                            name="action"
                            label="Action"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            {...register('type')}
                            fullWidth
                            name="type"
                            label="Type"
                        />
                    </ListItem>
                    <ListItem>
                        <TextField
                            {...register('start_on')}
                            fullWidth
                            name="start_on"
                            label="Start on"
                        />
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
