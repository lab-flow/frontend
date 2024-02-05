export const downloadPDF = (data: BlobPart, filename: string) => {
  const fileDataBlob = new Blob([data], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(fileDataBlob);
  link.download = `${filename}`;
  link.click();
};
