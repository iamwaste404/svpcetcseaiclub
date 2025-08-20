import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Clock, Users } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins bg-gradient-hero bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our clubs or events? Want to collaborate or need support? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="space-y-6 pt-0">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold font-poppins">Contact Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">organizer@codingclub.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-secondary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+91-9876543210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-1" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">XYZ College Campus<br />Main Building, Room 201</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Office Hours</p>
                      <p className="text-muted-foreground">Mon-Fri: 9:00 AM - 5:00 PM<br />Sat: 10:00 AM - 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary text-secondary-foreground">
              <CardContent className="pt-0">
                <h3 className="text-lg font-semibold mb-4 font-poppins">Quick Response</h3>
                <p className="text-secondary-foreground/90 mb-4">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
                <p className="text-sm text-secondary-foreground/80">
                  For urgent matters, please call us directly or visit our office during office hours.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-poppins">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your inquiry, suggestions, or how we can help you..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="min-h-[150px] transition-all duration-200 focus:shadow-glow"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full text-lg py-6"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We respect your privacy and will never share your information with third parties.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 hover:shadow-card transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-0">
                <h3 className="font-semibold mb-2">How do I join a club?</h3>
                <p className="text-muted-foreground">
                  Simply fill out our registration form, select your preferred club, and you'll receive a confirmation email within 24 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-card transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-0">
                <h3 className="font-semibold mb-2">Can I join multiple clubs?</h3>
                <p className="text-muted-foreground">
                  Yes! You can join multiple clubs, but we recommend starting with one to fully engage before expanding.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-card transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-0">
                <h3 className="font-semibold mb-2">Are there any membership fees?</h3>
                <p className="text-muted-foreground">
                  Basic membership is free for all students. Some special events or workshops may have nominal fees.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-card transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-0">
                <h3 className="font-semibold mb-2">How often do clubs meet?</h3>
                <p className="text-muted-foreground">
                  Most clubs meet weekly or bi-weekly. Specific schedules are shared upon joining each club.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;