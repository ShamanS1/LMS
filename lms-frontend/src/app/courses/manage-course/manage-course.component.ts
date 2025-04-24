import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.css']
})
export class ManageCourseComponent implements OnInit {
  courseId = '';
  course: any = {};
  sections: any[] = [];
  newSectionTitle = '';
  newMaterialTitle: string = '';
newMaterialType: string = 'pdf';
newMaterialUrl: string = '';
newMaterialFile: File | null = null;
studentProgress: any[] = [];

loadStudentProgress() {
  this.http.get<any[]>(`http://localhost:5000/api/progress/course/${this.courseId}`)
    .subscribe(res => {
      this.studentProgress = res;
    });
}


onFileChange(event: any) {
  this.newMaterialFile = event.target.files[0];
}


  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.loadCourse();
    this.loadSections();
    this.loadStudentProgress();

  }

  loadCourse() {
    this.http.get(`http://localhost:5000/api/courses/${this.courseId}`).subscribe(res => {
      this.course = res;
    });
  }

  loadSections() {
    this.http.get<any[]>(`http://localhost:5000/api/sections/course/${this.courseId}`).subscribe(res => {
      this.sections = res;
    });
  }

  addSection() {
    this.http.post(`http://localhost:5000/api/sections`, {
      courseId: this.courseId,
      title: this.newSectionTitle
    }).subscribe(() => {
      this.newSectionTitle = '';
      this.loadSections();
    });
  }

  deleteSection(sectionId: string) {
    this.http.delete(`http://localhost:5000/api/sections/${sectionId}`).subscribe(() => {
      this.loadSections();
    });
  }

  uploadMaterial(sectionId: string) {
    const formData = new FormData();
    formData.append('title', this.newMaterialTitle);
    formData.append('type', this.newMaterialType);
    formData.append('sectionId', sectionId);
    formData.append('courseId', this.courseId);
  
    if (this.newMaterialType === 'youtube' || this.newMaterialType === 'text') {
      formData.append('content', this.newMaterialUrl);
    } else if (this.newMaterialFile) {
      formData.append('file', this.newMaterialFile);
    }
  
    this.http.post('http://localhost:5000/api/materials', formData).subscribe(() => {
      this.newMaterialTitle = '';
      this.newMaterialType = 'pdf';
      this.newMaterialUrl = '';
      this.newMaterialFile = null;
      this.loadSections();
    });
  }
  
}
