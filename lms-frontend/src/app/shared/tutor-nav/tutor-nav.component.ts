import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tutor-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tutor-nav.component.html',
  styleUrls: ['./tutor-nav.component.css']
})
export class TutorNavComponent {}
