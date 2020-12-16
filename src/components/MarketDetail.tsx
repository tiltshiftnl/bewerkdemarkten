import { Input, Tabs } from "antd"
import React, { RefObject, Component, createRef, MouseEvent, KeyboardEvent, ChangeEvent } from "react"
import { AssignedBranche, Branche, Lot, MarketEventDetails, MarketLayout, MarketPage } from "../models"
import LayoutEdit from "./LayoutEdit"
import LotEdit from "./LotEdit"
import LotBlock from "./LotBlock"
import ObstacleBlock from "./ObstacleBlock"
import { PlusCircleOutlined } from '@ant-design/icons'
const { TabPane } = Tabs

interface MarketDetailPageState {
    selectedLot?: Lot, marketEventDetails: MarketEventDetails, currentPosition: [number, number, number], activeKey: string
}

export default class MarketDetail extends Component<{ lookupBranches: Branche[] }> {
    lotEdit: RefObject<LotEdit>
    readonly state: MarketDetailPageState = {
        selectedLot: undefined,
        marketEventDetails: {
            branches: [],
            pages: []
        },
        activeKey: "0",
        currentPosition: [0, 0, 0]
    }

    constructor(props: { lookupBranches: Branche[] }) {
        super(props)
        this.lotEdit = createRef()
    }

    getClassname = (lot: Lot) => {
        console.log(this.state.selectedLot)
        let baseClass = ""
        if (this.state.selectedLot === lot) {
            baseClass = "selected "
        }
        return baseClass + lot.type
    }

    getBranche = (lot: Lot): AssignedBranche => {
        if (lot.branches) {
            const _lotbranches = lot.branches.filter((item: string) => item !== "bak")
            if (_lotbranches.length === 1) {
                const _activeBranche = this.state.marketEventDetails.branches.filter(b => b.brancheId === _lotbranches[0])
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
        console.log(lot)
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

    lotChanged = (lot: Lot | undefined) => {
        if (lot) {
            const _marketEventDetails: MarketEventDetails = this.state.marketEventDetails
            _marketEventDetails
                .pages[this.state.currentPosition[0]]
                .layout[this.state.currentPosition[1]]
                .lots[this.state.currentPosition[2]] = lot

            // Now we need to refresh the props.
            this.setState({
                selectedLot: lot,
                marketEventDetails: _marketEventDetails
            })
        }
    }

    lotAdd = (lot: Lot, position: [number, number]) => {
        const _marketEventDetails: MarketEventDetails = this.state.marketEventDetails
        _marketEventDetails.pages[position[0]].layout[position[1]].lots.push(lot)
        this.setState({
            marketEventDetails: _marketEventDetails
        }, () => {
            this.lotEdit.current?.setState({
                lot: lot
            })
            this.setState({
                selectedLot: lot
            })
        })
    }

    layoutChanged = (layout: MarketLayout | undefined, position: [number, number], add?: boolean) => {
        console.log(layout)
        let _marketEventDetails: MarketEventDetails = this.state.marketEventDetails
        if (layout) {
            if (add) {
                _marketEventDetails.pages[position[0]].layout.splice(position[1], 0, layout)
            } else {
                _marketEventDetails.pages[position[0]].layout[position[1]] = layout
            }
        } else {
            _marketEventDetails.pages[position[0]].layout.splice(position[1], 1)
        }
        this.setState({
            marketEventDetails: _marketEventDetails
        })
    }

    onTabChange = (activeKey: string) => {
        this.setState({ activeKey })
    }

    onTabEdit = (e: string | MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>) => {
        let _marketEventDetails: MarketEventDetails = this.state.marketEventDetails
        if (typeof e === "string") {
            _marketEventDetails.pages.splice(parseInt(e), 1)
            this.setState({
                marketEventDetails: _marketEventDetails
            })
        } else {
            _marketEventDetails.pages.push({
                title: "Nieuwe pagina",
                layout: []
            })
        }
        this.setState({
            marketEventDetails: _marketEventDetails
        })
    }

    render() {
        return <>
            <Tabs
                type="editable-card"
                activeKey={this.state.activeKey}
                onEdit={this.onTabEdit}
                tabPosition="top"
                onChange={this.onTabChange}
            >
                {this.state.marketEventDetails.pages.map((page: MarketPage, i: number) => {
                    const pageindex = i
                    // Need a way to group panel content by title for the upper and lower blocks.
                    return <TabPane tab={<><Input size="small" value={page.title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const _marketEventDetails: MarketEventDetails = this.state.marketEventDetails
                            _marketEventDetails.pages[i].title = e.target.value
                            this.setState({
                                marketEventDetails: _marketEventDetails
                            })
                        }} /></>} key={i}>
                        <div className="block-wrapper">
                            <PlusCircleOutlined
                                className="dynamic-delete-button"
                                onClick={() => {
                                    const _newLayout: MarketLayout = {
                                        title: "Nieuwe rij",
                                        class: "block-left",
                                        landmarkBottom: "",
                                        landmarkTop: "",
                                        lots: []
                                    }
                                    this.layoutChanged(_newLayout, [pageindex, 0], true)

                                }}
                            />
                            {page.layout.map((layout: MarketLayout, i: number) => {
                                const layoutindex = i
                                return <div key={i} className={layout.class}>
                                    {layout.class === 'block-left' &&
                                        <LayoutEdit
                                            index={i}
                                            layout={layout}
                                            changed={this.layoutChanged}
                                            position={[pageindex, layoutindex]}
                                        />
                                    }
                                    <div className={`lot-row`}>
                                        {layout.lots.map((lot: Lot, i: number) => {
                                            const lotindex = i
                                            if (lot.type === "stand") {
                                                return <LotBlock
                                                    key={i}
                                                    index={i}
                                                    invert={layout.class === 'block-right' ? true : false}
                                                    lot={lot}
                                                    classDef={this.getClassname(lot)}
                                                    branche={this.getBranche(lot)}
                                                    lotOnClick={(event: any) => { this.toggleSelectedLot(lot, pageindex, layoutindex, lotindex) }}
                                                />
                                            }
                                            return <ObstacleBlock
                                                key={i}
                                                index={i}
                                                invert={layout.class === 'block-right' ? true : false}
                                                obstacle={lot}
                                                classDef={this.getClassname(lot)}
                                                lotOnClick={(event: any) => { this.toggleSelectedLot(lot, pageindex, layoutindex, lotindex) }}
                                            />

                                        })}
                                        <PlusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                                const _newLot: Lot = {
                                                    plaatsId: "0",
                                                    branches: [],
                                                    verkoopinrichting: [],
                                                    properties: [],
                                                    type: "stand"
                                                }
                                                this.lotAdd(_newLot, [pageindex, layoutindex])

                                            }}
                                        />
                                    </div>
                                    {layout.class === 'block-right' &&
                                        <LayoutEdit
                                            index={i}
                                            layout={layout}
                                            changed={this.layoutChanged}
                                            position={[pageindex, layoutindex]}
                                        />}
                                </div>

                            })}
                        </div>
                    </TabPane>
                })}
            </Tabs>
            <LotEdit
                ref={this.lotEdit}
                branches={this.state.marketEventDetails.branches} changed={this.lotChanged} />
        </>
    }
}