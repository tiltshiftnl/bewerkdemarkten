import React from "react"
import MarketDetail from "../components/MarketDetail"
import { Page, Rows, Lot } from "../models"
import { BranchesService, LotsService, MarketService, PagesService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"

export default class MarketDetailPage extends DynamicBase {
    readonly state: { market: Rows, lots: Lot[], pages: Page[], name: string, branches: string[] } = {
        market: {
            rows: [[]]
        },
        lots: [],
        pages: [],
        branches: [],
        name: "Gegevens worden opgehaald..."
    }

    marketService: MarketService
    lotsService: LotsService
    pagesService: PagesService

    // Lookups
    branchesService: BranchesService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.branchesService = new BranchesService()
        this.lotsService = new LotsService()
        this.pagesService = new PagesService()
    }

    refresh() {
        this.id = (this.props as any).match.params.id
        this.marketService.retrieve(this.id).then(result => {
            this.setState({
                market: result,
                name: this.id
            })
        })
        this.lotsService.retrieve(this.id).then(result => {
            this.setState({
                lots: result
            })
        })
        this.pagesService.retrieve(this.id).then(result => {
            this.setState({
                pages: result
            })
        })
    }

    marketChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ market: event.target.value });
    }

    lotsChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ lots: event.target.value });
    }

    pagesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ pages: event.target.value });
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
                {this.state.name && <><Breadcrumb.Item><Link to={`/market/${this.state.name.split('-')[0]}`}>
                    <span>{this.state.name.split('-')[0]}</span></Link>
                </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span>{this.state.name.split('-')[1]}</span>
                    </Breadcrumb.Item></>}
            </Breadcrumb>
            <p style={{ margin: "1em" }}>
                <a href={`/data/pdf/kaart-${this.state.name}.pdf`} download>Download Plattegrond</a>
            </p>
            <MarketDetail base={this.state.market} lots={this.state.lots} pages={this.state.pages} />
        </>
    }
}