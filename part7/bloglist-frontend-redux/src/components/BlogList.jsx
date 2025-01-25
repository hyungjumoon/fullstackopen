import { useDispatch, useSelector } from 'react-redux'
import { vote, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Blog from './Blog'

const BlogList = ({ user }) => {
  const dispatch = useDispatch()

  const addLike = (id) => {
    // blogService
    //   .update(blogObject)
    //   .then(returnedBlog => {
    //     const updatedBlogs = blogs.filter(blog => blog.id !== returnedBlog.id)
    //     setBlogs(updatedBlogs.concat(returnedBlog))
    //   })
    // dispatch(setNotification(`a like has been added to the blog ${returnedBlog.title} by ${returnedBlog.author} added`, 5))
    dispatch(vote(id))
    dispatch(setNotification(`a like has been added to the blog with id ${id}`, 5))
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