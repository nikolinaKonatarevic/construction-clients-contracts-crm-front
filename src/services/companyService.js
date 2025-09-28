import axios from "axios";

const API_URL = "http://localhost:8080/api/company"; // prilagodi ako je drugačiji path

export const getCompanyById = (id) => axios.get(`${API_URL}/${id}`);