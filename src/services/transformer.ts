import { getTextColor } from "../helpers/PresentationHelpers"
import { AssignedBranche, Assignment, Lot, MarketEventDetails, MarketPage, Obstacle, Page } from "../models"
import { BrancheService } from "./service_lookup"
import { BranchesService, GeographyService, LotsService, PagesService, RowsService } from "./service_markets"

export class Transformer {
    getRow(obstacle: Obstacle, matrix: any[]): [number, number] {
        // Object Before Obstacle
        const oStart = matrix.find(e => e.plaatsId === obstacle.kraamA)
        const oStartPosition = matrix.indexOf(oStart)

        // Object After Obstacle
        const oEnd = matrix.find(e => e.plaatsId === obstacle.kraamB)
        const oEndPosition = matrix.indexOf(oEnd)
        return [oStartPosition, oEndPosition]
    }

    /**
     * Convert from the model we require for the app to function to the individual files
     */
    async decode(marketEventDetails: MarketEventDetails) {

    }

    /**
     * Convert from the individual files to the model we require for the app to function
     */
    async encode(route: string): Promise<MarketEventDetails> {
        let newPages: MarketPage[] = []
        let rowSets: (Lot | Obstacle)[] = []
        let newBranches: AssignedBranche[] = []

        const _b = await new BranchesService().retrieve(route).then(result => result) // branches.json
        const _g = await new GeographyService().retrieve(route).then(result => result) // geografie.json
        const _l = await new LotsService().retrieve(route).then(result => result) // locaties.json
        const _r = await new RowsService().retrieve(route).then(result => result) // markt.json
        const _p = await new PagesService().retrieve(route).then(result => result) // paginas.json
        const _bb = await new BrancheService().retrieve().then(result => result)

        // Add color information to branches
        if (_b && _b.length > 0) {
            _b.forEach((a: AssignedBranche, i: number) => {
                const _bbLookupValue = _bb.filter(e => e.brancheId === _b[i].brancheId)
                if (_bbLookupValue.length === 1 && _bbLookupValue[0].color !== "") {
                    _b[i].backGroundColor = _bbLookupValue[0].color
                    _b[i].color = getTextColor(_bbLookupValue[0].color)
                }
                _b[i].allocated = 0
            })
            newBranches = _b
        }

        // replace row items with locations

        if (_r && _r.rows.length > 0) {
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
                                        _b[i].allocated = (_b[i].allocated as number) + 1 || 1
                                    }
                                })
                            })
                        }
                        rowSets.push({ ..._Lot, type: "stand" }) // where plaatsId =....
                    }
                })
            })
        }
        if (_g && _g.obstakels.length > 0) {
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
        }

        // Now I have rows with obstacles, lets paste them into the pages at the right positions,
        // replace the plaatsList with the given rows and stitch them together with the obstacles.
        if (_p && _p.length > 0) {

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
        }
        return { branches: newBranches, pages: newPages }
    }
}