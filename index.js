import { displayConcatenatedPDFs, displaySinglePDF } from "./lib.js";

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
    if (value.startsWith('402_')) {
        pdfA = value;
    } else if (value.startsWith('BAP')) {
        pdfB = value;
    }
});


if (pdfA === undefined) {
    console.log('pdfA Value: ', pdfA);
    console.log('pdfB Value: ', pdfB);
    displaySinglePDF("B", pdfB);
} else if (pdfB === undefined) {
    console.log('pdfA Value: ', pdfA);
    console.log('pdfB Value: ', pdfB);
    displaySinglePDF("A", pdfA);
} else {
    console.log('pdfA Value: ', pdfA);
    console.log('pdfB Value: ', pdfB);
    displayConcatenatedPDFs(pdfA, pdfB);
}

/*
// Check if at least one PDF URL is provided
if (pdfA || pdfB) {
    // Load and display concatenated PDFs
    console.log('pdfA Value: ', pdfA);
    console.log('pdfB Value: ', pdfB);
    displayConcatenatedPDFs(pdfA, pdfB);
} else {
    // Handle case where no PDF URLs are provided
    console.error('No valid PDF URLs provided');
}
*/