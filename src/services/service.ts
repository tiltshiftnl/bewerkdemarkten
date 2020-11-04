import Configuration from './configuration'

export class Service {
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
}