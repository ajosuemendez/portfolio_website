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
  mobileMoreOpen = false;
  currentRoute = '/';
  orbitActiveIndex = 0;
  private orbitTargetIndex = 0;
  wrapRoutePath: string | null = null;
  wrapDirection: 'top-to-bottom' | 'bottom-to-top' | null = null;

  readonly navItems: { path: string; label: keyof typeof translations.en.navLabels }[] = [
    { path: '/', label: 'home' },
    { path: '/me', label: 'me' },
    { path: '/work', label: 'work' },
    { path: '/email', label: 'email' },
    { path: '/cv', label: 'cv' },
  ];

  readonly moreItems: { path: string; label: keyof typeof translations.en.navLabels }[] = [
    { path: '/me', label: 'me' },
    { path: '/email', label: 'email' },
    { path: '/cv', label: 'cv' },
  ];

  get orbitNavItems(): Array<{
    path: string;
    label: keyof typeof translations.en.navLabels;
    left: number;
    top: number;
    distance: number;
    isCurrent: boolean;
    wrapDirection: 'top-to-bottom' | 'bottom-to-top' | null;
  }> {
    const centerX = 0;
    const centerY = 240;
    const radius = 230;

    return this.navItems.map((item, index) => {
      const relativeIndex = (index - this.orbitActiveIndex + this.navItems.length) % this.navItems.length;
      const slot = relativeIndex > this.navItems.length / 2
        ? relativeIndex - this.navItems.length
        : relativeIndex;
      const angle = (slot * 45 * Math.PI) / 180;
      return {
        ...item,
        left: centerX + radius * Math.cos(angle),
        top: centerY + radius * Math.sin(angle),
        distance: Math.abs(slot),
        isCurrent: index === this.orbitActiveIndex,
        wrapDirection: item.path === this.wrapRoutePath ? this.wrapDirection : null,
      };
    });
  }

  private get activeRouteIndex(): number {
    const routePath = this.getRoutePath(this.currentRoute);
    return this.navItems.findIndex((item) => item.path === routePath);
  }

  private getRoutePath(route: string): string {
    return route.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  }

  trackByNavPath(_index: number, item: { path: string }): string {
    return item.path;
  }

  private languageSubscription?: Subscription;
  private routerSubscription?: Subscription;
  private orbitStepTimer?: ReturnType<typeof setTimeout>;

  constructor(private languageService: LanguageService, private router: Router) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.orbitActiveIndex = Math.max(0, this.activeRouteIndex);
    this.orbitTargetIndex = this.orbitActiveIndex;
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
        const nextIndex = this.navItems.findIndex(
          (item) => item.path === this.getRoutePath(event.urlAfterRedirects)
        );

        this.animateOrbitTo(nextIndex);
        this.currentRoute = event.urlAfterRedirects;
        this.contentArea.nativeElement.scrollTop = 0;
        this.mobileMoreOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    if (this.orbitStepTimer) {
      clearTimeout(this.orbitStepTimer);
    }
  }

  finishOrbitStep(): void {
    this.wrapRoutePath = null;
    this.wrapDirection = null;
  }

  private animateOrbitTo(targetIndex: number): void {
    if (targetIndex < 0) {
      return;
    }

    this.orbitTargetIndex = targetIndex;
    if (!this.orbitStepTimer) {
      this.advanceOrbitStep();
    }
  }

  private advanceOrbitStep(): void {
    const targetIndex = this.orbitTargetIndex;
    if (targetIndex === this.orbitActiveIndex) {
      this.orbitStepTimer = undefined;
      return;
    }

    const stepCount = this.navItems.length;
    const stepsForward = (targetIndex - this.orbitActiveIndex + stepCount) % stepCount;
    const direction = stepsForward <= Math.floor(stepCount / 2) ? 1 : -1;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const advance = () => {
      if (this.orbitActiveIndex === targetIndex) {
        this.orbitStepTimer = undefined;
        return;
      }

      const previousIndex = this.orbitActiveIndex;
      const wrappingIndex = direction === 1
        ? (previousIndex - 2 + stepCount) % stepCount
        : (previousIndex + 2) % stepCount;

      this.wrapRoutePath = this.navItems[wrappingIndex].path;
      this.wrapDirection = direction === 1 ? 'top-to-bottom' : 'bottom-to-top';
      this.orbitActiveIndex = (previousIndex + direction + stepCount) % stepCount;

      this.orbitStepTimer = setTimeout(() => {
        this.finishOrbitStep();
        this.orbitStepTimer = undefined;
        if (this.orbitActiveIndex !== this.orbitTargetIndex) {
          this.orbitStepTimer = setTimeout(() => {
            this.orbitStepTimer = undefined;
            this.advanceOrbitStep();
          }, reduceMotion ? 0 : 90);
        } else {
          this.orbitStepTimer = undefined;
        }
      }, reduceMotion ? 0 : 720);
    };

    advance();
  }

  get isMoreRoute(): boolean {
    return this.currentRoute.startsWith('/me') ||
      this.currentRoute.startsWith('/email') ||
      this.currentRoute.startsWith('/cv');
  }

  toggleMoreMenu(): void {
    this.mobileMoreOpen = !this.mobileMoreOpen;
  }

  closeMenu(): void {
    this.mobileMoreOpen = false;
  }

  setLanguage(lang: 'en' | 'de'): void {
    this.languageService.setLanguage(lang);
  }
}
