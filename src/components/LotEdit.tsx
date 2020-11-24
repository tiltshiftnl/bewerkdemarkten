import { Col, Input, Row, Select, Checkbox } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import React, { Component } from "react"
import { AssignedBranche, Lot } from "../models"

interface LotEditProps {
    branches: AssignedBranche[],
    changed?: (lot: Lot) => void
}

export default class LotEdit extends Component<LotEditProps> {
    readonly state: { lot?: Lot } = {}


    setBak = (e: CheckboxChangeEvent) => {
        if (this.state.lot) {
            let _branches: string[] = this.state.lot?.branches || []
            if (e.target.checked) {
                _branches.push("bak")
            } else {
                _branches = _branches?.filter(e => e !== "bak")
            }
            this.setState({
                lot: { ...this.state.lot, branches: _branches }
            })

        }
    }

    componentDidUpdate(prevProps: LotEditProps, prevState: { lot?: Lot }) {
        if (this.state.lot && this.props.changed && this.state !== prevState) {
            this.props.changed(this.state.lot)
        }
    }

    getBak(): boolean {
        if (this.state.lot && this.state.lot.branches) {
            return this.state.lot.branches.indexOf("bak") > -1
        }
        return false
    }

    setElectricity = (e: CheckboxChangeEvent) => {
        if (this.state.lot) {
            let _properties: string[] = this.state.lot?.properties || []
            if (e.target.checked) {
                _properties.push("electra")
            } else {
                _properties = _properties?.filter(e => e !== "electra")
            }
            this.setState({
                lot: { ...this.state.lot, properties: _properties }
            })
        }
    }

    getElectricity(): boolean {
        if (this.state.lot && this.state.lot.properties) {
            return this.state.lot.properties.indexOf("electra") > -1
        }
        return false
    }

    setOwnMaterial = (e: CheckboxChangeEvent) => {
        if (this.state.lot) {
            let _verkoopinrichting: string[] = this.state.lot?.verkoopinrichting || []
            if (e.target.checked) {
                _verkoopinrichting.push("eigen-materieel")
            } else {
                _verkoopinrichting = _verkoopinrichting?.filter(e => e !== "eigen-materieel")
            }
            this.setState({
                lot: { ...this.state.lot, verkoopinrichting: _verkoopinrichting }
            })
        }
    }

    getOwnMaterial(): boolean {
        if (this.state.lot && this.state.lot.verkoopinrichting) {
            return this.state.lot.verkoopinrichting.indexOf("eigen-materieel") > -1
        }
        return false
    }

    render() {
        const firstColSpan = { xs: 8, sm: 8, md: 4, lg: 4 }
        const secondColSpan = { xs: 16, sm: 16, md: 8, lg: 8 }
        const formGutter: [number, number] = [4, 4]

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
                        placeholder="Selecteer een branche"
                        value={!this.state.lot ? [] : this.state.lot.branches?.filter(e => e !== "bak")}
                        onChange={(e: string[]) => {
                            this.setState({
                                lot: { ...this.state.lot, branches: [e] }
                            })
                        }}
                    >
                        {this.props.branches.filter((item: AssignedBranche) => item.brancheId !== "bak").map((br, i) => {
                            return <Select.Option key={i} value={br.brancheId}>{br.brancheId}</Select.Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Eigen materieel</Col>
                <Col {...secondColSpan}><Checkbox checked={this.getOwnMaterial()} onChange={this.setOwnMaterial} /></Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Electra</Col>
                <Col {...secondColSpan}><Checkbox checked={this.getElectricity()} onChange={this.setElectricity} /></Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Bak</Col>
                <Col {...secondColSpan}><Checkbox checked={this.getBak()} onChange={this.setBak} /></Col>
            </Row></div>
    }
}