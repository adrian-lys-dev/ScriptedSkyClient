import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions, AgChartTheme } from 'ag-charts-community';
import { CardStats } from '../../shared/models/dashboard/cardStats';
import { DashboardService } from '../../core/services/admin-services/dashboard.service';
import { BusyService } from '../../core/services/busy.service';
import { LoadingAdminComponent } from "../../shared/components/loading-admin/loading-admin.component";
import { MonthlySales } from '../../shared/models/dashboard/monthlySales';
import { GenresSales } from '../../shared/models/dashboard/genresSales';
import { RatingDistribution } from '../../shared/models/dashboard/ratingDistribution';
import { AvatarUsage } from '../../shared/models/dashboard/avatarUsage';

const ratingTheme: AgChartTheme = {
  palette: {
    fills: ["#ef4444", "#f97316", "#facc15", "#22c55e", "#16a34a"],
    strokes: ["#b91c1c", "#c2410c", "#a16207", "#15803d", "#166534"]
  }
};

@Component({
  selector: 'app-admin',
  imports: [AgCharts, DatePipe, LoadingAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  private dashboardService = inject(DashboardService);
  busyService = inject(BusyService);

  public barChartOptions!: AgChartOptions;
  public pieRatingOptions!: AgChartOptions;
  public pieGenresOptions!: AgChartOptions;
  public pieAvatarsOptions!: AgChartOptions;

  public today: Date = new Date();
  cardStats?: CardStats;
  monthlySales?: MonthlySales[];
  genresSales?: GenresSales[];
  ratingDistribution?: RatingDistribution[];
  avatarUsage?: AvatarUsage[];

  constructor() {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.getCardStats();
    this.getMonthlySales();
    this.getGenresSales();
    this.getRatingDistribution();
    this.getAvatarUsage();
  }

  getCardStats() {
    this.dashboardService.getCardStats().subscribe({
      next: response => this.cardStats = response,
      error: error => console.log(error)
    });
  }

  getMonthlySales(): void {
    this.dashboardService.getMonthlySales().subscribe(data => {
      this.monthlySales = data;
      this.barChartOptions = {
        ...this.barChartOptions,
        data: this.monthlySales
      };
    });
  }

  getGenresSales() {
    this.dashboardService.getGenresSales().subscribe(data => {
      this.genresSales = data;
      this.pieGenresOptions = {
        ...this.pieGenresOptions,
        data: this.genresSales
      };
    });
  }

  getRatingDistribution() {
    this.dashboardService.getRatingDistribution().subscribe(data => {
      this.ratingDistribution = data;
      this.pieRatingOptions = {
        ...this.pieRatingOptions,
        data: this.ratingDistribution
      };
    });
  }

  getAvatarUsage() {
    this.dashboardService.getAvatarUsage().subscribe(data => {
      this.avatarUsage = data;
      this.pieAvatarsOptions = {
        ...this.pieAvatarsOptions,
        data: this.avatarUsage
      };
    });
  }

  private initializeChartOptions(): void {
    this.barChartOptions = {
      title: { text: "Month Sales Data" },
      series: [
        { type: 'bar', xKey: 'month', yKey: 'salesCount', cornerRadius: 8, fill: '#0160ff' }
      ],
      background: { fill: '#f9fafb' }
    };

    this.pieRatingOptions = {
      theme: ratingTheme,
      title: { text: "Customer rating" },
      series: [
        { type: "pie", angleKey: "count", legendItemKey: "rating" }
      ],
      background: { fill: '#f9fafb' }
    };

    this.pieGenresOptions = {
      title: { text: "Top Selling Genres" },
      series: [
        { type: "pie", angleKey: "totalSold", legendItemKey: "genreName" }
      ],
      background: { fill: '#f9fafb' },
      legend: { enabled: true, position: "right" }
    };

    this.pieAvatarsOptions = {
      title: { text: "Avatar Usage Distribution" },
      series: [
        { type: "pie", angleKey: "userCount", legendItemKey: "avatarName" }
      ],
      legend: { enabled: true, position: "right" },
      background: { fill: '#f9fafb' }
    };
  }


}
