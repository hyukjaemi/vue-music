import storage from 'good-storage'

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200;

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
      arr.splice(index, 1)
    }
  }

export function saveFavorite(){
    let songs = storage.get(FAVORITE_KEY,[]);
    insertArray(songs,song,(item)=>{
        return song.id === item.id
    },FAVORITE_MAX_LENGTH)
    storage.set(FAVORITE_KEY,songs)
    return songs
}

export function deleteFavorite(song){
    let songs = storage.get(FAVORITE_KEY,[]);
    deleteFromArray(songs, (item) => {
        return item.id === song.id
      })
      storage.set(FAVORITE_KEY, songs)
      return songs 
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}