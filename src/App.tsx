import { useCallback, useState } from 'react';
import MainRouter from './router/MainRouter.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './style/GlobalStyle.tsx';
import theme from './style/theme.ts';
import { AuthProvider } from './hooks/useAuth.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  /**
   * 페이지 전체의 테마 색상을 저장할 state
   */
  const [themeColor, setThemeColor] = useState<Record<string, string>>(
    theme.light,
  );
  /**
   * 테마 색상을 반대로 스위치해주는 함수
   */
  const themeSwitcher = useCallback(() => {
    if (themeColor.type === 'light') setThemeColor(theme.dark);
    else setThemeColor(theme.light);
  }, [themeColor, setThemeColor]);

  /**
   * react-query 클라이언트 인스턴스 생성
   */
  const queryClient = new QueryClient();

  // ThemeProvider 의 type 을 오버라이드해서 theme 에 들어갈 타입을 지정하면 사용하기 편하지 않을까?
  return (
    <ThemeProvider
      theme={{ fontSize: theme.fontSize, color: themeColor, themeSwitcher }}
    >
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <MainRouter />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
