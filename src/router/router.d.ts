import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requireAuth?: boolean;
    title: string;
    roles?: string[];
  }
}
