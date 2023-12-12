const readJson = (file) =>
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

export default readJson
