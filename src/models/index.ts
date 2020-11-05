export interface Event {

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
    events: Events
}

export interface Stand {
    plaatsId: string
    branches?: string[]
    verkoopinrichting?: string[]
    properties?: string[]
}

export interface Obstacle {
    kraamA: string
    kraamB: string
    obstakel: string[]
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
}

export interface Markets {
    [key: string]: Market
}