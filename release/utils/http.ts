import axios from 'axios'
export const post = async (url, data, headers) => {
    const config = {
        headers: headers
    }
    try{
         const response = await axios.post(url,data, config)
        return response.data
    }catch( error) {
        return error
    }
}

export const get = async (url) => {
    try {
     const response = await axios.get(url)
        return response.data
    } catch(error){
        console.error(error)
    }
}