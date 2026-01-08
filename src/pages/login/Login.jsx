import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState();
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigation('/');
    }
  }, [navigation, userInfo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password, referralCode }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigation('/');
    } catch (error) {
      toast.error('Şifrə və ya email səhvdir');
    }
  };

  return (
<section className="min-h-screen flex items-center justify-center p-4 bg-gray-900 font-mono text-gray-100 relative overflow-hidden">
    {/* Cyberpunk Arka Plan Efekti */}
    <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern animate-grid-pulse"></div>
    </div>

    <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-neon-blue w-full max-w-md border-2 border-blue-600 transition-all duration-300 hover:shadow-neon-purple">
        
        {/* Başlık Bölümü */}
        <div className="text-center mb-10 border-b-2 border-purple-600 pb-4">
            <h1 className="text-4xl font-bold text-blue-400 tracking-wider mb-2 animate-pulse-light">
                 GİRİŞ <span className="text-purple-400">AKTİV</span>
            </h1>
            <p className="text-gray-400 text-lg">Sistemə daxil olun.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email və ya Referral Code */}
            <div>
                <label htmlFor="loginId" className="block text-sm font-medium text-blue-300 mb-1">
                    EMAIL / REFERRAL KODU <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    id="loginId"
                    placeholder="Email və ya Referral Code"
                    value={email || referralCode}
                    onChange={(e) => {
                        const value = e.target.value;
                        setEmail(value);
                        setReferralCode(value);
                    }}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                />
            </div>

            {/* Şifrə */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-1">
                    ŞİFRƏ <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        placeholder="Şifrənizi daxil edin"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                    {/* Göz İkonu */}
                    <span
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-purple-400 hover:text-blue-400 text-lg transition"
                        onClick={() => setIsPasswordVisible(prev => !prev)}
                    >
                        {isPasswordVisible ? <IoEyeOutline /> : <IoEyeOffOutline />}
                    </span>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-neon-blue transition duration-300 ease-in-out disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-lg tracking-wider transform hover:scale-105"
            >
                {isLoading ? '>>> YÜKLƏNİR ...' : '>>> GİRİŞ'}
            </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-gray-500">
            Hesabınız yoxdur? <span 
                className="text-blue-400 hover:text-purple-400 font-bold cursor-pointer transition" 
                onClick={() => navigation('/register')}
            >
                QEYDİYYAT.
            </span>
        </p>
    </div>
</section>
  );
};

export default Login;
