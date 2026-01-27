/**
 * Dynamic Export Utility
 * 
 * This wrapper ensures XLSX library is only loaded when export function is actually called,
 * not when the page loads. This reduces initial bundle size significantly.
 */

export const exportFileXLS = async (data: any[], fileName: string) => {
  // dynamically import the actual export function only when called
  const { exportFileXLS: actualExport } = await import('@/utils/files');
  return actualExport(data, fileName);
};
