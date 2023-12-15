import React, { useCallback, useEffect } from 'react'
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from 'reactflow'

import 'reactflow/dist/style.css'
import BlockWithValue from './components/BlockWithValue'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import {
    addBlock,
    deleteBlock,
    deleteExitPointBlock,
    setBlockPosition,
    setBlocks,
} from './store/slices/blockSlice'
import exportToJson from './utils/exportToJSON'
import convertBlocks from './utils/convertBlocks'
import readJson from './utils/readJSON'
import ExitPointModal from './components/ExitPointModal'
import ActionModal from './components/ActionModal'
import ConfigModal from './components/ConfigModal'
import { Toaster } from 'sonner'
import { styled as Styled } from '@mui/material/styles'
import { Button, Divider } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import RenameBlockModal from './components/RenameBlockModal'
import checkPosition from './utils/checkPosition'
import styled from 'styled-components'
import axios from 'axios'
import CodeModal from './components/CodeModal'
import { setCodeModalOpen } from './store/slices/modalSlice'

const VisuallyHiddenInput = Styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const nodeTypes = {
    blockWithValue: BlockWithValue,
}

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const blocks = useSelector((state) => state.blocks)
    const dispatch = useDispatch()
    const { screenToFlowPosition } = useReactFlow()

    const onInit = async () => {
        const canvas = document.querySelector('.canvas')
        const block1 = document.querySelector('#var1')
        canvas.addEventListener('dragover', allowDrop)
        block1.addEventListener('dragstart', drag)
        canvas.addEventListener('drop', drop)

        function allowDrop(e) {
            e.preventDefault()
        }

        function drag(e) {
            e.dataTransfer.setData('id', e.target.id)
        }

        function drop(e) {
            const id = e.dataTransfer.getData('id')
            if (id === 'var1') {
                dispatch(
                    addBlock(
                        screenToFlowPosition({
                            x: e.clientX,
                            y: e.clientY,
                        })
                    )
                )
            }
        }
    }

    const onChange = async (event) => {
        if (event.target.files) {
            const parsedData = await readJson(event.target.files[0])
            if (Object.keys(parsedData).length > 0)
                dispatch(setBlocks(checkPosition(parsedData.blocks)))
        }
    }

    useEffect(() => {
        if (blocks) {
            const [newBlocks, newEdges] = convertBlocks(blocks)
            setNodes(newBlocks)
            setEdges(newEdges)
        }
        if (Object.keys(blocks).length > 0)
            localStorage.setItem('blocks', JSON.stringify(blocks))
    }, [blocks])

    const onConnect = useCallback((params) => {}, [setEdges])

    const handleNodeDragStop = async (event, node, nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            dispatch(
                setBlockPosition({
                    id: nodes[i].id,
                    position: nodes[i].position,
                })
            )
        }
    }

    const handleNodesDelete = async (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            dispatch(deleteBlock(nodes[i].data.title))
        }
    }

    const handleEdgesDelete = async (edges) => {
        for (let i = 0; i < edges.length; i++) {
            dispatch(
                deleteExitPointBlock({
                    block: edges[i].source,
                    index: edges[i].data.index,
                })
            )
        }
    }

    return (
        <>
            <Toaster position="top-right" richColors />
            <ActionModal />
            <ExitPointModal />
            <ConfigModal />
            <RenameBlockModal />
            <CodeModal />
            <Tools>
                <Top>
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Загрузить файл
                        <VisuallyHiddenInput
                            type="file"
                            accept=".json,application/json"
                            onChange={onChange}
                        />
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => exportToJson(blocks)}
                    >
                        Скачать
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            dispatch(setCodeModalOpen(true))
                        }}
                    >
                        Редактировать скрипт
                    </Button>
                </Top>
                <Divider />
                <Bottom>
                    <DragButton draggable="true" id="var1">
                        Добавить блок
                    </DragButton>
                </Bottom>
            </Tools>
            <div className="canvas">
                <ReactFlow
                    onNodeDragStop={handleNodeDragStop}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    onInit={onInit}
                    onNodesDelete={handleNodesDelete}
                    onEdgesDelete={handleEdgesDelete}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </>
    )
}

const Tools = styled.div`
    position: fixed;
    height: 100vh;
    width: 300px;
    top: 0;
    left: 0;
    background-color: white;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
`

const Top = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 30px 0;
`

const Bottom = styled.div`
    padding: 30px 0;
`

const DragButton = styled.div`
    width: 100%;
    text-align: center;
    padding: 20px 0;
    border: 1px dashed grey;

    &:hover {
        cursor: grab;
    }
`
