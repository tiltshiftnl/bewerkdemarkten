import { Tabs } from "antd"
import React from "react"
import { Component } from "react"
import { Page, Rows, Lot } from "../models"
import LayoutEditBlock from "./LayoutEditBlock"
import LayoutEditLot from "./LayoutEditLot"
import LayoutLotBlock from "./LayoutLotBlock"

const { TabPane } = Tabs
export default class MarketDetail extends Component<{ base: Rows, lots: Lot[], pages: Page[] }> {
    readonly state: { selectedLot: string, selectedBranches: string[], selectedFacilities: [], selectedProperties: [] } = {
        selectedLot: "0",
        selectedBranches: [],
        selectedFacilities: [],
        selectedProperties: []
    }

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
        let baseClass = ""
        if (this.state.selectedLot === lotId) {
            baseClass = "selected "
        }
        if (this.lookupBranches(lotId).length > 0) {
            return baseClass + "lot occupied"
        }

        return baseClass + "lot"
    }

    openLotDetail = (lotId: string) => {

        this.setState({
            selectedLot: lotId,
            selectedBranches: this.lookupBranches(lotId),
            selectedFacilities: this.lookupFacilities(lotId),
            selectedProperties: this.lookupProperties(lotId)
        })
    }

    render() {
        const { pages } = this.props
        return <>
            <Tabs defaultActiveKey="10">
                {pages.map((page, i) => {
                    // Need a way to group panel content by title for the upper and lower blocks.
                    console.log(page)
                    const pageKey = i + 1
                    return page.indelingslijstGroup.map((indeling, i) => {
                        // If a panel exists with exactly the same title, append. Else create new
                        const indelingKey = i + 1
                        console.log(pageKey + "" + indelingKey)
                        //const panelHeader: string = `${indeling.title} ${indeling.landmarkTop} ${indeling.landmarkBottom}`
                        const myPanel = <TabPane tab={`${pageKey}-${indelingKey}`} key={`${pageKey}${indelingKey}`}>
                            <div className={indeling.class}>
                                {indeling.class === 'block-left' &&
                                    <LayoutEditBlock index={i} title={indeling.title} landmarkTop={indeling.landmarkTop} landmarkBottom={indeling.landmarkBottom} />}
                                <div className="lot-row">
                                    {indeling.plaatsList.map((lot, i) => {
                                        return <LayoutLotBlock
                                            index={i}
                                            invert={indeling.class === 'block-right' ? true : false}
                                            lot={lot}
                                            lotClass={this.getClassname(lot)}
                                            lotBranches={this.lookupBranches(lot)}
                                            lotProperties={this.lookupProperties(lot)}
                                            lotFacilities={this.lookupFacilities(lot)}
                                            lotOnClick={(event: any) => { this.openLotDetail(lot) }} />


                                    })}
                                </div>
                                {indeling.class === 'block-right' &&
                                    <LayoutEditBlock index={i} title={indeling.title} landmarkTop={indeling.landmarkTop} landmarkBottom={indeling.landmarkBottom} />}
                            </div>
                        </TabPane>
                        return myPanel
                    })
                })}
            </Tabs>
            {this.state.selectedLot !== "0" &&
                <LayoutEditLot
                    lot={this.state.selectedLot}
                    branches={this.state.selectedBranches}
                    facilities={this.state.selectedFacilities}
                    properties={this.state.selectedProperties} />}
        </>
    }
}