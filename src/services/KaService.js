import {api, base_api} from "src/apis/api.js";
import axios from "axios";

export const getExam = async (data) => {
    try {
        const response = await api.get(`http://localhost:8080/api/v1/ka/get-questions/${data}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
export const getSetting = async (data) => {
    try {
        const response = await api.get(`http://localhost:8080/api/v1/ka/room/infoRoom/${data}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const submitAnswer = async (answerData) => {
    try {
        const response = await api.post("http://localhost:8080/api/v1/ka/answer/submit",answerData);
        return response.data;
    } catch (error) {
        console.error('Error submitting answer:', error);
        throw error;
    }
};

