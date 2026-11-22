import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { translations } from '../../../translations/translations';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProjectsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  homeCopy: any = translations.en.home;

  private languageSubscription?: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.homeCopy = translations[lang].home;
    });
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }
}
