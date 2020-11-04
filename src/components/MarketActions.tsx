import { Button } from "@amsterdam/asc-ui"
import React from "react"
import { Component } from "react"
import { Market } from "../models"
import { TrashBin } from '@amsterdam/asc-assets'
import { ImCopy, ImPencil, ImUpload } from "react-icons/im";
import './MarketActions.css'
import { Link } from "react-router-dom"
export default class MarketActions extends Component<{ market: Market }> {

    render() {
        const iconSize = 20;
        return <>
            <Link to={`/market/edit/${this.props.market.id}`}>
                <Button className="btn outlined" title="Wijzigen" variant="blank" iconSize={iconSize} iconLeft={<ImPencil />} />
            </Link>
            <Link to={`/market/copy/${this.props.market.id}`}>
                <Button className="btn outlined" title="Kopie markt" variant="blank" iconSize={iconSize} iconLeft={<ImCopy />} />
            </Link>
            <Link to={`/market/delete/${this.props.market.id}`}>
                <Button className="btn red" title="Verwijderen" variant="blank" iconSize={iconSize} iconLeft={<TrashBin />} />
            </Link>
            <Link to={`/market/publish/acc/${this.props.market.id}`}>
                <Button className="btn outlined" title="Publiceren naar de Acceptatie omgeving" variant="blank" iconSize={iconSize} iconLeft={<ImUpload />} />
            </Link>
            <Link to={`/market/publish/prod/${this.props.market.id}`}>
                <Button className="btn blue" title="Publiceren naar de Productie omgeving" variant="blank" iconSize={iconSize} iconLeft={<ImUpload />} />
            </Link>
        </>
    }
}