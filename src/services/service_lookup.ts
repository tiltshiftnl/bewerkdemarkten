import { Announcements, Branche } from '../models'
import { Service } from './service'

export class BrancheService extends Service {
    async retrieve(): Promise<Branche[]> {
        // Retrieve from Cache
        const cachedBranches = localStorage.getItem('bwdm_lookup_branches')
        if (cachedBranches) {
            console.debug("Branches are cached")
            return JSON.parse(cachedBranches)
        }
        console.debug("Branches not cached")

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/branches.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Add to Cache
                localStorage.setItem('bwdm_lookup_branches', JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class DaysClosedService extends Service {
    async retrieve(): Promise<string[]> {
        // Retrieve from Cache
        const cachedDaysClosed = localStorage.getItem('bwdm_lookup_daysclosed')
        if (cachedDaysClosed) {
            console.debug("DaysClosed are cached")
            return JSON.parse(cachedDaysClosed)
        }
        console.debug("DaysClosed not cached")

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/daysClosed.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Add to Cache
                localStorage.setItem('bwdm_lookup_daysclosed', JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class AnnouncementService extends Service {
    async retrieve(): Promise<Announcements> {
        // Retrieve from Cache
        const cachedAnnouncements = localStorage.getItem('bwdm_lookup_announcements')
        if (cachedAnnouncements) {
            console.debug("Announcements are cached")
            return JSON.parse(cachedAnnouncements)
        }
        console.debug("Announcements not cached")

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/mededelingen.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Add to Cache
                localStorage.setItem('bwdm_lookup_announcements', JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class ObstacleTypeService extends Service {
    async retrieve(): Promise<string[]> {
        // Retrieve from Cache
        const cachedObstacleTypes = localStorage.getItem('bwdm_lookup_obstacletypes')
        if (cachedObstacleTypes) {
            console.debug("ObstacleTypes are cached")
            return JSON.parse(cachedObstacleTypes)
        }
        console.debug("ObstacleTypes not cached")

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/obstakeltypes.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Add to Cache
                localStorage.setItem('bwdm_lookup_obstacletypes', JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class LotPropertyService extends Service {
    async retrieve(): Promise<string[]> {
        // Retrieve from Cache
        const cachedProperties = localStorage.getItem('bwdm_lookup_properties')
        if (cachedProperties) {
            console.debug("Properties are cached")
            return JSON.parse(cachedProperties)
        }
        console.debug("Properties not cached")

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/plaatseigenschappen.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Add to Cache
                localStorage.setItem('bwdm_lookup_properties', JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}