import { t } from '@/plugins/i18n';
import { formatDate } from '@vueuse/core';

const table = {
  getNumberRecords(page: number, limit: number, total: number) {
    const from = total === 0 ? 0 : page * limit - limit + 1;
    const to = page * limit > total ? total : page * limit;
    return `${t('common.page.pagination.total')} ${total}
            ${t('common.page.pagination.showing')} ${from}
            - ${to} ${t('common.page.pagination.to')}`;
  },
  formatDate(date: Date, format: string) {
    format = !format ? 'YYYY/M/D' : format;
    return formatDate(date, format);
  }
};

export default table;
