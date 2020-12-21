import React, { createRef, MouseEvent, RefObject, KeyboardEvent } from "react"
import Day from "../components/Day"
import { MarketService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Tabs } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { AssignedBranche, Branche, MarketEventDetails } from "../models"
import { BrancheService } from "../services/service_lookup"
import Branches from "../components/Branches"

const { TabPane } = Tabs

export default class DayPage extends DynamicBase {
    readonly state: { lookupBranches?: Branche[], marketEventDetails?: MarketEventDetails, activeKey: string } = {
        activeKey: "0"
    }
    branchesRef: RefObject<Branches>
    dayRef: RefObject<Day>

    marketService: MarketService

    lookupBrancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.lookupBrancheService = new BrancheService()

        this.branchesRef = createRef()
        this.dayRef = createRef()
    }

    updateAssignedBranches = (lookupBranches: AssignedBranche[]) => {
        console.log("updateAssignedBranches")
        const _m = this.state.marketEventDetails
        if (_m) {
            _m.branches = lookupBranches
            console.log(_m)
            this.setState({
                marketEventDetails: _m
            }, () => {
                this.dayRef.current?.setState({
                    marketEventDetails: _m
                })
            })
        }
    }

    refresh() {
        this.id = (this.props as any).match.params.id
        this.lookupBrancheService.retrieve().then((lookupBranches: Branche[]) => {
            this.setState({
                lookupBranches
            })
        })
        this.marketService.constructRelationalStructure(this.id).then(result => {
            this.branchesRef.current?.updateAssignedBranches(result.branches)
            this.dayRef.current?.setState({
                marketEventDetails: result
            })
        }).catch((e: Error) => {
            console.error(`Marktdag bestaat nog niet, ${this.id} wordt nieuw aangemaakt.`)
            const _newM = {
                branches: [],
                pages: []
            }
            // No result
            this.setState({
                marketEventDetails:  _newM,
                activeKey: "1"
            }, () => {
                this.dayRef.current?.setState({
                    marketEventDetails: _newM
                })
            })
            this.branchesRef.current?.updateAssignedBranches([])
        })
    }

    render() {
        return <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/markets">
                        <span>Markten</span>
                    </Link>
                </Breadcrumb.Item>
                {this.id && <><Breadcrumb.Item><Link to={`/market/${this.id.split('-')[0]}`}>
                    <span>{this.id.split('-')[0]}</span></Link>
                </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>{this.id.split('-')[1]}</span>
                    </Breadcrumb.Item></>}
            </Breadcrumb>
            {this.state.lookupBranches &&
                <Tabs activeKey={this.state.activeKey} onTabClick={(key: string, e: MouseEvent | KeyboardEvent) => {
                    this.setState({activeKey: key})
                }}>
                    <TabPane tab="Details" key="0">
                        <Day ref={this.dayRef} lookupBranches={this.state.lookupBranches} />
                    </TabPane>
                    <TabPane tab="Branchelijst" key="1" forceRender={true}>
                        <Branches id={this.id} ref={this.branchesRef} lookupBranches={this.state.lookupBranches} changed={this.updateAssignedBranches} />
                    </TabPane>
                </Tabs>}
        </>
    }
}