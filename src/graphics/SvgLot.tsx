import React, { Component } from "react";
import { AssignedBranche, Lot } from "../models";
import SvgBak from "./SvgBak";
import SvgBench from "./SvgBench";
import SvgElectra from "./SvgElectra";
import SvgLight from "./SvgLight";
import SvgTree from "./SvgTree";
import SvgWater from "./SvgWater";

export default class SvgLot extends Component<{
    lot: Lot
    branche?: AssignedBranche
    classDef: string
    invert: boolean
}> {

    renderVerkoopinrichting = () => {
        let facilityPosition: { x: number, y: number } = { x: 2, y: 20 }
        let facilityColor = this.getFillColor() //"#faad14"
        if (this.props.invert) {
            facilityPosition = { x: 2, y: 2 }
        }
        if (this.props.lot.verkoopinrichting && this.props.lot.verkoopinrichting.length > 0)
            return <g>
                <rect x={facilityPosition.x} y={facilityPosition.y} height={28} width={6} fill={facilityColor} />
            </g>
    }

    renderProperties = () => {
        // Todo: Render ALL properties (how?)
        const properties = this.props.lot.properties
        let propertyPosition: { x: number, y: number } = { x: 36, y: 31 }
        if (this.props.invert) {
            propertyPosition = { x: 36, y: 1 }
        }
        if (properties) {
            return properties.map((prop: string, i: number) => {
                //console.log(prop)
                //console.log(i)
                switch(prop) {
                    case "bankje":
                        propertyPosition = this.props.invert ? { x: 24, y: 13 } : { x: 24, y: 20 }
                        return <SvgBench invert={this.props.invert} color="#c75819" position={propertyPosition} />
                    case "electra":
                        propertyPosition = this.props.invert ? { x: 36, y: 3 } : { x: 36, y: 31 }
                        return <SvgElectra invert={this.props.invert} color="#000" position={propertyPosition} />
                    case "water":
                        propertyPosition = this.props.invert ? { x: 10, y: 2 } : { x: 10, y: 35 }
                        return <SvgWater invert={this.props.invert} color="#1890ff" position={propertyPosition} />
                    case "boom":
                            propertyPosition = this.props.invert ? { x: 10, y: 15 } : { x: 10, y: 21 }
                            return <SvgTree invert={this.props.invert} color="#73ab4f" position={propertyPosition} />
                    case "lantaarnpaal":
                                propertyPosition = this.props.invert ? { x: 32, y: 12 } : { x: 32, y: 15 }
                                return <SvgLight invert={this.props.invert} color="yellow" position={propertyPosition} />
                    default:
                        return <></>
                }
            }) 
        }
        return <></>
    }

    renderBranches = () => {
        let branchesPosition: { x: number, y: number } = { x: 23, y: 36 }
        let brancheColor = "#777"
        if (this.props.invert) {
            branchesPosition = { x: 23, y: 3 }
        }
        // Contains bak?
        return <>{this.props.lot.branches && this.props.lot.branches.indexOf("bak") > -1 &&
            <SvgBak color={brancheColor} position={branchesPosition} />
        }</>
    }


    getStrokeColor = () => {
        if (this.props.classDef.indexOf("selected") > -1) {
            return "#1890ff"
        }
        if (this.props.branche && this.props.branche.backGroundColor) {
            return this.props.branche.backGroundColor
        }
        return "#fafafa"
    }

    getFillColor = () => {
        if(this.props.branche?.brancheId === "207-grill-frituur"){
            console.log(this.props.branche)
        }
        if (this.props.branche && this.props.branche.backGroundColor) {
            return this.props.branche.backGroundColor
        }
        return "#fafafa"
    }

    getTextColor = () => {
        if (this.props.branche && this.props.branche.color) {
            return this.props.branche.color
        }
        return "#000000"
    }

    render() {
        let x = 0
        let y = 0
        if(this.props.invert){
            x= 0
            y= 28
        }
        const width = 50
        const height = 20

        let strokeColor = this.getStrokeColor()
        let fillColor = this.getFillColor()
        let textColor = this.getTextColor()

        return <svg style={{ width: "50px" }} viewBox="0 0 50 50">
            <g>
                
                <rect x={x} y={y} width={width} height={height} style={{
                    fill: fillColor,
                    stroke: "none",
                    strokeWidth: "0px"
                }} />
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    style={{ fill: textColor }}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize="1em">
                    {this.props.lot.plaatsId}
                </text>
                {this.renderBranches()}
                <rect x={0} y={0} width={50} height={50} style={{
                    fill: "none",
                    stroke: strokeColor,
                    strokeWidth: "4px"
                }} />
                
            </g>
            {this.renderVerkoopinrichting()}
            {this.renderProperties()}
        </svg>
    }
}