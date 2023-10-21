import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import {criarNomeUnico} from "../operador/criarNomeUnico";

export async function criarPDFComJPG(jpgPath: string, diretorioSaida: string) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);

  const jpgBuffer = await sharp(jpgPath).toBuffer();
  const jpgImage = await pdfDoc.embedJpg(jpgBuffer);

  const jpgDims = jpgImage.scale(1);
  const jpgWidth = jpgDims.width;
  const jpgHeight = jpgDims.height;
  const pageWidth = page.getSize().width;
  const pageHeight = page.getSize().height;

  const scale = Math.min(pageWidth / jpgWidth, pageHeight / jpgHeight);

  const resizedWidth = jpgWidth * scale;
  const resizedHeight = jpgHeight * scale;

  page.drawImage(jpgImage, {
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
