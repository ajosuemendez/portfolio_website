import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { translations } from '../../../translations/translations';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit, OnDestroy {
  aboutCopy: any = translations.en.about;
  activeTab: 'intro' | 'capabilities' | 'experience' | 'education' = 'intro';

  private readonly tabOrder: Array<'intro' | 'capabilities' | 'experience' | 'education'> = [
    'intro',
    'capabilities',
    'experience',
    'education',
  ];
  private languageSubscription?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.aboutCopy = translations[lang].about;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  selectTab(tab: 'intro' | 'capabilities' | 'experience' | 'education'): void {
    this.activeTab = tab;
  }

  scrollToSection(event: Event, tab: 'intro' | 'capabilities' | 'experience' | 'education'): void {
    event.preventDefault();
    this.selectTab(tab);

    const panel = document.getElementById('about-content');
    const section = document.getElementById(`about-section-${tab}`);
    if (!panel || !section) {
      return;
    }

    const top = section.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop;
    panel.scrollTo({ top, behavior: 'smooth' });
  }

  onPanelScroll(event: Event): void {
    const panel = event.currentTarget as HTMLElement;
    const activationLine = panel.getBoundingClientRect().top + Math.min(150, panel.clientHeight * 0.3);
    const sections = panel.querySelectorAll<HTMLElement>('[data-about-section]');
    let activeTab = this.tabOrder[0];

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationLine) {
        activeTab = section.dataset['aboutSection'] as typeof activeTab;
      }
    });

    this.selectTab(activeTab);
  }
}
