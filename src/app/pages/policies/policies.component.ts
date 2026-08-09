import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 py-16 border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ title }}</h1>
        <p class="text-xl text-gray-600">Last updated: {{ lastUpdated }}</p>
      </div>
    </div>

    <div class="py-16 bg-white min-h-[50vh]">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose max-w-none text-gray-700 leading-relaxed" [innerHTML]="content"></div>
      </div>
    </div>
  `
})
export class PoliciesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private seoService = inject(SeoService);

  title = '';
  lastUpdated = 'January 1, 2026';
  content = '';
  
  policyData: Record<string, { title: string, content: string }> = {
    'privacy-policy': {
      title: 'Privacy Policy',
      content: `
        <h3>1. Introduction</h3>
        <p>At SM Incubators, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
        <h3>2. Information We Collect</h3>
        <p>We may collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products, particularly through our contact forms or WhatsApp communications. This may include your name, phone number, and email address.</p>
        <h3>3. How We Use Your Information</h3>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to respond to customer service requests, provide quotes, and process transactions.</p>
      `
    },
    'terms': {
      title: 'Terms & Conditions',
      content: `
        <h3>1. Agreement to Terms</h3>
        <p>By accessing our website, you agree to be bound by these Terms and Conditions and agree that you are responsible for compliance with any applicable local laws.</p>
        <h3>2. Products</h3>
        <p>We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the website. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors.</p>
        <h3>3. Pricing and Quotes</h3>
        <p>Prices are not displayed on the website as they may fluctuate based on raw material costs and shipping requirements. Official quotes provided via WhatsApp or Email are valid for 7 days.</p>
      `
    },
    'shipping-policy': {
      title: 'Shipping Policy',
      content: `
        <h3>1. Processing Time</h3>
        <p>All standard orders are processed within 2-3 business days. Commercial or bulk orders may take 5-7 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        <h3>2. Shipping Rates & Delivery Estimates</h3>
        <p>Shipping charges for your order will be calculated and displayed during the quoting process. Delivery delays can occasionally occur due to transport availability.</p>
        <h3>3. Damages</h3>
        <p>SM Incubators is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.</p>
      `
    },
    'return-policy': {
      title: 'Return Policy',
      content: `
        <h3>1. Returns</h3>
        <p>You have 7 calendar days to return an item from the date you received it if it is defective upon arrival. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
        <h3>2. Refunds</h3>
        <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment.</p>
        <h3>3. Warranty Replacements</h3>
        <p>If a part fails during the warranty period, we will provide replacement parts free of charge. Shipping costs for warranty parts may apply.</p>
      `
    }
  };

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const path = segments[0]?.path;
      if (path && this.policyData[path]) {
        const policy = this.policyData[path];
        this.title = policy.title;
        this.content = policy.content;
        
        this.seoService.setSeoData({
          title: `${this.title} | Policies`,
          description: this.content.substring(0, 150) + '...',
          keywords: 'sm incubators policies, terms and conditions, privacy policy, refund policy, shipping policy',
          route: `/${path}`
        });
      }
    });
  }
}
