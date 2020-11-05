import { Badge } from "antd"
import React from "react"
import { Component } from "react"
import { Page, Rows, Lot } from "../models"

export default class MarketDetail extends Component<{ base: Rows, lots: Lot[], pages: Page[] }> {

    lookupBranches = (lotId: string): string[] => {
        const result = this.props.lots.find(c => c.plaatsId === lotId)
        return result?.branches || []
    }

    lookupProperties = (lotId: string): string[] => {
        const result = this.props.lots.find(c => c.plaatsId === lotId)
        return result?.properties || []
    }

    lookupFacilities = (lotId: string): string[] => {
        const result = this.props.lots.find(c => c.plaatsId === lotId)
        return result?.verkoopinrichting || []
    }

    getClassname = (lotId: string) => {
        if (this.lookupBranches(lotId).length > 0) {
            return "lot occupied"
        }
        return "lot"
    }

    openLotDetail = (lotId: string) => {
        console.log(lotId)
        return "foo"
    }

    render() {

        const { pages } = this.props
        return <>
        {pages.map((page, i) => {
            return <div key={i}>
                {page.indelingslijstGroup.map((indeling, i) => {
                    if(indeling.class === "block-left"){
                    return <div key={i} className={`page-block ${indeling.class}`}>
                        <p>{`${page.title}, ${indeling.title}: ${indeling.landmarkTop} - ${indeling.landmarkBottom}`}</p>
                        <div className="lot-row">
                            {indeling.plaatsList.map((lot, i) => {
                                return <div key={i} className={this.getClassname(lot)} onClick={() => {this.openLotDetail(lot)}}>
                                    <Badge offset={[12, 22]} className="facility" count={this.lookupFacilities(lot).length} />
                                    <Badge count={this.lookupBranches(lot).length > 1 ? this.lookupBranches(lot).length : 0 }>
                                                {lot}
                                    </Badge>
                                    <Badge className="property" offset={[-12, 22]} count={this.lookupProperties(lot).length} />
                                    
                                </div>
                            })}
                        </div>
                    </div>
                    } else {
                        return <div key={i}>
                            <div className="lot-row">
                                {indeling.plaatsList.map(lot => {
                                    return <div className={this.getClassname(lot)} onClick={() => {this.openLotDetail(lot)}}><Badge count={this.lookupBranches(lot).length > 1 ? this.lookupBranches(lot).length : 0 }>{lot}</Badge></div>
                                })}
                            </div>
                        </div>
                    }
                })}
            </div>
        })}
            {/* {base.rows.map(row => {
                return <div className="lot-row">{row.map(lot => {
                    return <div className={this.getClassname(lot)}><Badge count={this.lookupBranches(lot).length > 1 ? this.lookupBranches(lot).length : 0 }>{lot}</Badge></div>
                })}</div>
            })
            } */}
            {/* <div>{JSON.stringify(pages)}</div> */}
        </>
    }
}