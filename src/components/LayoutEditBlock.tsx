import React, { Component } from "react";
import { Col, Input, Row } from "antd"
export default class LayoutEditBlock extends Component<{ index: number, title: string, landmarkTop: string, landmarkBottom: string }> {
    render() {
        const { index, title, landmarkTop, landmarkBottom } = this.props
        return <Row gutter={8}>
            <Col span={5}>
                <Input
                    id={`market_${index}_title`}
                    placeholder="klik hier om een naam in te vullen"
                    value={title} />
            </Col>
            <Col>
                <Input
                    id={`market_${index}_landmarkTop`}
                    placeholder="klik hier om een naam in te vullen"
                    value={landmarkTop} />
            </Col>
            <Col>
                <Input
                    id={`market_${index}_landmarkBottom`}
                    placeholder="klik hier om een naam in te vullen"
                    value={landmarkBottom} />
            </Col>
        </Row>
    }
}