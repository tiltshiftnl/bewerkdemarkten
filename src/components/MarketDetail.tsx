import { Tabs } from "antd"
import React, { RefObject, Component, createRef } from "react"
import { AssignedBranche, Lot, MarketEventDetails, MarketLayout, MarketPage, Obstacle } from "../models"
import LayoutEdit from "./LayoutEdit"
import LotEdit from "./LotEdit"
import LotBlock from "./LotBlock"
import ObstacleBlock from "./ObstacleBlock"

const { TabPane } = Tabs

interface MarketDetailPageProps {
    marketEvent: MarketEventDetails
    branches: AssignedBranche[]
    stateChanged?: (marketEvent: MarketEventDetails) => void
}

export default class MarketDetail extends Component<MarketDetailPageProps> {
    lotEdit: RefObject<LotEdit>

    readonly state: { selectedLot?: Lot, marketEvent: MarketEventDetails, currentPosition: [number, number, number] } = {
        selectedLot: undefined,
        marketEvent: {
            branches: [],
            pages: []
        },
        currentPosition: [0, 0, 0]
    }

    constructor(props: MarketDetailPageProps) {
        super(props)
        this.lotEdit = createRef()
    }

    getClassname = (lot: Lot) => {
        let baseClass = ""
        if (this.state.selectedLot === lot) {
            baseClass = "selected "
        }
        // if (lot.branches) {
        //     if (lot.branches.filter((item: string) => item !== "bak").length > 0) {
        //         return baseClass + "lot occupied"
        //     }
        // }

        return baseClass + "lot"
    }

    getBranche = (lot: Lot): AssignedBranche => {
        if (lot.branches) {
            const _lotbranches = lot.branches.filter((item: string) => item !== "bak")
            if(_lotbranches.length === 1){
                const _activeBranche = this.props.branches.filter(b => b.brancheId === _lotbranches[0])
                if (_activeBranche) {
                    return _activeBranche[0]
                }
            }
        }

        return {
            brancheId: "",
            verplicht: false,
            color: "",
            backGroundColor: ""

        }
    }

    toggleSelectedLot = (lot: Lot, pageindex: number, layoutindex: number, lotindex: number) => {
        if (lot === this.state.selectedLot) {
            this.lotEdit.current?.setState({
                lot: undefined
            })
            this.setState({
                selectedLot: undefined,
                currentPosition: [0, 0, 0]
            })
        } else {
            this.lotEdit.current?.setState({
                lot: lot
            })
            this.setState({
                selectedLot: lot,
                currentPosition: [pageindex, layoutindex, lotindex]
            })
        }
    }

    lotChanged = (lot: Lot) => {
        this.props.marketEvent
            .pages[this.state.currentPosition[0]]
            .layout[this.state.currentPosition[1]]
            .lots[this.state.currentPosition[2]] = lot
        // now we need to refresh the props.
        this.setState({
            selectedLot: lot
        })
        // and we need to tell the code list to refresh!
        if (this.props.stateChanged) {
            this.props.stateChanged(this.props.marketEvent)
        }

    }

    layoutChanged = (layout: MarketLayout) => {
        console.log(layout)
        // TODO: Persist!
    }

    render() {
        const { marketEvent } = this.props
        return <>
            <Tabs defaultActiveKey="10">
                {marketEvent.pages.map((page: MarketPage, i: number) => {
                    const pageindex = i
                    // Need a way to group panel content by title for the upper and lower blocks.
                    return <TabPane tab={page.title} key={i}>
                        <div className="block-wrapper">
                            {page.layout.map((layout: MarketLayout, i: number) => {
                                const layoutindex = i
                                return <div key={i} className={layout.class}>
                                    {layout.class === 'block-left' &&
                                        <LayoutEdit
                                            index={i}
                                            layout={layout}
                                            changed={this.layoutChanged}
                                        />
                                    }
                                    <div className={`lot-row`}>
                                        {layout.lots.map((lot: Lot | Obstacle, i: number) => {
                                            const lotindex = i
                                            if (lot.type === "stand") {
                                                return <LotBlock
                                                    key={i}
                                                    index={i}
                                                    invert={layout.class === 'block-right' ? true : false}
                                                    lot={(lot as Lot)}
                                                    classDef={this.getClassname(lot as Lot)}
                                                    branche={this.getBranche(lot as Lot)}
                                                    lotOnClick={(event: any) => { this.toggleSelectedLot(lot, pageindex, layoutindex, lotindex) }} />

                                            }
                                            return <ObstacleBlock
                                                key={i}
                                                index={i}
                                                invert={layout.class === 'block-right' ? true : false}
                                                obstacle={(lot as Obstacle)}
                                                classDef="obstacle"
                                            />

                                        })}
                                    </div>
                                    {layout.class === 'block-right' &&
                                        <LayoutEdit
                                            index={i}
                                            layout={layout}
                                        />}
                                </div>

                            })}
                        </div>
                    </TabPane>
                })}
            </Tabs>
            <LotEdit
                ref={this.lotEdit}
                branches={this.props.marketEvent.branches} changed={this.lotChanged} />
        </>
    }
}