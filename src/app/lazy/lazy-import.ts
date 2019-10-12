export const LAZY_LOAD = {
    path: 'lazy', loadChildren: () => import('../lazy-load/lazy-load.module').then(m => m.LazyLoadModule)
}