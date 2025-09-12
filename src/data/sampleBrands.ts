import { Brand } from '../types';

export const sampleBrands: Brand[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    icon: 'TF',
    color: '#3B82F6',
    lastUpdated: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'GreenEarth Energy',
    icon: 'GE',
    color: '#10B981',
    lastUpdated: '1 day ago',
    status: 'completed'
  },
  {
    id: '3',
    name: 'UrbanFit App',
    icon: 'UF',
    color: '#F59E0B',
    lastUpdated: '3 days ago',
    status: 'in-progress'
  },
  {
    id: '4',
    name: 'DataVault Security',
    icon: 'DV',
    color: '#8B5CF6',
    lastUpdated: '1 week ago',
    status: 'completed'
  },
  {
    id: '5',
    name: 'CloudScale Systems',
    icon: 'CS',
    color: '#EF4444',
    lastUpdated: '2 weeks ago',
    status: 'completed'
  },
  {
    id: '6',
    name: 'EcoFashion Co',
    icon: 'EF',
    color: '#06B6D4',
    lastUpdated: '3 weeks ago',
    status: 'completed'
  }
];

export const getBrandById = (id: string): Brand | undefined => {
  return sampleBrands.find(brand => brand.id === id);
};
