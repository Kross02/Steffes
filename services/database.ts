// services/database.ts
import { CosmosClient, Container } from "@azure/cosmos";
import { Lot, Picture } from "../types/lot";
import { config } from "../config";

class DatabaseService {
  private client: CosmosClient;
  private database: string;
  private container: Container;

  constructor() {
    this.client = new CosmosClient({
      endpoint: config.cosmos.endpoint,
      key: config.cosmos.key
    });

    this.database = config.cosmos.database;
    this.container = this.client
      .database(this.database)
      .container(config.cosmos.container);
  }

  // Create a new lot
  async createLot(lotData: Omit<Lot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lot> {
    const timestamp = new Date().toISOString();
    const lot: Lot & { type: string } = {
      ...lotData,
      id: `lot_${Date.now()}`, // Generate a unique ID
      pictures: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      type: 'lot' // Add type field for querying
    };

    const { resource } = await this.container.items.create(lot);
    return resource!;
  }

  // Get a lot by ID
  async getLotById(id: string): Promise<Lot | null> {
    try {
      const { resource } = await this.container.item(id, id).read();
      return resource || null;
    } catch (error) {
      console.error('Error getting lot:', error);
      return null;
    }
  }

  // Get all lots (with optional filtering)
  async getAllLots(filter?: { status?: Lot['status'] }): Promise<Lot[]> {
    let querySpec = "SELECT * FROM c WHERE c.type = 'lot'";
    if (filter?.status) {
      querySpec += ` AND c.status = '${filter.status}'`;
    }
    
    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();
    
    return resources;
  }

  // Add a picture to a lot
  async addPictureToLot(lotId: string, picture: Omit<Picture, 'id'>): Promise<Lot> {
    const lot = await this.getLotById(lotId);
    if (!lot) {
      throw new Error('Lot not found');
    }

    const newPicture: Picture = {
      ...picture,
      id: `pic_${Date.now()}` // Generate a unique ID
    };

    lot.pictures.push(newPicture);
    lot.updatedAt = new Date().toISOString();

    const { resource } = await this.container
      .item(lotId, lotId)
      .replace(lot);

    return resource!;
  }

  // Update a lot
  async updateLot(id: string, updates: Partial<Lot>): Promise<Lot> {
    const lot = await this.getLotById(id);
    if (!lot) {
      throw new Error('Lot not found');
    }

    const updatedLot: Lot = {
      ...lot,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    const { resource } = await this.container
      .item(id, id)
      .replace(updatedLot);

    return resource!;
  }

  // Delete a lot
  async deleteLot(id: string): Promise<void> {
    await this.container.item(id, id).delete();
  }

  // Remove a picture from a lot
  async removePictureFromLot(lotId: string, pictureId: string): Promise<Lot> {
    const lot = await this.getLotById(lotId);
    if (!lot) {
      throw new Error('Lot not found');
    }

    lot.pictures = lot.pictures.filter(pic => pic.id !== pictureId);
    lot.updatedAt = new Date().toISOString();

    const { resource } = await this.container
      .item(lotId, lotId)
      .replace(lot);

    return resource!;
  }
}

export const dbService = new DatabaseService();