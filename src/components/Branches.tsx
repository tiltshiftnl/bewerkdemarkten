import { Button, InputNumber, Select, Switch } from "antd"
import React, { Component } from "react"
import { AssignedBranche, Branche } from "../models"
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import CSS from 'csstype'
import { getTextColor } from "../helpers/PresentationHelpers"
import { BranchesService } from "../services/service_markets"


export default class Branches extends Component<{ id: string, lookupBranches: Branche[], changed?: (lookupBranches: AssignedBranche[]) => void }> {
    readonly state: { branches?: AssignedBranche[] } = {}
    branchesService: BranchesService

    constructor(props: any) {
        super(props)
        this.branchesService = new BranchesService()
    }

    updateAssignedBranches = (branches: AssignedBranche[]) => {
        localStorage.setItem(`bwdm_cache_${this.props.id}_branches`, JSON.stringify(branches))
        this.setState({
            branches
        })
        if(this.props.changed){
            this.props.changed(branches)
        }
    }

    getStyle = (branche: AssignedBranche): CSS.Properties => {
        return {
            background: branche.backGroundColor || "#fff",
            color: branche.color || "#000"
        }
    }

    getBrancheId = (branche: AssignedBranche, i: number) => {
        let _availableBranches: string[] = []
        if (branche.brancheId) {
            return branche.brancheId
        }
        if (this.state.branches) {
            _availableBranches = this.state.branches?.map(e => e.brancheId)
        }

        return <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Selecteer een branche"
            value={branche.brancheId || ""}
            onChange={(e: string) => {
                const _selectedBranche: Branche = this.props.lookupBranches.filter((item: Branche) => item.brancheId === e)[0]
                if (this.state.branches && _selectedBranche) {
                    const _branches = this.state.branches
                    _branches[i].brancheId = _selectedBranche.brancheId
                    _branches[i].backGroundColor = _selectedBranche.color
                    _branches[i].color = getTextColor(_selectedBranche.color)
                    // Find the color, set the foreground color with the function.
                    this.updateAssignedBranches(_branches)
                }
            }}
        >
            {this.props.lookupBranches.filter((item: Branche) => _availableBranches.indexOf(item.brancheId) === -1).map((br, i) => {
                return <Select.Option key={i} value={br.brancheId}>{br.brancheId}</Select.Option>
            })}
        </Select>
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

    render() {
        return <>{this.state.branches && <><table>
            <thead>
                <tr><th>Code</th><th>Omschrijving</th><th>Verplicht</th><th>Maximum</th><th>Toegewezen</th><th></th></tr>
            </thead>
            <tbody>
                {this.state.branches.map((branche, i) => {
                    return <tr key={i} style={this.getStyle(branche)} className={this.getClass(branche)}>
                        <td>{branche.brancheId.split('-')[0]}</td>
                        <td>{this.getBrancheId(branche, i)}</td>
                        <td><Switch checked={branche.verplicht} onChange={(checked: boolean) => {
                            if (this.state.branches) {
                                const _branches = this.state.branches
                                _branches[i].verplicht = checked
                                this.updateAssignedBranches(_branches)
                            }
                        }} /></td>
                        <td>
                            <InputNumber min={0} max={99} value={branche.maximumPlaatsen || 0}
                                onChange={(value: string | number | undefined) => {
                                    if (value && this.state.branches) {
                                        const _branches = this.state.branches
                                        _branches[i].maximumPlaatsen = value as number
                                        this.updateAssignedBranches(_branches)
                                    }
                                }} />
                        </td>
                        <td>{branche.allocated && <>{branche.allocated}</>}</td>
                        <td><MinusCircleOutlined
                            className="dynamic-button"
                            onClick={() => {
                                if (this.state.branches) {
                                    let _branches = this.state.branches
                                    delete _branches[i]
                                    _branches = _branches.filter(() => true)
                                    this.updateAssignedBranches(_branches)
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
                    this.updateAssignedBranches(_branches)
                }}
                style={{ marginTop: '20px' }}
                icon={<PlusOutlined />}
            >Toevoegen</Button>
            <Button type="primary"
                onClick={() => {
                    const _export = this.state.branches?.map((e: AssignedBranche)=> {
                        let _e: AssignedBranche = {
                            brancheId: e.brancheId,
                            verplicht: e.verplicht
                        }
                        if(e.maximumPlaatsen) {
                            _e.maximumPlaatsen = e.maximumPlaatsen
                        }
                        return _e
                    })
                    if(_export) {
                        this.branchesService.update(`${this.props.id}`, _export)
                    }
                }}
                style={{ margin: '20px' }}
            >Opslaan</Button>
            </>}</>
    }
}