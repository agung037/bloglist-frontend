import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import CreateBlogForm from './components/CreateBlogForm'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessages, setSuccessMessages] = useState(null)
  
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  // fungsi untuk handle tiap data yang diberikan form login
  const handleLogin = async (event) => {

    // menghindari browser untuk redirect ke halaman lain
    event.preventDefault();
    
    
    console.log('logginin with', username, password)

    try{
      // mencari apakah user ada dalam database
      // mengirim ke helper login data berupa username dan password
      const user = await loginService.login({username, password})

      // menambahkan token username dan name ke state
      setUser(user)

      // menambahkan user kedalam local storage, tapi di rubah dulu mjd string 
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    
      // lempar token ke service untuk dibuatkan bearer
      blogService.setToken(user.token)

      // kosongkan kembali form
      setUsername('')
      setPassword('')
      setSuccessMessages(`Login Success ${user.name}`)

      setTimeout(() => {
        setSuccessMessages(null)
      }, 1000)

    }
    // error handling
    catch(exception){
      console.log("wrong credential")
      setErrorMessage('Username / Password Incorrect')

      // setelah 4 detik kosongkan kembali notifikasi
      setTimeout(() => {
        setErrorMessage(null)
      }, 4000)
    }
  }

  
  // handler logout
  const logoutHandler = () => {
    localStorage.removeItem("loggedBlogappUser");
    console.log('membersihkan localstorage')
    setSuccessMessages('You are logged out')

    setTimeout(() => {
      setSuccessMessages(null)
    }, 1000)

    setUser(null)
  }


  // haldler untuk membuat blog baru
  const createNewBlogHandler = async (event) => {
    
    // prevent default agar tidak pindah page saat submit
    event.preventDefault()
    
    // langsung menutup form setelah submit new blog
    blogFormRef.current.toggleVisibility()

    const blogObject = {
      title: title,
      author: author,
      url: url
    }


    const returnedBlog = await blogService.create(blogObject)
    
    // tambahkan object yang baru di buat ke state
    setBlogs(blogs.concat(returnedBlog))
    
    
    // kosongkan semua form field
    setTitle('')
    setAuthor('')
    setUrl('')
    

    setSuccessMessages(`A new Blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
    setTimeout(() => {
      setSuccessMessages(null)
    }, 5000)

    

  }

  // Form Login dalam bentuk arrow function
  const loginForm = () => (
    // menggunakan component togglable dan menamai button
    <Togglable buttonLabel="Login">
      {/* menggunakan login form dan mengirimkan beberapa parameter */}
      <LoginForm

        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    </Togglable>
  )
  // akhir form login


  // tombol log out
  const logoutButton = () => (
    <div>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  )

  const blogFormRef = useRef()

  // function untuk membuat form input blog baru
  const formCreateBlog = () => (
    <Togglable buttonLabel="Add new Blog" ref={blogFormRef}>
      <CreateBlogForm
        createNewBlogHandler={createNewBlogHandler} 
        title={title}
        author={author}
        url={url}
        handleTitleChange={({target}) => setTitle(target.value)}
        handleAuthorChange={({target}) => setAuthor(target.value)}
        handleUrlChange={({target}) => setUrl(target.value)}
      />
    </Togglable>
    // <div>
    //   <form onSubmit={createNewBlogHandler}>
    //   <div>
    //       title : 
    //       <input
    //         type="text"
    //         value={title}
    //         onChange = {({target}) => setTitle(target.value)}
    //       />
    //   </div>
    //   <div>
    //       author : 
    //       <input
    //         type="text"
    //         value={author}
    //         onChange = {({target}) => setAuthor(target.value)}
    //       />
    //   </div>
    //   <div>
    //       url : 
    //       <input
    //         type="text"
    //         value={url}
    //         onChange = {({target}) => setUrl(target.value)}
    //       />
    //   </div>
    //   <button type='submit'>create</button>
    //   </form>
    // </div>
  )

  // effect untuk set blogs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  // effect untuk cek apakah localstorage berisi info user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    // jika localstorage ditemukan
    if(loggedUserJSON){
      
      // ubah dari text ke json
      const user = JSON.parse(loggedUserJSON)

      // masukan user ke dalam state
      setUser(user)

      // masukan token kedalam blog services
      blogService.setToken(user.token)
      
    }

    // empty array artinya effek hanya perlu di eksekusi sekali saat awal app diakses
  }, [])


  return (

    <div>
      <Notification message={errorMessage} type="error"/>
      <Notification message={successMessages} type="success"/>

      <h2>Blogs</h2>

      {user ? <h3>Welcome {user.name} you are logged in {logoutButton()}</h3> : ''}
      {user ? formCreateBlog() : loginForm()}
      {blogs.map(blog =><Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App