import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../services/utility.service';
import Chart, { ChartItem } from 'chart.js/auto';

@Component({
  selector: 'berkeliumlabs-settings',
  imports: [RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  public _utilityService = inject(UtilityService);

  storageEstimate!: Partial<StorageEstimate> & { usageDetails?: any };
  chart!: ChartItem;
  usageDetails: any[] = [];

  ngOnInit(): void {
    const storage = navigator.storage;
    storage.estimate().then((estimate: StorageEstimate) => {
      this.storageEstimate = estimate;
      if (Object.entries(this.storageEstimate.usageDetails).length > 0) {
        for (const [ key, value ] of Object.entries(this.storageEstimate.usageDetails)) {
          this.usageDetails.push({ key, value });
        }
      } 
      this.createStorageChart();
      // console.log(estimate);
    });
  }

  private createStorageChart() {
    this.chart = new Chart('bk-lab-storage', {
      type: 'doughnut',
      data: {
        labels: [
          `Used (${this._utilityService.formatBytes(this.storageEstimate.usage ?? 0)})`,
          `Available (${this._utilityService.formatBytes(this.storageEstimate.quota ?? 0)})`
        ],
        datasets: [{
          label: 'Lab Storage',
          data: [
            this.storageEstimate.usage,
            this.storageEstimate.quota
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 162, 86)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        aspectRatio: 3,
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            maxWidth: 400,
          }
        }
      },
    });
  }
}
