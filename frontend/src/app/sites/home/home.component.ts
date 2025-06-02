// product-list.component.ts
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, ProjectsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit  {
  selectedLang: 'en' | 'de' = 'en';
  private langSub!: Subscription;
  @ViewChild('languageSwitchContainer') languageSwitchContainer!: ElementRef<HTMLDivElement>;
  topOverlayHeight: number = 0;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.langSub = this.languageService.language$.subscribe(lang => {
      this.selectedLang = lang;
    });
  }

   ngAfterViewInit(): void {
  setTimeout(() => {
    const rect = this.languageSwitchContainer.nativeElement.getBoundingClientRect();
    this.topOverlayHeight = rect.top + rect.height / 2;
    console.log('Overlay height:', this.topOverlayHeight);
  });
}

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
