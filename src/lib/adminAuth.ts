// Admin authentication utilities using localStorage
export interface AdminUser {
  username: string;
  name: string;
}

const ADMIN_USER_KEY = 'reeldeal_admin_user';
const ADMIN_CREDENTIALS_KEY = 'reeldeal_admin_credentials';

// Initialize default admin credentials
export const initializeAdminCredentials = () => {
  if (!localStorage.getItem(ADMIN_CREDENTIALS_KEY)) {
    const defaultCredentials = {
      username: 'admin',
      password: 'admin123', // In production, this would be hashed
    };
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
  }
};

export const loginAdmin = (username: string, password: string): boolean => {
  initializeAdminCredentials();
  const storedCredentials = JSON.parse(localStorage.getItem(ADMIN_CREDENTIALS_KEY) || '{}');
  
  if (username === storedCredentials.username && password === storedCredentials.password) {
    const adminUser: AdminUser = {
      username,
      name: 'Site Owner',
    };
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_USER_KEY);
};

export const getAdminUser = (): AdminUser | null => {
  const user = localStorage.getItem(ADMIN_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAdminAuthenticated = (): boolean => {
  return getAdminUser() !== null;
};
