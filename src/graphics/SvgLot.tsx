import React, { Component } from "react";
import { Lot } from "../models";
import SvgBak from "./SvgBak";
import SvgElectra from "./SvgElectra";

export default class SvgLot extends Component<{
    lot: Lot
    invert: boolean
    classDef: string
}> {

    renderProperties = (properties: string[] | undefined) => {
        let propertyColor = "#777"
        let propertyPosition: { x: number, y: number } = { x: 37, y: 33 }
        if (this.props.invert) {
            propertyPosition = { x: 37, y: 0 }
        }
        if (properties) {
            if (properties[0] && properties[0] === "electra") {
                return <SvgElectra invert={this.props.invert} color={propertyColor} position={propertyPosition} />
            }
        }
        return <>todo</>
    }

    renderBranches = (branches: string[] | undefined) => {
        let branchesPosition: { x: number, y: number } = { x: 37, y: 3 }
        let brancheColor = "#777"
        if (this.props.invert) {
            branchesPosition = { x: 37, y: 37 }
        }
        // Contains bak?
        return <>{this.props.lot.branches && this.props.lot.branches.indexOf("bak") > -1 &&
            <SvgBak color={brancheColor} position={branchesPosition}/>
        }</>
    }

    render() {
        const x = 0
        const y = 0
        const width = 50
        const height = 50

        let facilityPosition: { x: number, y: number } = { x: 10, y: 40 }

        let strokeColor = "#d9d9d9"
        let fillColor = "#fafafa"
        let textColor = "#000000"
        let facilityColor = "#faad14"

        if (this.props.invert) {
            facilityPosition = { x: 10, y: 10 }
        }
        if (this.props.classDef === "lot occupied") {
            strokeColor = "#ffa39e"
            fillColor = "#fff1f0"
            textColor = "#ff4d4f"
        }

        if (this.props.classDef.indexOf("selected") > -1) {
            strokeColor = "#ffffff"
            fillColor = "#1890ff"
            textColor = "#ffffff"
        }

        return <svg style={{ width: "50px" }} viewBox="0 0 50 50">
            <g>
                <rect x={x} y={y} width={width} height={height} style={{
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: "1px"
                }} />
                <text
                    x={x + width / 2}
                    y={y + width / 2}
                    style={{ fill: textColor }}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="1.5em">
                    {this.props.lot.plaatsId}
                </text>
                {this.renderBranches(this.props.lot.branches)}

                {this.props.lot.verkoopinrichting && this.props.lot.verkoopinrichting.length > 0 &&
                    <g>
                        <circle cx={facilityPosition.x} cy={facilityPosition.y} r="8" fill={facilityColor} />
                        <text
                            x={facilityPosition.x}
                            y={facilityPosition.y}
                            style={{ fill: "white" }}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="10px">
                            {this.props.lot.verkoopinrichting.length}
                        </text>
                    </g>
                }
            </g>
            {this.renderProperties(this.props.lot.properties)}
        </svg>
    }
}