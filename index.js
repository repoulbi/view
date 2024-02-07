import {displayConcatenatedPDFs} from "./lib.js"

const urlHash = window.location.hash;
const hashParams = urlHash.substring(1).split('&');
let pdfA, pdfB;

hashParams.forEach(param => {
    // Assuming param directly contains PDF URLs without keys
    const value = decodeURIComponent(param);
    if (!pdfA) {
        pdfA = value;
    } else if (!pdfB) {
        pdfB = value;
    }
});

displayConcatenatedPDFs(pdfA, pdfB)