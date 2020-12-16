import React, { Component } from "react";
import { Lot } from "../models";
import SvgLoopje from "./SvgLoopje";

export default class SvgObstacle extends Component<{
    obstacle: Lot
    invert: boolean
    classDef: string
}> {
    getStrokeColor = () => {
        if (this.props.classDef.indexOf("selected") > -1) {
            return "#1890ff"
        }
        return "#fff"
    }

    render() {
        let strokeColor = this.getStrokeColor()
        return <svg style={{ width: "50px" }} viewBox="0 0 50 50">
            <SvgLoopje/>
            <rect x={0} y={0} width={50} height={50} style={{
                    fill: "none",
                    stroke: strokeColor,
                    strokeWidth: "4px"
                }} />
            </svg>
    }
}