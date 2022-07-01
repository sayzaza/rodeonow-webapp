const baseURL = process.env.VUE_APP_BASE_URL
import ky from 'ky';


export const getNews = async(index)=>{
   return await ky.get(`${baseURL}/services/archives.ashx/stories?index=${index}&page_size=10&sport=0&season=0&search=0`).json()
}

export const getSchedules = async(index)=>{
    return await ky.get(`${baseURL}/services/pro_rodeo.ashx/schedule?page_size=24&index=${index}`).json()
 }