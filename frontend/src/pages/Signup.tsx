import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'engineer' | 'manager';
  department: string;
  seniority?: 'junior' | 'mid' | 'senior';
  skills?: string[];
  employmentType: 'full-time' | 'part-time';
}

const departments = [
  'Engineering',
  'Product',
  'Design',
  'QA',
  'DevOps',
  'Data Science',
  'Other'
];

const skillOptions = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Go',
  'AWS',
  'Docker',
  'Kubernetes',
  'DevOps',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Project Management'
];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupForm>({
    defaultValues: {
      role: 'engineer',
      employmentType: 'full-time'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupForm) => {
    try {
      const { confirmPassword, ...signupData } = data;
      await signup(signupData);
      // Navigate based on role
      navigate(data.role === 'engineer' ? '/engineer/dashboard' : '/manager/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Join our engineering management platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              id="role"
              className="input mt-1"
              {...register('role', { required: 'Please select a role' })}
            >
              <option value="engineer">Engineer</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="input mt-1"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              className="input mt-1"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              className="input mt-1"
              {...register('department', { required: 'Department is required' })}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          {selectedRole === 'engineer' && (
            <>
              <div>
                <label htmlFor="seniority" className="block text-sm font-medium text-gray-700">
                  Seniority Level
                </label>
                <select
                  id="seniority"
                  className="input mt-1"
                  {...register('seniority', { required: 'Seniority level is required for engineers' })}
                >
                  <option value="">Select Seniority</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                </select>
                {errors.seniority && (
                  <p className="mt-1 text-sm text-red-600">{errors.seniority.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <div className="mt-1 space-y-2">
                  {skillOptions.map(skill => (
                    <label key={skill} className="inline-flex items-center mr-4 mb-2">
                      <input
                        type="checkbox"
                        value={skill}
                        className="form-checkbox h-4 w-4 text-primary-600"
                        {...register('skills', { 
                          required: 'Please select at least one skill',
                          validate: (value) => value && value.length > 0 || 'Please select at least one skill'
                        })}
                      />
                      <span className="ml-2 text-sm text-gray-700">{skill}</span>
                    </label>
                  ))}
                </div>
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  className="input mt-1"
                  {...register('employmentType', { required: 'Employment type is required' })}
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                </select>
                {errors.employmentType && (
                  <p className="mt-1 text-sm text-red-600">{errors.employmentType.message}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input mt-1"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input mt-1"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return "Passwords don't match";
                  }
                },
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup; 