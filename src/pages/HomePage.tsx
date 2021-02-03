import { HomeOutlined, FileZipOutlined } from '@ant-design/icons'
import { Col, Row, message, Progress, Button } from "antd"
import React, { Component } from "react"
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import JSZip from 'jszip'
import { Markets } from '../models'
import { zipAll } from '../common/generic'
import { MMarktService } from '../services/service_mmarkt'
import { MMarkt } from '../models/mmarkt'

export default class HomePage extends Component {
    readonly state: { mmarkets: MMarkt[], markets: Markets, progress: number, progressStatus: "active" | "success", systemState: any } = {
        mmarkets: [],
        markets: {},
        progress: 0,
        progressStatus: "active",
        systemState: {}
    }

    mmarktService: MMarktService

    constructor(props: any) {
        super(props)
        this.mmarktService = new MMarktService()
    }

    componentDidMount() {
        this.mmarktService.retrieve().then((mmarkets: MMarkt[]) => {

            this.setState({
                mmarkets
            })
        })

        const systemState = localStorage.getItem('bwdm_state')
        if (systemState) {
            const _marketsCache = localStorage.getItem('bwdm_cache_markets')
            if (_marketsCache) {
                const _markets = JSON.parse(_marketsCache)
                console.log(_markets)
            }
            this.setState({
                progress: 100,
                progressStatus: "success",
                systemState: JSON.parse(systemState)
            })
        }
    }

    getCacheName(file: string) {
        switch (file) {
            case "branches.json":
                return "branches"
            case "daysClosed.json":
                return "daysclosed"
            case "mededelingen.json":
                return "announcements"
            case "obstakeltypes.json":
                return "obstacletypes"
            case "plaatseigenschappen.json":
                return "properties"
            case "geografie.json":
                return "geography"
            case "locaties.json":
                return "lots"
            case "paginas.json":
                return "pages"
            case "markt.json":
                return "rows"
            default:
                return
        }
    }

    getDayNumber = (day: string) => {
        switch (day) {
            case "MA": {
                return 1
            }
            case "DI": {
                return 2
            }
            case "WO": {
                return 3
            }
            case "DO": {
                return 4
            }
            case "VR": {
                return 5
            }
            case "ZA": {
                return 6
            }
            case "ZO": {
                return 7
            }
            default: {
                return
            }
        }
    }

    beforeUpload = (file: any) => {
        const isZip = file.type === 'application/zip'
        if (!isZip) {
            message.error('You can only upload ZIP file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isZip && isLt2M;
    }

    handleFile = (event: any) => {
        const f = event.target.files[0]
        JSZip.loadAsync(f)
            .then((zip) => {
                const max = Object.keys(zip.files).length
                let _markets: Markets = {}
                let i = 0
                zip.forEach((relativePath, zipEntry) => {
                    i = i + 1
                    this.setState({
                        progress: (i / max * 100)
                    })

                    if (zipEntry.dir) {
                        const marketDayDir = zipEntry.name.replace('config/', '').replace('markt/', '').replace('/', '')
                        //const marketDayMarket = marketDayDir.split("-")[0]
                        //const marketDayDay = marketDayDir.split("-")[1]
                        //find market in mmarkt collection
                        const isvalid = this.state.mmarkets.find((entry: MMarkt) => {
                            return entry.afkorting === marketDayDir
                        })
                        if (isvalid) {
                            console.log(marketDayDir + " found")
                        } else {
                            console.log(marketDayDir + " not found")
                        }
                        if (marketDayDir && marketDayDir !== "") {
                            if (!_markets[marketDayDir]) {
                                _markets[marketDayDir] = { id: i, name: "" }
                            } else {
                                _markets[marketDayDir] = {
                                    id: 1,
                                    name: ""
                                }
                            }
                        }
                    } else {
                        const filename = zipEntry.name.replace('config/', '').replace('markt/', '')

                        if (!filename.includes("/") && filename.endsWith(".json")) {
                            // GENERIC datafiles
                            // Read the file string and store it in the local storage
                            zipEntry.async("string").then((content: string) => {
                                if (this.getCacheName(filename)) {
                                    localStorage.setItem(
                                        `bwdm_lookup_${this.getCacheName(filename)}`,
                                        JSON.stringify(
                                            JSON.parse(content)
                                        )
                                    )
                                }
                            })
                        } else if (filename.includes("/") && filename.endsWith(".json")) {
                            // Market datafiles
                            zipEntry.async("string").then((content: string) => {
                                if (this.getCacheName(filename.split("/")[1])) {
                                    const cacheName = `bwdm_cache_${filename.split("/")[0]}_${this.getCacheName(filename.split("/")[1])}`
                                    localStorage.setItem(
                                        `${cacheName}`,
                                        JSON.stringify(
                                            JSON.parse(content)
                                        )
                                    )
                                }
                            })
                        }
                    }
                })
                const systemState = {
                    zipName: f.name,
                    lastUpdate: Date.now(),
                    marketCount: Object.keys(_markets).length
                }

                localStorage.setItem(`bwdm_cache_markets`, JSON.stringify(_markets))
                localStorage.setItem('bwdm_state', JSON.stringify(systemState))
                this.setState({
                    markets: _markets,
                    progress: 100,
                    progressStatus: "success",
                    systemState: systemState
                })
            }, (e) => {
                console.log("Error reading " + f.name + ": " + e.message)
            })
    }

    getMmarktClass = (m: MMarkt) => {
        //console.log(m)
        if (this.state.markets[m.afkorting] && !m.kiesJeKraamActief) {
            return "ugly"
        } else if (m.kiesJeKraamActief) {
            return "tag"
        } else {
            return "inactive"
        }


    }

    render() {
        let myDate
        if (this.state.systemState.lastUpdate) {
            myDate = new Date(this.state.systemState.lastUpdate).toString()
        }

        return <>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">
                        <HomeOutlined />
                    </Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Progress percent={this.state.progress} status={this.state.progressStatus} />
            <Row gutter={[16, 16]}>

                <Col key="init-app" style={{ margin: "0.5em" }}>
                    <div className="tag-flex">
                        {this.state.mmarkets && this.state.mmarkets.map((m: MMarkt) => {
                            return <div key={m.id} className={this.getMmarktClass(m)}>{m.afkorting}</div>
                        })}
                    </div>
                    <br />
                    {myDate && <>
                        <i>Bestand:</i> {this.state.systemState.zipName}<br />
                        <i>Geladen op:</i> {myDate}<br />
                        {this.state.systemState.marketCount} <i>markten geladen</i><br />

                        <Button
                            title="Download het zip bestand met alle markten en configuratie"
                            icon={<FileZipOutlined />}
                            type="link"
                            onClick={() => {
                                zipAll()
                            }}

                        >Download zip bestand</Button>

                    </>}
                    <br />
                    {/* {this.state.files && Object.keys(this.state.files).map((f: string) => {
                        return <div key={f}>{f}</div>
                    })}<br /> */}
                    <input type="file" id="file" name="file" onChange={this.handleFile} />
                </Col>
            </Row>

        </>
    }
}