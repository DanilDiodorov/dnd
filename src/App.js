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
import Block from './components/Block'
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
import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import RenameBlockModal from './components/RenameBlockModal'
import checkPosition from './utils/checkPosition'

const VisuallyHiddenInput = styled('input')({
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
    block: Block,
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
        const block1 = document.querySelector('.varient-1')
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
            dispatch(setBlocks(checkPosition(parsedData.blocks)))
        }
    }

    useEffect(() => {
        if (blocks) {
            const [newBlocks, newEdges] = convertBlocks(blocks)
            setNodes(newBlocks)
            setEdges(newEdges)
        }
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
            <div className="tools">
                <div className="left">
                    <div className="block varient-1" draggable="true" id="var1">
                        Добавить блок
                    </div>
                </div>
                <div className="right">
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload file
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
                        Download
                    </Button>
                </div>
            </div>
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
