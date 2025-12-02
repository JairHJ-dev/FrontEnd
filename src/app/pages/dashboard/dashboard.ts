import { Component, ChangeDetectionStrategy, signal, computed, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { SensorData } from '../../services/sensor-data';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {
  // Datos del usuario
  currentUser = computed(() => this.authService.currentUser());
  
  // Datos de sensores
  latestReading = computed(() => this.sensorService.latestReading());
  readings = computed(() => this.sensorService.readings());
  updateInterval = computed(() => this.sensorService.updateInterval());
  lastUpdate = computed(() => this.sensorService.lastUpdate());
  isLoading = computed(() => this.sensorService.isLoading());

  // Men\u00fa de navegaci\u00f3n
  menuItems = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      command: () => {}
    },
    {
      label: 'Historial',
      icon: 'pi pi-history',
      command: () => {}
    },
    {
      label: 'Configuraci\u00f3n',
      icon: 'pi pi-cog',
      command: () => {}
    }
  ]);

  // Gr\u00e1ficos de temperatura
  temperatureChartData = computed(() => {
    const data = this.readings().slice(0, 20).reverse();
    return {
      labels: data.map(r => new Date(r.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })),
      datasets: [
        {
          label: 'Temperatura (\u00b0C)',
          data: data.map(r => r.temperature.toFixed(1)),
          fill: true,
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };
  });

  // Gr\u00e1fico de humedad
  humidityChartData = computed(() => {
    const data = this.readings().slice(0, 20).reverse();
    return {
      labels: data.map(r => new Date(r.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })),
      datasets: [
        {
          label: 'Humedad (%)',
          data: data.map(r => r.humidity.toFixed(1)),
          fill: true,
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    };
  });

  // Gr\u00e1fico de presi\u00f3n
  pressureChartData = computed(() => {
    const data = this.readings().slice(0, 20).reverse();
    return {
      labels: data.map(r => new Date(r.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })),
      datasets: [
        {
          label: 'Presi\u00f3n (hPa)',
          data: data.map(r => r.pressure.toFixed(1)),
          fill: true,
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };
  });

  // Gr\u00e1fico de luz
  lightChartData = computed(() => {
    const data = this.readings().slice(0, 20).reverse();
    return {
      labels: data.map(r => new Date(r.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })),
      datasets: [
        {
          label: 'Luz (lux)',
          data: data.map(r => r.light.toFixed(0)),
          fill: true,
          borderColor: '#FFCE56',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          tension: 0.4
        }
      ]
    };
  });

  chartOptions = signal({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  });

  constructor(
    private router: Router,
    private authService: Auth,
    private sensorService: SensorData
  ) {
    // Efecto para actualizar gr\u00e1ficos cuando llegan nuevos datos
    effect(() => {
      const reading = this.latestReading();
      if (reading) {
        console.log('Nueva lectura:', reading);
      }
    });
  }

  ngOnInit() {
    // Verificar autenticaci\u00f3n
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  onLogout() {
    this.authService.logout();
  }

  formatTimestamp(date: Date): string {
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getTemperatureStatus(temp: number): 'success' | 'warn' | 'danger' | 'info' {
    if (temp < 20) return 'info';
    if (temp < 28) return 'success';
    if (temp < 32) return 'warn';
    return 'danger';
  }

  getHumidityStatus(humidity: number): 'success' | 'warn' | 'danger' {
    if (humidity < 30) return 'warn';
    if (humidity <= 60) return 'success';
    return 'danger';
  }
}
