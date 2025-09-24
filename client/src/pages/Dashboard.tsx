import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HealthCard } from '@/components/HealthCard';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp,
  Heart,
  Activity,
  Calendar,
  Clock,
  Camera,
  MapPin,
  AlertTriangle,
  Plus,
  Eye,
  Download
} from 'lucide-react';

interface HealthMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'good';
}

interface HealthRecord {
  id: string;
  type: 'skin-check' | 'vital-signs' | 'emergency' | 'hospital-visit';
  title: string;
  date: string;
  status: 'normal' | 'warning' | 'emergency';
  summary: string;
}

export default function Dashboard() {
  const [locationStr, navigate] = useLocation();
  const { toast } = useToast();
  // TODO: Replace with real health data from backend
  const [healthMetrics] = useState<HealthMetric[]>([
    { label: 'Blood Pressure', value: '120/80', trend: 'stable', status: 'normal' },
    { label: 'Heart Rate', value: '72 bpm', trend: 'down', status: 'good' },
    { label: 'Weight', value: '165 lbs', trend: 'down', status: 'good' },
    { label: 'Sleep', value: '7.5 hrs', trend: 'up', status: 'good' }
  ]);

  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([
    {
      id: '1',
      type: 'skin-check',
      title: 'Skin Analysis - Facial Mole',
      date: '2024-01-15',
      status: 'normal',
      summary: 'AI analysis shows normal skin condition. Continue monitoring.'
    },
    {
      id: '2',
      type: 'vital-signs',
      title: 'Blood Pressure Reading',
      date: '2024-01-14',
      status: 'warning',
      summary: 'Slightly elevated reading. Consider reducing sodium intake.'
    },
    {
      id: '3',
      type: 'hospital-visit',
      title: 'Annual Checkup',
      date: '2024-01-10',
      status: 'normal',
      summary: 'Routine physical examination. All tests within normal range.'
    },
    {
      id: '4',
      type: 'emergency',
      title: 'Emergency Contact Used',
      date: '2024-01-05',
      status: 'emergency',
      summary: 'Emergency contact John Doe was notified during SOS activation.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-chart-2';
      case 'warning': return 'text-chart-3';
      case 'emergency': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-chart-2 text-white';
      case 'warning': return 'bg-chart-3 text-white';
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-chart-2" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-chart-3 transform rotate-180" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'skin-check': return Camera;
      case 'vital-signs': return Heart;
      case 'hospital-visit': return MapPin;
      case 'emergency': return AlertTriangle;
      default: return Activity;
    }
  };

  const handleExport = () => {
    try {
      const payload = { metrics: healthMetrics, records: healthRecords, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'health-data.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast({ title: 'Exported', description: 'Your health data has been exported as JSON.' });
    } catch (_e) {
      toast({ title: 'Export failed', description: 'Please try again.', });
    }
  };

  const handleViewRecord = (recordId: string) => {
    navigate(`/dashboard?record=${encodeURIComponent(recordId)}`);
    toast({ title: 'Opening record', description: `Record #${recordId}` });
  };

  const [isAllRecordsOpen, setIsAllRecordsOpen] = useState(false);
  const handleViewAllRecords = () => {
    setIsAllRecordsOpen(true);
  };

  const handleAddGoal = () => {
    toast({ title: 'Coming soon', description: 'Goal creation will be available shortly.' });
  };

  const handleScheduleAppointment = () => {
    toast({ title: 'Coming soon', description: 'Scheduling integration is not yet enabled.' });
  };

  // Add New Record dialog state
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [newRecordType, setNewRecordType] = useState<HealthRecord['type']>('skin-check');
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordDate, setNewRecordDate] = useState<string>('');
  const [newRecordStatus, setNewRecordStatus] = useState<HealthRecord['status']>('normal');
  const [newRecordSummary, setNewRecordSummary] = useState('');

  const handleOpenAddRecord = () => setIsAddRecordOpen(true);
  const handleSubmitAddRecord = () => {
    if (!newRecordTitle || !newRecordDate) {
      toast({ title: 'Missing fields', description: 'Please add a title and date.' });
      return;
    }
    const newRec: HealthRecord = {
      id: String(Date.now()),
      type: newRecordType,
      title: newRecordTitle,
      date: newRecordDate,
      status: newRecordStatus,
      summary: newRecordSummary || 'No summary provided.',
    };
    setHealthRecords(prev => [newRec, ...prev]);
    setIsAddRecordOpen(false);
    setNewRecordTitle('');
    setNewRecordDate('');
    setNewRecordSummary('');
    toast({ title: 'Record added', description: 'New health record saved to dashboard.' });
  };

  // Open dialogs based on query params
  const query = useMemo(() => {
    try {
      const q = new URLSearchParams(locationStr.split('?')[1] || '');
      return Object.fromEntries(q.entries());
    } catch {
      return {} as Record<string, string>;
    }
  }, [locationStr]);

  useEffect(() => {
    if ((query as any).view === 'records') {
      setIsAllRecordsOpen(true);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Health Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitor your health metrics and track your wellness journey
            </p>
          </div>
          <Button data-testid="button-export-data" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {healthMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className={`text-lg font-semibold ${getStatusColor(metric.status)}`}>
                      {metric.value}
                    </p>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Health Records
                </CardTitle>
                <CardDescription>Your latest health activities and checkups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record) => {
                    const IconComponent = getRecordIcon(record.type);
                    return (
                      <div key={record.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg hover-elevate transition-all cursor-pointer">
                        <div className={`p-2 rounded-full ${record.status === 'emergency' ? 'bg-destructive' : 'bg-primary'}`}>
                          <IconComponent className={`w-4 h-4 ${record.status === 'emergency' ? 'text-destructive-foreground' : 'text-primary-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{record.title}</h4>
                            <Badge className={getStatusBadgeColor(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{record.summary}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs" onClick={() => handleViewRecord(record.id)}>
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 text-center">
          <Button variant="outline" data-testid="button-view-all-records" onClick={handleViewAllRecords}>
                    View All Records
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Health Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Health Goals
                </CardTitle>
                <CardDescription>Track your progress towards better health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Daily Steps</span>
                    <span>7,234 / 10,000</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Water Intake</span>
                    <span>6 / 8 glasses</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Sleep Quality</span>
                    <span>7.5 / 8 hours</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={handleOpenAddRecord}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Record
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your most used health tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <HealthCard
                  title="Skin Check"
                  description="AI-powered analysis"
                  icon={Camera}
                  actionLabel="Start Analysis"
                  onAction={() => navigate('/skin-check')}
                />
                
                <HealthCard
                  title="Record Vitals"
                  description="Log health metrics"
                  icon={Heart}
                  actionLabel="Add Reading"
                  onAction={() => toast({ title: 'Coming soon', description: 'Vitals logging will be available shortly.' })}
                />
                
                <HealthCard
                  title="Emergency"
                  description="Quick SOS access"
                  icon={AlertTriangle}
                  status="emergency"
                  actionLabel="Emergency SOS"
                  onAction={() => navigate('/sos')}
                  isEmergency={true}
                />
              </CardContent>
            </Card>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Health Summary</CardTitle>
                <CardDescription>Overall wellness snapshot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-chart-2 mb-1">85%</div>
                    <p className="text-sm text-muted-foreground">Overall Health Score</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Physical Health</span>
                      <span className="text-chart-2 font-medium">Good</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mental Wellness</span>
                      <span className="text-chart-2 font-medium">Very Good</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sleep Quality</span>
                      <span className="text-chart-2 font-medium">Excellent</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Nutrition</span>
                      <span className="text-chart-3 font-medium">Fair</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Appointment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold text-sm">Annual Physical</h4>
                    <p className="text-xs text-muted-foreground">Dr. Smith • Jan 25, 2024</p>
                    <p className="text-xs text-muted-foreground">2:00 PM</p>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full" onClick={handleScheduleAppointment}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* View All Records Dialog */}
        <Dialog open={isAllRecordsOpen} onOpenChange={setIsAllRecordsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>All Health Records</DialogTitle>
              <DialogDescription>Your complete recent activity list</DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {healthRecords.map((record) => {
                const IconComponent = getRecordIcon(record.type);
                return (
                  <div key={record.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
                    <div className={`p-2 rounded-full ${record.status === 'emergency' ? 'bg-destructive' : 'bg-primary'}`}>
                      <IconComponent className={`w-4 h-4 ${record.status === 'emergency' ? 'text-destructive-foreground' : 'text-primary-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">{record.title}</h4>
                        <Badge className={getStatusBadgeColor(record.status)}>{record.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">{record.summary}</p>
                      <div className="text-[10px] text-muted-foreground">{new Date(record.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        {/* Add New Record Dialog */}
        <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Record</DialogTitle>
              <DialogDescription>Save a new health entry to your timeline</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <label className="text-sm">Type</label>
                <Select value={newRecordType} onValueChange={(v) => setNewRecordType(v as HealthRecord['type'])}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skin-check">Skin Check</SelectItem>
                    <SelectItem value="vital-signs">Vital Signs</SelectItem>
                    <SelectItem value="hospital-visit">Hospital Visit</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Title</label>
                <Input className="mt-1" value={newRecordTitle} onChange={(e) => setNewRecordTitle(e.target.value)} placeholder="e.g. Blood Pressure Reading" />
              </div>
              <div>
                <label className="text-sm">Date</label>
                <Input className="mt-1" type="date" value={newRecordDate} onChange={(e) => setNewRecordDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm">Status</label>
                <Select value={newRecordStatus} onValueChange={(v) => setNewRecordStatus(v as HealthRecord['status'])}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm">Summary</label>
                <Textarea className="mt-1" value={newRecordSummary} onChange={(e) => setNewRecordSummary(e.target.value)} placeholder="Short description" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRecordOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitAddRecord}>Save Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}