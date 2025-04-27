// services/database.ts
// import { CosmosClient, Container } from "@azure/cosmos";
import { Lot, Picture } from "../types/lot";
import { config } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock implementation using AsyncStorage
class DatabaseService {
  private storageKey = 'steffes_lots';

  constructor() {
    // Initialize storage if it doesn't exist
    this.initializeStorage();
  }

  // Initialize storage
  private async initializeStorage(): Promise<void> {
    try {
      const existingData = await AsyncStorage.getItem(this.storageKey);
      if (!existingData) {
        await AsyncStorage.setItem(this.storageKey, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  // Helper to get all lots from storage
  private async getAllLotsFromStorage(): Promise<Lot[]> {
    try {
      const lotsJson = await AsyncStorage.getItem(this.storageKey);
      return lotsJson ? JSON.parse(lotsJson) : [];
    } catch (error) {
      console.error('Error getting lots from storage:', error);
      return [];
    }
  }

  // Helper to save all lots to storage
  private async saveLotsToStorage(lots: Lot[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(lots));
    } catch (error) {
      console.error('Error saving lots to storage:', error);
    }
  }

  // Create a new lot
  async createLot(lotData: Omit<Lot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lot> {
    const timestamp = new Date().toISOString();
    const lot: Lot = {
      ...lotData,
      id: `lot_${Date.now()}`, // Generate a unique ID
      pictures: [],
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const lots = await this.getAllLotsFromStorage();
    lots.push(lot);
    await this.saveLotsToStorage(lots);
    
    return lot;
  }

  // Get a lot by ID
  async getLotById(id: string): Promise<Lot | null> {
    const lots = await this.getAllLotsFromStorage();
    return lots.find(lot => lot.id === id) || null;
  }

  // Get all lots (with optional filtering)
  async getAllLots(filter?: { status?: Lot['status'] }): Promise<Lot[]> {
    let lots = await this.getAllLotsFromStorage();
    
    if (filter?.status) {
      lots = lots.filter(lot => lot.status === filter.status);
    }
    
    return lots;
  }

  // Add a picture to a lot
  async addPictureToLot(lotId: string, picture: Omit<Picture, 'id'>): Promise<Lot> {
    const lots = await this.getAllLotsFromStorage();
    const lotIndex = lots.findIndex(lot => lot.id === lotId);
    
    if (lotIndex === -1) {
      throw new Error('Lot not found');
    }

    const newPicture: Picture = {
      ...picture,
      id: `pic_${Date.now()}` // Generate a unique ID
    };

    lots[lotIndex].pictures.push(newPicture);
    lots[lotIndex].updatedAt = new Date().toISOString();
    
    await this.saveLotsToStorage(lots);
    return lots[lotIndex];
  }

  // Update a lot
  async updateLot(id: string, updates: Partial<Lot>): Promise<Lot> {
    const lots = await this.getAllLotsFromStorage();
    const lotIndex = lots.findIndex(lot => lot.id === id);
    
    if (lotIndex === -1) {
      throw new Error('Lot not found');
    }

    const updatedLot: Lot = {
      ...lots[lotIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    lots[lotIndex] = updatedLot;
    await this.saveLotsToStorage(lots);
    
    return updatedLot;
  }

  // Delete a lot
  async deleteLot(id: string): Promise<void> {
    const lots = await this.getAllLotsFromStorage();
    const filteredLots = lots.filter(lot => lot.id !== id);
    await this.saveLotsToStorage(filteredLots);
  }

  // Remove a picture from a lot
  async removePictureFromLot(lotId: string, pictureId: string): Promise<Lot> {
    const lots = await this.getAllLotsFromStorage();
    const lotIndex = lots.findIndex(lot => lot.id === lotId);
    
    if (lotIndex === -1) {
      throw new Error('Lot not found');
    }

    lots[lotIndex].pictures = lots[lotIndex].pictures.filter(pic => pic.id !== pictureId);
    lots[lotIndex].updatedAt = new Date().toISOString();
    
    await this.saveLotsToStorage(lots);
    return lots[lotIndex];
  }
}

// Export a singleton instance
export const dbService = new DatabaseService();