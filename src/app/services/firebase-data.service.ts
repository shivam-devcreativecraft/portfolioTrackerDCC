import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AnalysisSettings } from '../models/analysis-settings.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {
  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private authService: AuthService
  ) {}

  // Get the current user's ID
  private getCurrentUserId(): Observable<string> {
    return this.auth.user.pipe(
      map(user => {
        if (!user) throw new Error('User not authenticated');
        return user.uid;
      })
    );
  }

  // Get analysis settings for the current user
  getAnalysisSettings(): Observable<AnalysisSettings | null> {
    return this.getCurrentUserId().pipe(
      switchMap(userId => 
        this.firestore
          .collection('users')
          .doc(userId)
          .collection('settings')
          .doc('analysis')
          .get()
      ),
      map(doc => doc.exists ? doc.data() as AnalysisSettings : null)
    );
  }

  // Save analysis settings for the current user
  saveAnalysisSettings(settings: AnalysisSettings): Observable<void> {
    return this.getCurrentUserId().pipe(
      switchMap(userId => 
        from(
          this.firestore
            .collection('users')
            .doc(userId)
            .collection('settings')
            .doc('analysis')
            .set(settings)
        )
      )
    );
  }

  deleteAnalysisSettings(): Observable<void> {
    return this.getCurrentUserId().pipe(
      switchMap(userId => 
        from(
          this.firestore
            .collection('users')
            .doc(userId)
            .collection('settings')
            .doc('analysis')
            .delete()
        )
      )
    );
  }

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
      // First check if the document exists in the specified collection
      const docRef = this.firestore
        .collection('users')
        .doc(userId)
        .collection(sheetName)
        .doc(tradeId);

      const doc = await docRef.get().toPromise();

      if (!doc?.exists) {
        throw new Error(`Trade with ID ${tradeId} not found in ${sheetName}`);
      }

      // If document exists, delete it
      await docRef.delete();
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  }
} 