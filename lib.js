import { PDFDocument, PDFPage } from 'https://cdn.skypack.dev/pdf-lib';

const flagUrl = 'https://repo.ulbi.ac.id/sk/2324-1/402_PengampuMK.pdf';
const constitutionUrl = 'https://repo.ulbi.ac.id/lkd/POBKD.pdf';

const pdfIframe = document.getElementById('pdf');

export async function displayConcatenatedPDFs() {
  try {
    const flagPdfBytes = await fetch(flagUrl).then(response => response.arrayBuffer());
    const constitutionPdfBytes = await fetch(constitutionUrl).then(response => response.arrayBuffer());

    const flagPdfDoc = await PDFDocument.load(flagPdfBytes);
    const constitutionPdfDoc = await PDFDocument.load(constitutionPdfBytes);

    const pagesToAppend = await flagPdfDoc.copyPages(constitutionPdfDoc, constitutionPdfDoc.getPageIndices());

    for (const page of pagesToAppend) {
      await flagPdfDoc.addPage(page);
    }

    const concatenatedPdfBytes = await flagPdfDoc.save();

    const pdfUrl = URL.createObjectURL(new Blob([concatenatedPdfBytes], { type: 'application/pdf' }));
    pdfIframe.src = pdfUrl;
  } catch (error) {
    console.error('Error concatenating and displaying PDFs:', error);
  }
}