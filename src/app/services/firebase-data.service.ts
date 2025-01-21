import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  // Upload trade data to Firebase
  async uploadTradeData(tradeData: any): Promise<void> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const sheetName = tradeData.Sheet_Name;
    
    // Add timestamp
    tradeData.timestamp = new Date();

    try {
      await this.firestore
        .collection('users')
        .doc(userId)
        .collection(sheetName)
        .doc(tradeData.ID)
        .set(tradeData);
    } catch (error) {
      console.error('Error uploading trade data:', error);
      throw error;
    }
  }

  // Fetch trade data for a specific sheet
  getTradeData(sheetName: string): Observable<any[]> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.firestore
      .collection('users')
      .doc(userId)
      .collection(sheetName)
      .valueChanges()
      .pipe(
        map(trades => trades.sort((a: any, b: any) => {
          // Sort by timestamp in descending order (newest first)
          return b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime();
        }))
      );
  }

  // Get trade data for a specific time period
  getTradeDataByDateRange(sheetName: string, startDate: Date, endDate: Date): Observable<any[]> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.firestore
      .collection('users')
      .doc(userId)
      .collection(sheetName, ref => 
        ref.where('timestamp', '>=', startDate)
           .where('timestamp', '<=', endDate)
           .orderBy('timestamp', 'desc')
      )
      .valueChanges();
  }

  // Add this new method
  async deleteTrade(sheetName: string, tradeId: string): Promise<void> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      await this.firestore
        .collection('users')
        .doc(userId)
        .collection(sheetName)
        .doc(tradeId)
        .delete();
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  }
} 