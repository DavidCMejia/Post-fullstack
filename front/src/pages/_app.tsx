import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import axios from 'axios'
import { store } from '../store'
import '../styles/globals.css'

function BackendCheck() {
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
    axios.get(`${API_URL}/health`)
      .then(() => console.log('✅ Backend connected —', API_URL))
      .catch(() => console.warn('❌ Backend not reachable at', API_URL))
  }, [])
  return null
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', borderRadius: 8 } }}>
        <BackendCheck />
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  )
}