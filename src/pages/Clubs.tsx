import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Users, Leaf, Gamepad2, Briefcase, Palette, Camera, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const clubs = [
  {
    id: 1,
    name: "Technology, Coding & Skill Development Club",
    description: "Learn programming, web development, AI, and cutting-edge technologies. Build projects and enhance your technical skills.",
    icon: Code,
    color: "from-blue-500 to-purple-600",
    members: 120,
  },
  {
    id: 2,
    name: "General Club",
    description: "A versatile community for general discussions, networking, and collaborative learning across various disciplines.",
    icon: Users,
    color: "from-green-500 to-teal-600",
    members: 200,
  },
  {
    id: 3,
    name: "Eco-Swachh Bharat Club",
    description: "Promote environmental awareness, sustainability, and cleanliness initiatives in our campus and community.",
    icon: Leaf,
    color: "from-green-600 to-emerald-600",
    members: 85,
  },
  {
    id: 4,
    name: "Yoga, Gaming & Sports Club",
    description: "Balance mind and body through yoga, competitive gaming, and various sports activities and tournaments.",
    icon: Gamepad2,
    color: "from-orange-500 to-red-600",
    members: 150,
  },
  {
    id: 5,
    name: "Business Management Club",
    description: "Develop entrepreneurship skills, learn business strategies, and network with industry professionals.",
    icon: Briefcase,
    color: "from-indigo-500 to-blue-600",
    members: 95,
  },
  {
    id: 6,
    name: "Arts & Cultural Club",
    description: "Express creativity through music, dance, theater, literature, and celebrate diverse cultural traditions.",
    icon: Palette,
    color: "from-pink-500 to-purple-600",
    members: 110,
  },
  {
    id: 7,
    name: "Photography, Short Film & Videography Club",
    description: "Capture moments, tell stories through visual media, and master the art of photography and filmmaking.",
    icon: Camera,
    color: "from-yellow-500 to-orange-600",
    members: 75,
  },
  {
    id: 8,
    name: "Organization Club",
    description: "Learn event management, organizational skills, and coordinate various campus activities and initiatives.",
    icon: Settings,
    color: "from-gray-500 to-slate-600",
    members: 65,
  },
];

const Clubs = () => {
  const [user, setUser] = useState<any>(null);
  const [userClubs, setUserClubs] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Get user's club memberships
        const { data } = await supabase
          .from('user_clubs')
          .select('club_id')
          .eq('user_id', session.user.id);
        
        if (data) {
          setUserClubs(data.map(item => item.club_id));
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        setUserClubs([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to join a club.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(clubId);
    
    try {
      const { error } = await supabase
        .from('user_clubs')
        .insert({
          user_id: user.id,
          club_id: clubId
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already a Member",
            description: "You are already a member of this club!",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setUserClubs([...userClubs, clubId]);
        toast({
          title: "Successfully Joined!",
          description: "Welcome to the club! Check your dashboard for updates.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    if (!user) return;

    setLoading(clubId);
    
    try {
      const { error } = await supabase
        .from('user_clubs')
        .delete()
        .eq('user_id', user.id)
        .eq('club_id', clubId);

      if (error) throw error;

      setUserClubs(userClubs.filter(id => id !== clubId));
      toast({
        title: "Left Club",
        description: "You have successfully left the club.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins bg-gradient-hero bg-clip-text text-transparent">
            Explore Our Clubs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find your passion and join a community of like-minded students. Each club offers unique opportunities for growth, learning, and connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => {
            const Icon = club.icon;
            return (
              <Card key={club.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${club.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">{club.members}</div>
                      <div className="text-xs text-muted-foreground">members</div>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold mb-2 font-poppins group-hover:text-primary transition-colors">
                      {club.name}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {club.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {user ? (
                    userClubs.includes(club.id.toString()) ? (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => handleLeaveClub(club.id.toString())}
                        disabled={loading === club.id.toString()}
                      >
                        {loading === club.id.toString() ? "Leaving..." : "Leave Club"}
                      </Button>
                    ) : (
                      <Button 
                        variant="club" 
                        className="w-full group-hover:shadow-glow"
                        onClick={() => handleJoinClub(club.id.toString())}
                        disabled={loading === club.id.toString()}
                      >
                        {loading === club.id.toString() ? "Joining..." : "Join This Club"}
                      </Button>
                    )
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => navigate("/auth")}
                    >
                      Login to Join
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-hero p-8 rounded-2xl shadow-elegant">
            <h2 className="text-2xl font-bold text-primary-foreground mb-4 font-poppins">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
              Join our community today and be part of something amazing. Register now to access all clubs and events.
            </p>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <a href={user ? "/dashboard" : "/auth"}>{user ? "Go to Dashboard" : "Complete Registration"}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clubs;