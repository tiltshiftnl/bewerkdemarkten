import { getTextColor } from '../helpers/PresentationHelpers'
import { AssignedBranche, Geography, Markets, Page, Rows, Lot, Obstacle, Assignment, MarketEventDetails } from '../models'
import { Service } from './service'
import { BrancheService } from './service_lookup'



export default class MarketsService extends Service<Markets> {
    
    async retrieve(): Promise<Markets> {
        // Retrieve from Cache
        const cachedMarkets = localStorage.getItem(`bwdm_cache_markets`)
        if (cachedMarkets) {
            console.debug(`Markets cached`)
            return JSON.parse(cachedMarkets)
        }
        console.debug(`Markets not cached`)
        return fetch(this.config.API_BASE_URL + "/markets.json")
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response)
                }
                return response.json()
            })
            .then(json => {
                const item = json
                // Cache
                localStorage.setItem(`bwdm_cache_markets`, JSON.stringify(item))
                return item
            })
            .catch(error => {
                this.handleError(error)
            })
    }
}

export class RowsService extends Service<Rows> {
    async update(route: string, data: Rows) {
        return this.postData(route, "rows", data)
    }

    async retrieve(route: string): Promise<Rows> {
        return this.getData(route, "rows")
    }
}

export class MarketService extends Service<Rows> {
    getRow(obstacle: Obstacle, matrix: any[]): [number, number] {
        // Object Before Obstacle
        const oStart = matrix.find(e => e.plaatsId === obstacle.kraamA)
        const oStartPosition = matrix.indexOf(oStart)

        // Object After Obstacle
        const oEnd = matrix.find(e => e.plaatsId === obstacle.kraamB)
        const oEndPosition = matrix.indexOf(oEnd)
        return [oStartPosition, oEndPosition]
    }

    async get(route: string): Promise<MarketEventDetails> {
        const _b = await new BranchesService().retrieve(route).then(result => result) // branches.json
        const _g = await new GeographyService().retrieve(route).then(result => result) // geografie.json
        const _l = await new LotsService().retrieve(route).then(result => result) // locaties.json
        const _r = await new RowsService().retrieve(route).then(result => result) // markt.json
        const _p = await new PagesService().retrieve(route).then(result => result) // paginas.json
        const _bb = await new BrancheService().retrieve().then(result => result)

        // replace row items with locations
        const rowSets: (Lot | Obstacle)[] = []
        _r.rows.forEach((row: string[], rowsetindex: number) => {
            row.forEach((lot: string, rowindex: number) => {
                const _Lot: Lot | undefined = _l.find(e => e.plaatsId === lot)
                if (_Lot) {
                    _Lot.blockPosition = [rowsetindex, rowindex]
                    if (rowindex === 0) {
                        _Lot.blockStart = true
                    }
                    if (rowindex === row.length - 1) {
                        _Lot.blockEnd = true
                    }
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
                console.debug("Something is wrong with this obstacle")
                console.debug(o)
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

export class BranchesService extends Service<AssignedBranche[]> {
    async update(route: string, data: AssignedBranche[]) {
        return this.postData(route, "branches", data)
    }

    async retrieve(route: string): Promise<AssignedBranche[]> {
        return this.getData(route, "branches")
    }
}

export class GeographyService extends Service<Geography> {
    async update(route: string, data: Geography) {
        return this.postData(route, "geography", data)
    }

    async retrieve(route: string): Promise<Geography> {
        return this.getData(route, "geography")
    }
}

export class LotsService extends Service<Lot[]> {
    async update(route: string, data: Lot[]) {
        return this.postData(route, "lots", data)
    }

    async retrieve(route: string): Promise<Lot[]> {
        return this.getData(route, "lots")
    }
}

export class PagesService extends Service<Page[]> {
    async update(route: string, data: Page[]) {
        return this.postData(route, "pages", data)
    }

    async retrieve(route: string): Promise<Page[]> {
        return this.getData(route, "pages")
    }
}
