import React, { Component, MouseEvent } from "react"
import SvgLot from "../graphics/SvgLot"
import { AssignedBranche, Lot } from "../models"

export default class LotBlock extends Component<{
    index: number
    lot: Lot
    invert: boolean
    classDef: string
    branche?: AssignedBranche
    lotOnClick: (event: MouseEvent) => void
}> {
    
    render() {
        const { index, lot, classDef, lotOnClick, invert, branche } = this.props
        return <div key={index} className={classDef} onClick={lotOnClick}>
            <SvgLot lot={lot} invert={invert} branche={branche} classDef={classDef}/>
        </div>
    }
}