import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Header -->
    <div class="bg-gray-50 py-16 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">About SM Incubators</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">Precision Incubation. Trusted Results. We are a leading manufacturer of premium egg incubators in India.</p>
      </div>
    </div>

    <!-- Company Story -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div class="prose max-w-none text-gray-600 leading-relaxed space-y-4">
              <p>Founded with a passion for agricultural innovation, SM Incubators has grown from a small workshop in Bhimavaram to a trusted name in poultry farming equipment. We recognized the need for reliable, high-hatch-rate incubators that didn't break the bank.</p>
              <p>Over the years, we have continuously refined our technology, incorporating advanced microcomputer controls, superior insulation materials, and industrial-grade turning mechanisms. Our machines are built to withstand the rigors of continuous operation while maintaining the delicate micro-environment required for successful hatching.</p>
              <p>Today, our incubators are used by hobbyists, small-scale farmers, and large commercial hatcheries across the country.</p>
            </div>
          </div>
          <div class="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center text-gray-400 font-medium border border-gray-200 shadow-soft">
            Factory / Team Image Placeholder
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="py-16 bg-primary">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div class="p-6">
            <p class="text-4xl font-bold text-white mb-2">10+</p>
            <p class="text-blue-100 font-medium">Years Experience</p>
          </div>
          <div class="p-6">
            <p class="text-4xl font-bold text-white mb-2">5000+</p>
            <p class="text-blue-100 font-medium">Happy Customers</p>
          </div>
          <div class="p-6">
            <p class="text-4xl font-bold text-white mb-2">15+</p>
            <p class="text-blue-100 font-medium">Product Models</p>
          </div>
          <div class="p-6">
            <p class="text-4xl font-bold text-white mb-2">24/7</p>
            <p class="text-blue-100 font-medium">Customer Support</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission & Vision -->
    <div class="py-20 bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div class="bg-white p-10 rounded-2xl shadow-soft border border-gray-100">
            <div class="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p class="text-gray-600 leading-relaxed">To empower poultry farmers with highly efficient, durable, and easy-to-use incubation technology that maximizes hatch rates and profitability.</p>
          </div>
          <div class="bg-white p-10 rounded-2xl shadow-soft border border-gray-100">
            <div class="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-6">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p class="text-gray-600 leading-relaxed">To be the most trusted and innovative manufacturer of agricultural incubation systems globally, setting the standard for quality and performance.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.setSeoData({
      title: 'About Us',
      description: 'Learn about SM Incubators, our mission, vision, and our commitment to manufacturing the best egg incubators in the industry.',
      route: '/about'
    });
  }
}
