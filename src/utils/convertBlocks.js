import { MarkerType } from 'reactflow'

const convertBlocks = (blocks) => {
    const newBlocks = []
    const newEdges = []

    for (let key in blocks) {
        newBlocks.push({
            position: blocks[key].position,
            id: key,
            type: 'blockWithValue',
            data: {
                title: key,
                actions: blocks[key].actions,
                exit_points: blocks[key].exit_points,
            },
            dragging: true,
        })
        blocks[key].exit_points?.forEach((edge, index) => {
            newEdges.push({
                id: `${key}->${edge.block}`,
                source: key,
                target: edge.block,
                sourceHandle: `${key}_${index}`,
                animated: true,
                data: { index },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20,
                },
                style: {
                    strokeWidth: 3,
                },
            })
        })
    }

    return [newBlocks, newEdges]
}

export default convertBlocks
