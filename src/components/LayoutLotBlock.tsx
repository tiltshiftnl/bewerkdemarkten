import { Badge } from "antd"
import React, { Component, MouseEvent } from "react"

export default class LayoutLotBlock extends Component<{
    index: number
    lot: string
    invert: boolean
    lotClass: string
    lotBranches: string[]
    lotFacilities: string[]
    lotProperties: string[]
    lotOnClick: (event: MouseEvent) => void
}> {
    render() {
        const { index, lot, lotClass, lotBranches, lotFacilities, lotProperties, lotOnClick, invert } = this.props
        if (invert) {
            return <div key={index} className={lotClass} onClick={lotOnClick}>
                <Badge offset={[12, -32]} className="facility" count={lotFacilities.length} />
                <Badge offset={[0, 38]} count={lotBranches.length > 1 ? lotBranches.length : 0}>
                    {lot}
                </Badge>
                <Badge className="property" offset={[-12, -32]} count={lotProperties.length} />

            </div>
        }
        return <div key={index} className={lotClass} onClick={lotOnClick}>
            <Badge offset={[12, 22]} className="facility" count={lotFacilities.length} />
            <Badge count={lotBranches.length > 1 ? lotBranches.length : 0}>
                {lot}
            </Badge>
            <Badge className="property" offset={[-12, 22]} count={lotProperties.length} />

        </div>
    }
}