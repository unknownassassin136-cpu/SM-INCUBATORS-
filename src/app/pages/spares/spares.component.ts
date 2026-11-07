import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { SeoService } from '../../services/seo.service';
import { SpareCardComponent } from '../../shared/spare-card/spare-card.component';
import { Spare } from '../../models/product.model';

@Component({
  selector: 'app-spares',
  standalone: true,
  imports: [CommonModule, SpareCardComponent],
  templateUrl: './spares.component.html',
  styleUrls: ['./spares.component.css'],
})
export class SparesComponent implements OnInit {
  private dataService = inject(DataService);
  private seoService = inject(SeoService);
  private cdr = inject(ChangeDetectorRef);

  spares: Spare[] = [];

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Spare Parts & Accessories',
      description:
        'Find high-quality spare parts and accessories for your egg incubators. Heating elements, turning motors, controllers, and more.',
      keywords:
        'incubator spare parts, incubator accessories, turning motor, heating element, temperature controller, egg tray',
      route: '/spares',
    });

    this.dataService.getSpares().subscribe((spares) => {
      this.spares = spares || [];
      this.cdr.detectChanges();
    });
  }
}
