import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, User, Hash, Users, Star } from "lucide-react";

const clubs = [
  "Technology, Coding & Skill Development Club",
  "General Club", 
  "Eco-Swachh Bharat Club",
  "Yoga, Gaming & Sports Club",
  "Business Management Club",
  "Arts & Cultural Club",
  "Photography, Short Film & Videography Club",
  "Organization Club"
];

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    email: "",
    password: "",
    selectedClub: "",
    skills: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.selectedClub) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Success message
    toast({
      title: "Registration Successful!",
      description: `Welcome to ${formData.selectedClub}! Check your email for confirmation.`,
    });

    // Reset form
    setFormData({
      fullName: "",
      rollNumber: "",
      email: "",
      password: "",
      selectedClub: "",
      skills: ""
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-poppins bg-gradient-hero bg-clip-text text-transparent">
              Join Coding Club
            </h1>
            <p className="text-xl text-muted-foreground">
              Start your journey with us and become part of an amazing community
            </p>
          </div>

          <Card className="shadow-elegant border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-poppins">Registration Form</CardTitle>
              <CardDescription>
                Fill in your details to join your preferred club and start participating in events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className="transition-all duration-200 focus:shadow-glow"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Roll Number / Student ID
                    </Label>
                    <Input
                      id="rollNumber"
                      type="text"
                      placeholder="Enter your roll number"
                      value={formData.rollNumber}
                      onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                      className="transition-all duration-200 focus:shadow-glow"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="transition-all duration-200 focus:shadow-glow"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="transition-all duration-200 focus:shadow-glow"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Select Club *
                  </Label>
                  <Select value={formData.selectedClub} onValueChange={(value) => handleInputChange("selectedClub", value)}>
                    <SelectTrigger className="transition-all duration-200 focus:shadow-glow">
                      <SelectValue placeholder="Choose your preferred club" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club} value={club}>
                          {club}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Skills & Interests
                  </Label>
                  <Textarea
                    id="skills"
                    placeholder="Tell us about your skills, interests, and what you hope to gain from joining..."
                    value={formData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    className="min-h-[100px] transition-all duration-200 focus:shadow-glow"
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full text-lg py-6"
                >
                  Complete Registration
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  By registering, you agree to participate actively in club activities and follow community guidelines.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;