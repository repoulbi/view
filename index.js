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

async function mergeAllPDFs(urls) {
        
    // create an empty PDFLib object of PDFDocument to do the merging into
    const pdfDoc = await PDFLib.PDFDocument.create();
    
    // iterate over all documents to merge
    const numDocs = urls.length;    
    for(var i = 0; i < numDocs; i++) {

        // download the document
        const donorPdfBytes = await fetch(urls[i]).then(res => res.arrayBuffer());

        // load/convert the document into a PDFDocument object
        const donorPdfDoc = await PDFLib.PDFDocument.load(donorPdfBytes);

        // iterate over the document's pages
        const docLength = donorPdfDoc.getPageCount();
        for(var k = 0; k < docLength; k++) {
            // extract the page to copy
            const [donorPage] = await pdfDoc.copyPages(donorPdfDoc, [k]);

            // add the page to the overall merged document
            pdfDoc.addPage(donorPage);
        }
    }
    
    // save as a Base64 URI
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    // strip off the first part to the first comma "data:image/png;base64,iVBORw0K..."
    const data_pdf = pdfDataUri.substring(pdfDataUri.indexOf(',')+1);
}