import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  NavigationStart,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('contentArea') contentArea!: ElementRef<HTMLElement>;

  isScrolled = false;
  isHome = false;
  isLoading = false;

  selectedLang: 'en' | 'de' = 'en';
  currentRoute: string = '';

  private languageSubscription!: Subscription;
  private routerSubscription!: Subscription;

  debouncedIsLoading = false;
  private loadingTimeout: any;

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.setViewportHeight();
    window.addEventListener('resize', this.setViewportHeight);

    this.pressedButton = this.router.url;

    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLang = lang;
    });

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;

        // Delay setting the visible loading flag to avoid flicker
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => {
          if (this.isLoading) {
            this.debouncedIsLoading = true;
          }
        }, 100); // 100ms threshold – adjust as needed

      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;

        // Small delay to allow fade out
        clearTimeout(this.loadingTimeout);
        setTimeout(() => {
          this.debouncedIsLoading = false;
        }, 100); // smooth fade-out
      }

      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        this.isHome = this.currentRoute === '/' || this.currentRoute === '/home';
      }
    });
  }

  ngAfterViewInit(): void {
    this.contentArea.nativeElement.addEventListener('scroll', () => {
      this.isScrolled = this.contentArea.nativeElement.scrollTop > 440;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setViewportHeight);
    this.languageSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  navigate(path: string): void {
    this.isLoading = true; // immediate feedback
    requestAnimationFrame(() => {
      this.router.navigate([path]);
    });
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }

  pressedButton: string | null = null;

  handlePress(path: string): void {
    this.pressedButton = path;
  }

  handleRelease(): void {
    setTimeout(() => {
      this.pressedButton = null;
    }, 150);
  }
}