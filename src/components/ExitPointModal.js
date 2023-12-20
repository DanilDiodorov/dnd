import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import {
    setCurrentExitPoint,
    setExitPointModalOpen,
} from '../store/slices/modalSlice'
import {
    Button,
    Checkbox,
    FormControlLabel,
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
    const { register, handleSubmit, setValue, unregister, watch } = useForm()
    const [exitPoint, setExitPoint] = useState(null)
    const { modelVariables } = useSelector((state) => state.models)
    const [fields, setFields] = useState(null)
    const [operator, setOperator] = useState('')
    const [isCustom, setIsCustom] = useState([])
    const [isDouble, setIsDouble] = useState(false)

    const handleClose = () => {
        setExitPoint(null)
        dispatch(setExitPointModalOpen(false))
        dispatch(setCurrentExitPoint(null))
        setFields(null)
        setIsCustom([])
        unregister('block')
        unregister('variable_0')
        unregister('condition_0')
        unregister('value_0')
        unregister('variable_1')
        unregister('condition_1')
        unregister('value_1')
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
        const bools = ['true', 'false']
        let newData
        if (Array.isArray(exitPoint?.condition)) {
            if (data.condition_0 === 'in') {
                data.value_0 = convertValue(data.value_0.toString(), 'array')
                data.value_0 = data.value_0.map((val) => {
                    return convertValue(val, 'boolean')
                })
            } else {
                if (bools.includes(data.value_0))
                    data.value_0 = convertValue(data.value_0, 'boolean')
                else if (!isNaN(data.value_0))
                    data.value_0 = convertValue(data.value_0, 'number')
            }

            newData = [data.variable_0, data.condition_0, data.value_0]
        } else {
            if (data.condition_0 === 'in') {
                data.value_0 = convertValue(data.value_0.toString(), 'array')
                data.value_0 = data.value_0.map((val) => {
                    return convertValue(val, 'boolean')
                })
            } else {
                if (bools.includes(data.value_0))
                    data.value_0 = convertValue(data.value_0, 'boolean')
                else if (!isNaN(data.value_0))
                    data.value_0 = convertValue(data.value_0, 'number')
            }
            if (data.condition_1 === 'in') {
                data.value_1 = convertValue(data.value_1.toString(), 'array')
                data.value_1 = data.value_1.map((val) => {
                    return convertValue(val, 'boolean')
                })
            } else {
                if (bools.includes(data.value_1))
                    data.value_1 = convertValue(data.value_1, 'boolean')
                else if (!isNaN(data.value_1))
                    data.value_1 = convertValue(data.value_1, 'number')
            }
            newData = {}
            newData.operator = operator
            newData.conditions = [
                [data.variable_0, data.condition_0, data.value_0],
                [data.variable_1, data.condition_1, data.value_1],
            ]
        }
        console.log(newData)
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
        setOperator(exitPoint?.condition?.operator || '')
        if (Array.isArray(exitPoint?.condition)) {
            setIsDouble(false)
        } else {
            setIsDouble(true)
        }
    }, [exitPoint])

    useEffect(() => {
        if (isDouble && Array.isArray(exitPoint?.condition)) {
            let newExitPoint = {}
            newExitPoint.block = exitPoint.block
            newExitPoint.condition = {}
            newExitPoint.condition.operator = 'and'
            newExitPoint.condition.conditions = []
            newExitPoint.condition.conditions[0] = exitPoint.condition
            newExitPoint.condition.conditions[1] = ['', '=', true]
            setExitPoint(newExitPoint)
        } else {
            if (exitPoint && !Array.isArray(exitPoint?.condition)) {
                let newExitPoint = {}
                newExitPoint.block = exitPoint.block
                newExitPoint.condition = exitPoint.condition.conditions[0]
                unregister('variable_1')
                unregister('condition_1')
                unregister('value_1')
                setExitPoint(newExitPoint)
            }
        }
    }, [isDouble])

    useEffect(() => {
        if (exitPoint) {
            let condition = []
            if (Array.isArray(exitPoint.condition))
                condition = [exitPoint.condition]
            else condition = exitPoint.condition.conditions
            setFields(
                condition.map((ep, index) => {
                    let inRange = false

                    blocks[currentExitPoint?.name]?.actions.forEach(
                        (action) => {
                            if (
                                ep[0] === action.name + '_result' ||
                                ep[0] === action.name + '_value'
                            )
                                inRange = true
                        }
                    )

                    if (modelVariables)
                        Object.keys(modelVariables).map((variable) => {
                            if (ep[0] === variable) inRange = true
                        })

                    if (watch(`variable_${index}`) === '') inRange = true

                    if (!inRange && !isCustom.includes(index)) {
                        setIsCustom([...isCustom, index])
                    }

                    return (
                        <>
                            <ListItem
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '3fr 1fr 3fr',
                                    gap: '10px',
                                }}
                                key={index}
                            >
                                {!isCustom.includes(index) ? (
                                    <Select
                                        {...register(`variable_${index}`)}
                                        defaultValue={ep[0]}
                                    >
                                        <MenuItem value={''}>
                                            Не выбрано
                                        </MenuItem>
                                        {blocks ? (
                                            blocks[currentExitPoint?.name]
                                                ?.actions ? (
                                                blocks[
                                                    currentExitPoint?.name
                                                ]?.actions.map((action) => {
                                                    return (
                                                        <MenuItem
                                                            value={`${
                                                                action.name +
                                                                '_result'
                                                            }`}
                                                        >
                                                            {`${action.name}_result`}
                                                        </MenuItem>
                                                    )
                                                })
                                            ) : (
                                                <></>
                                            )
                                        ) : (
                                            <></>
                                        )}
                                        {blocks ? (
                                            blocks[currentExitPoint?.name]
                                                ?.actions ? (
                                                blocks[
                                                    currentExitPoint?.name
                                                ]?.actions.map((action) => (
                                                    <MenuItem
                                                        value={`${
                                                            action.name +
                                                            '_value'
                                                        }`}
                                                    >
                                                        {`${action.name}_value`}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <></>
                                            )
                                        ) : (
                                            <></>
                                        )}
                                        {modelVariables &&
                                            Object.keys(modelVariables).map(
                                                (variable) => (
                                                    <MenuItem
                                                        value={`${variable}`}
                                                    >
                                                        {`${variable}`}
                                                    </MenuItem>
                                                )
                                            )}
                                    </Select>
                                ) : (
                                    <TextField
                                        defaultValue={ep[0]}
                                        {...register(`variable_${index}`)}
                                        label="Переменная"
                                    />
                                )}

                                <Select
                                    defaultValue={ep[1]}
                                    {...register(`condition_${index}`)}
                                >
                                    <MenuItem value="=">=</MenuItem>
                                    <MenuItem value="!=">!=</MenuItem>
                                    <MenuItem value="in">in</MenuItem>
                                    <MenuItem value=">">{'>'}</MenuItem>
                                    <MenuItem value="<">{'<'}</MenuItem>
                                    <MenuItem value="<=">{'<='}</MenuItem>
                                    <MenuItem value=">=">{'>='}</MenuItem>
                                </Select>
                                <TextField
                                    {...register(`value_${index}`)}
                                    defaultValue={ep[2]}
                                    label="Значение"
                                />
                            </ListItem>
                            <ListItem>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isCustom.includes(index)}
                                            onChange={(e) => {
                                                if (!isCustom.includes(index)) {
                                                    setIsCustom([
                                                        ...isCustom,
                                                        index,
                                                    ])
                                                } else {
                                                    setValue(
                                                        `variable_${index}`,
                                                        ''
                                                    )
                                                    setIsCustom(
                                                        isCustom.filter(
                                                            (el) => {
                                                                return (
                                                                    el !== index
                                                                )
                                                            }
                                                        )
                                                    )
                                                }
                                            }}
                                        />
                                    }
                                    label="Кастомная переменная"
                                />
                            </ListItem>
                        </>
                    )
                })
            )
        }
    }, [exitPoint, isCustom])

    return (
        <ModalWindow
            title="Условие выхода"
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
                    <ListItem>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isDouble}
                                    onChange={(e) => {
                                        setIsDouble(e.target.checked)
                                    }}
                                />
                            }
                            label="Два условия"
                        />
                    </ListItem>
                    {!Array.isArray(exitPoint?.condition) && (
                        <ListItem>
                            <Select
                                fullWidth
                                onChange={(e) => setOperator(e.target.value)}
                                value={operator}
                            >
                                <MenuItem value="and">and</MenuItem>
                                <MenuItem value="or">or</MenuItem>
                            </Select>
                        </ListItem>
                    )}
                    {fields}
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
