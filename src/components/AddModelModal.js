import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import { setAddModelModalOpen } from '../store/slices/modalSlice'
import { Button, List, ListItem, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import useModel from '../hooks/useModel'
import { useEffect } from 'react'

const AddModelModal = () => {
    const { addModelModalOpen } = useSelector((state) => state.modals)
    const dispatch = useDispatch()
    const {
        handleSubmit,
        register,
        unregister,
        setValue,
        formState: { errors },
    } = useForm()
    const { addModel } = useModel()

    const handleClose = () => {
        unregister('name')
        dispatch(setAddModelModalOpen(false))
    }

    useEffect(() => {
        setValue('name', '')
    }, [addModelModalOpen])

    const onSubmit = (data) => {
        addModel(data.name)
        handleClose()
    }

    return (
        <ModalWindow
            title="Добавить модель"
            isOpen={addModelModalOpen}
            onClose={handleClose}
        >
            <List>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ListItem>
                        <TextField
                            fullWidth
                            {...register('name', { required: true })}
                            label="Название"
                            error={!!errors.name}
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
                            Добавить
                        </Button>
                    </ListItem>
                </form>
            </List>
        </ModalWindow>
    )
}

export default AddModelModal
