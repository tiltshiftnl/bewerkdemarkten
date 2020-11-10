import { Tabs } from "antd"
import React from "react"
import { Component } from "react"
import { Lot, MarketEventDetails, Obstacle } from "../models"
import LayoutEditBlock from "./LayoutEditBlock"
import LayoutEditLot from "./LayoutEditLot"
import LayoutLotBlock from "./LayoutLotBlock"
import LayoutObstacleBlock from "./LayoutObstacleBlock"

const { TabPane } = Tabs
export default class MarketDetail extends Component<{ marketEvent: MarketEventDetails }> {
    readonly state: { selectedLot?: Lot } = {
        selectedLot: undefined
    }

    getClassname = (lot: Lot) => {
        let baseClass = ""
        if (this.state.selectedLot === lot) {
            baseClass = "selected "
        }
        if (lot.branches) {
            if (lot.branches.length > 0) {
                return baseClass + "lot occupied"
            }
        }

        return baseClass + "lot"
    }

    toggleSelectedLot = (lot: Lot) => {
        if (lot === this.state.selectedLot) {
            this.setState({
                selectedLot: undefined
            })
        } else {
            this.setState({
                selectedLot: lot
            })
        }
    }

    render() {
        const { marketEvent } = this.props
        return <>
            <Tabs defaultActiveKey="10">
                {marketEvent.pages.map((page, i) => {
                    // Need a way to group panel content by title for the upper and lower blocks.
                    return <TabPane tab={page.title} key={i}>
                        <div className="block-wrapper">
                        {page.layout.map((layout, i) => {
                            return <div key={i} className={layout.class}>
                                {layout.class === 'block-left' &&
                                    <LayoutEditBlock index={i} title={layout.title} landmarkTop={layout.landmarkTop} landmarkBottom={layout.landmarkBottom} />
                                }
                                <div className={`lot-row`}>
                                    {layout.lots.map((lot, i) => {
                                        if (lot.type === "stand") {
                                            return <LayoutLotBlock
                                                key={i}
                                                index={i}
                                                invert={layout.class === 'block-right' ? true : false}
                                                lot={(lot as Lot)}
                                                classDef={this.getClassname((lot as Lot))}
                                                lotOnClick={(event: any) => { this.toggleSelectedLot(lot) }} />

                                        }
                                        return <LayoutObstacleBlock
                                            key={i}
                                            index={i}
                                            invert={layout.class === 'block-right' ? true : false}
                                            obstacle={(lot as Obstacle)}
                                            classDef="obstacle"
                                            />

                                    })}
                                </div>
                                {layout.class === 'block-right' &&
                                    <LayoutEditBlock index={i} title={layout.title} landmarkTop={layout.landmarkTop} landmarkBottom={layout.landmarkBottom} />}
                            </div>

                        })}
                        </div>
                    </TabPane>
                })}
            </Tabs>
            {this.state.selectedLot &&
                <LayoutEditLot lot={this.state.selectedLot} />
                }
        </>
    }
}