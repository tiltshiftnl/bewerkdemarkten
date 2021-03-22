import { Lot, MarketEventDetails, MarketLayout, MarketPage } from "../models"
import { Transformer } from "../services/transformer"
import { getLocalStorageMarkets } from "./generic"


export const validateMarkets = (): string[] => {
    const transformer = new Transformer()
    // Read all markets
    // check to see if any of the markets is invalid.
    const _ids = getLocalStorageMarkets()
    _ids.forEach((m: string) => {
        transformer.encode(m).then((result: MarketEventDetails) => {
            if(validateLots(result)) {
                console.log(m + " contains errors")
            }
        })
    })
    return _ids
}


export const validateLots = (market: MarketEventDetails): boolean => {
    let invalid: boolean = false
    // create a collection for all lots plaatsId's
    market.pages.forEach((p: MarketPage, pi: number) => {
        p.invalid = false
        p.layout.forEach((m: MarketLayout, mi: number) => {
            m.invalid = false
            m.lots.forEach((l: Lot, li: number) => {
                if (l.type === "stand" && l.plaatsId) {
                    if (!lotUnique(l, market)) {
                        market.pages[pi].layout[mi].invalid = true
                        market.pages[pi].invalid = true
                        invalid = true
                        //console.log(l.plaatsId + " is not unique")
                    }
                }
            })
        })
    })
    return invalid
}

export const lotUnique = (lot: Lot, market: MarketEventDetails) => {
    const hits: [number, number, number][] = []
    market.pages.forEach((p: MarketPage, pi: number) => {
        p.layout.forEach((m: MarketLayout, mi: number) => {
            m.lots.forEach((l: Lot, li: number) => {
                if (l.type === "stand" && l.plaatsId === lot.plaatsId) {
                    hits.push([pi, mi, li])
                }
            })
        })
    })
    if (hits.length > 1) {
        lot.invalid = true
        return false
    } else {
        lot.invalid = false
        return true
    }
}