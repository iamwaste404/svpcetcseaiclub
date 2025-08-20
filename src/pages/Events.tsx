import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Trophy, Camera, Code, Palette } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Hackathon 2025",
    date: "March 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Tech Lab, Building A",
    club: "Technology Club",
    description: "24-hour coding challenge to build innovative solutions. Great prizes and networking opportunities await.",
    attendees: 150,
    maxAttendees: 200,
    icon: Code,
    color: "bg-blue-500",
    badge: "Featured"
  },
  {
    id: 2,
    title: "Photography Contest",
    date: "March 20, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Campus Grounds",
    club: "Photography Club",
    description: "Capture the beauty of our campus. Theme: 'Student Life'. Winners get professional camera equipment.",
    attendees: 45,
    maxAttendees: 100,
    icon: Camera,
    color: "bg-purple-500",
    badge: "Open"
  },
  {
    id: 3,
    title: "Business Pitch Competition",
    date: "March 25, 2025",
    time: "2:00 PM - 5:00 PM",
    location: "Auditorium",
    club: "Business Management Club",
    description: "Present your startup ideas to industry experts. Funding opportunities for winning teams.",
    attendees: 80,
    maxAttendees: 120,
    icon: Trophy,
    color: "bg-green-500",
    badge: "Competition"
  },
  {
    id: 4,
    title: "Cultural Festival",
    date: "April 2, 2025",
    time: "6:00 PM - 10:00 PM",
    location: "Main Campus",
    club: "Arts & Cultural Club",
    description: "Celebrate diversity through music, dance, and art. Food stalls and live performances included.",
    attendees: 300,
    maxAttendees: 500,
    icon: Palette,
    color: "bg-pink-500",
    badge: "Festival"
  },
  {
    id: 5,
    title: "Gaming Tournament",
    date: "April 5, 2025",
    time: "1:00 PM - 8:00 PM",
    location: "Gaming Zone",
    club: "Gaming & Sports Club",
    description: "Multi-game tournament featuring popular titles. Great prizes and gaming gear to be won.",
    attendees: 120,
    maxAttendees: 150,
    icon: Trophy,
    color: "bg-orange-500",
    badge: "Tournament"
  },
  {
    id: 6,
    title: "Environmental Awareness Drive",
    date: "April 10, 2025",
    time: "8:00 AM - 12:00 PM",
    location: "Local Community",
    club: "Eco-Swachh Bharat Club",
    description: "Tree plantation and cleanliness drive in the local community. Make a positive impact.",
    attendees: 60,
    maxAttendees: 100,
    icon: Users,
    color: "bg-green-600",
    badge: "Community"
  }
];

const Events = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins bg-gradient-hero bg-clip-text text-transparent">
            Upcoming Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join exciting events, competitions, and workshops. Build skills, make connections, and have fun with your fellow students.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map((event) => {
            const Icon = event.icon;
            const attendancePercentage = (event.attendees / event.maxAttendees) * 100;
            
            return (
              <Card key={event.id} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${event.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2">
                          {event.badge}
                        </Badge>
                        <CardTitle className="text-xl font-semibold font-poppins group-hover:text-primary transition-colors">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {event.club}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Registration</span>
                      <span className="font-medium">{event.attendees}/{event.maxAttendees} spots</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${attendancePercentage}%` }}
                      />
                    </div>
                  </div>

                  <Button 
                    variant={attendancePercentage >= 90 ? "outline" : "club"} 
                    className="w-full group-hover:shadow-glow"
                    disabled={attendancePercentage >= 100}
                  >
                    {attendancePercentage >= 100 ? "Event Full" : "Register for Event"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-secondary p-8 rounded-2xl shadow-elegant">
            <h2 className="text-2xl font-bold text-secondary-foreground mb-4 font-poppins">
              Don't Miss Out!
            </h2>
            <p className="text-secondary-foreground/90 mb-6 max-w-2xl mx-auto">
              Register for clubs to get early access to exclusive events and competitions.
            </p>
            <Button asChild variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
              <a href="/register">Join a Club</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;