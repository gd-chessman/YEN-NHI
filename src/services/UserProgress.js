
import {api} from "src/apis/api.js";


export const getProgressBySetIdUserId = async (userID,setID) => {
    try {
        const response = await api.get(`/v1/progress/user/${userID}/set/${setID}`)
        // console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
}