import { FILE_SIZE_DEFAULT } from '@/stores/constants/constant';

export function convertSize(bytes: number) {
  if (bytes) {
    const units = ['bytes', 'KB', 'MB'];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = (bytes / Math.pow(1024, unitIndex)).toFixed(2);
    return size + ' ' + units[unitIndex];
  }
  return FILE_SIZE_DEFAULT;
}
