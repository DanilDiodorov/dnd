import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setCurrentBlockName,
    setRenameBlockModalOpen,
} from '../store/slices/modalSlice'
import { Button, List, ListItem, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { renameBlock } from '../store/slices/blockSlice'

const RenameBlockModal = () => {
    const { renameBlockModalOpen, currentBlockName } = useSelector(
        (state) => state.modals
    )
    const dispatch = useDispatch()
    const { register, handleSubmit, unregister, setValue } = useForm()

    const handleClose = () => {
        dispatch(setRenameBlockModalOpen(false))
        dispatch(setCurrentBlockName(null))
        unregister('block_name')
    }

    const onSumbit = (data) => {
        dispatch(
            renameBlock({ newName: data.block_name, oldName: currentBlockName })
        )
        handleClose()
    }

    useEffect(() => {
        setValue('block_name', currentBlockName)
    }, [currentBlockName])

    return (
        <ModalWindow
            title="Название блока"
            isOpen={renameBlockModalOpen}
            onClose={handleClose}
        >
            <List>
                <form onSubmit={handleSubmit(onSumbit)}>
                    <ListItem>
                        <TextField
                            {...register('block_name')}
                            fullWidth
                            label="Название"
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

export default RenameBlockModal
