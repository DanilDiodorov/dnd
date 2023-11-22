import { memo } from 'react'
import { Handle, Position } from 'reactflow'

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
            />
            <div className="card">
                <div>Title: {data.title}</div>
                <div>Value: {data.value}</div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                isConnectable={isConnectable}
            />
        </>
    )
})
