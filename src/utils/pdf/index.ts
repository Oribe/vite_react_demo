/**
 * 导出pdf
 */

import html2canvas from "html2canvas";
import { jsPDF as JsPDF } from "jspdf";

/**
 * 将图片转化成pdf导出
 * @param imageData
 * a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
 */
export function exportPdf(imageData: HTMLCanvasElement) {
  const pdf = new JsPDF({
    unit: "pt",
    format: "a4",
  });
  const pdfWidth = 595.28;
  // const pdfHeight = 841.89;
  pdf.addImage({
    imageData,
    x: 10,
    y: 10,
    width: pdfWidth - 20,
    height: ((pdfWidth - 20) / imageData.width) * imageData.height,
    compression: "NONE",
  });
  pdf.setDisplayMode("fullwidth");
  pdf.save("order.pdf");
}

/**
 * 将HTML转化成canvas并保存成图片
 * @param element 需要转化成图片的html
 * @returns
 */
export function htmlToImage(element: HTMLDivElement) {
  if (!element) {
    return;
  }
  html2canvas(element, {
    width: element.clientWidth,
    height: element.clientHeight,
  }).then((canvas) => {
    exportPdf(canvas);
    // document.body.appendChild(canvas);
  });
}
