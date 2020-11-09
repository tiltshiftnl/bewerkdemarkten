import React, { Component } from "react";
import { Obstacle } from "../models";

export default class SvgObstacle extends Component<{
    obstacle: Obstacle
    invert: boolean
    classDef: string
}> {
    render() {
        const x = 15
        const y = 0
        const width = 20
        const height = 50
        let strokeColor = "#fff"
        let fillColor = "#f5f5f5"

        return <svg style={{ width: "50px" }} viewBox="0 0 50 50">
            <g>
                <rect x={x} y={y} width={width} height={height} style={{
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: "1px"
                }} />
            </g>
        </svg>
    }
}