import Configuration from './configuration'

type datasetType = "branches" | "pages" | "lots" | "geography" | "rows"

export class Service<T> {
    config: Configuration
    constructor() {
        this.config = new Configuration()
    }
    handleResponseError(response: Response) {
        throw new Error("HTTP error, status = " + response.status)
    }

    handleError(error: Error) {
        throw error
    }

    getFilename(dataset: datasetType) {
        switch (dataset) {
            case "pages":
                return "paginas.json"
            case "lots":
                return "locaties.json"
            case "geography":
                return "geografie.json"
            case "branches":
                return "branches.json"
                case "rows":
                    return "markt.json"
            default:
                return ""
        }
    }

    async getData(route: string, dataset: datasetType): Promise<T> {
        // Retrieve from Cache
        const cached = localStorage.getItem(`bwdm_cache_${route}_${dataset}`)
        if (cached) {
            console.debug(`${dataset} for ${route} are cached`)
            return JSON.parse(cached)
        }
        console.debug(`${dataset} for ${route} not cached`)

        // Fetch
        return fetch(`${this.config.API_BASE_URL}/markt/${route}/${this.getFilename(dataset)}`)
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_${route}_${dataset}`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }

    async postData(route: string, dataset: datasetType, data: T) {
        // Update Cache
        localStorage.setItem(`bwdm_cache_${route}_${dataset}`, JSON.stringify(data))
        // Post
        return fetch(`${this.config.API_BASE_URL}/markt/${route}/${this.getFilename(dataset)}`,
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return "ok"
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}