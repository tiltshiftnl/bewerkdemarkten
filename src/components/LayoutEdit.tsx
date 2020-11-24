import React, { Component } from "react";
import { Col, Input, Row } from "antd"
import { MarketLayout } from "../models";
export default class LayoutEdit extends Component<{ index: number, layout: MarketLayout, changed?: (layout: MarketLayout) => void }> {
    readonly state: { layout: MarketLayout } = {
        layout: {
            title: "",
            landmarkTop: "",
            landmarkBottom: "",
            lots: [],
            class: ""
        }

    }

    componentDidMount() {
        this.setState({
            layout: this.props.layout,
        })
    }

    render() {
        const { index } = this.props
        return <Row gutter={[8, 8]}>
            <Col>
                <Input
                    id={`market_${index}_title`}
                    placeholder="Vul titel in"
                    value={this.state.layout.title}
                    onChange={(e: any) => {
                        if (this.props.changed){
                            this.props.changed({...this.state.layout, title: e.target.value})
                        }
                        this.setState({
                            layout: {...this.state.layout, title: e.target.value}
                        })
                    }} />
            </Col>
            <Col>
                <Input
                    id={`market_${index}_landmarkTop`}
                    placeholder="Herkeningspunt start"
                    value={this.state.layout.landmarkTop}
                    onChange={(e: any) => {
                        this.setState({
                            layout: {...this.state.layout, landmarkTop: e.target.value}
                        })
                    }} />
            </Col>
            <Col>
                <Input
                    id={`market_${index}_landmarkBottom`}
                    placeholder="Herkenningspunt eind"
                    value={this.state.layout.landmarkBottom}
                    onChange={(e: any) => {
                        this.setState({
                            layout: {...this.state.layout, landmarkBottom: e.target.value}
                        })
                    }} />
            </Col>
        </Row>
    }
}