import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Calendar, Users, Award } from "lucide-react";

// Mock gallery data - in a real app, this would come from an API
const galleryItems = [
  {
    id: 1,
    title: "Tech Hackathon 2024 Winners",
    date: "December 2024",
    club: "Technology Club",
    type: "image",
    attendees: 200,
    description: "Amazing projects showcased at our annual hackathon event.",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Cultural Festival Highlights",
    date: "November 2024",
    club: "Arts & Cultural Club",
    type: "video",
    attendees: 500,
    description: "Celebrating diversity through music, dance, and art.",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Photography Workshop",
    date: "October 2024",
    club: "Photography Club",
    type: "image",
    attendees: 75,
    description: "Students learning the art of professional photography.",
    thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Business Pitch Competition",
    date: "October 2024",
    club: "Business Management Club",
    type: "video",
    attendees: 120,
    description: "Innovative startup ideas presented by our talented students.",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Environmental Drive Success",
    date: "September 2024",
    club: "Eco-Swachh Bharat Club",
    type: "image",
    attendees: 100,
    description: "Community cleanup and tree plantation initiative.",
    thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Gaming Tournament Finals",
    date: "September 2024",
    club: "Gaming & Sports Club",
    type: "video",
    attendees: 150,
    description: "Intense gaming competition with amazing prizes.",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&h=300&fit=crop",
  }
];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-poppins bg-gradient-hero bg-clip-text text-transparent">
            Event Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Relive the amazing moments from our past events, competitions, and workshops. 
            See the creativity, collaboration, and fun that makes our community special.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button variant="default" size="sm">All Events</Button>
          <Button variant="outline" size="sm">Technology</Button>
          <Button variant="outline" size="sm">Cultural</Button>
          <Button variant="outline" size="sm">Business</Button>
          <Button variant="outline" size="sm">Photography</Button>
          <Button variant="outline" size="sm">Sports</Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play button for videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                )}

                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant={item.type === "video" ? "destructive" : "secondary"}>
                    {item.type}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold font-poppins group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{item.attendees}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      {item.club}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Events
          </Button>
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <div className="bg-gradient-primary p-8 rounded-2xl shadow-elegant">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-foreground mb-4 font-poppins">
                Event Statistics
              </h2>
              <p className="text-primary-foreground/90">
                Our clubs have organized amazing events throughout the year
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary-foreground">25+</div>
                <div className="text-primary-foreground/80">Competitions</div>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary-foreground">1000+</div>
                <div className="text-primary-foreground/80">Participants</div>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary-foreground">50+</div>
                <div className="text-primary-foreground/80">Events</div>
              </div>
              <div className="text-center">
                <Play className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-3xl font-bold text-primary-foreground">100+</div>
                <div className="text-primary-foreground/80">Memories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;