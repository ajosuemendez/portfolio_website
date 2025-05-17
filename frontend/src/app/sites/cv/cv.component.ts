import { Component } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'cv',
  standalone: true,
  imports: [PdfViewerModule],
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
})
export class CvComponent {
  pdfSrc = "assets/cvs/Lebenslauf_Alejandro_Mendez.pdf";

}