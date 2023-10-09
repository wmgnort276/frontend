import { createApp } from 'vue';
import router from './router';
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';
import i18n from './plugins/i18n';
import { MotionPlugin } from '@vueuse/motion';
import { setupStore } from '@/stores';
import { setupVueQuery } from '@/plugins/vueQuery';
import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App);
app.use(router);
app.use(CKEditor);
setupStore(app);
setupVueQuery(app);
app.use(i18n).use(MotionPlugin).mount('#app');
