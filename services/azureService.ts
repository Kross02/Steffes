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
  },

  async getAllLots(): Promise<Lot[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/lotReadAll`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to get lots: ${errorText}`);
      }

      const lots = await response.json();
      return lots;
    } catch (error) {
      console.error('Error fetching lots:', error);
      throw error;
    }
  },

  async getLotById(id: string): Promise<Lot> {
    try {
      const response = await fetch(`${API_BASE_URL}/lotReadID/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to get lot: ${errorText}`);
      }

      const lot = await response.json();
      return lot;
    } catch (error) {
      console.error('Error fetching lot:', error);
      throw error;
    }
  },

  async updateLot(id: string, lotData: Partial<Lot>, category: string): Promise<Lot> {
    try {
      const response = await fetch(`${API_BASE_URL}/lotUpdate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-ms-documentdb-partitionkey': JSON.stringify([category])
        },
        body: JSON.stringify(lotData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update lot: ${errorText}`);
      }

      const updatedLot = await response.json();
      return updatedLot;
    } catch (error) {
      console.error('Error updating lot:', error);
      throw error;
    }
  },

  async deleteLot(id: string, category: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/lotDelete/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'x-ms-documentdb-partitionkey': JSON.stringify([category])
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to delete lot: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting lot:', error);
      throw error;
    }
  },

  async uploadPhoto(photoUri: string): Promise<string> {
    try {
      // Convert the photo URI to base64
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
      });
      
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      // Generate a unique filename
      const fileName = `photo_${Date.now()}.jpg`;

      // Upload to blob storage
      const uploadResponse = await fetch(`${API_BASE_URL}/blobUpload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName,
          fileBase64: base64Data,
          tag: 'New Photo' // You can customize this or pass it as a parameter
        })
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload photo');
      }

      const { url } = await uploadResponse.json();
      return url;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }
}; 