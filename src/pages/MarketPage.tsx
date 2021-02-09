import React, { createRef, MouseEvent, RefObject, KeyboardEvent } from "react"
import Day from "../components/Day"
import MarketsService from "../services/service_markets"
import { Transformer } from "../services/transformer"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb, Tabs, Row, Col, //Button, Upload
    } from 'antd'
import { HomeOutlined, //UploadOutlined, FileZipOutlined 
    } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { AssignedBranche, Branche, MarketEventDetails, Markets, Plan } from "../models"
import { BrancheService } from "../services/service_lookup"
import Branches from "../components/Branches"
import Configuration from "../services/configuration"
//import { zipMarket } from "../common/generic"

const { TabPane } = Tabs

export default class MarketPage extends DynamicBase {
    readonly state: {
        lookupBranches?: Branche[],
        marketEventDetails?: MarketEventDetails,
        activeKey: string,
        plan?: Plan,
        pfdReadyForUpload?: boolean
        pdfSelected?: File
        uploadProps?: any
    } = {
            activeKey: "0"
        }
    branchesRef: RefObject<Branches>
    config: Configuration
    dayRef: RefObject<Day>

    marketsService: MarketsService
    transformer: Transformer

    lookupBrancheService: BrancheService

    constructor(props: any) {
        super(props)
        this.config = new Configuration()

        this.transformer = new Transformer()
        this.marketsService = new MarketsService()
        this.lookupBrancheService = new BrancheService()

        this.branchesRef = createRef()
        this.dayRef = createRef()
    }

    getPlan = () => {
        this.marketsService.retrieve().then((markets: Markets) => {
            let uploadProps: any = {
                defaultFileList: []
            }

            this.setState({
                uploadProps
            })
        })
    }

    updateAssignedBranches = (branches: AssignedBranche[]) => {
        const _m = this.state.marketEventDetails
        if (_m) {
            console.log(_m)
            _m.branches = branches
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
        this.transformer.encode(this.id).then(result => {
            this.branchesRef.current?.updateBranches(result.branches)
            this.setState({
                marketEventDetails: result,
                activeKey: result.pages.length === 0 ? "1" : "0"
            })
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
            this.branchesRef.current?.updateBranches([])
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
                {this.id && <>
                    <Breadcrumb.Item><Link to={`/market/${this.id}`}>
                        <span>{this.id}</span></Link>
                    </Breadcrumb.Item>
                    </>
                }
            </Breadcrumb>
            <Row align="top" gutter={[16, 16]}>
                <Col>
                    {/* {this.state.uploadProps &&
                        <Upload {...this.state.uploadProps}>
                            <Button icon={<UploadOutlined />}>Kaart uploaden/vervangen</Button>
                        </Upload>
                    } */}

                </Col>
                <Col>
                    {/* <Button
                    title={`Download de JSON bestanden voor ${this.id}`}
                    icon={<FileZipOutlined />}
                    type="link"
                        onClick={() => {
                            if (this.id) {
                                zipMarket(this.id)
                            }
                        }}

                    >Download {this.id}</Button> */}
                    {/* <Button
                    title={`Upload de JSON bestanden voor ${this.id} naar de centrale server`}
                    style={{marginLeft: "1em"}}
                    icon={<UploadOutlined />}
                    type="primary"
                        onClick={() => {
                            if (this.id) {
                                uploadMarket(this.id)
                            }
                        }}

                    >{this.id} opslaan</Button> */}
                </Col>
            </Row>
            {this.state.lookupBranches &&
                <Tabs activeKey={this.state.activeKey} onTabClick={(key: string, e: MouseEvent | KeyboardEvent) => {
                    this.setState({ activeKey: key })
                }}>
                    <TabPane tab="Marktindeling" key="0">
                        <Day id={this.id} ref={this.dayRef} lookupBranches={this.state.lookupBranches} />
                    </TabPane>
                    <TabPane tab="Branche toewijzing" key="1" forceRender={true}>
                        {/* {(!this.state.lookupBranches || this.state.lookupBranches.length === 0) &&
                            <p>Alvorens kan worden begonnen met het indelen van de markt dienen de branches te zijn toegewezen die kunnen worden gebruikt op de markt.</p>
                        } */}
                        <Branches id={this.id} ref={this.branchesRef} lookupBranches={this.state.lookupBranches} changed={this.updateAssignedBranches} />
                    </TabPane>
                </Tabs>}

        </>
    }
}