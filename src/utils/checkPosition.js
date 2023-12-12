const checkPosition = (data) => {
    let x = 200,
        y = 200,
        i = 0
    for (let key in data) {
        if (data[key].position === undefined) {
            data[key].position = { x, y }
            i++
            x += 500
            if (i === 5) {
                x = 200
                i = 0
                y += 600
            }
        }
    }
    return data
}

export default checkPosition
