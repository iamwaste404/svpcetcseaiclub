import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus, Phone, GraduationCap, Calendar, Users } from "lucide-react";
import svpcetLogo from "@/assets/svpcet-logo.jpeg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [branches, setBranches] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
    
    // Load dropdown data
    const loadData = async () => {
      const [branchesRes, yearsRes, clubsRes] = await Promise.all([
        supabase.from('branches').select('*'),
        supabase.from('years').select('*'),
        supabase.from('clubs').select('*')
      ]);
      
      if (branchesRes.data) setBranches(branchesRes.data);
      if (yearsRes.data) setYears(yearsRes.data);
      if (clubsRes.data) setClubs(clubsRes.data);
    };
    
    loadData();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              roll_number: rollNumber,
              phone_number: phoneNumber,
              branch: branch,
              year: year,
              selected_club_id: selectedClub
            }
          }
        });
        
        if (!error && data.user) {
          // Update the profile with additional data
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              roll_number: rollNumber,
              phone_number: phoneNumber,
              branch: branch,
              year: year,
              selected_club_id: selectedClub || null
            })
            .eq('user_id', data.user.id);
            
          if (profileError) {
            console.error('Profile update error:', profileError);
          }
        }

        if (error) throw error;

        toast({
          title: "Registration Successful!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/20 mx-auto mb-4">
            <img src={svpcetLogo} alt="SVPCET Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Your Account"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-white text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-white text-sm">
                      Roll Number
                    </Label>
                    <Input
                      id="rollNumber"
                      type="text"
                      placeholder="Enter your roll number"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required={!isLogin}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required={!isLogin}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-white text-sm">
                    Branch
                  </Label>
                  <Select value={branch} onValueChange={setBranch} required={!isLogin}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Choose your branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {branches.map((branchItem) => (
                        <SelectItem 
                          key={branchItem.id} 
                          value={branchItem.code}
                          className="text-white hover:bg-slate-700"
                        >
                          {branchItem.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white text-sm">
                    Year
                  </Label>
                  <Select value={year} onValueChange={setYear} required={!isLogin}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {years.map((yearItem) => (
                        <SelectItem 
                          key={yearItem.id} 
                          value={yearItem.year_value}
                          className="text-white hover:bg-slate-700"
                        >
                          {yearItem.year_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="club" className="text-white text-sm">
                    Select One Club
                  </Label>
                  <Select value={selectedClub} onValueChange={setSelectedClub}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Choose your club" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {clubs.map((club) => (
                        <SelectItem 
                          key={club.id} 
                          value={club.id}
                          className="text-white hover:bg-slate-700"
                        >
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
              </Button>

              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  {isLogin ? "Create new account" : "Login here"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;