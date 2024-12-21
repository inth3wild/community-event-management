import { useAuthStore } from '@/stores/auth.store';

export const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">Community Events</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm">{user.name}</span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          ) : (
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
