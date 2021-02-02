import { HomeOutlined, FileZipOutlined } from '@ant-design/icons'
import { Col, Row, message, Progress, Button } from "antd"
import React, { Component } from "react"
import { Breadcrumb } from 'antd'
import { Link } from 'react-router-dom'
import JSZip from 'jszip'
import { Markets } from '../models'
import { zipAll } from '../common/generic'

export default class HomePage extends Component {
    readonly state: { files: string[], progress: number, progressStatus: "active" | "success", systemState: any } = {
        files: [],
        progress: 0,
        progressStatus: "active",
        systemState: {}
    }

    componentDidMount() {
        const systemState = localStorage.getItem('bwdm_state')
        if(systemState){
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
                        const marketDayMarket = marketDayDir.split("-")[0]
                        const marketDayDay = marketDayDir.split("-")[1]
                        if (marketDayDir && marketDayDir !== "") {
                            if (!_markets[marketDayMarket]) {
                                _markets[marketDayMarket] = { id: i, name: "", events: {} }
                            } else {
                                if (this.getDayNumber(marketDayDay)) {
                                    _markets[marketDayMarket].events[marketDayDay] = {
                                        weekday: this.getDayNumber(marketDayDay)
                                    }
                                } else {
                                    _markets[marketDayMarket].events[marketDayDay] = {}
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
                        } else if (filename.includes("/") && filename.endsWith(".json")){
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
                    files: _markets,
                    progress: 100,
                    progressStatus: "success",
                    systemState: systemState
                })
            }, (e) => {
                console.log("Error reading " + f.name + ": " + e.message)
            })
    }

    render() {
        let myDate
        if(this.state.systemState.lastUpdate){
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
                    {myDate && <>
                    <i>Bestand:</i> {this.state.systemState.zipName}<br/>
                    <i>Geladen op:</i> {myDate}<br/>
                    {this.state.systemState.marketCount} <i>markten geladen</i><br/>

                    <Button
                    title="Download het zip bestand met alle markten en configuratie"
                    icon={<FileZipOutlined />}
                    type="link"
                        onClick={() => {
                                zipAll()
                        }}

                    >Download zip bestand</Button>

                    </>}
                    <br/>
                    {/* {this.state.files && Object.keys(this.state.files).map((f: string) => {
                        return <div key={f}>{f}</div>
                    })}<br /> */}
                    <input type="file" id="file" name="file" onChange={this.handleFile} />
                </Col>
            </Row>

        </>
    }
}