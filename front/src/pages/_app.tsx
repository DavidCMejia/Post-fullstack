import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import { store } from '../store';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', borderRadius: 8 } }}>
        <Component {...pageProps} />
      </ConfigProvider>
    </Provider>
  )
}
