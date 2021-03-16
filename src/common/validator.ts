import { Lot, MarketEventDetails, MarketLayout, MarketPage } from "../models"

export const validateLots = (market: MarketEventDetails) => {
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
                        console.log(l.plaatsId + " is not unique")
                    }
                }
            })
        })
    })
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
        console.log("Uh, oh, we have a double!")
        return false
    } else {
        lot.invalid = false
        return true
    }
}