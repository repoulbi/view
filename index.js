import { displayConcatenatedPDFs, displaySinglePDF } from "./lib.js";

const urlHash = window.location.hash;
if (!urlHash) {
    window.location.href = '404.html';
}

const hashParams = urlHash.substring(1).split('&');
let pdfA, pdfB;

hashParams.forEach(param => {
    const value = decodeURIComponent(param);
    if (value.startsWith('402_')) {
        pdfA = value;
    } else if (value.startsWith('BAP')) {
        pdfB = value;
    }
});


if (pdfA === undefined) {
    displaySinglePDF("B", pdfB);
} else if (pdfB === undefined) {
    displaySinglePDF("A", pdfA);
} else {
    displayConcatenatedPDFs(pdfA, pdfB);
}