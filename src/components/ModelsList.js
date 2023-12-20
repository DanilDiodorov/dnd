import {
    Button,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material'
import useModel from '../hooks/useModel'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentModel } from '../store/slices/modelSlice'
import TuneIcon from '@mui/icons-material/Tune'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import * as React from 'react'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const ModelsList = () => {
    const { getModels, deleteModel } = useModel()
    const dispatch = useDispatch()
    const { models, currentModel } = useSelector((state) => state.models)
    const [currentModelName, setCurrentModelName] = useState()

    const [open, setOpen] = useState(false)

    const handleClickOpen = (e, model) => {
        e.stopPropagation()
        setCurrentModelName(model)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        getModels()
    }, [])

    return (
        <List>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
            >
                <DialogTitle>Удалить</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Вы действительно хотите удалить модель?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            deleteModel(currentModelName)
                            handleClose()
                        }}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
            {models.map((model) => (
                <ListItem disablePadding>
                    <StyledListButton
                        onClick={() => dispatch(setCurrentModel(model))}
                        active={currentModel === model}
                    >
                        <TuneIcon />
                        <ListItemText style={{ marginLeft: '10px' }}>
                            {model}
                        </ListItemText>
                        <StyledIconButton
                            className="icon-button"
                            aria-label="delete"
                            size="large"
                            onClick={(e) => handleClickOpen(e, model)}
                        >
                            <DeleteIcon />
                        </StyledIconButton>
                    </StyledListButton>
                </ListItem>
            ))}
        </List>
    )
}

const StyledIconButton = styled(IconButton)`
    opacity: 0;
`

const StyledListButton = styled(ListItemButton)`
    width: 100%;
    color: black;
    border-radius: 4px !important;
    background-color: #f0f0f0 ${({ active }) => (active ? '!important' : '')};

    &:hover .icon-button {
        opacity: 1;
    }
`

export default ModelsList
