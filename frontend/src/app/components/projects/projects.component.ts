import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChildren(CardComponent, { read: ElementRef }) cards!: QueryList<ElementRef>;
  @ViewChild('titleRef') titleRef!: ElementRef;

  projects = [
    {
      title: 'Decision Support App - Slack',
      tech: ['React', 'Python', 'MySQL'],
      description: 'App that helps groups to make important decision while traveling on the phone/tablet.',
      expanded: false,
      link: 'https://info.ajosuemendez.com/decision-support/',
      imagePath: 'assets/images/dsp-frontpage.png',
    },
    {
      title: 'Online Training Chatbot',
      tech: ['React', 'Python', 'Rasa', 'Docker'],
      description: 'Simulation of people with psychological problems using chatbots for training using appropriate conversation methods..',
      expanded: false,
      imagePath: 'assets/images/chatbot-demo.png',
    },
    {
      title: 'Portfolio Website',
      tech: ['Angular', 'TypeScript', 'Nginx', 'Docker'],
      description: 'A personal portfolio showcasing my work and resume.',
      expanded: false,
      imagePath: 'assets/images/portfolio.png',
    },
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe title
    if (this.titleRef?.nativeElement) {
      observer.observe(this.titleRef.nativeElement);
    }

    // Observe each card
    this.cards.forEach((card) => observer.observe(card.nativeElement));
  }
}
