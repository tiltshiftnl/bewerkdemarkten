import { Card, Col, Row } from "antd";
import React, { Component } from "react";
import { AssignedBranche } from "../models";

export default class MarketAllocation extends Component<{ branches: AssignedBranche[] }> {
    render() {
        return <Row gutter={[2,2]}>
            {this.props.branches.map((branche, i) => {
                return <Col span={8}>
                    <Card title={branche.brancheId.split('-')[0]}>
                        <Row><Col span={4}>Code:</Col><Col>{branche.brancheId}</Col></Row>
                        <Row><Col span={4}>Verplicht:</Col><Col>{branche.verplicht && <><b>Ja</b>&nbsp;</>}</Col></Row>
                        <Row><Col span={4}>Maximum:</Col><Col>{branche.maximumPlaatsen && <>{branche.maximumPlaatsen}</>}</Col></Row>
                        <Row><Col span={4}>Toegewezen:</Col><Col>{branche.allocated && <>{branche.allocated}</>}</Col></Row>
                    </Card>
                </Col>
            })}</Row>
    }
}