import { Card, Col, Row } from "antd";
import React, { Component } from "react";
import { AssignedBranche } from "../models";

export default class MarketAllocation extends Component<{ branches: AssignedBranche[] }> {

    getClass(branche: AssignedBranche): string{
        let baseClass: string = ""
        if(branche.brancheId === "bak"){
            return "baking"
        }
        if(branche.maximumPlaatsen) {
            const allocated: number = branche.allocated || 0
            if(branche.maximumPlaatsen < allocated){
                baseClass += " over-assigned"
            }
            if (branche.maximumPlaatsen === allocated){
                baseClass += " assigned"
            } else {
                baseClass += " under-assigned"
            }
        } else {
            // Branche has no maximum
            if(branche.allocated){
                baseClass += " available"
            }
        }

        if(branche.verplicht){
            baseClass += " mandatory"
        }
        return baseClass
    }

    render() {
        return <Row gutter={[8,8]}>
            {this.props.branches.map((branche, i) => {
                return <Col xs={24} sm={12} md={8} lg={6} xl={4}>
                    <Card title={branche.brancheId.split('-')[0]} className={this.getClass(branche)}>
                        <Row><Col span={12} >Code:</Col><Col>{branche.brancheId}</Col></Row>
                        <Row><Col span={12}>Verplicht:</Col><Col>{branche.verplicht && <><b>Ja</b>&nbsp;</>}</Col></Row>
                        <Row><Col span={12}>Maximum:</Col><Col>{branche.maximumPlaatsen && <>{branche.maximumPlaatsen}</>}</Col></Row>
                        <Row><Col span={12}>Toegewezen:</Col><Col>{branche.allocated && <>{branche.allocated}</>}</Col></Row>
                    </Card>
                </Col>
            })}</Row>
    }
}