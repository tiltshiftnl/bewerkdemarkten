import React, { Component, MouseEvent } from "react"
import SvgObstacle from "../graphics/SvgObstacle"
import { Lot } from "../models"

export default class ObstacleBlock extends Component<{
    index: number
    obstacle: Lot
    invert: boolean
    classDef: string
    lotOnClick: (event: MouseEvent) => void
}> {
    render() {
        const { index, obstacle, classDef, invert, lotOnClick } = this.props
        return <div key={index} className={classDef} onClick={lotOnClick}>
            <SvgObstacle obstacle={obstacle} invert={invert} classDef={classDef} />
        </div>
    }
}