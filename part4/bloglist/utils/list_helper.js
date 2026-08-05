const groupBy = require('lodash/groupBy')
const maxBy = require('lodash/maxBy')

const dummy = (blogs) => {
  console.log(blogs)
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, curr) => (curr.likes > prev.likes ? curr : prev), blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = groupBy(blogs, 'author')
  const mostBlogsAuthor = maxBy(Object.keys(authors), (author) => authors[author].length)
  return mostBlogsAuthor ? { author: mostBlogsAuthor, blogs: authors[mostBlogsAuthor].length } : undefined
}

const mostLikes = (blogs) => {
  const authors = groupBy(blogs, 'author')
  const mostLikesAuthor = maxBy(Object.keys(authors), (author) => authors[author].reduce((sum, blog) => sum + blog.likes, 0))
  return mostLikesAuthor ? { author: mostLikesAuthor, totalLikes: authors[mostLikesAuthor].reduce((sum, blog) => sum + blog.likes, 0) } : undefined
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}