import jsonp from '@/common/js/jsonp'
import axios from 'axios'
import {commonParams, options} from './config'
export function getRecommend () {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign({}, commonParams, {
        platform:'h5',
        uin:0,
        needNewCode:1
    })
    return jsonp(url, data, options)
}


export function getDistList() {
    const url = '/api/getDiscList'
    const data = Object.assign({}, commonParams, {
        platform:'yqq',
        hostUin:0,
        sin:0,
        ein:29,
        sortId:5,
        needNewCode:0,
        categoryId:10000000,
        rnd:Math.random(),
        format:'json'
    })
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
    // return jsonp(url, data, options)
}

export function getSongList(dissid) {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    const data = Object.assign({},commonParams,{
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        disstid: dissid,
        needNewCode: 0,
        format: 'jsonp',
        platform: 'yqq',
        hostUin: 0
    })
    return jsonp(url, data, options)
}