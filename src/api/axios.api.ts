import axios from "axios";
import { BASE_URL } from "../constants/urls";

export const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
