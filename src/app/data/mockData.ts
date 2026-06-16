export interface Claim {
  id: string;
  customerId: string;
  customerName: string;
  type: 'auto' | 'property';
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  fraudScore: number;
  damageAssessment: string;
  estimatedCost: number;
  submittedAt: string;
  processedAt?: string;
  vehicleInfo?: string;
  propertyInfo?: string;
  location?: string;
  description?: string;
}

export const mockClaims: Claim[] = [
  {
    id: 'CLM-2024-001',
    customerId: 'USR-001',
    customerName: 'Rajesh Kumar',
    type: 'auto',
    status: 'approved',
    fraudScore: 15,
    damageAssessment: 'Front bumper damage',
    estimatedCost: 45000,
    submittedAt: '2024-01-20T10:30:00',
    processedAt: '2024-01-20T11:45:00',
    vehicleInfo: 'Honda City 2020',
    location: 'Mumbai, Maharashtra',
    description: 'Minor collision at traffic signal'
  },
  {
    id: 'CLM-2024-002',
    customerId: 'USR-002',
    customerName: 'Priya Sharma',
    type: 'property',
    status: 'flagged',
    fraudScore: 87,
    damageAssessment: 'Water damage - suspicious',
    estimatedCost: 250000,
    submittedAt: '2024-01-21T14:20:00',
    location: 'Bangalore, Karnataka',
    description: 'Water damage from burst pipe'
  },
  {
    id: 'CLM-2024-003',
    customerId: 'USR-003',
    customerName: 'Amit Patel',
    type: 'auto',
    status: 'pending',
    fraudScore: 42,
    damageAssessment: 'Side panel damage',
    estimatedCost: 78000,
    submittedAt: '2024-01-22T09:15:00',
    vehicleInfo: 'Hyundai Creta 2021',
    location: 'Delhi, NCR',
    description: 'Scraped while parking'
  },
  {
    id: 'CLM-2024-004',
    customerId: 'USR-004',
    customerName: 'Sneha Reddy',
    type: 'property',
    status: 'approved',
    fraudScore: 8,
    damageAssessment: 'Roof damage from storm - genuine',
    estimatedCost: 125000,
    submittedAt: '2024-01-19T16:00:00',
    processedAt: '2024-01-19T18:30:00',
    location: 'Hyderabad, Telangana',
    description: 'Roof tiles damaged during heavy storm',
    propertyInfo: 'Residential Home - 2 Story'
  },
  {
    id: 'CLM-2024-005',
    customerId: 'USR-005',
    customerName: 'Vikram Singh',
    type: 'auto',
    status: 'rejected',
    fraudScore: 95,
    damageAssessment: 'Pre-existing damage',
    estimatedCost: 150000,
    submittedAt: '2024-01-18T11:00:00',
    processedAt: '2024-01-18T15:00:00',
    vehicleInfo: 'Maruti Swift 2019',
    location: 'Pune, Maharashtra',
    description: 'Total damage claim - evidence shows old damage'
  }
];

export interface FraudLayer {
  name: string;
  score: number;
  confidence: 'high' | 'medium' | 'low';
  details: string;
}

export const fraudLayers: FraudLayer[] = [
  { name: 'Face Recognition', score: 12, confidence: 'high', details: 'Face matches registered user with 98% confidence' },
  { name: 'Damage Consistency', score: 8, confidence: 'high', details: 'Damage pattern matches reported incident type' },
  { name: 'Temporal Analysis', score: 5, confidence: 'medium', details: 'Time between incident and claim filing is reasonable' },
  { name: 'Location Verification', score: 3, confidence: 'high', details: 'GPS location consistent with reported area' },
  { name: 'Historical Pattern', score: 2, confidence: 'low', details: 'No previous suspicious claims from this user' }
];

export interface DamageArea {
  id: string;
  type: string;
  severity: number;
  confidence: number;
  cost: number;
  coordinates: { x: number; y: number; width: number; height: number };
}

export const damageAreas: DamageArea[] = [
  { id: '1', type: 'Front Bumper Crack', severity: 7, confidence: 95, cost: 25000, coordinates: { x: 30, y: 60, width: 40, height: 20 } },
  { id: '2', type: 'Headlight Damage', severity: 5, confidence: 88, cost: 15000, coordinates: { x: 20, y: 50, width: 15, height: 15 } },
  { id: '3', type: 'Hood Dent', severity: 4, confidence: 72, cost: 5000, coordinates: { x: 35, y: 40, width: 20, height: 15 } }
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  claimsProcessed: number;
  approvalRate: number;
  avgProcessingTime: string;
  status: 'active' | 'away' | 'offline';
}

export const teamMembers: TeamMember[] = [
  { id: 'AGT-001', name: 'Anita Desai', role: 'Senior Claims Agent', email: 'anita.d@aivala.com', claimsProcessed: 234, approvalRate: 87, avgProcessingTime: '12 min', status: 'active' },
  { id: 'AGT-002', name: 'Ravi Verma', role: 'Claims Agent', email: 'ravi.v@aivala.com', claimsProcessed: 189, approvalRate: 92, avgProcessingTime: '15 min', status: 'active' },
  { id: 'AGT-003', name: 'Meera Shah', role: 'Fraud Analyst', email: 'meera.s@aivala.com', claimsProcessed: 156, approvalRate: 78, avgProcessingTime: '18 min', status: 'away' },
  { id: 'MGR-001', name: 'Suresh Nair', role: 'Claims Manager', email: 'suresh.n@aivala.com', claimsProcessed: 567, approvalRate: 89, avgProcessingTime: '10 min', status: 'active' }
];

export interface Settlement {
  id: string;
  claimId: string;
  amount: number;
  method: 'direct_repair' | 'cash_payout' | 'blockchain';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transactionHash?: string;
  completedAt?: string;
}

export const settlements: Settlement[] = [
  { id: 'SET-001', claimId: 'CLM-2024-001', amount: 45000, method: 'direct_repair', status: 'completed', completedAt: '2024-01-20T14:00:00' },
  { id: 'SET-002', claimId: 'CLM-2024-004', amount: 125000, method: 'blockchain', status: 'completed', transactionHash: '0x7d8a...ef3c', completedAt: '2024-01-19T20:00:00' },
  { id: 'SET-003', claimId: 'CLM-2024-003', amount: 78000, method: 'cash_payout', status: 'processing' }
];

export interface FraudTrend {
  month: string;
  total: number;
  flagged: number;
  rejected: number;
}

export const fraudTrends: FraudTrend[] = [
  { month: 'Aug', total: 245, flagged: 32, rejected: 18 },
  { month: 'Sep', total: 298, flagged: 41, rejected: 24 },
  { month: 'Oct', total: 312, flagged: 38, rejected: 21 },
  { month: 'Nov', total: 267, flagged: 29, rejected: 16 },
  { month: 'Dec', total: 289, flagged: 35, rejected: 19 },
  { month: 'Jan', total: 234, flagged: 27, rejected: 14 }
];

export const fraudPatterns = [
  { type: 'Staged Accidents', count: 45, percentage: 23 },
  { type: 'Inflated Costs', count: 38, percentage: 19 },
  { type: 'Pre-existing Damage', count: 52, percentage: 27 },
  { type: 'False Claims', count: 31, percentage: 16 },
  { type: 'Identity Fraud', count: 29, percentage: 15 }
];