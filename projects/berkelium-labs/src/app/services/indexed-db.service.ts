import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor() {
    this.dbName = 'berkeliumLabsDB';
    this.dbVersion = 2;
  }

  /**
   * Initialize the database with specified stores
   * @param stores Array of store configurations { name: string, keyPath: string, indices?: Array<{name: string, keyPath: string, options?: IDBIndexParameters}> }
   */
  public initializeDB(
    stores: Array<{
      name: string;
    }>
  ): Observable<boolean> {
    return from(
      new Promise<boolean>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onerror = (event) => {
          console.error('IndexedDB error:', request.error);
          reject('Error opening database');
        };

        request.onsuccess = (event) => {
          this.db = request.result;
          console.log('IndexedDB opened successfully');
          resolve(true);
        };

        request.onupgradeneeded = (event) => {
          const db = request.result;

          // Create object stores
          stores.forEach((store) => {
            if (!db.objectStoreNames.contains(store.name)) {
              db.createObjectStore(store.name);
              console.log(`Object store ${store.name} created`);
            }
          });
        };
      })
    ).pipe(
      catchError((error) => {
        console.error('IndexedDB initialization error:', error);
        return throwError(() => new Error('Failed to initialize IndexedDB'));
      })
    );
  }

  /**
   * Add an item to a store
   * @param storeName Name of the object store
   * @param item Item to add
   */
  public add<T>(storeName: string, item: T, key: string): Observable<T> {
    return from(
      new Promise<T>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(item as any, key);

        request.onsuccess = () => {
          resolve(item);
        };

        request.onerror = () => {
          reject(`Error adding item to ${storeName}: ${request.error}`);
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Get all items from a store
   * @param storeName Name of the object store
   */
  public getAll<T>(storeName: string): Observable<T[]> {
    return from(
      new Promise<T[]>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result as T[]);
        };

        request.onerror = () => {
          reject(`Error getting items from ${storeName}: ${request.error}`);
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Get an item by its key
   * @param storeName Name of the object store
   * @param key Key of the item to get
   */
  public getByKey<T>(storeName: string, key: string | number): Observable<T> {
    return from(
      new Promise<T>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result as T);
          } else {
            resolve(undefined as T);
          }
        };

        request.onerror = () => {
          reject(`Error getting item from ${storeName}: ${request.error}`);
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Update an item in a store
   * @param storeName Name of the object store
   * @param item Item to update
   */
  public update<T>(storeName: string, item: T, key: string): Observable<T> {
    return from(
      new Promise<T>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item as any, key);

        request.onsuccess = () => {
          resolve(item);
        };

        request.onerror = () => {
          reject(`Error updating item in ${storeName}: ${request.error}`);
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Delete an item by its key
   * @param storeName Name of the object store
   * @param key Key of the item to delete
   */
  public delete(storeName: string, key: string | number): Observable<boolean> {
    return from(
      new Promise<boolean>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = () => {
          reject(`Error deleting item from ${storeName}: ${request.error}`);
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Clear all items from a store
   * @param storeName Name of the object store
   */
  public clear(storeName: string): Observable<boolean> {
    return from(
      new Promise<boolean>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = () => {
          reject(`Error clearing ${storeName}: ${request.error}`);
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Query items using an index
   * @param storeName Name of the object store
   * @param indexName Name of the index to query
   * @param query Query value
   */
  public queryByIndex<T>(
    storeName: string,
    indexName: string,
    query: string | number
  ): Observable<T[]> {
    return from(
      new Promise<T[]>((resolve, reject) => {
        if (!this.db) {
          reject('Database not initialized');
          return;
        }

        const transaction = this.db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(query);

        request.onsuccess = () => {
          resolve(request.result as T[]);
        };

        request.onerror = () => {
          reject(
            `Error querying ${indexName} in ${storeName}: ${request.error}`
          );
        };
      })
    ).pipe(catchError((error) => throwError(() => new Error(error))));
  }

  /**
   * Close the database connection
   */
  public closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('IndexedDB connection closed');
    }
  }
}
