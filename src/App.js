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
} from './store/slices/blockSlice'
import convertBlocks from './utils/convertBlocks'
import ExitPointModal from './components/ExitPointModal'
import ActionModal from './components/ActionModal'
import ConfigModal from './components/ConfigModal'
import { Toaster } from 'sonner'
import { Button, Divider } from '@mui/material'
import RenameBlockModal from './components/RenameBlockModal'
import styled from 'styled-components'
import CodeModal from './components/CodeModal'
import {
    setAddModelModalOpen,
    setCodeModalOpen,
    setExportModalOpen,
    setVariablesModalOpen,
} from './store/slices/modalSlice'
import AddModelModal from './components/AddModelModal'
import ModelsList from './components/ModelsList'
import useModel from './hooks/useModel'
import AddIcon from '@mui/icons-material/Add'
import VariablesModal from './components/VariablesModal'
import ExportModal from './components/ExportModal'

const nodeTypes = {
    blockWithValue: BlockWithValue,
}

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const blocks = useSelector((state) => state.blocks)
    const dispatch = useDispatch()
    const { screenToFlowPosition } = useReactFlow()
    const { modelVariables, modelExport } = useSelector((state) => state.models)
    const { saveModelFile } = useModel()

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

    useEffect(() => {
        if (blocks) {
            const [newBlocks, newEdges] = convertBlocks(blocks)
            setNodes(newBlocks)
            setEdges(newEdges)
            saveModelFile()
        }
    }, [blocks, modelExport, modelVariables])

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
            <AddModelModal />
            <VariablesModal />
            <ExportModal />
            <Tools>
                <ContentBlock>
                    <DragButton draggable="true" id="var1">
                        Добавить блок
                    </DragButton>
                </ContentBlock>
                <Divider />
                <ContentBlock>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            dispatch(setCodeModalOpen(true))
                        }}
                        disabled={blocks === null}
                    >
                        Скрипт
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            dispatch(setVariablesModalOpen(true))
                        }}
                        disabled={blocks === null}
                    >
                        Переменные
                    </Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            dispatch(setExportModalOpen(true))
                        }}
                        disabled={blocks === null}
                    >
                        Экспорты
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => dispatch(setAddModelModalOpen(true))}
                    >
                        Добавить модель
                    </Button>
                </ContentBlock>
                <Divider />
                <ContentBlock>
                    <ModelsList />
                </ContentBlock>
            </Tools>
            {blocks ? (
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
            ) : (
                <></>
            )}
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

const ContentBlock = styled.div`
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
