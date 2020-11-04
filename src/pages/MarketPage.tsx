import { Heading, Link } from "@amsterdam/asc-ui"
import React from "react"
import { Market, Page } from "../models"
import { LocationsService, MarketService, PagesService } from "../services/service_markets"
import { DynamicBase } from "./DynamicBase"

export default class MarketPage extends DynamicBase {
    readonly state: { market: Market, locations: Location[], pages: Page[], name: string } = {
        market: {
            id: 0,
            name: "onbekend",
            events: {}
        },
        locations: [],
        pages: [],
        name: "Gegevens worden opgehaald..."
    }

    marketService: MarketService
    locationsService: LocationsService
    pagesService: PagesService

    constructor(props: any) {
        super(props)
        this.marketService = new MarketService()
        this.locationsService = new LocationsService()
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
        this.locationsService.retrieve(this.id).then(result => {
            this.setState({
                locations: result
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

    locationsChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ locations: event.target.value });
    }

    pagesChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ pages: event.target.value });
    }

    render() {
        return <>
            <Heading>{this.state.name}</Heading>
            <Heading forwardedAs="h2">Basisgegevens</Heading>
            <textarea id="markt" value={this.state.market && JSON.stringify(this.state.market)} onChange={this.marketChange} />
            <Heading forwardedAs="h2">Kramen</Heading>
            <textarea id="locaties" value={this.state.locations && JSON.stringify(this.state.locations)} onChange={this.locationsChange} />
            <Heading forwardedAs="h2">Pagina's</Heading>
            <textarea id="paginas" value={this.state.pages && JSON.stringify(this.state.pages)} onChange={this.pagesChange} />
            <Heading forwardedAs="h2">Exporteren</Heading>
            <Link href="/#">Download json files</Link>
        </>
    }
}