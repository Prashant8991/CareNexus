import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Phone, 
  User,
  MapPin,
  Clock,
  Heart,
  Shield,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import emergencyIcon from '@assets/generated_images/Emergency_medical_symbol_5e010c1b.png';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

export default function SOS() {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy?: number; timestamp?: number } | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'locating' | 'granted' | 'denied' | 'error'>('idle');
  const [isMedicalDialogOpen, setIsMedicalDialogOpen] = useState(false);
  const [medicalInfo, setMedicalInfo] = useState<{ bloodType: string; allergies: string; emergencyContact: string }>(
    { bloodType: 'O+', allergies: 'Penicillin', emergencyContact: 'John Doe' }
  );
  
  // TODO: Replace with real emergency contacts from user profile
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Amit Kumar', phone: '+91 98765 43210', relationship: 'Spouse', priority: 1 },
    { id: '2', name: 'Priya Sharma', phone: '+91 91234 56789', relationship: 'Parent', priority: 2 },
    { id: '3', name: 'Dr. Mehta', phone: '+91 90123 45678', relationship: 'Doctor', priority: 3 }
  ]);

  const handleEmergencyCall = () => {
    setIsEmergencyActive(true);
    try {
      window.open('tel:101', '_self');
    } catch (_e) {}
    // TODO: Integrate with Twilio for real emergency calls
    // TODO: Send SMS to emergency contacts
    setTimeout(() => setIsEmergencyActive(false), 5000);
  };

  const handleContactEmergency = (contact: EmergencyContact) => {
    console.log(`Calling emergency contact: ${contact.name} - ${contact.phone}`);
    window.open(`tel:${contact.phone}`, '_self');
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        ...newContact,
        priority: emergencyContacts.length + 1
      };
      setEmergencyContacts([...emergencyContacts, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
    }
  };

  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const enableLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocStatus('error');
      return;
    }
    setLocStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude, accuracy, timestamp: pos.timestamp });
        setLocStatus('granted');
      },
      (err) => {
        setLocStatus(err.code === 1 ? 'denied' : 'error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  };

  // Load medical info from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('medicalInfo');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          setMedicalInfo({
            bloodType: parsed.bloodType || 'O+',
            allergies: parsed.allergies || '',
            emergencyContact: parsed.emergencyContact || ''
          });
        }
      }
    } catch (_e) {}
  }, []);

  const saveMedicalInfo = () => {
    try {
      localStorage.setItem('medicalInfo', JSON.stringify(medicalInfo));
    } catch (_e) {}
    setIsMedicalDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <img 
              src={emergencyIcon} 
              alt="Emergency Symbol"
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Emergency SOS
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to emergency services and your emergency contacts. 
            Use responsibly - for real emergencies only.
          </p>
        </div>

        {/* Emergency Status */}
        {isEmergencyActive && (
          <Card className="mb-8 border-destructive bg-destructive/10 animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-destructive animate-bounce" />
                <div className="text-center">
                  <h3 className="font-bold text-destructive text-lg">EMERGENCY SERVICES CONTACTED</h3>
                  <p className="text-destructive/80">Help is on the way. Stay calm and follow emergency operator instructions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Emergency Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Call 101 */}
          <Card className="border-destructive bg-destructive/5">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-destructive-foreground" />
              </div>
              <CardTitle className="text-xl text-destructive">Emergency Services</CardTitle>
              <CardDescription>Call 101 for immediate emergency assistance</CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <Button 
                size="lg"
                variant="destructive"
                onClick={handleEmergencyCall}
                className="w-full text-lg h-14"
                data-testid="button-call-101"
              >
                <Phone className="w-6 h-6 mr-3" />
                CALL 101
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Police • Fire • Medical Emergency
              </p>
            </CardContent>
          </Card>

          {/* Medical Info */}
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Medical Information</CardTitle>
              <CardDescription>Quick access to your medical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Blood Type:</span>
                  <span className="font-medium">{medicalInfo.bloodType || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Allergies:</span>
                  <span className="font-medium">{medicalInfo.allergies || 'None'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Emergency Contact:</span>
                  <span className="font-medium">{medicalInfo.emergencyContact || '—'}</span>
                </div>
              </div>
              <Dialog open={isMedicalDialogOpen} onOpenChange={setIsMedicalDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-edit-medical-info">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Medical Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Medical Information</DialogTitle>
                    <DialogDescription>These details are stored only on your device.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input id="bloodType" value={medicalInfo.bloodType} onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })} placeholder="e.g., O+, A-, B+" />
                    </div>
                    <div>
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input id="allergies" value={medicalInfo.allergies} onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })} placeholder="e.g., Penicillin, Nuts" />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input id="emergencyContact" value={medicalInfo.emergencyContact} onChange={(e) => setMedicalInfo({ ...medicalInfo, emergencyContact: e.target.value })} placeholder="e.g., John Doe (+91 XXXXX XXXXX)" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMedicalDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveMedicalInfo} data-testid="button-save-medical-info">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>People to contact in case of emergency</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddContact(true)}
                data-testid="button-add-contact"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="text-xs">
                      #{contact.priority}
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm"
                    onClick={() => handleContactEmergency(contact)}
                    data-testid={`button-call-${contact.id}`}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRemoveContact(contact.id)}
                    data-testid={`button-remove-${contact.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {emergencyContacts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No emergency contacts added yet</p>
              </div>
            )}

            {/* Add Contact Form */}
            {showAddContact && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-semibold">Add Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="Contact name"
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input 
                      id="relationship"
                      value={newContact.relationship}
                      onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                      placeholder="e.g., Spouse, Parent, Doctor"
                      data-testid="input-contact-relationship"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleAddContact}
                      size="sm"
                      data-testid="button-save-contact"
                    >
                      Save Contact
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAddContact(false)}
                      data-testid="button-cancel-contact"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Location Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Location Services
            </CardTitle>
            <CardDescription>Share your location with emergency services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <h4 className="font-semibold">Current Location</h4>
                <p className="text-sm text-muted-foreground">
                  {locStatus === 'granted' && userLocation
                    ? `Lat ${userLocation.lat.toFixed(5)}, Lng ${userLocation.lng.toFixed(5)} • ±${Math.round(userLocation.accuracy || 0)}m`
                    : locStatus === 'locating'
                    ? 'Locating…'
                    : 'Enable location sharing for faster emergency response'}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={enableLocation} disabled={locStatus === 'locating'} data-testid="button-enable-location">
                {locStatus === 'locating' ? 'Locating…' : 'Enable Location'}
              </Button>
            </div>
            {locStatus === 'denied' && (
              <p className="text-xs text-destructive">Permission denied. Enable location permissions in your browser settings.</p>
            )}
            {locStatus === 'error' && (
              <p className="text-xs text-destructive">Could not fetch your location on this device.</p>
            )}
            {userLocation && (
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.open(`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`, '_blank')}
                >
                  Open in Google Maps
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=hospitals&center=${userLocation.lat},${userLocation.lng}`, '_blank')}
                >
                  Hospitals Near Me
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="border-chart-3 bg-chart-3/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-chart-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Emergency Use Only</h3>
                <p className="text-sm text-muted-foreground">
                  The SOS feature should only be used in real emergencies. Misuse of emergency services can result in serious consequences 
                  and may prevent others from getting help when they need it. If you're experiencing a medical, fire, or police emergency, 
                  don't hesitate to call 101 immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}