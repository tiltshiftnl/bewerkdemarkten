import React, { Component } from "react";
import { Lot } from "../models";
import SvgBench from "./SvgBench";
import SvgElectra from "./SvgElectra";
import SvgLight from "./SvgLight";
import SvgLoopje from "./SvgLoopje";
import SvgWalkthrough from "./SvgWalkthrough";
import SvgWalkWithClose from "./SvgWalkWithClose";
import SvgWater from "./SvgWater";

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

    getGraphic = () => {
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("loopje") > -1) {
            return <SvgLoopje color="red"/>
        }
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("doorloop") > -1) {
            return <SvgWalkthrough color="red"/>
        }
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("loopjediedichtmag") > -1) {
            return <SvgWalkWithClose color="red"/>
        }
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("electra") > -1) {
            return <SvgElectra color="red" position={{x:18,y:18}}/>
        }
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("water") > -1) {
            return <SvgWater color="red" position={{x:18,y:18}}/>
        }
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("bankje") > -1) {
            return <SvgBench color="red" position={{x:18,y:18}}/>
        }
        if (this.props.obstacle.obstakel && this.props.obstacle.obstakel.indexOf("lantaarnpaal") > -1) {
            return <SvgLight color="red" position={{x:15,y:16}}/>
        }
        return <></>
    }

    render() {
        let strokeColor = this.getStrokeColor()
        return <svg style={{ width: "50px" }} viewBox="0 0 50 50">
            {this.getGraphic()}
            <rect x={0} y={0} width={50} height={50} style={{
                    fill: "none",
                    stroke: strokeColor,
                    strokeWidth: "4px"
                }} />
            </svg>
    }
}