import axios from "axios"
const baseUrl = '/api/login'


// function untuk login
// credentials berisi username dan pasword yang dikirim melalui form login
const login = async (credential) => {

  // kirim ke backend
  const response = await axios.post(baseUrl, credential)

  // kirim hasil dari backend ke user
  return response.data
  
}


// eslint-disable-next-line import/no-anonymous-default-export
export default {login};