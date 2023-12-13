import {
    Card,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    Button,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
} from '@mui/material'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { Handle, Position } from 'reactflow'
import {
    setActionModalOpen,
    setCurrentAction,
    setCurrentBlockName,
    setCurrentExitPoint,
    setExitPointModalOpen,
    setRenameBlockModalOpen,
} from '../store/slices/modalSlice'
import AddIcon from '@mui/icons-material/Add'
import {
    addAction,
    addExitPoint,
    deleteBlock,
    deleteElement,
    deleteExitPointBlock,
    duplicateBlock,
    setExitPoint,
} from '../store/slices/blockSlice'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'
import * as React from 'react'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ACTIONS from '../configs/actions'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'

export default memo(({ data, isConnectable }) => {
    const dispatch = useDispatch()

    const onDelete = (e, block, index, type) => {
        e.stopPropagation()
        dispatch(deleteElement({ block, type, index }))
    }

    const actionsBlock = data.actions.map((action, index) => {
        return (
            <ListItem>
                <StyledListButton
                    onClick={() => {
                        dispatch(
                            setCurrentAction({
                                index,
                                name: data.title,
                            })
                        )
                        dispatch(setActionModalOpen(true))
                    }}
                >
                    {ACTIONS[action.action].icon}
                    <ListItemText style={{ marginLeft: '10px' }}>
                        {action.name}
                    </ListItemText>
                    <StyledIconButton
                        className="icon-button"
                        aria-label="delete"
                        size="large"
                        onClick={(e) =>
                            onDelete(e, data.title, index, 'actions')
                        }
                    >
                        <DeleteIcon />
                    </StyledIconButton>
                </StyledListButton>
            </ListItem>
        )
    })

    const exitBlocks = data.exit_points?.map((exit_point, index) => {
        return (
            <ListItem>
                <StyledListButton
                    onClick={() => {
                        dispatch(
                            setCurrentExitPoint({
                                index,
                                name: data.title,
                                ...exit_point,
                            })
                        )
                        dispatch(setExitPointModalOpen(true))
                    }}
                >
                    <ListItemText>Exit Point {index + 1}</ListItemText>
                    <StyledIconButton
                        className="icon-button"
                        aria-label="delete"
                        size="large"
                        onClick={(e) =>
                            onDelete(e, data.title, index, 'exit_points')
                        }
                    >
                        <DeleteIcon />
                    </StyledIconButton>
                </StyledListButton>
                <Handle
                    type="source"
                    id={`${data.title}_${index}`}
                    position={Position.Right}
                    onConnect={(params) =>
                        dispatch(
                            setExitPoint({
                                block: params.source,
                                index,
                                name: params.target,
                            })
                        )
                    }
                    onDelete={(params) => {
                        dispatch(
                            deleteExitPointBlock({
                                block: params.source,
                                index,
                            })
                        )
                    }}
                />
            </ListItem>
        )
    })

    return (
        <Card style={{ minWidth: '400px' }}>
            {data.title !== 'start' && (
                <Handle
                    type="target"
                    id={data.title}
                    position={Position.Left}
                />
            )}
            <Header>
                <Title>{data.title}</Title>
                <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                        <>
                            <IconButton
                                aria-label="delete"
                                size="small"
                                {...bindTrigger(popupState)}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem
                                    onClick={() => {
                                        dispatch(setRenameBlockModalOpen(true))
                                        dispatch(
                                            setCurrentBlockName(data.title)
                                        )
                                        popupState.close()
                                    }}
                                >
                                    Переименовать
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        dispatch(duplicateBlock(data.title))
                                        popupState.close()
                                    }}
                                >
                                    Дублировать
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        dispatch(deleteBlock(data.title))
                                        popupState.close()
                                    }}
                                >
                                    Удалить
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </PopupState>
            </Header>
            <Divider />
            <List>
                {actionsBlock}
                <ListItem>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            dispatch(addAction(data.title))
                            dispatch(
                                setCurrentAction({
                                    index: data.actions.length,
                                    name: data.title,
                                })
                            )
                            dispatch(setActionModalOpen(true))
                        }}
                    >
                        Добавить действие
                    </Button>
                </ListItem>
                <Divider />
                {exitBlocks}
                <ListItem>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            dispatch(addExitPoint(data.title))
                            dispatch(
                                setCurrentExitPoint({
                                    index: data.exit_points
                                        ? data.exit_points.length
                                        : 0,
                                    name: data.title,
                                })
                            )
                            dispatch(setExitPointModalOpen(true))
                        }}
                    >
                        Добавить условие
                    </Button>
                </ListItem>
            </List>
        </Card>
    )
})

const StyledIconButton = styled(IconButton)`
    opacity: 0;
`

const StyledListButton = styled(ListItemButton)`
    width: 100%;
    color: black;

    &:hover .icon-button {
        opacity: 1;
    }
`

const Header = styled.div`
    display: flex;
    padding: 20px;
    justify-content: space-between;
`

const Title = styled.h2`
    margin: 0;
    padding: 0;
`

const MenuButton = styled.div``
