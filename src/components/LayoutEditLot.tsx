import { Col, Input, Row, Select, Checkbox } from "antd"
import React, { Component } from "react"
import { AssignedBranche, Lot } from "../models"


export default class LayoutEditLot extends Component<{ branches: AssignedBranche[] }> {
    readonly state: { lot?: Lot } = {}

    checkBak(lot: Lot): boolean {
        if (lot && lot.branches) {
            return lot.branches.indexOf("bak") > -1
        }
        return false
    }

    checkElectricity(lot: Lot): boolean {
        if (lot && lot.properties) {
            return lot.properties.indexOf("electra") > -1
        }
        return false
    }

    checkOwnMaterial(lot: Lot): boolean {
        if (lot && lot.verkoopinrichting) {
            return lot.verkoopinrichting.indexOf("eigen-materieel") > -1
        }
        return false
    }

    render() {
        const firstColSpan = {xs: 8, sm: 8, md: 4, lg: 4}
        const secondColSpan = {xs: 16, sm: 16, md: 8, lg: 8}
        const formGutter: [number, number] = [4,4]
        let branches: string[] = []
        if (this.state.lot) {

            if (this.state.lot.branches) {
                branches = this.state.lot.branches.filter((item: string) => item !== "bak")
            }
        }
        return <div className="edit-lot">
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Kraam</Col>
                <Col {...secondColSpan}>
                    <Input
                        placeholder="Vul naam of nummer van de kraam in"
                        value={this.state.lot?.plaatsId}
                        onChange={(e: any) => {
                            this.setState({
                                lot: { ...this.state.lot, plaatsId: e.target.value }
                            })
                        }} />
                </Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Branche(s)</Col>
                <Col {...secondColSpan}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={branches}
                    >
                        {this.props.branches.filter((item: AssignedBranche) => item.brancheId !== "bak").map((br, i) => {
                            return <Select.Option key={i} value={br.brancheId}>{br.brancheId}</Select.Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Eigen materieel</Col>
                <Col {...secondColSpan}><Checkbox checked={this.state.lot && this.checkOwnMaterial(this.state.lot)} /></Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Electra</Col>
                <Col {...secondColSpan}><Checkbox checked={this.state.lot && this.checkElectricity(this.state.lot)} /></Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Bak</Col>
                <Col {...secondColSpan}><Checkbox checked={this.state.lot && this.checkBak(this.state.lot)} /></Col>
            </Row></div>
    }
}