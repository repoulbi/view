import { PDFDocument } from "https://unpkg.com/pdf-lib";

export async function createPdf() {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const page = pdfDoc.addPage([350, 400]);
    page.moveTo(110, 200);
    page.drawText('Hello World!');
    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('pdf').src = pdfDataUri;
}

export async function mergeAllPDFs(urls) {
        
    // create an empty PDFLib object of PDFDocument to do the merging into
    const pdfDoc = await PDFLib.PDFDocument.create();
    
    // iterate over all documents to merge
    const numDocs = urls.length;    
    for(var i = 0; i < numDocs; i++) {
        console.log(urls[i]);

        // download the document
        const donorPdfBytes = await fetch(urls[i]).then(res => res.arrayBuffer());

        // load/convert the document into a PDFDocument object
        const donorPdfDoc = await PDFLib.PDFDocument.load(donorPdfBytes);

        // iterate over the document's pages
        const docLength = donorPdfDoc.getPageCount();
        console.log(docLength);
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
    document.getElementById('pdf').src = data_pdf;
}

export async function embedPdfPages() {
    const flagUrl = 'https://repo.ulbi.ac.id/sk/2324-1/402_PengampuMK.pdf';
    const constitutionUrl = 'https://repo.ulbi.ac.id/lkd/POBKD.pdf';
  
    const flagPdfBytes = await fetch(flagUrl).then((res) => res.arrayBuffer());
    const constitutionPdfBytes = await fetch(constitutionUrl).then((res) =>
      res.arrayBuffer(),
    );
  
    const pdfDoc = await PDFDocument.create();
  
    const [americanFlag] = await pdfDoc.embedPdf(flagPdfBytes);
  
    const usConstitutionPdf = await PDFDocument.load(constitutionPdfBytes);
    const preamble = await pdfDoc.embedPage(usConstitutionPdf.getPages()[1], {
      left: 55,
      bottom: 485,
      right: 300,
      top: 575,
    });
  
    const americanFlagDims = americanFlag.scale(0.3);
    const preambleDims = preamble.scale(2.25);
  
    const page = pdfDoc.addPage();
  
    page.drawPage(americanFlag, {
      ...americanFlagDims,
      x: page.getWidth() / 2 - americanFlagDims.width / 2,
      y: page.getHeight() - americanFlagDims.height - 150,
    });
    page.drawPage(preamble, {
      ...preambleDims,
      x: page.getWidth() / 2 - preambleDims.width / 2,
      y: page.getHeight() / 2 - preambleDims.height / 2 - 50,
    });

    const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
    document.getElementById('pdf').src = pdfDataUri;  
    //const pdfBytes = await pdfDoc.save();
  }