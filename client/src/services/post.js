import axios from "../shared/axios";

export const getAllPost = async () => (await axios.get("post/all")).data;

export const getPostById = async (id) => (await axios.get(`post/${id}`)).data;

export const createPost = async (username, content) =>
  (await axios.post("post/create", { username, content })).data;
