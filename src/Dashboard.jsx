// PostsPage.js
import React, { useState, useEffect } from "react";
import { Table, Select, Input } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";

const { Option } = Select;
const { Search } = Input;

const PostsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/posts?${queryParams}`
      );
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location.search]);

  useEffect(() => {
    const filteredByTags =
      selectedTags.length === 0
        ? posts
        : posts.filter((post) =>
            post.tags.some((tag) => selectedTags.includes(tag))
          );
    // Filter posts based on search query
    const filteredBySearch = filteredByTags.filter((post) =>
      post.body.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(filteredBySearch);
  }, [posts, selectedTags, searchQuery]);

  const handleTagChange = (value) => {
    setSelectedTags(value);
    const params = new URLSearchParams(location.search);
    params.set("tags", value.join(","));
    window.history.replaceState(
      null,
      "",
      `${location.pathname}?${params.toString()}`
    );
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    const params = new URLSearchParams(location.search);
    params.set("search", value);
    window.history.replaceState(
      null,
      "",
      `${location.pathname}?${params.toString()}`
    );
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Body", dataIndex: "body", key: "body" },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => tags.join(", "),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Select
          className="filter-select"
          mode="multiple"
          style={{ width: 200, marginBottom: 10 }}
          placeholder="Select tags"
          value={selectedTags}
          onChange={handleTagChange}
        >
          {[
            "history",
            "american",
            "crime",
            "french",
            "fiction",
            "english",
            "magical",
            "love",
            "classic",
            "mystery",
          ].map((tag) => (
            <Option key={tag} value={tag}>
              {tag}
            </Option>
          ))}
        </Select>
        <Search
          placeholder="Search posts"
          onSearch={handleSearch}
          style={{ width: 200, marginBottom: 10 }}
        />
      </div>

      <Table
        dataSource={filteredPosts}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PostsPage;
