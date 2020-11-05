import { Heading } from "@amsterdam/asc-ui"
import React from "react"
import MarketDetail from "../components/MarketDetail"
import { Page, Rows, Lot } from "../models"
import { LotsService, MarketService, PagesService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"

export default class MarketPage extends DynamicBase {
    readonly state: { market: Rows, lots: Lot[], pages: Page[], name: string } = {
        market: {
            rows: [[]]
        },
        lots: [],
        pages: [],
        name: "Gegevens worden opgehaald..."
    }

    marketService: MarketService
    lotsService: LotsService
    pagesService: PagesService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
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
            <Heading>{this.state.name}</Heading>
            <MarketDetail base={this.state.market} lots={this.state.lots} pages={this.state.pages}/>
            {/* <textarea id="markt" value={this.state.market && JSON.stringify(this.state.market)} onChange={this.marketChange} />
            <Heading forwardedAs="h2">Kramen</Heading>
            <textarea id="locaties" value={this.state.lots && JSON.stringify(this.state.lots)} onChange={this.lotsChange} />
            <Heading forwardedAs="h2">Pagina's</Heading>
            <textarea id="paginas" value={this.state.pages && JSON.stringify(this.state.pages)} onChange={this.pagesChange} />
            <Heading forwardedAs="h2">Exporteren</Heading>
            <Link href="/#">Download json files</Link> */}
        </>
    }
}