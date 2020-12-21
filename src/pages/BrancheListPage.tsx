import { Breadcrumb, Button, Input, Popover } from "antd"
import React, { ChangeEvent, Component } from "react"
import { Link } from "react-router-dom"
import { HomeOutlined } from '@ant-design/icons'
import { Branche } from "../models"
import { BrancheService } from "../services/service_lookup"
import { MinusCircleOutlined, PlusOutlined, BgColorsOutlined } from '@ant-design/icons';
import { getTextColor } from '../helpers/PresentationHelpers'
import CSS from 'csstype'
import { ChromePicker } from 'react-color'

export default class BrancheListPage extends Component {

    readonly state: { branches: Branche[], displayColorPicker: boolean } = {
        displayColorPicker: false,
        branches: []
    }
    getStyle = (branche: Branche): CSS.Properties => {
        return {
            background: branche.color || "#fff",
            color: getTextColor(branche.color) || "#000"
        }
    }

    brancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.brancheService = new BrancheService()
    }

    updateBranches = (branches: Branche[]) => {
        localStorage.setItem('bwdm_lookup_branches', JSON.stringify(branches))
        this.setState({
            branches
        })
    }

    componentDidMount = () => {
        this.brancheService.retrieve().then((branches: Branche[]) => {
            this.updateBranches(branches)
        })
    }

    render() {
        return <><Breadcrumb>
            <Breadcrumb.Item>
                <Link to="/">
                    <HomeOutlined />
                </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to="/branchess">
                    <span>Branches</span>
                </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
            <table>
                <thead>
                    <tr><th>Code</th><th>Titel</th><th>Omschrijving</th><th></th></tr>
                </thead>
                <tbody>
                    {this.state.branches.map((branche, i) => {
                        return <tr key={i} style={this.getStyle(branche)}>
                            <td>{branche.number ? branche.number : ""}</td>
                            <td>
                                <Input value={branche.brancheId} placeholder={"ID-Naam"}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value && this.state.branches) {
                                            const _branches = this.state.branches
                                            _branches[i].brancheId = e.target.value
                                            _branches[i].number = parseInt(e.target.value.split('-')[0])
                                            this.updateBranches(_branches)
                                            
                                        }
                                    }}
                                />
                            </td>
                            <td>
                                <Input value={branche.description} placeholder={"Omschrijving"}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        if (e.target.value && this.state.branches) {
                                            const _branches = this.state.branches
                                            _branches[i].description = e.target.value
                                            this.updateBranches(_branches)
                                        }
                                    }}
                                />
                                </td>
                            <td>

                                <Popover content={<ChromePicker color={branche.color} disableAlpha={true} onChange={(color: any, event: any) => {
                                    if (this.state.branches) {
                                        const _branches = this.state.branches
                                        _branches[i].color = color.hex
                                        this.updateBranches(_branches)
                                    }


                                }} />} trigger="click">
                                    <BgColorsOutlined style={{ color: getTextColor(branche.color) }} className="market-button" />
                                </Popover>
                            </td>
                            <td><MinusCircleOutlined
                                className="dynamic-button"
                                onClick={() => {
                                    if (this.state.branches) {
                                        const _branches = this.state.branches
                                        delete _branches[i]
                                        this.updateBranches(_branches)
                                    }
                                }}
                            /></td>
                        </tr>

                    })}</tbody></table>
            <Button
                onClick={() => {
                    const _branches = this.state.branches || []
                    _branches.push({
                        number: 0,
                        brancheId: "",
                        description: "",
                        color: "#fff"
                    })
                    this.updateBranches(_branches)
                }}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            </>
    }
}