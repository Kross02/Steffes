import { Lot } from '@/types/lot';

// Use your local IP address
const API_BASE_URL = 'http://172.20.10.4:7071/api';

export const azureService = {
  async createLot(lotData: Omit<Lot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lot> {
    console.log('Creating lot with data:', lotData);
    console.log('API URL:', `${API_BASE_URL}/lotCreate`);

    try {
      const response = await fetch(`${API_BASE_URL}/lotCreate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(lotData),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create lot: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Success response:', result);
      return result;
    } catch (error) {
      console.error('Network or parsing error:', error);
      throw error;
    }
  }
}; 