import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentModel: '',
    modelVariables: {},
    modelExport: {},
    models: [],
}

export const modelSlice = createSlice({
    name: 'models',
    initialState,
    reducers: {
        setModels: (state, action) => {
            state.models = action.payload
            return state
        },
        setCurrentModel: (state, action) => {
            state.currentModel = action.payload
            return state
        },
        setModelVariables: (state, action) => {
            state.modelVariables = action.payload
            return state
        },
        setModelExport: (state, action) => {
            state.modelExport = action.payload
        },
    },
})

export const { setModels, setCurrentModel, setModelVariables, setModelExport } =
    modelSlice.actions

export default modelSlice.reducer
