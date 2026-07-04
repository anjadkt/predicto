import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { validateField } from '../utils/validateFields';
import { registerUser } from '../services/auth.service';
import { uploadToCloud } from '../utils/uploadToCloudnary';
import ButtonLoading from '../components/ButtonLoading';

function Register() {

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        password: ''
    });

    const [file, setFile] = useState<File | null>(null);

    const [errors, setErrors] = useState({
        name: '',
        number: '',
        password: ''
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        setFile(selectedFile);
        setAvatarPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nameError = validateField('name', formData.name);
        const numberError = validateField('number', formData.number);
        const passwordError = validateField('password', formData.password);

        if (nameError || numberError || passwordError) {
            setErrors({
                name: nameError,
                number: numberError,
                password: passwordError
            });
            return;
        }

        setIsSubmitting(true);
        try {

            const avatar = await uploadToCloud(file!);

            await registerUser({ ...formData, avatar });

            navigate("/login");

        } catch (error: any) {

            const errorObj = {
                name: "",
                number: "",
                password: ""
            }
            switch (error.response?.status) {
                case 400:
                    errorObj.number = "Invalid number or password!"
                    break;
                case 409:
                    errorObj.number = "User already exist!"
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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans py-12">
            {/* Background glowing stadium lights */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="relative w-full max-w-md px-6 lg:px-8 z-10">

                {/* Form Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center justify-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div
                                onClick={handleClick}
                                className="group relative w-24 h-24 cursor-pointer overflow-hidden rounded-full bg-slate-900/60 ring-2 ring-white/20 shadow-inner transition-all duration-300 hover:ring-emerald-500"
                            >
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <svg
                                            className="h-10 w-10 text-slate-400 transition-colors group-hover:text-emerald-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="text-xs font-medium text-white">
                                        {avatarPreview ? "Change" : "Upload"}
                                    </span>
                                </div>
                            </div>

                            {file && (
                                <p className="mt-2 max-w-[150px] truncate text-xs text-slate-400">
                                    {file.name}
                                </p>
                            )}
                        </div>

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-300">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className={`block w-full rounded-xl border-0 py-3 px-4 bg-slate-900/60 text-white shadow-inner ring-1 ring-inset ${errors.name ? 'ring-red-500 focus:ring-red-500' : 'ring-white/20 focus:ring-emerald-500'} focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-300 outline-none`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.name}</p>
                                )}
                            </div>
                        </div>

                        {/* Number Field */}
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium leading-6 text-slate-300">
                                Mobile Number
                            </label>
                            <div className="mt-1 relative">
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
                                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.number}</p>
                                )}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
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
                                    <p className="mt-1 text-sm text-red-400 animate-pulse">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Create Account Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-4 py-3.5 text-sm font-semibold leading-6 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                {isSubmitting ? <ButtonLoading /> : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-emerald-400 hover:text-emerald-300 transition-colors">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;