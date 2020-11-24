import React, { Component, MouseEvent } from "react"
import SvgLot from "../graphics/SvgLot"
import { Lot } from "../models"

export default class LotBlock extends Component<{
    index: number
    lot: Lot
    invert: boolean
    classDef: string
    lotOnClick: (event: MouseEvent) => void
}> {
    
    render() {
        const { index, lot, classDef, lotOnClick, invert } = this.props
        return <div key={index} className={classDef} onClick={lotOnClick}>
            <SvgLot lot={lot} invert={invert} classDef={classDef} />
        </div>
    }
}