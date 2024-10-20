const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0) 
}

const favoriteBlog = (blogs) => {
  const reducer = (mx, item) => {
    return item.likes > mx
      ? item.likes
      : mx
  }
  const mx = blogs.reduce(reducer, 0)
  const ans = blogs.filter(blog => blog.likes === mx)
  if (ans.length === 0) {
    return {}
  }
  return {author: ans[0].author, title: ans[0].title, likes: ans[0].likes}
}

module.exports = {
  dummy, totalLikes, favoriteBlog
}