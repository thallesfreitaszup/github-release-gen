import axios from 'axios'
export const post = async (url, data) => {
    return axios.post(url,data)
}

export const get = async (url) => {
    try {
     const response = await axios.get(url)
        return response.data
    } catch(error){
        console.error(error)
    }
}