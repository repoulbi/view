import { displayConcatenatedPDFs } from "./lib.js";

const urlHash = window.location.hash;
if (!urlHash) {
    // If hash URL is empty, redirect to 404.html
    window.location.href = '404.html';
}

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

// Load and display concatenated PDFs
displayConcatenatedPDFs(pdfA, pdfB);
