export const onSearchBarLoaded = (event) => {
  const searchBar = event.object;
  if (searchBar.android) {
    // Específico para Android, asegurándose de que el teclado no se abra automáticamente
    searchBar.android.clearFocus();
  }
};

export const identifyObject = (id, collection) => {
  const object = collection.find((d) => d.id == id);
  return object;
};
