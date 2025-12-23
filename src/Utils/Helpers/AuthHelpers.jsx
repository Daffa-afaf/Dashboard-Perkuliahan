export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const hasPermission = (perm) => {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.role === 'admin') return true;
  return Array.isArray(user.permissions) && user.permissions.includes(perm);
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};
