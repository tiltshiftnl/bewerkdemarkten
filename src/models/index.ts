export interface Plan {
    name: string
    pages: number
}
export interface Event {
    plan?: Plan
}

export interface Events {
    [key: string]: Event
}

export interface Assignment {
    class: string
    title: string
    landmarkTop: string
    landmarkBottom: string
    plaatsList: string[]
}

export interface Rows {
    rows: string[][]
}

export interface Page {
    title: string
    indelingslijstGroup: Assignment[]
}

export interface Market {
    id: number
    name: string
    phase?: string
    plan?: Plan
    events: Events
}

export interface Lot {
    plaatsId: string
    branches?: string[]
    verkoopinrichting?: string[]
    properties?: string[]
    type?: "lot" | "stand"
}

export interface Obstacle {
    kraamA: string
    kraamB: string
    obstakel: string[]
    type?: "obstacle"
}

export interface Geography {
    obstakels: Obstacle[]
}

// Branches for the general Branches list
export interface Branche {
    brancheId: string
    number?: number
    description: string
    color: string
}

export interface Announcement {
    activatie: string
    wenperiode: string
    live: string
}

export interface Announcements {
    marktDetail: Announcement
    marktDetailPlaatsvoorkeuren: Announcement
    aanwezigheid: Announcement
    plaatsVoorkeuren: Announcement
}

// Branches assigned to Markets
export interface AssignedBranche {
    brancheId: string
    verplicht: boolean
    maximumPlaatsen?: number
}

export interface Markets {
    [key: string]: Market
}

export interface MarketEventDetails {
    branches: AssignedBranche[]
    pages: {
        layout: {
            class: string
            landmarkTop: string
            landmarkBottom: string
            title: string
            lots: (Lot | Obstacle)[]
        }[]
        title: string
    }[]
}