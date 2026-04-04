import { useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Input from "../../components/Input";
import Button from "../../components/Button";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async  (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }


    // For now storing locally
     try {
      const res = await window.electronAPI.signup({
        name,
        email,
        password
      });

      if (res.success) {
        toast.success("Account Created Successfully 🚀");
        navigate("/");
      } else {
        toast.error(res.message || "Signup failed");
      }

    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }

   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: "#1e3a8a" }}
          >
            <HiOutlineDocumentText size={28} />
          </div>
        </div>

        <h2 className="text-3xl font-medium text-center text-gray-900 mb-1 tracking-tight">
          Create Your Account
        </h2>

        <p className="text-gray-400 text-center text-sm mb-8">
          Sign up for Invoice Generator
        </p>

        <form onSubmit={handleSignup} className="space-y-5">

          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={FiUser}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FiMail}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FiLock}
            rightIcon={showPassword ? FiEyeOff : FiEye}
            onRightIconClick={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={FiLock}
            rightIcon={showConfirmPassword ? FiEyeOff : FiEye}
            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <Button type="submit" fullWidth>
            Sign Up <FiArrowRight />
          </Button>

        </form>

        <div className="my-6 border-t border-gray-200" />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="font-bold text-gray-900 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default SignUp;