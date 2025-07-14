// product-list.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  projects = [
    {
      title: 'Portfolio Website',
      tech: ['Angular', 'TypeScript', 'Nginx', 'Docker'],
      description: 'A personal portfolio showcasing my work and resume.',
      expanded: false,
      imagePath: 'assets/images/portfolio.png'
    },
    {
      title: 'Decision Support App - Slack',
      tech: ['React', 'Python', 'MySQL'],
      description: 'App that helps groups to make important decision while traveling on the phone/tablet.',
      expanded: false,
      link: 'https://info.ajosuemendez.com/decision-support/',
      imagePath: 'assets/images/dsp-frontpage.png'
    },
    {
      title: 'Online Chatbot Escape Room',
      tech: ['React', 'Python', 'Rasa', 'Docker'],
      description: 'An online chatbot for playing escape rooms.',
      expanded: false,
      imagePath: 'assets/images/portfolio.png'
    }
  ];
}
