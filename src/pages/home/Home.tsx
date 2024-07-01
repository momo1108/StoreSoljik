import Header from '@/components/layouts/header/Header';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { userInfo, loading } = useAuth();
  console.log(userInfo, loading);
  return (
    <>
      <Header isSigning={false} />
    </>
  );
}
