import { Announcements, Branche } from '../models'
import { Service } from './service'

export class BrancheService extends Service {
    async retrieve(): Promise<Branche[]> {
        return fetch(this.config.API_BASE_URL + "/markt/branches.json")
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

export class DaysClosedService extends Service {
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

export class AnnouncementService extends Service {
    async retrieve(): Promise<Announcements> {
        return fetch(this.config.API_BASE_URL + "/markt/mededelingen.json")
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

export class ObstacleTypeService extends Service {
    async retrieve(): Promise<string[]> {
        return fetch(this.config.API_BASE_URL + "/markt/obstakeltypes.json")
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

export class LotPropertyService extends Service {
    async retrieve(): Promise<string[]> {
        return fetch(this.config.API_BASE_URL + "/markt/plaatseigenschappen.json")
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