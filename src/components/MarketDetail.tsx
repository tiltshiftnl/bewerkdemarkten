import { Tabs } from "antd"
import React, { RefObject, Component, createRef } from "react"
import { AssignedBranche, Lot, MarketEventDetails, MarketPage, Obstacle } from "../models"
import LayoutEditBlock from "./LayoutEditBlock"
import LayoutEditLot from "./LayoutEditLot"
import LayoutLotBlock from "./LayoutLotBlock"
import LayoutObstacleBlock from "./LayoutObstacleBlock"

const { TabPane } = Tabs
export default class MarketDetail extends Component<{ marketEvent: MarketEventDetails }> {
    editBlock: RefObject<LayoutEditLot>
    readonly state: { selectedLot?: Lot } = {
        selectedLot: undefined
    }
    constructor(props: { marketEvent: MarketEventDetails }) {
        super(props)
        this.editBlock = createRef()
    }
    getClassname = (lot: Lot) => {
        let baseClass = ""
        if (this.state.selectedLot === lot) {
            baseClass = "selected "
        }
        if (lot.branches) {
            if (lot.branches.filter((item: string) => item !== "bak").length > 0) {
                return baseClass + "lot occupied"
            }
        }

        return baseClass + "lot"
    }

    toggleSelectedLot = (lot: Lot) => {
        if (lot === this.state.selectedLot) {
            this.editBlock.current?.setState({
                lot: undefined
            })
            this.setState({
                selectedLot: undefined
            })
        } else {
            this.editBlock.current?.setState({
                lot: lot
            })
            this.setState({
                selectedLot: lot
            })
        }
    }

    calculateOccupied = (branche: AssignedBranche) => {
        const pages: MarketPage[] = this.props.marketEvent.pages
        pages.forEach((page: MarketPage) => {

        })
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
                                        <LayoutEditBlock
                                            index={i}
                                            title={layout.title}
                                            landmarkTop={layout.landmarkTop}
                                            landmarkBottom={layout.landmarkBottom} />
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
                                        <LayoutEditBlock
                                            index={i}
                                            title={layout.title}
                                            landmarkTop={layout.landmarkTop}
                                            landmarkBottom={layout.landmarkBottom} />}
                                </div>

                            })}
                        </div>
                    </TabPane>
                })}
            </Tabs>
            <LayoutEditLot
                ref={this.editBlock}
                branches={this.props.marketEvent.branches} />
        </>
    }
}