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
  pdfSrc = "assets/cvs/Lebenslauf_Alejandro_Mendez.pdf";
  downloadText = 'Download';

  private langSub!: Subscription;

  // Inject the service using Angular's inject() for standalone component
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.langSub = this.languageService.language$.subscribe((lang: 'en' | 'de') => {
      this.downloadText = translations[lang].uiText.download;
    });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }
}
