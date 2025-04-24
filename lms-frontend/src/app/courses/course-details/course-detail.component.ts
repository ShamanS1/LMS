import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgressToggleComponent } from "../../progress/progress-toggle.component";
import { ProgressBarComponent } from "../../progress/progress-bar/progress-bar.component";
import { AuthService } from '../../auth/auth.service'; // assume user is stored here


@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressToggleComponent, ProgressBarComponent,RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {
  courseId = '';
  course: any;
  structure: any[] = [];
  enrolled = false;
  loading = true;
mat: any;
  toastr: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    ) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];

    this.http.get(`http://localhost:5000/api/courses/${this.courseId}`).subscribe({
      next: (data: any) => {
        this.course = data;
        const userId = this.auth.getUser()?._id;
        this.enrolled = data.enrolledStudents?.includes(userId);
        this.checkStructure();
      },
      error: err => console.error(err)
    });
  }

  checkStructure() {
    this.http.get<any[]>(`http://localhost:5000/api/courses/${this.courseId}/structure`).subscribe({
      next: data => {
        this.structure = data;
        this.loading = false;
      },
      error: err => {
        if (err.status === 403) this.enrolled = false;
        this.loading = false;
      }
    });
  }

  enroll() {
    this.http.post(`http://localhost:5000/api/courses/${this.courseId}/enroll`, {}).subscribe({
      next: () => {
        this.enrolled = true;
        this.checkStructure();
        this.toastr.success('Enrolled successfully');
        this.router.navigate(['/my-courses']);
      },
      error: err => alert(err.error.message || 'Enrollment failed')
    });
  }
}
