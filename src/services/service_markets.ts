import { getTextColor } from '../helpers/PresentationHelpers'
import { AssignedBranche, Geography, Markets, Page, Rows, Lot, Obstacle, Assignment, MarketEventDetails } from '../models'
import { Service } from './service'
import { BrancheService } from './service_lookup'

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
    async retrieve(route: string): Promise<Rows> {
        // Retrieve from Cache
        const cachedMarket = localStorage.getItem(`bwdm_cache_${route}_market`)
        if (cachedMarket) {
            console.log(`Market for ${route} is cached`)
            return JSON.parse(cachedMarket)
        }
        console.log(`Market for ${route} not cached`)

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/markt.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_${route}_market`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }

    getRow(obstacle: Obstacle, matrix: any[]): [number, number] {
        // Object Before Obstacle
        const oStart = matrix.find(e => e.plaatsId === obstacle.kraamA)
        const oStartPosition = matrix.indexOf(oStart)

        // Object After Obstacle
        const oEnd = matrix.find(e => e.plaatsId === obstacle.kraamB)
        const oEndPosition = matrix.indexOf(oEnd)
        return [oStartPosition, oEndPosition]
    }

    async constructRelationalStructure(route: string): Promise<MarketEventDetails> {
        const _b = await new BranchesService().retrieve(route).then(result => result) // branches.json
        const _g = await new GeographyService().retrieve(route).then(result => result) // geografie.json
        const _l = await new LotsService().retrieve(route).then(result => result) // locaties.json
        const _m = await this.retrieve(route).then(result => result) // markt.json
        const _p = await new PagesService().retrieve(route).then(result => result) // paginas.json
        const _bb = await new BrancheService().retrieve().then(result => result)

        // replace row items with locations
        const rowSets: (Lot | Obstacle)[] = []
        _m.rows.forEach(row => {
            row.forEach((lot: string) => {
                const _Lot: Lot | undefined = _l.find(e => e.plaatsId === lot)
                if (_Lot) {
                    // Set allocated on branches for the given lot
                    if (_Lot.branches) {
                        _b.forEach((br: AssignedBranche, i) => {
                            _Lot.branches?.forEach(a => {
                                if (a === _b[i].brancheId) {
                                    const _bbLookupValue = _bb.filter(e => e.brancheId === _b[i].brancheId)
                                    if (_bbLookupValue.length === 1 && _bbLookupValue[0].color !== "") {
                                        _b[i].backGroundColor = _bbLookupValue[0].color
                                        _b[i].color = getTextColor(_bbLookupValue[0].color)
                                    }
                                    _b[i].allocated = (_b[i].allocated as number) + 1 || 1
                                }
                            })
                        })
                    }
                    rowSets.push({ ..._Lot, type: "stand" }) // where plaatsId =....
                }
            })
        })

        // Insert obstacles between lots.
        _g.obstakels.forEach((o: Obstacle) => {
            // Where to insert the obstacle?
            const obstaclePosition = this.getRow(o, rowSets)

            if (obstaclePosition !== [-1, -1]) {
                rowSets.splice(obstaclePosition[1], 0, { ...o, type: "obstacle" })
            } else {
                console.log("Something is wrong with this obstacle")
                console.log(o)
            }
        })

        // Now I have rows with obstacles, lets paste them into the pages at the right positions,
        // replace the plaatsList with the given rows and stitch them together with the obstacles.
        const newPages: any = []
        _p.forEach((page: Page) => {
            const newListGroupArray: any = []
            page.indelingslijstGroup.forEach((group: Assignment) => {
                const firstLotId: string = group.plaatsList[0]
                const lastLotId: string = group.plaatsList[group.plaatsList.length - 1]
                //find the first
                const firstLot = rowSets.find(e => (e as Lot).plaatsId === firstLotId)
                //find the last
                const lastLot = rowSets.find(e => (e as Lot).plaatsId === lastLotId)
                if (lastLot && firstLot) {
                    const firstLotPosition = rowSets.indexOf(firstLot)
                    const lastLotPosition = rowSets.indexOf(lastLot)
                    //grab the part of the array that is between (and including) first and last
                    const pageLotsAndObstacles = rowSets.slice(firstLotPosition, lastLotPosition + 1)
                    delete (group as any).plaatsList
                    const newListGroup = { ...group, lots: pageLotsAndObstacles }
                    newListGroupArray.push(newListGroup)
                }
            })
            delete (page as any).indelingslijstGroup
            const newPage = { ...page, layout: newListGroupArray }
            newPages.push(newPage)
        })

        return { branches: _b, pages: newPages }
    }
}

export class BranchesService extends Service {
    async retrieve(route: string): Promise<AssignedBranche[]> {
        // Retrieve from Cache
        const cachedBranches = localStorage.getItem(`bwdm_cache_${route}_branches`)
        if (cachedBranches) {
            console.log(`Branches for ${route} are cached`)
            return JSON.parse(cachedBranches)
        }
        console.log(`Branches for ${route} not cached`)

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/branches.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_${route}_branches`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class GeographyService extends Service {
    async retrieve(route: string): Promise<Geography> {
        // Retrieve from Cache
        const cachedGeography = localStorage.getItem(`bwdm_cache_${route}_geography`)
        if (cachedGeography) {
            console.log(`Geography for ${route} are cached`)
            return JSON.parse(cachedGeography)
        }
        console.log(`Geography for ${route} not cached`)

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/geografie.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_${route}_geography`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class LotsService extends Service {
    async retrieve(route: string): Promise<Lot[]> {
        // Retrieve from Cache
        const cachedLots = localStorage.getItem(`bwdm_cache_${route}_lots`)
        if (cachedLots) {
            console.log(`Lots for ${route} are cached`)
            return JSON.parse(cachedLots)
        }
        console.log(`Lots for ${route} not cached`)

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/locaties.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_${route}_lots`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class PagesService extends Service {
    async retrieve(route: string): Promise<Page[]> {
        // Retrieve from Cache
        const cachedPages = localStorage.getItem(`bwdm_cache_${route}_pages`)
        if (cachedPages) {
            console.log(`Pages for ${route} are cached`)
            return JSON.parse(cachedPages)
        }
        console.log(`Pages for ${route} not cached`)

        // Fetch
        return fetch(this.config.API_BASE_URL + "/markt/" + route + "/paginas.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_${route}_pages`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}
