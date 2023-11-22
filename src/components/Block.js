import { memo } from 'react'
import { Handle, Position } from 'reactflow'

export default memo(({ data, isConnectable }) => {
    return (
        <>
            <div className="card card-2">
                <div>Title: {data.title}</div>
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
