import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'About Us',
      description:
        'Learn about SM Incubators, our journey, and our commitment to providing top-quality, high-hatch-rate egg incubators for farmers across India.',
      keywords: 'about sm incubators, incubator manufacturer, poultry farming experts, egg incubator company',
      route: '/about',
    });
  }
}
