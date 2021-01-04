import React, { createRef, MouseEvent, RefObject, KeyboardEvent } from "react"
import Day from "../components/Day"
import MarketsService, { MarketService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Button, Tabs, Upload, message, Row, Col } from 'antd'
import { HomeOutlined, UploadOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { AssignedBranche, Branche, MarketEventDetails, Markets, Plan, Event } from "../models"
import { BrancheService } from "../services/service_lookup"
import Branches from "../components/Branches"
import Configuration from "../services/configuration"

const { TabPane } = Tabs

export default class DayPage extends DynamicBase {
    readonly state: {
        lookupBranches?: Branche[],
        marketEventDetails?: MarketEventDetails,
        activeKey: string,
        plan?: Plan,
        pfdReadyForUpload?: boolean
        pdfSelected?: File
    } = {
            activeKey: "0"
        }
    branchesRef: RefObject<Branches>
    config: Configuration
    dayRef: RefObject<Day>
    uploadProps: any

    marketsService: MarketsService
    marketService: MarketService

    lookupBrancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.config = new Configuration()
        this.uploadProps = {
            name: 'file',
            action: `${this.config.API_BASE_URL}/markt/${this.id}/upload/pdf`,
            onChange(info: any) {
                if (info.file.status !== 'Bezig met uploaden') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} upload geslaagd.`);
                    this.setState({
                        plan: {
                            name: `kaart-${this.id}`,
                            pages: 0
                        }
                    })
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} upload mislukt.`);
                }
            },
        };
        this.marketService = new MarketService()
        this.marketsService = new MarketsService()
        this.lookupBrancheService = new BrancheService()

        this.branchesRef = createRef()
        this.dayRef = createRef()
    }



    getPlan = () => {
        this.marketsService.retrieve().then((markets: Markets) => {
            const _arr: string[] = this.id.split("-")
            const _event: Event = markets[_arr[0]].events[_arr[1]]
            this.setState({
                plan: _event.plan
            })
        })
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
        this.getPlan()
        this.marketService.constructRelationalStructure(this.id).then(result => {
            this.branchesRef.current?.updateAssignedBranches(result.branches)
            this.dayRef.current?.setState({
                marketEventDetails: result
            })
        }).catch((e: Error) => {
            console.error(`Marktdag bestaat nog niet, ${this.id} wordt nieuw aangemaakt.`)
            const _newM: MarketEventDetails = {
                branches: [],
                pages: [
                    {
                        title: "Nieuwe pagina",
                        layout: [
                            {
                                title: "Nieuwe rij",
                                class: "",
                                landmarkBottom: "",
                                landmarkTop: "",
                                lots: []
                            }
                        ]
                    }
                ]
            }
            // No result
            this.setState({
                marketEventDetails: _newM,
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
            <Row align="middle" gutter={[16,16]}>
                <Col>
                    <a target="_blank" rel="noreferrer" href={`${this.config.API_BASE_URL}/markt/${this.id}/download/pdf`}>
                        {this.state.plan?.name}
                    </a>
                </Col><Col>
                    <Upload {...this.uploadProps}>
                        <Button icon={<UploadOutlined />}>Kaart uploaden/vervangen</Button>
                    </Upload>
                </Col>
            </Row>
            {this.state.lookupBranches &&
                <Tabs activeKey={this.state.activeKey} onTabClick={(key: string, e: MouseEvent | KeyboardEvent) => {
                    this.setState({ activeKey: key })
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