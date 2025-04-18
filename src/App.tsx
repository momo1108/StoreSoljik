import { useCallback, useState } from 'react';
import MainRouter from './router/MainRouter';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './style/GlobalStyle';
import theme from './style/theme.ts';
import { AuthProvider } from './hooks/useFirebaseAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ModalProvider } from './hooks/useModal.tsx';

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
  queryClient.setQueryDefaults(['product'], {
    staleTime: 1000 * 60,
    refetchInterval: 1000 * 60,
    refetchIntervalInBackground: false,
    gcTime: 1000 * 60 * 30,
  });
  queryClient.setQueryDefaults(['products'], {
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: false,
    gcTime: 1000 * 60 * 30,
  });
  queryClient.setQueryDefaults(['orders'], {
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchIntervalInBackground: false,
    gcTime: 1000 * 60 * 30,
  });

  // ThemeProvider 의 type 을 오버라이드해서 theme 에 들어갈 타입을 지정하면 사용하기 편하지 않을까?
  return (
    <ThemeProvider
      theme={{
        fontSize: theme.fontSize,
        lineHeight: theme.lineHeight,
        color: themeColor,
        themeSwitcher,
      }}
    >
      <GlobalStyle />
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ModalProvider>
              <MainRouter />
            </ModalProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster
              richColors
              toastOptions={{
                style: {
                  padding: '15px',
                  gap: '12px',
                },
                closeButton: true,
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
