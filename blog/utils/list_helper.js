var _ = require('lodash');


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

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}
  const authors = _.groupBy(blogs, (x => x.author))
  let ans = {author: '', blogs: 0}
  for (const prop in authors) {
    if (authors[prop].length > ans.blogs) {
      ans.author = prop
      ans.blogs = authors[prop].length
    }
  }
  return ans
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {}
  const authors = _.groupBy(blogs, (x => x.author))
  const like = _.mapValues(authors,
    function(posts) {
      return _.reduce(_.map(posts, (x=>x.likes)), ((a,b) => a+b), 0)
    })
  let ans = {author: '', likes: 0}
  for (const prop in like) {
    if (like[prop] > ans.likes) {
      ans.author = prop
      ans.likes = like[prop]
    }
  }
  return ans
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}