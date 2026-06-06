import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LogIn, UserPlus, KeyRound, Mail, Phone, Lock, User, Eye, EyeOff } from 'lucide-react';

type Tab = 'login' | 'register' | 'reset';

export default function Auth() {
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Login form
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Reset form
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');

  const { login, register, resetPassword, loginWithWechat, loginWithGithub } = useAuthStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccount || !loginPassword) {
      setMessage({ type: 'error', text: '请填写账号和密码' });
      return;
    }
    const result = login(loginAccount, loginPassword);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      setMessage({ type: 'error', text: '请填写必填项' });
      return;
    }
    if (regPassword !== regConfirm) {
      setMessage({ type: 'error', text: '两次密码不一致' });
      return;
    }
    if (regPassword.length < 6) {
      setMessage({ type: 'error', text: '密码至少6位' });
      return;
    }
    const result = register({ username: regUsername, email: regEmail, phone: regPhone, password: regPassword });
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetNewPassword) {
      setMessage({ type: 'error', text: '请填写邮箱和新密码' });
      return;
    }
    if (resetNewPassword !== resetConfirm) {
      setMessage({ type: 'error', text: '两次密码不一致' });
      return;
    }
    const result = resetPassword(resetEmail, resetNewPassword);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if (result.success) setTab('login');
  };

  const handleThirdParty = (type: 'wechat' | 'github') => {
    const result = type === 'wechat' ? loginWithWechat() : loginWithGithub();
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });
  };

  const tabs: { key: Tab; label: string; icon: typeof LogIn }[] = [
    { key: 'login', label: '登录', icon: LogIn },
    { key: 'register', label: '注册', icon: UserPlus },
    { key: 'reset', label: '找回密码', icon: KeyRound },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">商务数据分析在线教育平台</h1>
            <p className="text-sm text-white/70 mt-1">系统掌握数据分析核心技能</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setMessage(null); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${
                  tab === key
                    ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Message */}
          {message && (
            <div className={`mx-6 mt-4 px-4 py-2.5 rounded-lg text-sm font-medium ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Forms */}
          <div className="p-6">
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">账号</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginAccount}
                      onChange={e => setLoginAccount(e.target.value)}
                      placeholder="用户名 / 邮箱 / 手机号"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="请输入密码"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-200">
                  登录
                </button>

                {/* Third-party login */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">第三方登录</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleThirdParty('wechat')} className="flex items-center justify-center gap-2 py-2.5 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm font-medium hover:bg-green-100 transition-colors">
                    <span className="text-lg">🟢</span> 微信登录
                  </button>
                  <button type="button" onClick={() => handleThirdParty('github')} className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors">
                    <span className="text-lg">🐙</span> GitHub登录
                  </button>
                </div>
              </form>
            )}

            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名 <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="请输入用户名"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="请输入邮箱"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="请输入手机号（选填）"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">密码 <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="至少6位密码"
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">确认密码 <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="再次输入密码"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-200">
                  注册
                </button>
              </form>
            )}

            {tab === 'reset' && (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                  请输入注册时使用的邮箱，设置新密码后即可登录
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">注册邮箱</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="请输入注册邮箱"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={resetNewPassword} onChange={e => setResetNewPassword(e.target.value)} placeholder="请输入新密码"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="再次输入新密码"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" />
                  </div>
                </div>
                <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-amber-200 hover:-translate-y-0.5 transition-all duration-200">
                  重置密码
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
