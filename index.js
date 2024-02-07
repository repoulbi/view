createPdf();
async function createPdf() {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([350, 400]);
    page.moveTo(110, 200);
    page.drawText('Hello World!');
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('pdf').src = pdfDataUri;
}


async function merge() {
    let PDFDocument = PDFLib.PDFDocument;

    const in1 = document.getElementById('file1').files[0];
    const in2 = document.getElementById('file2').files[0]; 
    let bytes1 = await readFileAsync(in1);
    let bytes2 = await readFileAsync(in2); 
    const pdf1 = await PDFDocument.load(bytes1);
    const pdf2 = await PDFDocument.load(bytes2);

    const mergedPdf = await PDFDocument.create(); 
    const copiedPagesA = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
    copiedPagesA.forEach((page) => mergedPdf.addPage(page)); 
    const copiedPagesB = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
    copiedPagesB.forEach((page) => mergedPdf.addPage(page)); 
    const mergedPdfFile = await mergedPdf.save();

    download(mergedPdfFile, 'pdf-lib_page_copying_example.pdf', 'application/pdf')
    }