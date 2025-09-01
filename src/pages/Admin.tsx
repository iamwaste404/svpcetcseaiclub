import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Image, Megaphone, Plus, Edit, Trash2, Upload, LogOut, Shield } from "lucide-react";

interface User {
  id: string;
  email: string;
  full_name: string;
  roll_number: string;
  phone_number: string;
  branch: string;
  year: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  registration_deadline: string;
  max_participants: number;
  current_participants: number;
  photo_urls: string[];
  featured_image: string;
  club_id: string;
  clubs: { name: string };
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  club_id: string;
  clubs: { name: string };
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  
  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    registration_deadline: '',
    max_participants: '',
    club_id: ''
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    club_id: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAuth();
    loadData();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (!adminData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [usersRes, eventsRes, announcementsRes, clubsRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*, clubs(name)').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*, clubs(name)').order('created_at', { ascending: false }),
        supabase.from('clubs').select('*')
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (announcementsRes.data) setAnnouncements(announcementsRes.data);
      if (clubsRes.data) setClubs(clubsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const uploadEventPhotos = async (eventId: string, files: FileList) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = `${eventId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('event-photos')
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from('event-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    });

    return await Promise.all(uploadPromises);
  };

  const handleCreateEvent = async () => {
    try {
      let photoUrls: string[] = [];
      let featuredImage = '';

      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([{
          ...eventForm,
          max_participants: parseInt(eventForm.max_participants),
          event_date: new Date(eventForm.event_date).toISOString(),
          registration_deadline: eventForm.registration_deadline ? new Date(eventForm.registration_deadline).toISOString() : null
        }])
        .select()
        .single();

      if (eventError) throw eventError;

      if (selectedFiles && selectedFiles.length > 0) {
        photoUrls = await uploadEventPhotos(eventData.id, selectedFiles);
        featuredImage = photoUrls[0] || '';

        await supabase
          .from('events')
          .update({ photo_urls: photoUrls, featured_image: featuredImage })
          .eq('id', eventData.id);
      }

      toast({
        title: "Success",
        description: "Event created successfully",
      });

      setEventForm({ title: '', description: '', event_date: '', registration_deadline: '', max_participants: '', club_id: '' });
      setSelectedFiles(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([announcementForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement created successfully",
      });

      setAnnouncementForm({ title: '', content: '', club_id: '' });
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const makeUserAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('admin_roles')
        .insert([{ user_id: userId, role: 'admin' }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User granted admin privileges",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">SVPCET Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user?.email}</p>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Announcements
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.roll_number}</TableCell>
                          <TableCell>{user.branch}</TableCell>
                          <TableCell>{user.year}</TableCell>
                          <TableCell>{user.phone_number}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => makeUserAdmin(user.id)}
                              size="sm"
                              variant="outline"
                            >
                              Make Admin
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Management */}
          <TabsContent value="events">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventTitle">Event Title</Label>
                      <Input
                        id="eventTitle"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventClub">Club</Label>
                      <Select value={eventForm.club_id} onValueChange={(value) => setEventForm({...eventForm, club_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select club" />
                        </SelectTrigger>
                        <SelectContent>
                          {clubs.map((club) => (
                            <SelectItem key={club.id} value={club.id}>
                              {club.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="eventDesc">Description</Label>
                    <Textarea
                      id="eventDesc"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      placeholder="Enter event description"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input
                        id="eventDate"
                        type="datetime-local"
                        value={eventForm.event_date}
                        onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="regDeadline">Registration Deadline</Label>
                      <Input
                        id="regDeadline"
                        type="datetime-local"
                        value={eventForm.registration_deadline}
                        onChange={(e) => setEventForm({...eventForm, registration_deadline: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={eventForm.max_participants}
                        onChange={(e) => setEventForm({...eventForm, max_participants: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="eventPhotos">Event Photos</Label>
                    <Input
                      id="eventPhotos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setSelectedFiles(e.target.files)}
                    />
                  </div>

                  <Button onClick={handleCreateEvent} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Events List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Club</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Participants</TableHead>
                          <TableHead>Photos</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {events.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.title}</TableCell>
                            <TableCell>{event.clubs?.name}</TableCell>
                            <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {event.current_participants}/{event.max_participants}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {event.photo_urls?.length || 0} photos
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setEditingEvent(event)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteEvent(event.id)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Photos Management */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Event Photos Gallery</CardTitle>
                <CardDescription>Manage all event photos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {events.map((event) => 
                    event.photo_urls?.map((url, index) => (
                      <div key={`${event.id}-${index}`} className="relative group">
                        <img
                          src={url}
                          alt={`${event.title} photo ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <p className="text-sm font-medium">{event.title}</p>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="mt-2"
                              onClick={() => {
                                // Delete photo logic here
                                const updatedUrls = event.photo_urls?.filter((_, i) => i !== index);
                                supabase
                                  .from('events')
                                  .update({ photo_urls: updatedUrls })
                                  .eq('id', event.id)
                                  .then(() => loadData());
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Management */}
          <TabsContent value="announcements">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Announcement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="announcementTitle">Title</Label>
                      <Input
                        id="announcementTitle"
                        value={announcementForm.title}
                        onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                        placeholder="Enter announcement title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcementClub">Club</Label>
                      <Select value={announcementForm.club_id} onValueChange={(value) => setAnnouncementForm({...announcementForm, club_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select club" />
                        </SelectTrigger>
                        <SelectContent>
                          {clubs.map((club) => (
                            <SelectItem key={club.id} value={club.id}>
                              {club.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="announcementContent">Content</Label>
                    <Textarea
                      id="announcementContent"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                      placeholder="Enter announcement content"
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleCreateAnnouncement} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Announcements List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{announcement.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {announcement.clubs?.name} • {new Date(announcement.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm">{announcement.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setEditingAnnouncement(announcement)}
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              size="sm"
                              variant="destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;