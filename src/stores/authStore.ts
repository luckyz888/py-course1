import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  bio: string;
  loginType: 'local' | 'wechat' | 'github';
  createdAt: string;
  lastLoginAt: string;
}

interface AuthState {
  currentUser: User | null;
  users: User[];
  isLoggedIn: boolean;
  register: (data: { username: string; email: string; phone: string; password: string }) => { success: boolean; message: string };
  login: (account: string, password: string) => { success: boolean; message: string };
  loginWithWechat: () => { success: boolean; message: string };
  loginWithGithub: () => { success: boolean; message: string };
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => { success: boolean; message: string };
  updateProfile: (data: { username?: string; avatar?: string; bio?: string }) => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
}

const generateId = () => Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

const AVATARS = ['🦊', '🐼', '🦁', '🐯', '🐸', '🐧', '🦄', '🐲', '🦅', '🐝'];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isLoggedIn: false,

      register: (data) => {
        const { users } = get();
        if (users.some(u => u.email === data.email)) {
          return { success: false, message: '该邮箱已被注册' };
        }
        if (users.some(u => u.phone === data.phone && data.phone)) {
          return { success: false, message: '该手机号已被注册' };
        }
        if (users.some(u => u.username === data.username)) {
          return { success: false, message: '该用户名已被占用' };
        }
        const newUser: User = {
          id: generateId(),
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: data.password,
          avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
          bio: '',
          loginType: 'local',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        set({ users: [...users, newUser], currentUser: newUser, isLoggedIn: true });
        return { success: true, message: '注册成功' };
      },

      login: (account, password) => {
        const { users } = get();
        const user = users.find(u =>
          (u.email === account || u.phone === account || u.username === account) && u.password === password
        );
        if (!user) {
          return { success: false, message: '账号或密码错误' };
        }
        const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
        set({
          currentUser: updatedUser,
          isLoggedIn: true,
          users: users.map(u => u.id === user.id ? updatedUser : u),
        });
        return { success: true, message: '登录成功' };
      },

      loginWithWechat: () => {
        const { users } = get();
        let user = users.find(u => u.loginType === 'wechat' && u.username === '微信用户');
        if (!user) {
          user = {
            id: generateId(),
            username: '微信用户',
            email: `wechat_${generateId()}@mock.com`,
            phone: '',
            password: '',
            avatar: '🟢',
            bio: '通过微信登录',
            loginType: 'wechat',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          set({ users: [...users, user], currentUser: user, isLoggedIn: true });
        } else {
          const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
          set({
            currentUser: updatedUser,
            isLoggedIn: true,
            users: users.map(u => u.id === user!.id ? updatedUser : u),
          });
        }
        return { success: true, message: '微信登录成功' };
      },

      loginWithGithub: () => {
        const { users } = get();
        let user = users.find(u => u.loginType === 'github' && u.username === 'GitHub用户');
        if (!user) {
          user = {
            id: generateId(),
            username: 'GitHub用户',
            email: `github_${generateId()}@mock.com`,
            phone: '',
            password: '',
            avatar: '🐙',
            bio: '通过GitHub登录',
            loginType: 'github',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
          };
          set({ users: [...users, user], currentUser: user, isLoggedIn: true });
        } else {
          const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
          set({
            currentUser: updatedUser,
            isLoggedIn: true,
            users: users.map(u => u.id === user!.id ? updatedUser : u),
          });
        }
        return { success: true, message: 'GitHub登录成功' };
      },

      logout: () => {
        set({ currentUser: null, isLoggedIn: false });
      },

      resetPassword: (email, newPassword) => {
        const { users } = get();
        const user = users.find(u => u.email === email);
        if (!user) {
          return { success: false, message: '未找到该邮箱对应的账号' };
        }
        const updatedUser = { ...user, password: newPassword };
        set({
          users: users.map(u => u.id === user.id ? updatedUser : u),
          currentUser: get().currentUser?.id === user.id ? updatedUser : get().currentUser,
        });
        return { success: true, message: '密码重置成功' };
      },

      updateProfile: (data) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...data };
        set({
          currentUser: updatedUser,
          users: users.map(u => u.id === currentUser.id ? updatedUser : u),
        });
      },

      changePassword: (oldPassword, newPassword) => {
        const { currentUser, users } = get();
        if (!currentUser) return { success: false, message: '未登录' };
        if (currentUser.password !== oldPassword) {
          return { success: false, message: '原密码错误' };
        }
        const updatedUser = { ...currentUser, password: newPassword };
        set({
          currentUser: updatedUser,
          users: users.map(u => u.id === currentUser.id ? updatedUser : u),
        });
        return { success: true, message: '密码修改成功' };
      },
    }),
    { name: 'auth-store' }
  )
);
