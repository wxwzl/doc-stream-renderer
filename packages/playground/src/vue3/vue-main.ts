import { createApp } from 'vue';
import VueApp from './VueApp.vue';
import '../styles.css';
if (import.meta.env.DEV) {
  import('react-grab');
}

createApp(VueApp).mount('#root');
