import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setBlocks } from '../store/slices/blockSlice'
import checkPosition from '../utils/checkPosition'
import {
    setCurrentModel,
    setModelExport,
    setModelVariables,
    setModels,
} from '../store/slices/modelSlice'

const useModel = () => {
    const { currentModel, modelVariables, modelExport } = useSelector(
        (state) => state.models
    )
    const dispatch = useDispatch()
    const blocks = useSelector((state) => state.blocks)

    useEffect(() => {
        getModel(currentModel)
    }, [currentModel])

    const addModel = async (name) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_SERVER_URL}/model`,
                {
                    name,
                }
            )
            toast.success(response.data)
            await getModels()
            dispatch(setCurrentModel(name))
        } catch (error) {
            toast.error(error.response?.data)
        }
    }

    const getModels = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_SERVER_URL}/model`
            )
            dispatch(setModels(response.data))
        } catch (error) {
            toast.error(error.response?.data)
        }
    }

    const getModel = async (name) => {
        if (name !== '')
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/model-file?name=${name}`
                )
                if (response.data) {
                    dispatch(setBlocks(checkPosition(response.data.blocks)))
                    dispatch(setModelVariables(response.data.variables))
                    dispatch(setModelExport(response.data.export))
                } else {
                    dispatch(setBlocks(null))
                    dispatch(setModelVariables(null))
                    dispatch(setModelExport(null))
                }
            } catch (error) {}
        else {
            dispatch(setBlocks(null))
            dispatch(setModelVariables(null))
            dispatch(setModelExport(null))
        }
    }

    const saveModelFile = async () => {
        if (currentModel)
            try {
                const data = {}
                data.blocks = blocks
                data.dialog_class = 'astersay.dialog.BaseDialog'
                data.variables = modelVariables
                data.export = modelExport
                await axios.post(
                    `${process.env.REACT_APP_SERVER_URL}/model-file`,
                    {
                        name: currentModel,
                        data,
                    }
                )
            } catch (error) {
                toast.error(error.response?.data)
            }
    }

    const deleteModel = async (name) => {
        try {
            const response = await axios.delete(
                `${process.env.REACT_APP_SERVER_URL}/model?name=${name}`
            )
            if (currentModel === name) dispatch(setCurrentModel(''))
            getModels()
            toast.success(response.data)
        } catch (error) {
            toast.error(error.response?.data)
        }
    }

    return { addModel, getModels, saveModelFile, deleteModel }
}

export default useModel
