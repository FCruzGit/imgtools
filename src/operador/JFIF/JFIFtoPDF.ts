import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import {criarNomeUnico} from "../operador/criarNomeUnico";

export async function criarPDFComJFIF(jfifPath: string, diretorioSaida: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);

    const jfifBuffer = await sharp(jfifPath).toBuffer();
    const jfifImage = await pdfDoc.embedJpg(jfifBuffer);

    const jfifDims = jfifImage.scale(1);
    const jfifWidth = jfifDims.width;
    const jfifHeight = jfifDims.height;
    const pageWidth = page.getSize().width;
    const pageHeight = page.getSize().height;

    const scale = Math.min(pageWidth / jfifWidth, pageHeight / jfifHeight);

    const resizedWidth = jfifWidth * scale;
    const resizedHeight = jfifHeight * scale;

    page.drawImage(jfifImage, {
        x: (pageWidth - resizedWidth) / 2,
        y: (pageHeight - resizedHeight) / 2,
        width: resizedWidth,
        height: resizedHeight,
    });

// Função para criar um nome de arquivo único com base no diretório de saída e no nome base
    const nomeBase = 'JFIF_convertido';
    const nomeArquivo = criarNomeUnico(diretorioSaida, nomeBase);
    const caminhoCompleto = `${diretorioSaida}/${nomeArquivo}`;

    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync(caminhoCompleto, pdfBytes);
}
