import axios from 'axios'
const baseUrl = '/api/blogs'

// buat variabel kosongan token, untuk diisi ketika login berhasil
let token = null

// function untuk mendapatkan semua blogs
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// function untuk membuat blog baru
const create = async (newObject) => {

  // tambahkan token di header untuk authorization
  const config = {
    headers: {Authorization: token},
  }

  // mengirim permintaan post ke backend menggunakan axios
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// function untuk menulis bearer / token, yand digunakan untuk membuat backed mempercayai browser
const setToken = newToken => {
  token = `bearer ${newToken}`
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create }