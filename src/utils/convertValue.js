const convertValue = (value, type) => {
    switch (type) {
        case 'string':
            return String(value)
        case 'number':
            return Number(value)
        case 'boolean':
            return value === 'false' ? false : true
        case 'object':
            return value.trim().split(',')
        default:
            return value
    }
}

export default convertValue
