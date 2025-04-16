import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user?.name || 'User'}!</h2>
      <p className="mb-2">Role: <span className="font-semibold">{user?.role}</span></p>
      {user?.role === 'admin' ? (
        <p className="text-green-600">You have admin access. You can add books and manage users.</p>
      ) : (
        <p className="text-blue-600">You are a member. You can browse and borrow books.</p>
      )}
    </div>
  );
}
