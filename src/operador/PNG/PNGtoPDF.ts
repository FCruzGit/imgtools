import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import {criarNomeUnico} from "../operador/criarNomeUnico";

export async function criarPDFComPNG(pngPath: string, diretorioSaida: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);

    const pngBuffer = await sharp(pngPath).toBuffer();
    const pngImage = await pdfDoc.embedPng(pngBuffer);

    const pngDims = pngImage.scale(1);
    const pngWidth = pngDims.width;
    const pngHeight = pngDims.height;
    const pageWidth = page.getSize().width;
    const pageHeight = page.getSize().height;

    const scale = Math.min(pageWidth / pngWidth, pageHeight / pngHeight);

    const resizedWidth = pngWidth * scale;
    const resizedHeight = pngHeight * scale;

    page.drawImage(pngImage, {
        x: (pageWidth - resizedWidth) / 2,
        y: (pageHeight - resizedHeight) / 2,
        width: resizedWidth,
        height: resizedHeight,
    });

// Função para criar um nome de arquivo único com base no diretório de saída e no nome base
    const nomeBase = 'PNG_convertido';
    const nomeArquivo = criarNomeUnico(diretorioSaida, nomeBase);
    const caminhoCompleto = `${diretorioSaida}/${nomeArquivo}`;

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(caminhoCompleto, pdfBytes);
}
