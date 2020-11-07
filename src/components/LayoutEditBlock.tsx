import React, { Component } from "react";
import { Col, Input, Row } from "antd"
export default class LayoutEditBlock extends Component<{ index: number, title: string, landmarkTop: string, landmarkBottom: string }> {
    readonly state: { title: string, landmarkTop: string, landmarkBottom: string } = {
        title: "",
        landmarkTop: "",
        landmarkBottom: ""
    }

    componentDidMount() {
        this.setState({
            title: this.props.title,
            landmarkTop: this.props.landmarkTop,
            landmarkBottom: this.props.landmarkBottom
        })
    }

    render() {
        const { index } = this.props
        return <Row gutter={[8, 8]}>
            <Col>
                <Input
                    id={`market_${index}_title`}
                    placeholder="Vul titel in"
                    value={this.state.title}
                    onChange={(e: any) => {
                        this.setState({
                            title: e.target.value
                        })
                    }} />
            </Col>
            <Col>
                <Input
                    id={`market_${index}_landmarkTop`}
                    placeholder="Herkeningspunt start"
                    value={this.state.landmarkTop}
                    onChange={(e: any) => {
                        this.setState({
                            landmarkTop: e.target.value
                        })
                    }} />
            </Col>
            <Col>
                <Input
                    id={`market_${index}_landmarkBottom`}
                    placeholder="Herkenningspunt eind"
                    value={this.state.landmarkBottom}
                    onChange={(e: any) => {
                        this.setState({
                            landmarkBottom: e.target.value
                        })
                    }} />
            </Col>
        </Row>
    }
}