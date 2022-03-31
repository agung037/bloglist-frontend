import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


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

    }
    // error handling
    catch(exception){
      console.log("wrong credential")
      setErrorMessage('Username / Password Incorect')

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
    setUser(null)
  }


  // haldler untuk membuat blog baru
  const createNewBlogHandler = async (event) => {
    
    // prevent default agar tidak pindah page saat submit
    event.preventDefault()

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
    <div>
      <h1>Log in to application</h1>
      <Notification message={errorMessage}/>
    <form onSubmit={handleLogin}>
      <div>
          username
          <input
            type="text"
            value={username}
            onChange = {({target}) => setUsername(target.value)}
          />

      </div>

      <div>
        password
        <input 
          type="password"
          value={password}
          onChange = {({target}) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>

    </form>
    </div>
  )
  // akhir form login


  // tombol log out
  const logoutButton = () => (
    <div>
      <button onClick={logoutHandler}>Logout</button>
    </div>
  )


  // function untuk membuat form input blog baru
  const formCreateBlog = () => (
    <div>
      <form onSubmit={createNewBlogHandler}>
      <div>
          title : 
          <input
            type="text"
            value={title}
            onChange = {({target}) => setTitle(target.value)}
          />
      </div>
      <div>
          author : 
          <input
            type="text"
            value={author}
            onChange = {({target}) => setAuthor(target.value)}
          />
      </div>
      <div>
          url : 
          <input
            type="text"
            value={url}
            onChange = {({target}) => setUrl(target.value)}
          />
      </div>
      <button type='submit'>create</button>
      </form>
    </div>
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


  // jika user belum login sehingga datanya bernilai null
  // maka tampilkan form login
  if(user === null){
    return loginForm()
  }

  // jika user ada maka tampilkan blog
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={successMessages}/>
      <h3>Welcome {user.name} you are logged in {logoutButton()}</h3>

      {formCreateBlog()}

      {blogs.map(blog =><Blog key={blog.id} blog={blog} />)}
    </div>
  )
}

export default App