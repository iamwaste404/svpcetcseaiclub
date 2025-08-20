import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Heart, Star, Award, Globe } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Community",
    description: "Building strong connections between students from diverse backgrounds and interests."
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Striving for the highest standards in everything we do, from events to skill development."
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Encouraging students to pursue their interests with enthusiasm and dedication."
  },
  {
    icon: Star,
    title: "Innovation",
    description: "Fostering creativity and new ideas that drive positive change in our community."
  }
];

const achievements = [
  { number: "8+", label: "Active Clubs" },
  { number: "500+", label: "Members" },
  { number: "50+", label: "Events/Year" },
  { number: "100+", label: "Projects" }
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Globe className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-poppins bg-gradient-hero bg-clip-text text-transparent">
            About Coding Club
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Coding Club is a vibrant student initiative designed to connect learners and talents across 
            technology, culture, arts, sports, business, and more. Our mission is to encourage collaboration, 
            creativity, and skill development in a supportive community environment.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-hero p-8 md:p-12 rounded-3xl shadow-elegant mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-foreground mb-6 font-poppins">
              Our Mission
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed">
              To create an inclusive platform where students can explore their passions, develop new skills, 
              and build meaningful connections. We believe that every student has unique talents that deserve 
              to be nurtured and celebrated within a diverse community of learners.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="space-y-4 pt-6">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold font-poppins">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 bg-gradient-secondary rounded-2xl shadow-card">
                <div className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-2">
                  {achievement.number}
                </div>
                <div className="text-secondary-foreground/80 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 font-poppins">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="space-y-4 pt-0">
                <Award className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-semibold font-poppins">Skill Development</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Participate in workshops, seminars, and hands-on projects that enhance your technical 
                  and soft skills. Learn from industry experts and experienced mentors.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="space-y-4 pt-0">
                <Users className="w-12 h-12 text-secondary mb-4" />
                <h3 className="text-2xl font-semibold font-poppins">Networking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with like-minded peers, build lasting friendships, and create professional 
                  networks that will benefit you throughout your career.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="space-y-4 pt-0">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold font-poppins">Leadership</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Take on leadership roles, organize events, and develop management skills that 
                  will serve you well in your future endeavors.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-elegant transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="space-y-4 pt-0">
                <Star className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-2xl font-semibold font-poppins">Recognition</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Showcase your talents, win competitions, and gain recognition for your 
                  achievements within the college community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-accent p-8 rounded-2xl shadow-elegant">
            <h2 className="text-2xl font-bold text-accent-foreground mb-4 font-poppins">
              Ready to Join Our Community?
            </h2>
            <p className="text-accent-foreground/90 mb-6 max-w-2xl mx-auto">
              Be part of something bigger. Join Coding Club today and start your journey 
              of growth, learning, and connection.
            </p>
            <Button asChild variant="outline" size="lg" className="border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
              <a href="/register">Get Started Today</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;