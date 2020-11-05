import { Heading } from "@amsterdam/asc-ui"
import React from "react"
import MarketDetail from "../components/MarketDetail"
import { Page, Rows, Stand } from "../models"
import { StandsService, MarketService, PagesService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"

export default class MarketPage extends DynamicBase {
    readonly state: { market: Rows, stands: Stand[], pages: Page[], name: string } = {
        market: {
            rows: [[]]
        },
        stands: [],
        pages: [],
        name: "Gegevens worden opgehaald..."
    }

    marketService: MarketService
    standsService: StandsService
    pagesService: PagesService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.standsService = new StandsService()
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
        this.standsService.retrieve(this.id).then(result => {
            this.setState({
                stands: result
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

    standsChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ stands: event.target.value });
    }

    pagesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ pages: event.target.value });
    }

    render() {
        return <>
            <Heading>{this.state.name}</Heading>
            <MarketDetail base={this.state.market} stands={this.state.stands} pages={this.state.pages}/>
            {/* <textarea id="markt" value={this.state.market && JSON.stringify(this.state.market)} onChange={this.marketChange} />
            <Heading forwardedAs="h2">Kramen</Heading>
            <textarea id="locaties" value={this.state.stands && JSON.stringify(this.state.stands)} onChange={this.standsChange} />
            <Heading forwardedAs="h2">Pagina's</Heading>
            <textarea id="paginas" value={this.state.pages && JSON.stringify(this.state.pages)} onChange={this.pagesChange} />
            <Heading forwardedAs="h2">Exporteren</Heading>
            <Link href="/#">Download json files</Link> */}
        </>
    }
}