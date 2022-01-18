import { Link, useParams } from "react-router-dom";
import React from "react";
import { getPostById } from "../services/post";
import useSWR from "swr";

export default function Post() {
  const { id } = useParams();

  const { data, error } = useSWR(`post-${id}`, () => getPostById(id));

  if (error) return <div>Error</div>;

  if (!data) return <div>Loading</div>;

  return (
    <div>
      <Link to="/">Return Home</Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img
          style={{ width: 30, height: 30, borderRadius: "999px" }}
          src={`https://avatars.dicebear.com/api/micah/${data.username}.svg`}
          alt=""
        />

        <p>
          {data.username}: {data.content}
        </p>
      </div>
    </div>
  );
}
