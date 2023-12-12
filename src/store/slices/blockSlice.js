import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const blockSlice = createSlice({
    name: 'blocks',
    initialState,
    reducers: {
        setBlocks: (state, action) => {
            state = action.payload
            return state
        },
        setBlockPosition: (state, action) => {
            state[action.payload.id].position = action.payload.position
            return state
        },
        setBlockAction: (state, action) => {
            state[action.payload.block].actions[action.payload.index].name =
                action.payload.name
            state[action.payload.block].actions[action.payload.index].action =
                action.payload.action
            state[action.payload.block].actions[action.payload.index].type =
                action.payload.type
            state[action.payload.block].actions[action.payload.index].start_on =
                action.payload.start_on
            return state
        },
        setConfigs: (state, action) => {
            state[action.payload.block].actions[action.payload.index].config =
                action.payload.config
            return state
        },
        addAction: (state, action) => {
            state[action.payload].actions.push({
                name: `action_${state[action.payload].actions.length}`,
                action: '',
                type: '',
                start_on: '',
            })
            return state
        },
        setCondition: (state, action) => {
            state[action.payload.block].exit_points[
                action.payload.index
            ].condition = action.payload.condition
            return state
        },
        addExitPoint: (state, action) => {
            if (state[action.payload].exit_points == undefined)
                state[action.payload].exit_points = [
                    {
                        block: '',
                        condition: ['', '=', true],
                    },
                ]
            else
                state[action.payload].exit_points.push({
                    block: '',
                    condition: ['', '=', true],
                })
            return state
        },
        deleteElement: (state, action) => {
            state[action.payload.block][action.payload.type].splice(
                action.payload.index,
                1
            )
            return state
        },
        setExitPoint: (state, action) => {
            console.log(action.payload.block, action.payload.index)
            state[action.payload.block].exit_points[
                action.payload.index
            ].block = action.payload.name
            return state
        },
        deleteExitPointBlock: (state, action) => {
            state[action.payload.block].exit_points[
                action.payload.index
            ].block = ''
            return state
        },
        addBlock: (state, action) => {
            const count = Object.keys(state).length
            state[`block_${count}`] = {}
            state[`block_${count}`].position = action.payload
            state[`block_${count}`].actions = []
            state[`block_${count}`].exit_points = []
            return state
        },
        deleteBlock: (state, action) => {
            delete state[action.payload]
            return state
        },
        renameBlock: (state, action) => {
            state[action.payload.newName] = state[action.payload.oldName]
            delete state[action.payload.oldName]
            return state
        },
    },
})

export const {
    setBlocks,
    setBlockPosition,
    setBlockAction,
    setConfigs,
    addAction,
    setCondition,
    addExitPoint,
    deleteElement,
    setExitPoint,
    deleteExitPointBlock,
    addBlock,
    deleteBlock,
    renameBlock,
} = blockSlice.actions

export default blockSlice.reducer
