import { useState } from 'react'
import storage from '../services/storage'

const Blog = ({ blog, handleLikeBlog, handleDelete }) => {
  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const currentUser = storage.getUser()
  const deletionAllowed = (currentUser && currentUser.username === blog.user.username)

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title}, {blog.author}
        <button onClick={() => setShowFull(!showFull)}>
          {showFull ? 'hide' : 'view'}
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
      { deletionAllowed &&
        <button onClick={handleDelete}>remove</button>
      }
    </div>
  )
}

export default Blog