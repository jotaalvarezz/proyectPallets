import { Application } from '@nativescript/core'

/* export function getRootView() {
  const rootView = Application.getRootView();
  return rootView;
} */
export const showDrawer = () => {
  let drawerNativeView = Application.getRootView()
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.showDrawer()
  }
}

export const closeDrawer = () => {
  let drawerNativeView = Application.getRootView()
  if (drawerNativeView && drawerNativeView.showDrawer) {
    drawerNativeView.closeDrawer()
  }
}

