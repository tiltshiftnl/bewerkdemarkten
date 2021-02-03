import { MMarkt } from '../models/mmarkt'
import { Service } from './service'

export class MMarktService extends Service<MMarkt[]> {
    async retrieve(): Promise<MMarkt[]> {
        return fetch("/data/mmarkt.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Add to Cache
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }


}
