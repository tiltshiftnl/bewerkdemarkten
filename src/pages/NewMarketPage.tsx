import { Button, Heading, Link, TextArea } from "@amsterdam/asc-ui"
import React, { Component } from "react"
import { ImUpload } from "react-icons/im"

export default class NewMarketPage extends Component {
    render() {
        const IconSize = 20
        return <>
            <Heading>Nieuwe markt aanmaken</Heading>
            <Heading forwardedAs="h2">Basisgegevens</Heading>
            <TextArea id="markt">{}</TextArea>
            <Button variant="primaryInverted" iconSize={IconSize} iconLeft={<ImUpload />}>Marktdata inladen</Button>
            <Heading forwardedAs="h2">Kramen</Heading>
            <TextArea id="locaties">{}</TextArea>
            <Button variant="primaryInverted" iconSize={IconSize} iconLeft={<ImUpload />}>Locaties inladen</Button>
            <Heading forwardedAs="h2">Pagina's</Heading>
            <TextArea id="paginas">{}</TextArea>
            <Button variant="primaryInverted" iconSize={IconSize} iconLeft={<ImUpload />}>Pagina's inladen</Button>
            <Heading forwardedAs="h2">Exporteren</Heading>
            <Link href="/#">Download json files</Link>
        </>
    }
}