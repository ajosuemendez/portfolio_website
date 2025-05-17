import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit, OnDestroy {
  @Input() project: any;  // Accepts a single project object

  @ViewChild('cardRef') cardRef!: ElementRef<HTMLDivElement>;

  isMobile = false;

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkMobile);
  }

  checkMobile = () => {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleDetails() {
    this.project.expanded = !this.project.expanded;

    if (this.project.expanded) {
      setTimeout(() => {
        this.cardRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300); // Adjust delay to match CSS transition duration
    }
  }
}
