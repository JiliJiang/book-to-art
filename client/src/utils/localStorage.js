export const getSavedArtIds = () => {
  const savedartIds = localStorage.getItem('saved_arts')
    ? JSON.parse(localStorage.getItem('saved_arts'))
    : [];

  return savedartIds;
};

export const saveArtIds = (artIdArr) => {
  if (artIdArr.length) {
    localStorage.setItem('saved_arts', JSON.stringify(artIdArr));
  } else {
    localStorage.removeItem('saved_arts');
  }
};

export const removeArtId = (artId) => {
  const savedartIds = localStorage.getItem('saved_arts')
    ? JSON.parse(localStorage.getItem('saved_arts'))
    : null;

  if (!savedartIds) {
    return false;
  }

  const updatedSavedartIds = savedartIds?.filter((savedartId) => savedartId !== artId);
  localStorage.setItem('saved_arts', JSON.stringify(updatedSavedartIds));

  return true;
};
