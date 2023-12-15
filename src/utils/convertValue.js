const convertValue = (value, type) => {
    switch (type) {
        case 'string':
            return String(value)
        case 'number':
            return Number(value)
        case 'boolean':
            return value === 'false' ? false : true
        case 'array':
            return value.trim().split(',')
        case 'object':
            return JSON.parse(value)
        default:
            return value
    }
}

export default convertValue
