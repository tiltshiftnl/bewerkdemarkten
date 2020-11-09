import React, { Component } from "react";
import { Lot } from "../models";

export default class SvgLot extends Component<{
    lot: Lot
    invert: boolean
    classDef: string
}> {
    render() {
        const x = 0
        const y = 0
        const width = 50
        const height = 50
        let branchesPosition: { x: number, y: number } = { x: 40, y: 10 }
        let facilityPosition: { x: number, y: number } = { x: 10, y: 40 }
        let propertyPosition: { x: number, y: number } = { x: 40, y: 40 }
        let strokeColor = "#d9d9d9"
        let fillColor = "#fafafa"
        let textColor = "#000000"
        let facilityColor = "#faad14"
        let propertyColor = "#52c41a"

        if (this.props.invert) {
            branchesPosition = { x: 40, y: 40 }
            facilityPosition = { x: 10, y: 10 }
            propertyPosition = { x: 40, y: 10 }
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
                {this.props.lot.branches && this.props.lot.branches.length > 1 &&
                    <g>
                        <circle cx={branchesPosition.x} cy={branchesPosition.y} r="8" fill={textColor} />
                        <text
                            x={branchesPosition.x}
                            y={branchesPosition.y}
                            style={{ fill: fillColor }}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="10px">
                            {this.props.lot.branches.length}
                        </text>
                    </g>
                }

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

                {this.props.lot.properties && this.props.lot.properties.length > 0 &&
                    <g>
                        <circle cx={propertyPosition.x} cy={propertyPosition.y} r="8" fill={propertyColor} />
                        <text
                            x={propertyPosition.x}
                            y={propertyPosition.y}
                            style={{ fill: "white" }}
                            dominantBaseline="middle"
                            textAnchor="middle"
                            fontSize="10px">
                            {this.props.lot.properties.length}
                        </text>
                    </g>
                }
            </g>
        </svg>
    }
}