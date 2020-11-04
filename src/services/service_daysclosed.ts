import { Service } from './service'

export default class DaysClosedService extends Service {

    async retrieve(): Promise<string[]> {
        return fetch(this.config.API_BASE_URL + "/markt/daysClosed.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}
