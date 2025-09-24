import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Clock,
  Navigation,
  Star,
  Search,
  Filter,
  Heart,
  AlertTriangle
} from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  type: 'general' | 'emergency' | 'urgent-care' | 'specialty';
  hours: string;
  services: string[];
  emergencyRoom: boolean;
}

// TODO: Replace with real hospital data from Google Maps API
const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '+1 (555) 123-4567',
    distance: 1.2,
    rating: 4.5,
    type: 'general',
    hours: '24/7',
    services: ['Emergency Care', 'Surgery', 'Cardiology', 'Pediatrics'],
    emergencyRoom: true
  },
  {
    id: '2',
    name: 'Emergency Medical Center',
    address: '456 Oak Avenue, Midtown',
    phone: '+1 (555) 234-5678',
    distance: 2.1,
    rating: 4.2,
    type: 'emergency',
    hours: '24/7',
    services: ['Emergency Care', 'Trauma Center', 'Critical Care'],
    emergencyRoom: true
  },
  {
    id: '3',
    name: 'QuickCare Urgent Care',
    address: '789 Pine Street, Westside',
    phone: '+1 (555) 345-6789',
    distance: 0.8,
    rating: 4.0,
    type: 'urgent-care',
    hours: '7:00 AM - 10:00 PM',
    services: ['Minor Injuries', 'X-Rays', 'Lab Tests', 'Vaccinations'],
    emergencyRoom: false
  },
  {
    id: '4',
    name: 'Children\'s Medical Center',
    address: '321 Elm Drive, Northside',
    phone: '+1 (555) 456-7890',
    distance: 3.5,
    rating: 4.8,
    type: 'specialty',
    hours: '6:00 AM - 8:00 PM',
    services: ['Pediatrics', 'Pediatric Emergency', 'NICU', 'Child Psychology'],
    emergencyRoom: true
  },
  {
    id: '5',
    name: 'Metro Urgent Care',
    address: '654 Maple Lane, Eastside',
    phone: '+1 (555) 567-8901',
    distance: 1.9,
    rating: 3.8,
    type: 'urgent-care',
    hours: '8:00 AM - 9:00 PM',
    services: ['Walk-in Care', 'Minor Surgery', 'Occupational Health'],
    emergencyRoom: false
  }
];

export default function Hospitals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filteredHospitals = mockHospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || hospital.type === selectedType;
    const matchesEmergency = !emergencyOnly || hospital.emergencyRoom;
    
    return matchesSearch && matchesType && matchesEmergency;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      case 'urgent-care': return 'bg-chart-3 text-white';
      case 'specialty': return 'bg-chart-2 text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'emergency': return 'Emergency';
      case 'urgent-care': return 'Urgent Care';
      case 'specialty': return 'Specialty';
      default: return 'General';
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (address: string) => {
    // TODO: Integrate with Google Maps API for real directions
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Find Nearby Hospitals
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Locate medical facilities near you with real-time information about services, 
            hours, and contact details.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search hospitals, services, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-hospitals"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
                
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="text-sm border rounded-md px-3 py-1 bg-background"
                  data-testid="select-hospital-type"
                >
                  <option value="all">All Types</option>
                  <option value="general">General Hospital</option>
                  <option value="emergency">Emergency Only</option>
                  <option value="urgent-care">Urgent Care</option>
                  <option value="specialty">Specialty Care</option>
                </select>

                <label className="flex items-center space-x-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={emergencyOnly}
                    onChange={(e) => setEmergencyOnly(e.target.checked)}
                    className="rounded"
                    data-testid="checkbox-emergency-only"
                  />
                  <span>Emergency Room only</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover-elevate transition-all duration-200">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Hospital Info */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {hospital.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{hospital.distance} miles away</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-current text-chart-3" />
                            <span>{hospital.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{hospital.hours}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getTypeColor(hospital.type)}>
                          {getTypeLabel(hospital.type)}
                        </Badge>
                        {hospital.emergencyRoom && (
                          <Badge variant="outline" className="border-destructive text-destructive">
                            <Heart className="w-3 h-3 mr-1" />
                            ER
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-muted-foreground">{hospital.address}</p>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Services Available:</h4>
                      <div className="flex flex-wrap gap-2">
                        {hospital.services.map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => handleCall(hospital.phone)}
                      className="w-full"
                      data-testid={`button-call-${hospital.id}`}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Hospital
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => handleDirections(hospital.address)}
                      className="w-full"
                      data-testid={`button-directions-${hospital.id}`}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>

                    {hospital.emergencyRoom && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="w-full"
                        onClick={() => handleCall('911')}
                        data-testid={`button-emergency-${hospital.id}`}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Emergency Call
                      </Button>
                    )}

                    <div className="text-center text-sm text-muted-foreground pt-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{hospital.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No hospitals found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or location</p>
          </div>
        )}

        {/* Location Permission Notice */}
        <Card className="mt-12 border-chart-2 bg-chart-2/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-chart-2 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Location Services</h3>
                <p className="text-sm text-muted-foreground">
                  Enable location services to see more accurate distances and find the nearest medical facilities. 
                  Hospital information is powered by Google Maps and includes real-time data when available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}