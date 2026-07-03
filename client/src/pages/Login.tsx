import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { validateField } from '../utils/validateFields';
import { loginUser } from '../services/auth.service';
import { useAuth } from '../hooks/UseAuth';

function Login() {

    const [formData, setFormData] = useState({
        number: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        number: '',
        password: ''
    });

    const { login } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numberError = validateField('number', formData.number);
        const passwordError = validateField('password', formData.password);

        if (numberError || passwordError) {
            setErrors({ number: numberError, password: passwordError });
            return;
        }

        setIsSubmitting(true);

        try {

            await loginUser(formData);
            await login();
            navigate("/root");

        } catch (error: any) {

            const errorObj = { number: "", password: "" }

            switch (error.response?.status) {
                case 400:
                    errorObj.number = "Invalid number or password"
                    break;
                case 404:
                    errorObj.number = "User not found!"
                    break;
                case 403:
                    errorObj.number = "User not verified!"
                    break;
                case 406:
                    errorObj.password = "Wrong password!"
                    break;
                default:
                    errorObj.number = "Something went wrong!"
                    break;
            }

            setErrors(errorObj);

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">

            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative w-full max-w-md px-6 py-12 lg:px-8 z-10">
                {/* Form Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>

                        {/* Number Field */}
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium leading-6 text-slate-300">
                                Mobile Number
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="number"
                                    name="number"
                                    type="tel"
                                    required
                                    value={formData.number}
                                    onChange={handleChange}
                                    placeholder="Enter your number"
                                    className={`block w-full rounded-xl border-0 py-3 px-4 bg-slate-900/60 text-white shadow-inner ring-1 ring-inset ${errors.number ? 'ring-red-500 focus:ring-red-500' : 'ring-white/20 focus:ring-emerald-500'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-300 outline-none`}
                                />
                                {errors.number && (
                                    <p className="mt-2 text-sm text-red-400 animate-pulse">{errors.number}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`block w-full rounded-xl border-0 py-3 px-4 bg-slate-900/60 text-white shadow-inner ring-1 ring-inset ${errors.password ? 'ring-red-500 focus:ring-red-500' : 'ring-white/20 focus:ring-emerald-500'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-300 outline-none`}
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-400 animate-pulse">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Login Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                {isSubmitting ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold leading-6 text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;