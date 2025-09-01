import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { User, Users, Calendar, Megaphone, LogOut, Plus, Minus, Star, Shield } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  id: string;
  full_name: string;
  roll_number: string | null;
  email: string;
  skills: string | null;
}

interface Club {
  id: string;
  name: string;
  description: string;
  member_count: number;
  is_member?: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  registration_deadline: string | null;
  max_participants: number | null;
  current_participants: number;
  club: { name: string };
  is_registered?: boolean;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  club: { name: string };
}

const Dashboard = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuth = async () => {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            setUser(session.user);
            loadUserData(session.user.id);
          } else {
            navigate("/auth");
          }
        }
      );

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
      } else {
        navigate("/auth");
      }

      return () => subscription.unsubscribe();
    };

    setupAuth();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setIsAdmin(!!adminData);

      // Load clubs with membership status
      const { data: clubsData } = await supabase
        .from("clubs")
        .select(`
          *,
          user_clubs!inner(user_id)
        `);

      const { data: userClubsData } = await supabase
        .from("user_clubs")
        .select("club_id")
        .eq("user_id", userId);

      const userClubIds = userClubsData?.map(uc => uc.club_id) || [];

      const { data: allClubsData } = await supabase
        .from("clubs")
        .select("*")
        .order("name");

      const clubsWithMembership = allClubsData?.map(club => ({
        ...club,
        is_member: userClubIds.includes(club.id)
      })) || [];

      setClubs(clubsWithMembership);

      // Load events for user's clubs
      if (userClubIds.length > 0) {
        const { data: eventsData } = await supabase
          .from("events")
          .select(`
            *,
            clubs!inner(name),
            event_registrations(user_id)
          `)
          .in("club_id", userClubIds)
          .gte("event_date", new Date().toISOString())
          .order("event_date");

        const eventsWithRegistration = eventsData?.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          event_date: event.event_date,
          registration_deadline: event.registration_deadline,
          max_participants: event.max_participants,
          current_participants: event.current_participants,
          club: { name: event.clubs.name },
          is_registered: event.event_registrations?.some((reg: any) => reg.user_id === userId) || false
        })) || [];

        setEvents(eventsWithRegistration);

        // Load announcements for user's clubs
        const { data: announcementsData } = await supabase
          .from("announcements")
          .select(`
            *,
            clubs!inner(name)
          `)
          .in("club_id", userClubIds)
          .order("created_at", { ascending: false })
          .limit(10);

        const formattedAnnouncements = announcementsData?.map(announcement => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          created_at: announcement.created_at,
          club: { name: announcement.clubs.name }
        })) || [];

        setAnnouncements(formattedAnnouncements);
      }

    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_clubs")
        .insert({ user_id: user.id, club_id: clubId });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have successfully joined the club.",
      });

      // Reload data
      loadUserData(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join club",
        variant: "destructive",
      });
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_clubs")
        .delete()
        .eq("user_id", user.id)
        .eq("club_id", clubId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have left the club.",
      });

      // Reload data
      loadUserData(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave club",
        variant: "destructive",
      });
    }
  };

  const handleEventRegistration = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ user_id: user.id, event_id: eventId });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have registered for the event.",
      });

      // Reload data
      loadUserData(user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-poppins mb-2">
              Welcome back, {profile?.full_name || user?.email}! 👋
            </h1>
            <p className="text-muted-foreground">Manage your clubs, events, and stay updated with announcements.</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button asChild variant="hero" size="sm">
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Panel
                </Link>
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-elegant border-border/50 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number</p>
                  <p className="font-medium">{profile?.roll_number || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Skills</p>
                  <p className="font-medium">{profile?.skills || "Not set"}</p>
                </div>
              </CardContent>
            </Card>

            {/* My Clubs */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  My Clubs ({clubs.filter(c => c.is_member).length})
                </CardTitle>
                <CardDescription>Clubs you are a member of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clubs.filter(club => club.is_member).map((club) => (
                    <div key={club.id} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{club.name}</h4>
                        <p className="text-xs text-muted-foreground">{club.member_count} members</p>
                      </div>
                      <Button
                        onClick={() => handleLeaveClub(club.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {clubs.filter(club => !club.is_member).length > 0 && (
                    <div className="pt-3 border-t border-border/50">
                      <p className="text-sm font-medium mb-2">Available Clubs</p>
                      {clubs.filter(club => !club.is_member).slice(0, 3).map((club) => (
                        <div key={club.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{club.name}</h4>
                            <p className="text-xs text-muted-foreground">{club.member_count} members</p>
                          </div>
                          <Button
                            onClick={() => handleJoinClub(club.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events and Announcements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Events */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Events ({events.length})
                </CardTitle>
                <CardDescription>Events from your joined clubs</CardDescription>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.club.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(event.event_date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {event.is_registered ? (
                              <Badge variant="secondary">
                                <Star className="w-3 h-3 mr-1" />
                                Registered
                              </Badge>
                            ) : (
                              <Button
                                onClick={() => handleEventRegistration(event.id)}
                                variant="hero"
                                size="sm"
                              >
                                Register
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        {event.max_participants && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {event.current_participants}/{event.max_participants} participants
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming events from your clubs</p>
                    <p className="text-sm text-muted-foreground">Join more clubs to see events!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="shadow-elegant border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Latest Announcements ({announcements.length})
                </CardTitle>
                <CardDescription>Recent updates from your clubs</CardDescription>
              </CardHeader>
              <CardContent>
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <div className="text-xs text-muted-foreground">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{announcement.club.name}</p>
                        <p className="text-sm">{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No announcements from your clubs</p>
                    <p className="text-sm text-muted-foreground">Join clubs to stay updated!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;