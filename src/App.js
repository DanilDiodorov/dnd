import React, { useCallback, useEffect } from 'react'
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
} from 'reactflow'

import 'reactflow/dist/style.css'
import BlockWithValue from './components/BlockWithValue'
import Block from './components/Block'
import './App.css'
import randomstring from 'randomstring'
import axios from 'axios'

const nodeTypes = {
    block: Block,
    blockWithValue: BlockWithValue,
}

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const { screenToFlowPosition } = useReactFlow()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onInit = async () => {
        const canvas = document.querySelector('.canvas')
        const block1 = document.querySelector('.varient-1')
        const block2 = document.querySelector('.varient-2')
        canvas.addEventListener('dragover', allowDrop)
        block1.addEventListener('dragstart', drag)
        block2.addEventListener('dragstart', drag)
        canvas.addEventListener('drop', drop)

        const nodesRequest = await axios.get(`http://localhost:3001/nodes`)
        const edgesRequest = await axios.get(`http://localhost:3001/edges`)

        setNodes(nodesRequest.data)
        setEdges(edgesRequest.data)

        function allowDrop(e) {
            e.preventDefault()
        }

        function drag(e) {
            e.dataTransfer.setData('id', e.target.id)
        }

        function drop(e) {
            const id = e.dataTransfer.getData('id')
            let data

            if (id === 'var1') {
                data = {
                    id: randomstring.generate(),
                    type: 'block',
                    data: { title: id },
                    position: screenToFlowPosition({
                        x: e.clientX,
                        y: e.clientY,
                    }),
                }
                setNodes((nds) => nds.concat(data))
            } else {
                data = {
                    id: randomstring.generate(),
                    type: 'blockWithValue',
                    data: { title: id, value: '1' },
                    position: screenToFlowPosition({
                        x: e.clientX,
                        y: e.clientY,
                    }),
                }
                setNodes((nds) => nds.concat(data))
            }
            axios.post('http://localhost:3001/nodes', data)
        }
    }

    const readJsonFile = (file) =>
        new Promise((resolve, reject) => {
            const fileReader = new FileReader()

            fileReader.onload = (event) => {
                if (event.target) {
                    resolve(JSON.parse(event.target.result))
                }
            }

            fileReader.onerror = (error) => reject(error)
            fileReader.readAsText(file)
        })

    const onChange = async (event) => {
        if (event.target.files) {
            const parsedData = await readJsonFile(event.target.files[0])

            setNodes(parsedData.nodes)
            setEdges(parsedData.edges)
            const nodesRequest = await axios.get(`http://localhost:3001/nodes`)
            const edgesRequest = await axios.get(`http://localhost:3001/edges`)

            try {
                for (let i = 0; i < nodesRequest.data.length; i++) {
                    await axios.delete(
                        `http://localhost:3001/nodes/${nodesRequest.data[i].id}`
                    )
                    await new Promise((resolve) => setTimeout(resolve, 500)) // Задержка в 1 секунду
                }
                console.log('Все запросы успешно выполнены')
            } catch (error) {
                console.error('Произошла ошибка при выполнении запросов', error)
            }
            try {
                for (let i = 0; i < edgesRequest.data.length; i++) {
                    await axios.delete(
                        `http://localhost:3001/edges/${edgesRequest.data[i].id}`
                    )
                    await new Promise((resolve) => setTimeout(resolve, 500)) // Задержка в 1 секунду
                }
                console.log('Все запросы успешно выполнены')
            } catch (error) {
                console.error('Произошла ошибка при выполнении запросов', error)
            }

            try {
                for (let i = 0; i < parsedData.nodes.length; i++) {
                    await axios.post(
                        `http://localhost:3001/nodes/`,
                        parsedData.nodes[i]
                    )
                    await new Promise((resolve) => setTimeout(resolve, 500)) // Задержка в 1 секунду
                }
                console.log('Все запросы успешно выполнены')
            } catch (error) {
                console.error('Произошла ошибка при выполнении запросов', error)
            }
            try {
                for (let i = 0; i < parsedData.edges.length; i++) {
                    await axios.post(
                        `http://localhost:3001/edges/`,
                        parsedData.edges[i]
                    )
                    await new Promise((resolve) => setTimeout(resolve, 500)) // Задержка в 1 секунду
                }
                console.log('Все запросы успешно выполнены')
            } catch (error) {
                console.error('Произошла ошибка при выполнении запросов', error)
            }
        }
    }

    const exportToJson = async () => {
        let filename = 'export.json'
        let contentType = 'application/json;charset=utf-8;'

        const data = {}
        const nodesRequest = await axios.get('http://localhost:3001/nodes')
        const edgesRequest = await axios.get('http://localhost:3001/edges')
        data.nodes = nodesRequest.data
        data.edges = edgesRequest.data

        console.log(data)
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob(
                [decodeURIComponent(encodeURI(JSON.stringify(data)))],
                { type: contentType }
            )
            navigator.msSaveOrOpenBlob(blob, filename)
        } else {
            var a = document.createElement('a')
            a.download = filename
            a.href =
                'data:' +
                contentType +
                ',' +
                encodeURIComponent(JSON.stringify(data))
            a.target = '_blank'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }
    }

    const onConnect = useCallback(
        (params) => {
            axios.post('http://localhost:3001/edges', params)
            setEdges((eds) => addEdge(params, eds))
        },
        [setEdges]
    )

    const handleNodeDragStop = async (event, node, nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            await axios.put(
                `http://localhost:3001/nodes/${nodes[i].id}`,
                nodes[i]
            )
            await new Promise((resolve) => setTimeout(resolve, 500))
        }
    }

    const handleNodesDelete = async (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
            await axios.delete(`http://localhost:3001/nodes/${nodes[i].id}`)
            await new Promise((resolve) => setTimeout(resolve, 500))
        }
    }

    const handleEdgesDelete = async (edges) => {
        for (let i = 0; i < edges.length; i++) {
            await axios.delete(`http://localhost:3001/edges/${edges[i].id}`)
            await new Promise((resolve) => setTimeout(resolve, 500))
        }
    }

    return (
        <>
            <div className="tools">
                <div className="left">
                    <div className="block varient-1" draggable="true" id="var1">
                        varient 1
                    </div>
                    <div className="block varient-2" draggable="true" id="var2">
                        varient 2
                    </div>
                </div>
                <div className="right">
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={onChange}
                    />
                    <button onClick={exportToJson}>Download</button>
                </div>
            </div>
            <div className="canvas" style={{ width: '100vw', height: '100vh' }}>
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
