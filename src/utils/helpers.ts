/**
 * Mock download function to simulate file export across the app.
 */
export const handleDownload = (fileName: string = 'export') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fullFileName = `${fileName}_${timestamp}.pdf`;
  
  // Show a notification-like alert (since we are in an iframe, we avoid window.alert if possible, 
  // but for a "Make it active" request, this is the most visible way to show success)
  console.log(`Downloading: ${fullFileName}`);
  
  // Create a temporary link element to simulate a real download
  const blob = new Blob(['Mock data for ' + fileName], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fullFileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  
  // In a real app, this would call a PDF generation library like jspdf or a backend endpoint
};

/**
 * Validates Indian GSTIN format
 * Format: 2 digits state code + 10 digits PAN + 1 digit entity code + 'Z' + 1 digit checksum
 */
export const validateGSTIN = (gstin: string): boolean => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin.toUpperCase().trim());
};

/**
 * Converts numbers to Indian currency words
 */
export const numberToWords = (num: number): string => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only' : 'only';
  
  return str.trim();
};
