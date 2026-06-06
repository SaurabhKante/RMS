import { useState } from "react";
import { 
  ArrowRight, 
  BarChart, 
  Eye, 
  EyeOff, 
  Rocket 
} from "lucide-react";


const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-900 to-teal-700 relative overflow-hidden text-white p-16 items-center">
        {/* Blur Effect */}

        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-orange-400/20 blur-[120px] rounded-full"></div>

        <div className="relative z-10 max-w-xl">
          {/* Logo */}

          <div className="w-16 h-16 bg-white rounded-2xl mb-8"></div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Elevate Your Restaurant
            <br />
            Operations with Hotelix.
          </h1>

          <p className="text-lg text-gray-200 leading-8 mb-10">
            Join thousands of high-performing restaurants that use our RMS to
            streamline workflows, manage inventory, and boost guest
            satisfaction.
          </p>

          {/* Card 1 */}

          <div className="flex gap-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mb-5">
            <div className="text-2xl mt-1">
              <Rocket />
            </div>

            <div>
              <h3 className="font-bold text-lg mb-1">Fast Deployment</h3>

              <p className="text-sm text-gray-200 leading-6">
                Get your system up and running in less than 24 hours with guided
                onboarding.
              </p>
            </div>
          </div>

          {/* Card 2 */}

          <div className="flex gap-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
            <div className="text-2xl mt-1">
              <BarChart />
            </div>

            <div>
              <h3 className="font-bold text-lg mb-1">
                Real-time Analytics
              </h3>

              <p className="text-sm text-gray-200 leading-6">
                Track sales, waste, and staff performance with live dashboard
                updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>

          <p className="text-gray-500 mb-8">
            Start your 14-day free trial. No credit card required.
          </p>

          <form className="space-y-5">
            {/* Restaurant */}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                RESTAURANT NAME
              </label>

              <input
                type="text"
                placeholder="Enter restaurant name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            {/* Manager */}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                MANAGER NAME
              </label>

              <input
                type="text"
                placeholder="Enter manager's full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            {/* Row */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  PHONE NUMBER
                </label>

                <input
                  type="text"
                  placeholder="Enter 10-digit mobile number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-700"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Checkbox */}

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" />

              <p className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/" className="text-teal-800 font-semibold">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="/" className="text-teal-800 font-semibold">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Button */}

            <button className="w-full bg-teal-900 hover:bg-teal-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all">
              Create Account
              <ArrowRight />
            </button>

            {/* Login */}

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-gray-500">
                Already have an account?
                <a
                  href="/"
                  className="text-teal-900 font-bold ml-1 hover:underline"
                >
                  Back to Login
                </a>
              </p>
            </div>
          </form>

          <footer className="text-center text-sm text-gray-400 mt-10">
            © 2026 Hotelix Technologies. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;