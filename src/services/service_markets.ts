import { Branch, Geography, Market, Markets, Page } from '../models'
import { Service } from './service'

export default class MarketsService extends Service {

    async retrieve(): Promise<Markets> {
        return fetch(this.config.API_BASE_URL + "/markets.json")
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

export class MarketService extends Service {

    async retrieve(route: string): Promise<Market> {
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/markt.json")
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

export class BranchesService extends Service {

    async retrieve(route: string): Promise<Branch[]> {
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/branches.json")
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

export class GeographyService extends Service {

    async retrieve(route: string): Promise<Geography> {
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/geografie.json")
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

export class LocationsService extends Service {

    async retrieve(route: string): Promise<Location[]> {
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/locaties.json")
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

export class PagesService extends Service {

    async retrieve(route: string): Promise<Page[]> {
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/paginas.json")
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
