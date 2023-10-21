import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import {criarNomeUnico} from "../operador/criarNomeUnico";

export async function criarPDFComJPEG(jpegPath: string, diretorioSaida: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);

    const jpegBuffer = await sharp(jpegPath).toBuffer();
    const jpegImage = await pdfDoc.embedJpg(jpegBuffer);

    const jpegDims = jpegImage.scale(1);
    const jpegWidth = jpegDims.width;
    const jpegHeight = jpegDims.height;
    const pageWidth = page.getSize().width;
    const pageHeight = page.getSize().height;

    const scale = Math.min(pageWidth / jpegWidth, pageHeight / jpegHeight);

    const resizedWidth = jpegWidth * scale;
    const resizedHeight = jpegHeight * scale;

    page.drawImage(jpegImage, {
        x: (pageWidth - resizedWidth) / 2,
        y: (pageHeight - resizedHeight) / 2,
        width: resizedWidth,
        height: resizedHeight,
    });

// Função para criar um nome de arquivo único com base no diretório de saída e no nome base
    const nomeBase = 'JPEG_convertido';
    const nomeArquivo = criarNomeUnico(diretorioSaida, nomeBase);
    const caminhoCompleto = `${diretorioSaida}/${nomeArquivo}`;

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(caminhoCompleto, pdfBytes);
}
