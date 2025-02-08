import axios from "axios";
const API_URL = "https://jsonplaceholder.typicode.com/posts";


export function createNote({ title, body, userId }){
   return axios.post(API_URL, { title, body, userId });
}

export function updateNote({ id, title, body, userId }){
  return axios.put(`${API_URL}/${id}`, { title, body, userId });
}

export function removeNote(id){
  return axios.delete(`${API_URL}/${id}`);
}

export function getAll(){
  return axios.get(API_URL);
}