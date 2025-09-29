// src/lib/resume.ts
export async function readResumeText(file: File): Promise<string> {
  const ext = file.name.toLowerCase();

  if (ext.endsWith(".txt")) return await file.text();

  if (ext.endsWith(".pdf")) {
    // Use top-level API and worker URL (Vite handles the asset)
    const pdfjs = await import("pdfjs-dist");
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;

    // @ts-ignore - types exist but this keeps TS quiet across versions
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

    // @ts-ignore
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      // @ts-ignore
      const content = await page.getTextContent();
      text += " " + content.items.map((it: any) => it.str).join(" ");
    }
    return text.replace(/\s+/g, " ").trim();
  }

  if (ext.endsWith(".docx")) {
    const { convertToHtml } = await import("mammoth");
    const buf = await file.arrayBuffer();
    const { value } = await convertToHtml({ arrayBuffer: buf });
    return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  // fallback for .doc or unknown
  return await file.text();
}
