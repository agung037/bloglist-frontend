const CreateBlogForm = ({
  createNewBlogHandler,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
  return (
    <div>
      <form onSubmit={createNewBlogHandler}>
        <div>
          title :
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          author :
          <input type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url :
          <input type="text" value={url} onChange={handleUrlChange} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm
