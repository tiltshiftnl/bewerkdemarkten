import { Col, Input, Row, Select, Checkbox } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import React, { Component } from "react"
import { AssignedBranche, Lot } from "../models"
import { LotPropertyService } from "../services/service_lookup"

interface LotEditProps {
    branches: AssignedBranche[],
    changed?: (lot: Lot) => void
}

export default class LotEdit extends Component<LotEditProps> {
    readonly state: { lot?: Lot, properties: string[] } = { properties: [] }
    propertyService: LotPropertyService

    constructor(props: any) {
        super(props)
        this.propertyService = new LotPropertyService()
    }


    componentDidMount = () => {
        this.propertyService.retrieve().then((properties: string[]) => {
            this.setState({
                properties
            })
        })
    }

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

    setProperty = (e: CheckboxChangeEvent) => {
        if (e.target.id) {
            if (this.state.lot) {
                let _properties: string[] = this.state.lot?.properties || []
                if (e.target.checked) {
                    _properties.push(e.target.id)
                } else {
                    _properties = _properties?.filter(p => p !== e.target.id)
                }
                this.setState({
                    lot: { ...this.state.lot, properties: _properties }
                })
            }
        }
    }

    getProperty(value: string): boolean {
        if (this.state.lot && this.state.lot.properties) {
            return this.state.lot.properties.indexOf(value) > -1
        }
        return false
    }

    setVerkoopinrichting = (e: CheckboxChangeEvent) => {
        if (e.target.id) {
            if (this.state.lot) {
                let _verkoopinrichting: string[] = this.state.lot?.verkoopinrichting || []
                if (e.target.checked) {
                    _verkoopinrichting.push(e.target.id)
                } else {
                    _verkoopinrichting = _verkoopinrichting?.filter(v => v !== e.target.id)
                }
                this.setState({
                    lot: { ...this.state.lot, verkoopinrichting: _verkoopinrichting }
                })
            }
        }
    }

    getVerkoopinrichting(value: string): boolean {
        if (this.state.lot && this.state.lot.verkoopinrichting) {
            return this.state.lot.verkoopinrichting.indexOf(value) > -1
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
                            console.log(e)
                            this.setState({
                                lot: { ...this.state.lot, branches: [e] }
                            })
                        }}
                    >
                        <Select.Option key={"blanco"} value={""}><em><b>Niet toegewezen</b></em></Select.Option>
                        {this.props.branches.filter((item: AssignedBranche) => item.brancheId !== "bak").map((br, i) => {
                            return <Select.Option key={i} value={br.brancheId}>{br.brancheId}</Select.Option>
                        })}
                    </Select>
                </Col>
            </Row>
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Eigen materieel</Col>
                <Col {...secondColSpan}><Checkbox id="eigen-materieel" checked={this.getVerkoopinrichting("eigen-materieel")} onChange={this.setVerkoopinrichting} /></Col>
            </Row>
            {this.state.properties && this.state.properties.map((prop: string, i: number) => {
                return <Row key={i} gutter={formGutter}>
                <Col {...firstColSpan}>{prop.charAt(0).toUpperCase() + prop.slice(1)}</Col>
                <Col {...secondColSpan}><Checkbox id={prop} checked={this.getProperty(prop)} onChange={this.setProperty} /></Col>
            </Row>
            })}
            <Row gutter={formGutter}>
                <Col {...firstColSpan}>Bak</Col>
                <Col {...secondColSpan}><Checkbox checked={this.getBak()} onChange={this.setBak} /></Col>
            </Row></div>
    }
}