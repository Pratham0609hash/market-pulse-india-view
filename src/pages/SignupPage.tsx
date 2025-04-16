
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const SignupPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    
    if (pass.length >= 8) strength += 1;
    if (pass.match(/[A-Z]/)) strength += 1;
    if (pass.match(/[0-9]/)) strength += 1;
    if (pass.match(/[^A-Za-z0-9]/)) strength += 1;
    
    setPasswordStrength(strength);
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    if (checkPasswordStrength(password) < 3) {
      setError("Password is not strong enough");
      return false;
    }
    
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions");
      return false;
    }
    
    return true;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate signup process
    setTimeout(() => {
      // In a real app, this would be an API call to register the user
      console.log("User registered:", { fullName, email });
      
      // Redirect to login page
      window.location.href = "/login";
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-indigo-800">StockPulse</h1>
          </Link>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Password strength:</span>
                    <span className="text-xs font-medium">
                      {passwordStrength === 0 && "Very weak"}
                      {passwordStrength === 1 && "Weak"}
                      {passwordStrength === 2 && "Medium"}
                      {passwordStrength === 3 && "Strong"}
                      {passwordStrength === 4 && "Very strong"}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength === 0 ? "bg-red-400 w-1/5" :
                        passwordStrength === 1 ? "bg-orange-400 w-2/5" :
                        passwordStrength === 2 ? "bg-yellow-400 w-3/5" :
                        passwordStrength === 3 ? "bg-green-400 w-4/5" :
                        "bg-green-600 w-full"
                      }`}
                    ></div>
                  </div>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1">
                    <li className={password.length >= 8 ? "text-green-600" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={password.match(/[A-Z]/) ? "text-green-600" : ""}>
                      • At least one uppercase letter
                    </li>
                    <li className={password.match(/[0-9]/) ? "text-green-600" : ""}>
                      • At least one number
                    </li>
                    <li className={password.match(/[^A-Za-z0-9]/) ? "text-green-600" : ""}>
                      • At least one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                required
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal cursor-pointer"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;
