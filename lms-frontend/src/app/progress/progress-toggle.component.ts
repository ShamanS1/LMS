import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-progress-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-toggle.component.html',
  styleUrls: ['./progress-toggle.component.css']
})
export class ProgressToggleComponent implements OnInit {
  @Input() courseId = '';
  @Input() materialId = '';
  isCompleted = false;
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProgress();
  }

  getProgress() {
    this.http.get<any>(`http://localhost:5000/api/progress/${this.courseId}`)
      .subscribe({
        next: res => {
          this.isCompleted = res.completedMaterials.some((m: any) => m._id === this.materialId);
        }
      });
  }

  toggleProgress() {
    this.loading = true;
    this.http.post(`http://localhost:5000/api/progress/${this.courseId}/materials/${this.materialId}/toggle`, {})
      .subscribe({
        next: (res: any) => {
          this.isCompleted = res.completedMaterials.some((m: any) => m._id === this.materialId);
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }
}
