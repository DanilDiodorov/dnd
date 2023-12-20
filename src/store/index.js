import { configureStore } from '@reduxjs/toolkit'
import blockReducer from './slices/blockSlice'
import modalReducer from './slices/modalSlice'
import modelReducer from './slices/modelSlice'

export const store = configureStore({
    reducer: {
        blocks: blockReducer,
        modals: modalReducer,
        models: modelReducer,
    },
})
