import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const searchProperties = async(data)=>{

    const res = await axios.post(
        `${API}/api/ai/search`,
        data
    );

    return res.data;

}

export const compareProperties = async(ids){

    const res = await axios.post(
        `${API}/api/ai/compare`,
        { ids }
    );

    return res.data;

}