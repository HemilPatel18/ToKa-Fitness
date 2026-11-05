import axios from 'axios';

const backend_url = "http://localhost:8001"

const api = axios.create({
    baseURL: backend_url
});

export async function RegisterTest(name, email, password, confirmPassword ) {
  try {
    const response = await api.post('/auth/register', {
      name: email,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });

    console.log('Backend response:', response.data);
  } catch (error) {
    console.error(
      'Backend request failed:',
      error.response?.data || error.message
    );
  }
}

export default api;