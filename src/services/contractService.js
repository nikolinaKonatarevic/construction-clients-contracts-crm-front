import axios from "axios";

const API_URL = "http://localhost:8080/api/contract"; // prilagodi ako je drugačiji path

export const getContracts = () => axios.get(API_URL);
export const getContractById = (id) => axios.get(`${API_URL}/${id}`);
export const updateContract = (contract) => axios.put(API_URL, contract);
export const createContract = (contract) => axios.post(API_URL, contract);

