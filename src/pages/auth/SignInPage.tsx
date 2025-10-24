import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "../../hooks/useAuth";
import supabase from "../../lib/supabaseClient";

const SignInPage = () => {
  // ==============================
  // If user is already logged in, redirect to home
  // This logic is being repeated in SignIn and SignUp..
  const { session } = useSession();
  if (session) return <Navigate to="/" />;
  // maybe we can create a wrapper component for these pages
  // just like the ./router/AuthProtectedRoute.tsx? up to you.
  // ==============================
  const [status, setStatus] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Logging in...");
    const { error } = await supabase.auth.signInWithPassword({
      email: formValues.email,
      password: formValues.password,
    });
    if (error) {
      alert(error.message);
    }
    setStatus("");
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 px-4">
  <div className="text-center mb-8">
    <h1 className="text-5xl font-bold text-white">Spotly</h1>
  </div>

  <form 
    className="main-container flex flex-col items-center space-y-4 w-full max-w-sm bg-gray-800 p-6 rounded-lg shadow-md"
    onSubmit={handleSubmit}
  >
    <h1 className="header-text text-2xl font-semibold text-white">Sign In</h1>

    <input
      name="email"
      onChange={handleInputChange}
      type="email"
      placeholder="Email"
      className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
    />
    <input
      name="password"
      onChange={handleInputChange}
      type="password"
      placeholder="Password"
      className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <button
      type="submit"
      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
    >
      Login
    </button>

    <Link className="auth-link text-sm text-green-400 hover:underline" to="/auth/sign-up">
      Don't have an account? Sign Up
    </Link>

    {status && <p className="text-red-400 text-sm">{status}</p>}
  </form>
</main>
  );
};

export default SignInPage;
