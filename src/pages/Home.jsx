import { createPost, getAllPost } from "../services/post";
import React from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { useState } from "react";

export default function Home() {
  const { data, error, mutate } = useSWR("all-posts", () => getAllPost());

  const [usernameValue, setUsernameValue] = useState("");
  const [contentValue, setContentValue] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (usernameValue.trim() && contentValue.trim()) {
      createPost(usernameValue.trim(), contentValue.trim()).then(() => {
        mutate();
      });

      setUsernameValue("");
      setContentValue("");
    }
  };

  if (error) return <div>Error</div>;

  if (!data) return <div>Loading</div>;

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={usernameValue}
          onChange={(e) => setUsernameValue(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          value={contentValue}
          onChange={(e) => setContentValue(e.target.value)}
        />
        <button type="submit">Create new post</button>
      </form>

      {data.map((item) => (
        <div
          key={item._id}
          style={{ display: "flex", alignItems: "center", gap: 10 }}
        >
          <img
            style={{ width: 30, height: 30, borderRadius: "999px" }}
            src={`https://avatars.dicebear.com/api/micah/${item.username}.svg`}
            alt=""
          />

          <p>
            {item.username}: {item.content}
          </p>

          <Link to={`/post/${item._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}
