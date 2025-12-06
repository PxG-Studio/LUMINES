/**
 * LandingLayout Component
 * Main layout for landing page with all sections
 */

'use client';

import React from "react";
import { HeroSection } from "./HeroSection";
import { FeatureGrid } from "./FeatureGrid";
import { Footer } from "./Footer";
import { SimpleNav } from "./SimpleNav";
import { SocialProof } from "./SocialProof";
import { ProductDemo } from "./ProductDemo";
import { DetailedFeatures } from "./DetailedFeatures";
import { PricingSection } from "./PricingSection";
import { UseCasesSection } from "./UseCasesSection";
import { FAQ } from "./FAQ";
import { StatsSection } from "./StatsSection";
import { BenefitsSection } from "./BenefitsSection";
import { IntegrationsShowcase } from "./IntegrationsShowcase";
import { ComparisonTable } from "./ComparisonTable";
import { CTASection } from "./CTASection";
import { StickyCTA } from "./StickyCTA";

export function LandingLayout() {
  return (
    <div
      style={{
        background: "var(--nv-bg-0)",
        minHeight: "100vh",
        color: "var(--nv-text-0)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <SimpleNav />
      <HeroSection />
      <StatsSection />

      {/* Feature Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px", backgroundColor: "var(--nv-bg-0)" }}>
        <FeatureGrid />
      </div>

      {/* Mid-page CTA */}
      <CTASection
        variant="accent"
        title="Ready to Transform Your Workflow?"
        description="Join thousands of developers building faster with Lumenforge.io. Start for free, no credit card required."
        primaryCTA="Start Coding Now"
        primaryLink="/slate/ide"
        secondaryCTA="View Demo"
        secondaryLink="/demo"
      />

      <DetailedFeatures />
      <ProductDemo />
      <BenefitsSection />
      <UseCasesSection />
      <SocialProof />
      <IntegrationsShowcase />
      <ComparisonTable />
      <PricingSection />
      <FAQ />

      {/* End-of-page CTA */}
      <CTASection
        variant="default"
        title="Start Building Today"
        description="Everything you need to build, preview, and deploy faster. Get started in seconds."
        primaryCTA="Get Started Free"
        primaryLink="/slate/ide"
        secondaryCTA="Schedule Demo"
        secondaryLink="/contact"
      />

      <Footer />
      <StickyCTA />
    </div>
  );
}

