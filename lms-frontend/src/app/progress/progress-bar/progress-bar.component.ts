import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input() courseId = '';
  percent: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>(`http://localhost:5000/api/progress/${this.courseId}`).subscribe({
      next: res => {
        this.percent = res.percent || 0;
      },
      error: err => console.error('Progress fetch failed', err)
    });
  }
}
