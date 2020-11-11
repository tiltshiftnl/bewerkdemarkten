import { AssignedBranche, Geography, Markets, Page, Rows, Lot, Obstacle, Assignment, MarketEventDetails } from '../models'
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
    async retrieve(route: string): Promise<Rows> {
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
                                    //console.log(a + " matches " + _b[i].brancheId)
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

export class LotsService extends Service {
    async retrieve(route: string): Promise<Lot[]> {
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
