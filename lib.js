import { PDFDocument, PDFPage } from 'https://cdn.skypack.dev/pdf-lib';
import { isMobile } from 'https://cdn.jsdelivr.net/gh/jscroot/useragent@0.0.1/croot.js';
import {redirect} from 'https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js';

const loaderSection = document.getElementById('loaderSection');

export async function displayConcatenatedPDFs(pdfA, pdfB) {
  const flagUrl = 'https://repo.ulbi.ac.id/sk/2324-1/' + pdfA + '.pdf';
  const constitutionUrl = 'https://repo.ulbi.ac.id/buktiajar/2324-1/' + pdfB + '.pdf';

  try {
    const flagPdfBytes = await fetch(flagUrl).then(response => response.arrayBuffer());
    const constitutionPdfBytes = await fetch(constitutionUrl).then(response => response.arrayBuffer());

    const concatenatedPdfBytes = new Uint8Array(flagPdfBytes.byteLength + constitutionPdfBytes.byteLength);
    concatenatedPdfBytes.set(new Uint8Array(flagPdfBytes), 0);
    concatenatedPdfBytes.set(new Uint8Array(constitutionPdfBytes), flagPdfBytes.byteLength);

    const pdfData = new Blob([concatenatedPdfBytes], { type: 'application/pdf' });

    if (isMobile()) {
      // Mobile mode
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

      const loadingTask = pdfjsLib.getDocument({ url: URL.createObjectURL(pdfData) });
      loadingTask.promise.then(pdf => {
        const numPages = pdf.numPages;
        const canvasContainer = document.createElement('div');
        canvasContainer.style.width = '100%';
        canvasContainer.style.height = '100%';
        canvasContainer.style.position = 'fixed';
        canvasContainer.style.top = '0';
        canvasContainer.style.left = '0';
        canvasContainer.style.zIndex = '9999';
        canvasContainer.style.overflowY = 'scroll'; // Enable vertical scrolling
        document.body.appendChild(canvasContainer);

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          pdf.getPage(pageNumber).then(page => {
            const viewport = page.getViewport({ scale: 1 });
            const scale = Math.min(canvasContainer.clientWidth / viewport.width, canvasContainer.clientHeight / viewport.height);
            const scaledViewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;
            canvasContainer.appendChild(canvas);

            const renderContext = {
              canvasContext: context,
              viewport: scaledViewport
            };
            page.render(renderContext);
          });
        }

        // Full-screen mode
        if (canvasContainer.requestFullscreen) {
          canvasContainer.requestFullscreen();
        } else if (canvasContainer.webkitRequestFullscreen) {
          canvasContainer.webkitRequestFullscreen();
        }
      });
    } else {
      // Desktop mode
      const loaderSection = document.getElementById('loaderSection');
      if (loaderSection && loaderSection.parentNode) {
        const pdfUrl = URL.createObjectURL(pdfData);
        const embedElement = document.createElement('embed');
        embedElement.setAttribute('src', pdfUrl);
        embedElement.setAttribute('width', '100%');
        embedElement.setAttribute('height', '100%');
        loaderSection.parentNode.replaceChild(embedElement, loaderSection);
      }
    }

  } catch (error) {
    // Handle error if PDF loading fails
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Dokumen masih dalam proses pembuatan. Silahkan kembali lagi setelah 10 menit.',
    });
    const HomeLink = document.createElement('a');
    HomeLink.href = "javascript:window.location.reload(true)";
    HomeLink.textContent = 'Segarkan Laman';
    if (loaderSection && loaderSection.parentNode) {
      loaderSection.parentNode.replaceChild(HomeLink, loaderSection);
    } else {
      document.body.appendChild(HomeLink);
    }
    console.error('Error memroses PDFs:', error);
  }
}