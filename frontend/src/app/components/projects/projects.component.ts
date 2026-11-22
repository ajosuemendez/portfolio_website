import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { translations } from '../../../translations/translations';
import { LanguageService } from '../../services/language.service';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'projects',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  @Input() variant: 'home' | 'work' = 'home';

  projects: any[] = [];
  selectedLang: 'en' | 'de' = 'en';

  private languageSubscription?: Subscription;

  constructor(private languageService: LanguageService) {}

  get title(): string {
    return this.variant === 'work'
      ? translations[this.selectedLang].workTitle
      : translations[this.selectedLang].projectsTitle;
  }

  get description(): string {
    return this.variant === 'work'
      ? translations[this.selectedLang].workIntro
      : translations[this.selectedLang].projectsIntro;
  }

  get eyebrow(): string {
    return this.variant === 'work'
      ? translations[this.selectedLang].workEyebrow
      : translations[this.selectedLang].projectsEyebrow;
  }

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLang = lang;
      this.projects = translations[lang].projects;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}
