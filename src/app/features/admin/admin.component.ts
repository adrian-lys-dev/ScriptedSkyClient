import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AgCharts } from 'ag-charts-angular';
import { AgChartOptions, AgChartTheme } from 'ag-charts-community';

const ratingTheme: AgChartTheme = {
  palette: {
    fills: [
      "#ef4444",
      "#f97316",
      "#facc15",
      "#22c55e",
      "#16a34a"
    ],
    strokes: [
      "#b91c1c",
      "#c2410c",
      "#a16207",
      "#15803d",
      "#166534"
    ]
  }
};


@Component({
  selector: 'app-admin',
  imports: [AgCharts, DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  
  public barChartOptions: AgChartOptions;
  public pieRatingOptions: AgChartOptions;
  public pieGenresOptions: AgChartOptions;
  public pieAvatarsOptions: AgChartOptions;

  public today: Date = new Date();

    constructor() {
      this.barChartOptions = {
        title: {
          text: "Moth Sales Data",
        },
        data: [
          { month: 'January', sales: 1200 },
          { month: 'February', sales: 980 },
          { month: 'March', sales: 1350 },
          { month: 'April', sales: 1420 },
          { month: 'May', sales: 1600 },
          { month: 'June', sales: 1550 },
          { month: 'July', sales: 1700 },
          { month: 'August', sales: 1800 },
          { month: 'September', sales: 2100 },
          { month: 'October', sales: 2000 },
          { month: 'November', sales: 1900 },
          { month: 'December', sales: 2200 }
        ],
        series: [{ type: 'bar', xKey: 'month', yKey: 'sales', cornerRadius: 8, fill: '#0160ff' }],
        background: { fill: '#f9fafb' }
      };

      this.pieRatingOptions = {
        theme: ratingTheme,
        data: [
          { rating: 1, count: 12 },
          { rating: 2, count: 23 },
          { rating: 3, count: 45 },
          { rating: 4, count: 78 },
          { rating: 5, count: 142 }
        ],
        title: {
          text: "Customer rating",
        },
        series: [
          {
            type: "pie",
            angleKey: "count",
            legendItemKey: "rating",
          },
        ],
        background: { fill: '#f9fafb' }
      };

      this.pieGenresOptions = {
        data: [
          { genre: 'Fantasy', sales: 1250 },
          { genre: 'Science Fiction', sales: 1100 },
          { genre: 'Romance', sales: 950 },
          { genre: 'Detective', sales: 820 },
          { genre: 'Historical', sales: 700 },
          { genre: 'Biography', sales: 560 },
          { genre: 'Self-Help', sales: 480 },
          { genre: 'Children\'s Literature', sales: 450 },
          { genre: 'Adventure', sales: 420 },
          { genre: 'Poetry', sales: 360 }
        ],
        title: {
          text: "Top Selling Genres",
        },
        series: [
          {
            type: "pie", 
            angleKey: "sales",
            legendItemKey: "genre",
          },
        ],
        background: { fill: '#f9fafb' },
        legend: {
          enabled: true,
          position: "right"
        }
      };

      this.pieAvatarsOptions = {
        data: [
          { avatar: 'Avatar 1', usage: 120 },
          { avatar: 'Avatar 2', usage: 95 },
          { avatar: 'Avatar 3', usage: 80 },
          { avatar: 'Avatar 4', usage: 75 },
          { avatar: 'Avatar 5', usage: 60 },
          { avatar: 'Avatar 6', usage: 55 },
          { avatar: 'Avatar 7', usage: 50 },
          { avatar: 'Avatar 8', usage: 45 },
          { avatar: 'Avatar 9', usage: 40 },
          { avatar: 'Avatar 10', usage: 35 },
          { avatar: 'Avatar 11', usage: 25 },
          { avatar: 'Avatar 12', usage: 20 }
        ],
        title: {
          text: "Avatar Usage Distribution",
        },
        series: [
          {
            type: "pie",
            angleKey: "usage",
            legendItemKey: "avatar"
          }
        ],
        legend: {
          enabled: true,
          position: "right"
        },
        background: { fill: '#f9fafb' }
      };

  }

}
