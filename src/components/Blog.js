import { useState } from "react"
import React from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, blogs, setBlogs, user }) => {
  const [show, setShow] = useState(false)
  const [buttonText, setButtonText] = useState("Show")
  const [likeCount, setLikeCount] = useState(false)

  if (!user) {
    user = ""
  }

  const handleClick = () => {
    setShow(!show)

    if (show) {
      setButtonText("Show")
    } else {
      setButtonText("Hide")
    }
  }

  const handleLike = () => {
    blogService.like(blog)
    setLikeCount((blog.likes += 1))
  }

  const handleDelete = async () => {
    const confirmation = window.confirm(
      `are you sure want to delete ${blog.title}`
    )

    if (confirmation) {
      await blogService.remove(blog)
      setBlogs(blogs.filter((b) => b !== blog))
    }
  }

  const details = () => {
    // membuat function untuk menampilkan details
    return (
      <div>
        <div>
          likes {likeCount ? likeCount : blog.likes}{" "}
          <button id="like" className="like-button" onClick={handleLike}>
            Like
          </button>
        </div>
        <div className="blog-url">{blog.url}</div>
        <div>author : {blog.author}</div>
        <div>
          {user.username === blog.user.username ? (
            <button className="delete" onClick={handleDelete}>
              delete
            </button>
          ) : (
            ""
          )}

          <p className="tomato">
            <i>created by : {blog.user.username}</i>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="nice-border">
      {blog.title} by {blog.author}{" "}
      <button className="blog-button" onClick={handleClick}>
        {buttonText}
      </button>
      {/* komponen ini akan terlihat apabila state dari show bernilai true */}
      {show ? details() : ""}
    </div>
  )
}

export default Blog
