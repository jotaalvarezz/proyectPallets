import { CustomError } from "~/tools/customError";

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

export const objectKey = (id, key, collection, msg = "Vacio") => {
  const object = collection.find((item) => item.id === id)
  if(object){
    return object[key]
  }else {
    return msg
  }
}

export const responseCatch = (res) => {
  if (res.code) {
    throw new CustomError(res.title, res.message, res.code);
  }
};

