import { useState } from "react"
import blogService from "../services/blogs"

const Blog = ({ blog, handleLikeBlog }) => {
  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}, {blog.author}
        <button onClick={() => setShowFull(!showFull)}>
          {showFull ? "hide" : "view"}
        </button>
      </div>
      { showFull && (
        <div>
            <div><a href={blog.url}>{blog.url}</a></div>
            <div>
              likes {blog.likes}
              <button onClick={handleLikeBlog}>like</button>
            </div>
            <div>added by {blog.user.name}</div>
          </div>
      )}
    </div>
  )
}

export default Blog