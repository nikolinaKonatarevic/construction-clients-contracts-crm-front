import axios from "axios";

const API_URL = "http://localhost:8080/api/customer"; 

export const getCustomers = () => axios.get(API_URL);

export const getCustomerById = (id) => axios.get(`${API_URL}/${id}`);

export const createCustomer = (customer) => axios.post(API_URL, customer);

export const updateCustomer = (customer) => axios.put(API_URL, customer);

export const deleteCustomer = (id) => axios.delete(`${API_URL}/${id}`);
