const exportToJson = async (blocks) => {
    const filename = 'export.json'
    const contentType = 'application/json;charset=utf-8;'

    const data = {}
    data.blocks = blocks

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

export default exportToJson
