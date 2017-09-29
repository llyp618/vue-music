import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

export function loadSearch(){
    return storage.get(SEARCH_KEY, [])
}

/**
 * 向数组arr首部插入新值val，如果val与arr中第一个值相同则返回，如果val与arr后面有相同，则删除那个值再插入，整个
 * 数组长度不超过maxLen 如果超过则删除最后一个值。
 * @param {Array} arr 
 * @param {String} val 
 * @param {Function} compare 
 * @param {Number} maxLen 
 */
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if(index === 0) {
        return
    }
    if(index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen){
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches,query,(item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)
    storage.set(SEARCH_KEY, searches)
    return searches
}


export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    searches.forEach((item,index) => {
        if(item === query){
            searches.splice(index, 1)
        }
    })
    storage.set(SEARCH_KEY,searches)
    return searches
}

export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}


export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, PLAY_MAX_LEN)
    storage.set(PLAY_KEY, songs)
    return songs
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}


export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    insertArray(songs, song, (item) => {
        return song.id === item.id
    }, FAVORITE_MAX_LEN)
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    deleteFromArray(songs, (item) => {
        return item.id === song.id
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}