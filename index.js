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

// Show loading message
Swal.fire({
    title: 'Please wait',
    text: 'Please wait while the PDF is being loaded...',
    allowOutsideClick: false,
    onBeforeOpen: () => {
        Swal.showLoading();
    }
});

// Load and display concatenated PDFs
displayConcatenatedPDFs(pdfA, pdfB)
    .then(() => {
        // Close loading message when PDFs are loaded
        Swal.close();
    })
    .catch(error => {
        // Handle error if PDF loading fails
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load PDF. Please try again later.',
        });
        console.error('Error loading PDF:', error);
    });
