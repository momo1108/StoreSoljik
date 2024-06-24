import { auth } from '@/firebase';

export default function ProtectedRoute() {
  console.log(auth);
  return <div>ProtectedRoute</div>;
}
