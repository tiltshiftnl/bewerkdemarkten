import React, { Component } from "react"
import SvgObstacle from "../graphics/SvgObstacle"
import { Obstacle } from "../models"

export default class LayoutObstacleBlock extends Component<{
    index: number
    obstacle: Obstacle
    invert: boolean
    classDef: string
}> {
    render() {
        const { index, obstacle, classDef, invert } = this.props
            return <div key={index} className={classDef}>
                <SvgObstacle obstacle={obstacle} invert={invert} classDef={classDef} />
            </div>
    }
}