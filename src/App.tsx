import axios from 'axios'
import { QueryClient } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

class FetchAPI {
  public static async fetch(url: string, invalidate = false) {
    if (invalidate) {
      queryClient.invalidateQueries(url)
    }

    return await queryClient.fetchQuery(url, () =>
      fetch(url).then((response) => response.json())
    )
  }
}

const axiosAPI = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  adapter: (config) => {
    console.log('adapter')
    return queryClient.fetchQuery(config.url!, () => {
      console.log('axios', config.method, config.url)
      return axios({ ...config, ...{ adapter: undefined } })
    })
  },
})

axiosAPI.interceptors.request.use(
  (config) => {
    console.log('interceptors')
    return config
  },
  (error) => {
    console.log('interceptors error')
    return Promise.reject(error)
  }
)

function App() {
  // const handleClickFetch = async () => {
  //   const data = await FetchAPI.fetch(
  //     'https://jsonplaceholder.typicode.com/photos'
  //   )
  //   console.log('data', data)
  // }

  // const handleClickRefetch = async () => {
  //   const data = await FetchAPI.fetch(
  //     'https://jsonplaceholder.typicode.com/photos',
  //     true
  //   )
  //   console.log('data', data)
  // }

  const handleClickFetch = async () => {
    const data = await axiosAPI.post('/posts', {
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    console.log('data', data)
  }

  const handleClickRefetch = async () => {
    queryClient.invalidateQueries('/posts')
    const data = await axiosAPI.post('/posts', {
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    console.log('data', data)
  }

  return (
    <div>
      <p>React Query POC</p>

      <button onClick={handleClickFetch}>Fetch</button>
      <button onClick={handleClickRefetch}>Force Refetch</button>
    </div>
  )
}

export default App
