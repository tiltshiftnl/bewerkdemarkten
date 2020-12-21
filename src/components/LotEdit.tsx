import { Col, Input, Row, Select, Checkbox, Radio, Tooltip } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import React, { Component } from "react"
import { AssignedBranche, Lot } from "../models"
import { LotPropertyService, ObstacleTypeService } from "../services/service_lookup"
import { LeftCircleOutlined, RightCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { RadioChangeEvent } from "antd/lib/radio"

interface LotEditProps {
    branches: AssignedBranche[],
    changed?: (lot: Lot | undefined) => void,
    delete?: (position: [number, number, number]) => void,
    append?: (position: [number, number, number]) => void,
    prepend?: (position: [number, number, number]) => void
}

export default class LotEdit extends Component<LotEditProps> {
    readonly state: { lot?: Lot, properties: string[], obstacleTypes: string[], currentPosition?: [number, number, number] } = { properties: [], obstacleTypes: [] }
    propertyService: LotPropertyService
    obstacleTypeService: ObstacleTypeService

    constructor(props: any) {
        super(props)
        this.propertyService = new LotPropertyService()
        this.obstacleTypeService = new ObstacleTypeService()
    }


    onToggle = (e: RadioChangeEvent) => {

        let _lot: Lot | undefined = this.state.lot

        if (_lot && this.props.changed) {
            _lot.type = e.target.value
            this.props.changed(this.state.lot)
        }
    }

    componentDidMount = () => {
        this.propertyService.retrieve().then((properties: string[]) => {
            this.setState({
                properties
            })
        })
        this.obstacleTypeService.retrieve().then((obstacleTypes: string[]) => {
            this.setState({
                obstacleTypes
            })
        })
    }

    setBak = (e: CheckboxChangeEvent) => {
        if (this.state.lot && this.state.lot) {
            let _branches: string[] = this.state.lot.branches || []
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
            {this.state.lot &&
                <>
                    <Row align="middle">
                        <Col>
                            <Radio.Group value={this.state.lot?.type} optionType="button" buttonStyle="solid" onChange={this.onToggle}>
                                <Radio.Button value="stand">Kraam</Radio.Button>
                                <Radio.Button value="obstacle">Obstakel</Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>
                    {this.state.lot.type === "obstacle" &&
                        <>
                            <Row gutter={formGutter}>
                                <Col {...firstColSpan}>Type</Col>
                                <Col {...secondColSpan}>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Selecteer een type"
                                        value={!this.state.lot ? "" :
                                            this.state.lot.obstakel ? this.state.lot.obstakel.length === -1 ? "" : this.state.lot.obstakel[0] : ""}
                                        onChange={(e: string) => {
                                            let _b = [e]
                                            if (e === "") {
                                                _b = []
                                            }
                                            this.setState({
                                                lot: { ...this.state.lot, obstakel: _b }
                                            })
                                        }}
                                    >
                                        <Select.Option key={""} value={""}>{[]}</Select.Option>
                                        {this.state.obstacleTypes.map((br, i) => {
                                            return <Select.Option key={i} value={br}>{br}</Select.Option>
                                        })}
                                    </Select>
                                </Col>
                            </Row>
                        </>
                    }
                    {this.state.lot.type === "stand" &&
                        <>
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
                                        value={!this.state.lot ? "" : this.state.lot.branches?.filter(e => e !== "bak")[0]}
                                        onChange={(e: string) => {
                                            let _b = [e]
                                            if (e === "") {
                                                _b = []
                                            }
                                            // Did it have "bak"? Then add bak back.
                                            if (
                                                this.state.lot &&
                                                this.state.lot.branches &&
                                                this.state.lot.branches.filter(e => e === "bak").length > 0) {
                                                _b.push("bak")
                                            }
                                            this.setState({
                                                lot: { ...this.state.lot, branches: _b }
                                            })
                                        }}
                                    >
                                        <Select.Option key={""} value={""}>{[]}</Select.Option>
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
                            </Row>
                        </>}
                    <Row gutter={formGutter}>
                        <Col>
                            <Tooltip title="Nieuwe voor geselecteerd item invoegen">
                                <LeftCircleOutlined
                                    className="dynamic-button"
                                    onClick={() => {
                                        // Tell parent component to remove this lot.
                                        if (this.props.prepend && this.state.currentPosition) {
                                            this.props.prepend(this.state.currentPosition)
                                        }
                                    }}
                                />
                            </Tooltip>
                            <Tooltip title="Verwijderen">
                            <MinusCircleOutlined
                                className="dynamic-button"
                                onClick={() => {
                                    // Tell parent component to remove this lot.
                                    if (this.props.delete && this.state.currentPosition) {
                                        this.props.delete(this.state.currentPosition)
                                    }
                                }}
                            />
                            </Tooltip>
                            <Tooltip title="Nieuwe achter geselecteerd item invoegen">
                                <RightCircleOutlined
                                    className="dynamic-button"
                                    onClick={() => {
                                        // Tell parent component to remove this lot.
                                        if (this.props.append && this.state.currentPosition) {
                                            this.props.append(this.state.currentPosition)
                                        }
                                    }}
                                />
                            </Tooltip>
                        </Col>
                    </Row>
                </>}
        </div>
    }
}