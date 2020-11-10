import React, { Component } from "react";
import { Obstacle } from "../models";
import SvgLoopje from "./SvgLoopje";

export default class SvgObstacle extends Component<{
    obstacle: Obstacle
    invert: boolean
    classDef: string
}> {
    render() {
        return <SvgLoopje/>
    }
}