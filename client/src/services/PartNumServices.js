import axios from "axios";

const REST_API_BASE_URL = "http://localhost:8080/api/equipment";

export const GetPart = (partNumberId) => axios.get(REST_API_BASE_URL + '/' + partNumberId);

export const UpdatePart = (partId, partData) => axios.put(REST_API_BASE_URL + '/' + partId, partData);
