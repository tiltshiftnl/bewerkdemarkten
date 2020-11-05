import { Badge } from "antd"
import React from "react"
import { Component } from "react"
import { Page, Rows, Stand } from "../models"

export default class MarketDetail extends Component<{ base: Rows, stands: Stand[], pages: Page[] }> {

    lookupBranches = (standId: string): string[] => {
        const result = this.props.stands.find(c => c.plaatsId === standId)
        return result?.branches || []
    }

    getClassname = (standId: string) => {
        if (this.lookupBranches(standId).length > 0) {
            return "stand occupied"
        }
        return "stand"
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
                        <div className="stands-row">
                            {indeling.plaatsList.map((stand, i) => {
                                return <div key={i} className={this.getClassname(stand)}><Badge count={this.lookupBranches(stand).length > 1 ? this.lookupBranches(stand).length : 0 }>{stand}</Badge></div>
                            })}
                        </div>
                    </div>
                    } else {
                        return <div key={i}>
                            <div className="stands-row">
                                {indeling.plaatsList.map(stand => {
                                    return <div className={this.getClassname(stand)}><Badge count={this.lookupBranches(stand).length > 1 ? this.lookupBranches(stand).length : 0 }>{stand}</Badge></div>
                                })}
                            </div>
                        </div>
                    }
                })}
            </div>
        })}
            {/* {base.rows.map(row => {
                return <div className="stands-row">{row.map(stand => {
                    return <div className={this.getClassname(stand)}><Badge count={this.lookupBranches(stand).length > 1 ? this.lookupBranches(stand).length : 0 }>{stand}</Badge></div>
                })}</div>
            })
            } */}
            {/* <div>{JSON.stringify(pages)}</div> */}
        </>
    }
}