import { getTextColor } from "../common/generic"
import { AssignedBranche, Assignment, Geography, Lot, MarketEventDetails, MarketLayout, MarketPage, Obstacle, Page, Rows, Stand } from "../models"
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
                    _b[i].backGroundColor = _bbLookupValue[0].color.replace("##", "#")
                    _b[i].color = getTextColor(_bbLookupValue[0].color.replace("##", "#"))
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
                    if (group.plaatsList.length > 0) {
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
                    } else {
                        delete (group as any).plaatsList
                        const newListGroup = { ...group, lots: [] }
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

    layoutToGeography(pages: MarketPage[]): Geography {
        const obstacles: Obstacle[] = []

        pages.forEach((page: MarketPage) => {
            page.layout.forEach((layout: MarketLayout) => {
                layout.lots.forEach((element: Lot | Obstacle, i) => {
                    if (element.type === "obstacle") {
                        obstacles.push({
                            kraamA: (layout.lots[i - 1] ? layout.lots[i - 1].plaatsId : "") || "",
                            kraamB: (layout.lots[i + 1] ? layout.lots[i + 1].plaatsId : "") || "",
                            obstakel: element.obstakel || []
                        })
                    }

                })
            })
        })
        return {
            obstakels: obstacles
        }
    }


    layoutToStands(pages: MarketPage[]): Stand[] {
        const stands: Stand[] = []

        pages.forEach((page: MarketPage) => {
            page.layout.forEach((layout: MarketLayout) => {
                layout.lots.forEach((element: Lot | Obstacle) => {
                    if (element.type === "stand") {
                        let _stand: Stand = {
                            plaatsId: element.plaatsId || "",
                        }
                        if (element.branches) {
                            _stand.branches = element.branches
                        }
                        if (element.verkoopinrichting) {
                            _stand.verkoopinrichting = element.verkoopinrichting
                        }
                        if (element.properties) {
                            _stand.properties = element.properties
                        }
                        stands.push(_stand)
                    }
                })
            })
        })
        return stands
    }

    layoutToRows(pages: MarketPage[]): Rows {
        const _blocks: string[][] = []
        pages.forEach((page: MarketPage) => {
            page.layout.forEach((layout: MarketLayout) => {
                let _block: string[] = []
                layout.lots.forEach((element: Lot | Obstacle, i: number) => {
                    // Loop until the next object would be an obstacle or until blockEnd is true
                    if (element.type === "stand") {
                        _block.push(element.plaatsId || "")
                        // Does it have a previous element? If not, set blockStart
                        if (!layout.lots[i - 1]) {
                            layout.lots[i].blockStart = true
                        }

                        // Does it have a previous element? If not, set blockStart
                        if (!layout.lots[i + 1]) {
                            layout.lots[i].blockEnd = true
                        }

                        // Is the previous element an obstacle?
                        if (layout.lots[i - 1]) {
                            if (layout.lots[i - 1].type === "obstacle") {
                            layout.lots[i].blockStart = true
                            } else {
                                if(layout.lots[i - 1].blockEnd) {
                                    layout.lots[i].blockStart = true
                                }
                            }
                        }

                        // Is the next element an obstacle?
                        if (layout.lots[i + 1] && layout.lots[i + 1].type === "obstacle") {
                            layout.lots[i].blockEnd = true
                        }
                        // Causes crash when layout.lots[i +1] or layouts.lots[]Check for layout lots
                        if (element.blockEnd) {
                            _blocks.push(_block)
                            _block = []
                        }
                    }
                })
            })
        })
        return {
            rows: _blocks
        }
    }

    layoutToPages(pages: MarketPage[]): Page[] {
        const final: Page[] = []
        pages.forEach((page: MarketPage) => {
            const indelingsLijst = page.layout.map((layout: MarketLayout) => {
                const plaatsList: string[] = []

                layout.lots.forEach((element: Lot | Obstacle) => {
                    if (element.type === "stand") {
                        plaatsList.push(element.plaatsId || "?")
                    }
                })

                return {
                    class: layout.class,
                    title: layout.title,
                    landmarkTop: layout.landmarkTop,
                    landmarkBottom: layout.landmarkBottom,
                    plaatsList: plaatsList
                }
            })
            final.push({
                title: page.title,
                indelingslijstGroup: indelingsLijst
            })
        })
        return final
    }
}