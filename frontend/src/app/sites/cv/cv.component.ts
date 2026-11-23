import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LanguageService } from '../../services/language.service';
import { translations } from '../../../translations/translations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cv',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
})
export class CvComponent implements OnInit, OnDestroy {
  pdfSrc = 'assets/cvs/Lebenslauf_Alejandro_Mendez.pdf';
  downloadText = 'Download';
  cvCopy: any = translations.en.cv;
  uiText: Record<keyof typeof translations.en.uiText, string> = translations.en.uiText;
  currentPage = 1;
  totalPages = 0;
  isPageChanging = false;
  pageTurnPhase: 'idle' | 'out' | 'in' = 'idle';
  pageTurnDirection: 'next' | 'previous' = 'next';

  private langSub!: Subscription;
  private pageChangeTimer?: ReturnType<typeof setTimeout>;

  // Inject the service using Angular's inject() for standalone component
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.langSub = this.languageService.language$.subscribe((lang: 'en' | 'de') => {
      this.downloadText = translations[lang].uiText.download;
      this.uiText = translations[lang].uiText;
      this.cvCopy = translations[lang].cv;
    });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
    if (this.pageChangeTimer) {
      clearTimeout(this.pageChangeTimer);
    }
  }

  onPdfLoad(document: { numPages: number }): void {
    this.totalPages = document.numPages;
    this.currentPage = Math.min(this.currentPage, this.totalPages);
  }

  previousPage(): void {
    this.setPage(Math.max(1, this.currentPage - 1), 'previous');
  }

  nextPage(): void {
    this.setPage(Math.min(this.totalPages, this.currentPage + 1), 'next');
  }

  private setPage(page: number, direction: 'next' | 'previous'): void {
    if (page === this.currentPage) {
      return;
    }

    if (this.pageChangeTimer) {
      clearTimeout(this.pageChangeTimer);
    }

    this.pageTurnDirection = direction;
    this.pageTurnPhase = 'out';
    this.isPageChanging = true;
    this.pageChangeTimer = setTimeout(() => {
      this.currentPage = page;
      this.pageTurnPhase = 'in';
      this.pageChangeTimer = setTimeout(() => {
        this.pageTurnPhase = 'idle';
        this.isPageChanging = false;
        this.pageChangeTimer = undefined;
      }, 300);
    }, 240);
  }
}
