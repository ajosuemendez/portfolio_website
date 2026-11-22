import { Component } from '@angular/core';
import { ProjectsComponent } from '../../components/projects/projects.component';

@Component({
  selector: 'work',
  standalone: true,
  imports: [ProjectsComponent],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css'],
})
export class WorkComponent {}
