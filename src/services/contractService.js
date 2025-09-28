import axios from "axios";

const API_URL = "http://localhost:8080/api/contract"; // prilagodi ako je drugačiji path

export const getContracts = () => axios.get(API_URL);
