import { useDispatch, useSelector } from 'react-redux'
import ModalWindow from './ModalWindow'
import { setCodeModalOpen } from '../store/slices/modalSlice'
import Editor from 'react-simple-code-editor'
import { useEffect, useState } from 'react'
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism.css' //Example style, you can use another
import axios from 'axios'
import styled from 'styled-components'
import { Button, ListItem } from '@mui/material'

const CodeModal = () => {
    const { codeModalOpen } = useSelector((state) => state.modals)
    const { currentModel } = useSelector((state) => state.models)
    const [code, setCode] = useState('')
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(setCodeModalOpen(false))
    }

    useEffect(() => {
        const getCode = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_SERVER_URL}/python-file?name=${currentModel}`
                )
                setCode(response.data)
            } catch (error) {}
        }
        if (codeModalOpen) getCode()
    }, [codeModalOpen])

    const onSubmit = (e) => {
        e.preventDefault()
        try {
            axios.post(`${process.env.REACT_APP_SERVER_URL}/python-file`, {
                data: code,
                name: currentModel,
            })
        } catch (error) {}
        dispatch(setCodeModalOpen(false))
    }

    return (
        <ModalWindow
            title="Редактировать скрипт"
            onClose={handleClose}
            isOpen={codeModalOpen}
        >
            <form onSubmit={onSubmit}>
                <ListItem>
                    <EditorBlock>
                        <EditorContent
                            value={code}
                            onValueChange={(code) => setCode(code)}
                            highlight={() => highlight(code, languages.js)}
                            padding={15}
                        />
                    </EditorBlock>
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
                        Сохранить
                    </Button>
                </ListItem>
            </form>
        </ModalWindow>
    )
}

const EditorBlock = styled.div`
    max-height: 500px;
    overflow: auto;
    width: 100%;
`

const EditorContent = styled(Editor)`
    font-family: 'Fira code', 'Fira Mono', monospace;
    border: none;
    font-size: 12px;
    width: 100%;
    background-color: #f0f0f0 !important;
    border-radius: 5px;

    &:focus {
        outline: none !important;
        bottom: none;
    }
`

export default CodeModal
