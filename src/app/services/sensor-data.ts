import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, switchMap, catchError, of } from 'rxjs';

export interface SensorReading {
  id: number;
  temperature: number;
  humidity: number;
  pressure: number;
  light: number;
  timestamp: Date;
}

export interface UpdateInterval {
  interval: number; // en segundos
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class SensorData {
  // URL del backend (cambiar según tu configuración)
  private apiUrl = 'http://localhost:3000/api'; // Ajustar cuando esté desplegado
  
  // Señales para datos reactivos
  latestReading = signal<SensorReading | null>(null);
  readings = signal<SensorReading[]>([]);
  updateInterval = signal<number>(30); // 30 segundos por defecto
  isLoading = signal<boolean>(false);
  lastUpdate = signal<Date>(new Date());

  constructor(private http: HttpClient) {
    this.initializeData();
  }

  private initializeData(): void {
    // Simular datos iniciales (quitar cuando el backend esté listo)
    this.generateMockData();
    
    // Iniciar polling de datos
    this.startDataPolling();
  }

  // Obtener intervalo de actualización del backend
  getUpdateInterval() {
    // Simular respuesta del backend
    const randomInterval = Math.floor(Math.random() * (60 - 4 + 1)) + 4;
    this.updateInterval.set(randomInterval);
    return randomInterval;
    
    /* Cuando el backend esté listo:
    return this.http.get<UpdateInterval>(`${this.apiUrl}/update`).pipe(
      catchError(() => of({ interval: 30, timestamp: new Date() }))
    );
    */
  }

  // Obtener últimas lecturas de sensores
  getSensorReadings() {
    /* Cuando el backend esté listo:
    return this.http.get<SensorReading[]>(`${this.apiUrl}/sensors`).pipe(
      catchError(() => of([]))
    );
    */
  }

  // Iniciar polling de datos
  private startDataPolling(): void {
    // Actualizar datos cada X segundos
    interval(this.updateInterval() * 1000)
      .pipe(
        switchMap(() => {
          this.isLoading.set(true);
          // Simular obtención de datos
          return of(this.generateMockReading());
        })
      )
      .subscribe(reading => {
        this.latestReading.set(reading);
        this.readings.update(readings => [reading, ...readings].slice(0, 50));
        this.lastUpdate.set(new Date());
        this.isLoading.set(false);
        
        // Obtener nuevo intervalo
        this.getUpdateInterval();
      });
  }

  // Generar datos de prueba (remover cuando el backend esté listo)
  private generateMockData(): void {
    const mockReadings: SensorReading[] = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - i * 30000);
      mockReadings.push({
        id: i + 1,
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 40,
        pressure: 980 + Math.random() * 50,
        light: Math.random() * 1000,
        timestamp
      });
    }
    
    this.readings.set(mockReadings);
    this.latestReading.set(mockReadings[0]);
  }

  private generateMockReading(): SensorReading {
    return {
      id: this.readings().length + 1,
      temperature: 20 + Math.random() * 15,
      humidity: 40 + Math.random() * 40,
      pressure: 980 + Math.random() * 50,
      light: Math.random() * 1000,
      timestamp: new Date()
    };
  }
}
