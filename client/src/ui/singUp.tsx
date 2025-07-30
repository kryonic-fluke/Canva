import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema,type SignupFormValues } from '../lib/schemas';
import { useSignUp } from '../hooks/useSignup';

const Signup = () => {
    const { mutate: performSignup, isPending, error: mutationError } = useSignUp();

    // 2. Set up react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema), // Use Zod for validation
    });

    // 3. This function is called by react-hook-form on successful validation
    const onSubmit = (data: SignupFormValues) => {
        performSignup(data); // Call our mutation
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Your Account</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                        {...register('email')}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Password</label>
                    <input
                        {...register('password')}
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                {mutationError && <p className="text-red-500 text-center mb-4">{mutationError.message}</p>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isPending ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default Signup;