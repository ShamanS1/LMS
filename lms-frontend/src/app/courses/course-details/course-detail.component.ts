import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProgressToggleComponent } from "../../progress/progress-toggle.component";
import { ProgressBarComponent } from "../../progress/progress-bar/progress-bar.component";
import { AuthService } from '../../auth/auth.service'; // assume user is stored here
import { StudentNavComponent } from '../../dashboard/student/student-nav/student-nav.component';


@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProgressToggleComponent, ProgressBarComponent,StudentNavComponent],
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
  courseProgress: number | null = null;


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
        if (this.enrolled) {
          this.checkEligibility(); 
        }
        
      },
      error: err => console.error(err)
    });
  }

  checkStructure() {
    this.http.get<any[]>(`http://localhost:5000/api/courses/${this.courseId}/structure`).subscribe({
      next: data => {
        if (this.enrolled) {
          
          // Fetch progress
          this.http.get<any>(`http://localhost:5000/api/progress/${this.courseId}`).subscribe({
            next: progressRes => {
              const completedIds = progressRes.completedMaterials.map((m: any) => m._id);
              // Enhance structure to mark which section is completed
              this.structure = data.map(sec => {
                const sectionMaterials = sec.materials;
                const doneCount = sectionMaterials.filter((m: any) => completedIds.includes(m._id)).length;
                const isSectionComplete = sectionMaterials.length > 0 && doneCount === sectionMaterials.length;
  
                return {
                  ...sec,
                  isCompleted: isSectionComplete,
                  materials: sectionMaterials.map((mat: any) => ({
                    ...mat,
                    isCompleted: completedIds.includes(mat._id)
                  }))
                };
              });
              this.loading = false;
            },
            error: () => {
              this.structure = data; // fallback
              this.loading = false;
            }
          });
        } else {
          this.structure = data;
          this.loading = false;
        }
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

  certificateEligible = false;

checkEligibility() {
  this.http.get<{ eligible: boolean }>(`http://localhost:5000/api/certificates/${this.courseId}/eligibility`)
    .subscribe({
      next: res => {
        this.certificateEligible = res.eligible;
      },
      error: err => console.error('Eligibility check failed', err)
    });
}

downloadMaterial(matId: string, filename: string) {
  const token = localStorage.getItem('token');
  this.http.get(`http://localhost:5000/api/materials/${matId}/download`, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Download failed', error);
  });
}

downloadCertificate() {
  const token = localStorage.getItem('token');
  this.http.get(`http://localhost:5000/api/certificates/${this.courseId}/download`, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.course?.title || 'certificate'}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Certificate download failed', error);
  });
}



}
