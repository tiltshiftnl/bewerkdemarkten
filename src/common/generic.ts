import JSZip from "jszip"
import { AssignedBranche, Geography, Lot, Page, Rows } from "../models"
import { BranchesService, GeographyService, LotsService, PagesService, RowsService } from "../services/service_markets"

export const getTextColor = (hexcolor: string): string => {
    var r = parseInt(hexcolor.substr(1, 2), 16)
    var g = parseInt(hexcolor.substr(3, 2), 16)
    var b = parseInt(hexcolor.substr(4, 2), 16)
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
    // Return new color if to dark, else return the original
    return (yiq < 40) ? '#2980b9' : "black"
}

export const getFileName = (key: string) => {
    switch (key) {
        case "pages":
            return "paginas.json"
        case "lots":
            return "locaties.json"
        case "geography":
            return "geografie.json"
        case "branches":
            return "branches.json"
        case "rows":
            return "markt.json"
        default:
            return ""
    }
}
export const zipMarket = (marketDayId: string) => {
    const zip = new JSZip();

    // Grab all the localstorage objects and put them in a single zipfile for download!
    ["branches", "geography", "lots", "pages", "rows"].forEach((key: string) => {
        const data = localStorage.getItem(`bwdm_cache_${marketDayId}_${key}`)
        if (data) {
            zip.file(getFileName(key), data)
        }
    })

    zip.generateAsync({ type: "base64" })
        .then(function (content) {
            downloadObjectAsZip("data:application/zip;base64," + content, `${marketDayId}.zip`)
        });
}


export const uploadMarket = (marketDayId: string) => {
    const _branchesFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_branches`)
    const _geographyFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_geography`)
    const _lotsFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_lots`)
    const _pagesFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_pages`)
    const _rowsFromStorage: string | null = localStorage.getItem(`bwdm_cache_${marketDayId}_rows`)
    if(_branchesFromStorage) {
        new BranchesService().update("branches", JSON.parse(_branchesFromStorage) as AssignedBranche[]).then((result) =>{
            console.log("Branches uploaded?")
        })
    }
    if(_geographyFromStorage) {
        new GeographyService().update("geography", JSON.parse(_geographyFromStorage) as Geography).then((result) =>{
            console.log(result)
            console.log("Geography uploaded?")
        })
    }
    if(_lotsFromStorage) {
        new LotsService().update("lots", JSON.parse(_lotsFromStorage) as Lot[]).then((result) =>{
            console.log(result)
            console.log("Lots uploaded?")
        })
    }
    if(_pagesFromStorage) {
        new PagesService().update("pages", JSON.parse(_pagesFromStorage) as Page[]).then((result) =>{
            console.log(result)
            console.log("Pages uploaded?")
        })
    }
    if(_rowsFromStorage) {
        new RowsService().update("rows", JSON.parse(_rowsFromStorage) as Rows).then((result) =>{
            console.log(result)
            console.log("Rows uploaded?")
        })
    }
    console.log("Upload finished?")   

}

export const downloadObjectAsZip = (base64: string, filename: string) => {
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", base64);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
