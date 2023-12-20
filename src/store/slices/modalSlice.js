import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    actionModalOpen: false,
    exitPointModalOpen: false,
    configModalOpen: false,
    renameBlockModalOpen: false,
    codeModalOpen: false,
    addModelModalOpen: false,
    variablesModalOpen: false,
    exportModalOpen: false,
    currentAction: null,
    currentConfigs: null,
    currentExitPoint: null,
    currentBlockName: null,
}

export const modalSlice = createSlice({
    name: 'modals',
    initialState,
    reducers: {
        setActionModalOpen: (state, action) => {
            state.actionModalOpen = action.payload
        },
        setExitPointModalOpen: (state, action) => {
            state.exitPointModalOpen = action.payload
        },
        setConfigModalOpen: (state, action) => {
            state.configModalOpen = action.payload
        },
        setRenameBlockModalOpen: (state, action) => {
            state.renameBlockModalOpen = action.payload
        },
        setCodeModalOpen: (state, action) => {
            state.codeModalOpen = action.payload
        },
        setAddModelModalOpen: (state, action) => {
            state.addModelModalOpen = action.payload
        },
        setVariablesModalOpen: (state, action) => {
            state.variablesModalOpen = action.payload
        },
        setExportModalOpen: (state, action) => {
            state.exportModalOpen = action.payload
        },
        setCurrentAction: (state, action) => {
            state.currentAction = action.payload
        },
        setCurrentConfigs: (state, action) => {
            state.currentConfigs = action.payload
        },
        setCurrentExitPoint: (state, action) => {
            state.currentExitPoint = action.payload
        },
        setCurrentBlockName: (state, action) => {
            state.currentBlockName = action.payload
        },
    },
})

export const {
    setActionModalOpen,
    setExitPointModalOpen,
    setCurrentAction,
    setCurrentExitPoint,
    setCurrentConfigs,
    setConfigModalOpen,
    setRenameBlockModalOpen,
    setCurrentBlockName,
    setCodeModalOpen,
    setAddModelModalOpen,
    setVariablesModalOpen,
    setExportModalOpen,
} = modalSlice.actions

export default modalSlice.reducer
