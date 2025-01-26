import { useDispatch, useSelector } from 'react-redux'
import { vote, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const dispatch = useDispatch()

  const addLike = (blogObject) => {
    dispatch(vote(blogObject))
    dispatch(setNotification(`a like has been added to the blog ${blogObject.title} by ${blogObject.author} added`, 5))
  }

  const remove = (id) => {
    dispatch(removeBlog(id))
    dispatch(setNotification(`the blog with id ${id} has been deleted`, 5))
  }

  const blogs = useSelector(({ blogs }) => blogs)

  return(
    <div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          putLike={addLike}
          removeBlog={blog.user && blog.user.username === user.username ? remove : null}
        />
      )}
    </div>
  )
}

export default BlogList