import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { translations } from '../../translations/translations';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLElement>;

  selectedLang: 'en' | 'de' = 'en';
  navLabels: Record<keyof typeof translations.en.navLabels, string> = translations.en.navLabels;
  uiText: Record<keyof typeof translations.en.uiText, string> = translations.en.uiText;
  mobileMenuOpen = false;

  readonly navItems: { path: string; label: keyof typeof translations.en.navLabels }[] = [
    { path: '/', label: 'home' },
    { path: '/me', label: 'me' },
    { path: '/work', label: 'work' },
    { path: '/email', label: 'email' },
    { path: '/cv', label: 'cv' },
  ];

  private languageSubscription?: Subscription;
  private routerSubscription?: Subscription;

  constructor(private languageService: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLang = lang;
      document.documentElement.lang = lang;
      this.navLabels = translations[lang].navLabels;
      this.uiText = translations[lang].uiText;
    });
  }

  ngAfterViewInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.contentArea.nativeElement.scrollTop = 0;
      }
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  setLanguage(lang: 'en' | 'de'): void {
    this.languageService.setLanguage(lang);
  }
}
