import {
    Card,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    CardHeader,
    Divider,
    Button,
    IconButton,
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
    deleteElement,
    deleteExitPointBlock,
    setExitPoint,
} from '../store/slices/blockSlice'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from 'styled-components'

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
                    <ListItemText>{action.name}</ListItemText>
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
            <Handle type="target" id={data.title} position={Position.Left} />
            <CardHeader
                onClick={() => {
                    dispatch(setRenameBlockModalOpen(true))
                    dispatch(setCurrentBlockName(data.title))
                }}
                title={data.title}
            />
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
    &:hover .icon-button {
        opacity: 1;
    }
`
