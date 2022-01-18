import { Route, Routes } from "react-router-dom";
import React from "react"
import Home from "./pages/Home";
import Post from "./pages/Post";

export default function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="post/:id" element={<Post />} />
    </Routes>
  );
}
