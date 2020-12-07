import { Button, Input, InputNumber, Popover, Switch } from "antd"
import React, { ChangeEvent, Component } from "react"
import { AssignedBranche } from "../models"
import { MinusCircleOutlined, PlusOutlined, BgColorsOutlined, FontColorsOutlined } from '@ant-design/icons'
import CSS from 'csstype'
import { ChromePicker } from 'react-color'

export default class MarketAllocation extends Component<{ branches: AssignedBranche[] }> {
    readonly state: { branches?: AssignedBranche[], displayColorPicker: boolean } = {
        displayColorPicker: false,
        branches: []
    }
    getStyle = (branche: AssignedBranche): CSS.Properties => {
        return {
            background: branche.backGroundColor || "#fff",
            color: branche.color || "#000"
        }
    }

    getClass(branche: AssignedBranche): string {
        let baseClass: string = ""
        if (branche.brancheId === "bak") {
            if (branche.verplicht) {
                return "baking mandatory"
            }
            return "baking"
        }
        if (branche.maximumPlaatsen) {
            const allocated: number = branche.allocated || 0
            if (branche.maximumPlaatsen < allocated) {
                baseClass += " over-assigned"
            }
            if (branche.maximumPlaatsen === allocated) {
                baseClass += " assigned"
            } else {
                baseClass += " under-assigned"
            }
        } else {
            // Branche has no maximum
            if (branche.allocated) {
                baseClass += " available"
            }
        }

        if (branche.verplicht) {
            baseClass += " mandatory"
        }
        return baseClass.trim()
    }

    componentDidMount = () => {
        this.setState({
            branches: this.props.branches
        })
    }

    render() {
        return <><table>
            <thead>
                <tr><th>Code</th><th>Omschrijving</th><th>Verplicht</th><th>Maximum</th><th>Toegewezen</th><th colSpan={2}>Kleur</th><th></th></tr>
            </thead>
            <tbody>
                {this.state.branches && this.state.branches.map((branche, i) => {
                    return <tr key={i} style={this.getStyle(branche)} className={this.getClass(branche)}>
                        <td>{branche.brancheId.split('-')[0]}</td>
                        <td>
                            <Input value={branche.brancheId} placeholder={"ID-Naam"}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    if (e.target.value && this.state.branches) {
                                        const _branches = this.state.branches
                                        _branches[i].brancheId = e.target.value
                                        this.setState({
                                            branches: _branches
                                        })
                                    }
                                }}
                            /></td>
                        <td><Switch checked={branche.verplicht} onChange={(checked: boolean) => {
                            if (this.state.branches) {
                                const _branches = this.state.branches
                                _branches[i].verplicht = checked
                                this.setState({
                                    branches: _branches
                                })
                            }
                        }} /></td>
                        <td>
                            <InputNumber min={0} max={99} value={branche.maximumPlaatsen || 0}
                                onChange={(value: string | number | undefined) => {
                                    console.log(value)
                                    if (value && this.state.branches) {
                                        const _branches = this.state.branches
                                        _branches[i].maximumPlaatsen = value as number
                                        this.setState({
                                            branches: _branches
                                        })
                                    }
                                }} />
                        </td>
                        <td>{branche.allocated && <>{branche.allocated}</>}</td>
                        <td>

                            <Popover content={<ChromePicker color={branche.backGroundColor} disableAlpha={true} onChange={(color: any, event: any) => {
                                console.log(color)
                                if (this.state.branches) {
                                    const _branches = this.state.branches
                                    _branches[i].backGroundColor = color.hex
                                    this.setState({
                                        branches: _branches
                                    })
                                }


                            }} />} trigger="click">
                                <BgColorsOutlined style={{ backgroundColor: branche.backGroundColor, color: branche.color }} className="market-button" />
                            </Popover>
                        </td>
                        <td>
                            <Popover content={<ChromePicker color={branche.color} disableAlpha={true} onChange={(color: any, event: any) => {
                                console.log(color)
                                if (this.state.branches) {
                                    const _branches = this.state.branches
                                    _branches[i].color = color.hex
                                    this.setState({
                                        branches: _branches
                                    })
                                }


                            }} />} trigger="click">
                                <FontColorsOutlined className="market-button" style={{ backgroundColor: branche.backGroundColor, color: branche.color }} />
                            </Popover>
                        </td>

                        <td><MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => {
                                if (this.state.branches) {
                                    const _branches = this.state.branches
                                    delete _branches[i]
                                    this.setState({
                                        branches: _branches
                                    })
                                }
                            }}
                        /></td>
                    </tr>

                })}</tbody></table>
            <Button
                onClick={() => {
                    const _branches = this.state.branches || []
                    _branches.push({
                        brancheId: "",
                        verplicht: false,
                        color: "#000",
                        backGroundColor: "#fff",
                        allocated: 0
                    })
                    this.setState({
                        branches: _branches
                    })
                }}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            <Button type="primary" htmlType="submit">
                Opslaan
        </Button></>
    }
}