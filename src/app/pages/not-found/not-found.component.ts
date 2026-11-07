import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
})
export class NotFoundComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      route: '/404',
    });
  }
}
