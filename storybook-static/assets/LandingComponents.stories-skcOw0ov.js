import{j as T,T as Y}from"./iframe-BXkX_8oL.js";import{L as q}from"./LandingLayout-RgCRShq0.js";import"./preload-helper-C1FmrZbK.js";import"./SimpleNav-9elFKaWt.js";import"./Button-CDJro0XR.js";import"./File-BlZ5GgWr.js";import"./git-branch-DExO_pBL.js";import"./createLucideIcon-kSpmkMCE.js";import"./ChevronRight-1H6bY8tN.js";import"./x-BrWRloni.js";const{expect:e,within:W,userEvent:s,waitFor:B,fn:$}=__STORYBOOK_MODULE_TEST__,ee={title:"Lumenforge.io Design System/WIS2L Framework/Landing/Shared Framework Components/LandingComponents",id:"wis2l-landing-components-stories",component:q,decorators:[l=>T.jsx(Y,{children:T.jsx(l,{})})],parameters:{layout:"fullscreen",backgrounds:{default:"dark"},actions:{handles:["click","keydown","keyup","focus","blur"]},a11y:{config:{rules:[{id:"color-contrast",enabled:!0,reviewOnFail:!0}]}}},tags:["autodocs"],argTypes:{}},r={render:()=>T.jsx(q,{}),play:async({canvasElement:l,step:c})=>{const t=W(l);await c("1. Verify complete page structure",async()=>{const n=await t.findByText(/Your Entire Creative Pipeline in One Workspace/i);e(n).toBeInTheDocument(),e(n.tagName).toBe("H1");const o=t.getByText(/Active Developers/i);e(o).toBeInTheDocument(),e(o).toBeVisible();const a=t.getAllByRole("heading",{name:/Instant Preview/i});e(a.length).toBeGreaterThanOrEqual(1),e(a[0]).toBeVisible();const u=t.getByText(/Everything You Need to Build Faster/i);e(u).toBeInTheDocument(),e(u).toBeVisible();const i=t.getByText(/Why Choose Lumenforge.io/i);e(i).toBeInTheDocument(),e(i).toBeVisible();const d=t.getByText(/Perfect for Teams Like Yours/i);e(d).toBeInTheDocument(),e(d).toBeVisible();const y=t.getByText(/Compare to Alternatives/i);e(y).toBeInTheDocument(),e(y).toBeVisible();const h=t.getByText(/Simple, Transparent Pricing/i);e(h).toBeInTheDocument(),e(h).toBeVisible();const b=t.getByText(/Frequently Asked Questions/i);e(b).toBeInTheDocument(),e(b).toBeVisible()}),await c("2. Test navigation buttons",async()=>{const n=t.getByRole("button",{name:/^docs$/i});e(n).toBeInTheDocument(),e(n).toBeVisible(),await s.click(n);const o=t.getAllByRole("button",{name:/^open editor$/i});e(o.length).toBeGreaterThan(0);const a=o[0];await s.click(a)}),await c("3. Test hero CTA buttons",async()=>{const n=t.getByRole("button",{name:/^start coding$/i});e(n).toBeInTheDocument(),await s.click(n);const o=t.getByRole("button",{name:/^try ai generator$/i});e(o).toBeInTheDocument(),await s.click(o)}),await c("4. Test CTA section buttons",async()=>{const n=window.open,o=$();window.open=o;try{const a=t.getAllByRole("button",{name:/start coding now|get started free|view demo|schedule demo/i});e(a.length).toBeGreaterThan(0);for(const u of a.slice(0,2))e(u).toBeVisible(),await s.click(u);e(o).toHaveBeenCalled()}finally{window.open=n}}),await c("5. Test keyboard navigation",async()=>{const n=t.getByRole("button",{name:/^docs$/i});n.focus(),e(n).toHaveFocus(),await s.keyboard("{Tab}"),await s.keyboard("{Tab}"),await s.keyboard("{Tab}");const o=document.activeElement;o&&o.tagName==="BUTTON"&&await s.keyboard("{Enter}")}),await c("6. Test scroll behavior",async()=>{const n=t.getByText(/©/i);n.scrollIntoView({behavior:"smooth",block:"end"}),await B(()=>{e(n).toBeInTheDocument()},{timeout:2e3}),window.scrollTo({top:0,behavior:"smooth"}),await B(()=>{const o=t.getByText(/Your Entire Creative Pipeline in One Workspace/i);e(o).toBeInTheDocument()},{timeout:2e3})}),await c("7. Verify accessibility features",async()=>{t.getAllByRole("button").forEach(i=>{const d=i.textContent||i.getAttribute("aria-label");e(d==null?void 0:d.trim().length).toBeGreaterThan(0),e(i).toBeVisible()}),t.getAllByRole("link").forEach(i=>{e(i).toHaveAttribute("href"),e(i.getAttribute("href")).toBeTruthy()});const a=t.getAllByRole("heading");e(a.length).toBeGreaterThan(1);const u=a.find(i=>i.tagName==="H1");e(u).toBeInTheDocument()}),await c("8. Test feature section interactions",async()=>{const n=l.querySelectorAll('article[role="article"]');e(n.length).toBeGreaterThanOrEqual(3);const o=l.querySelectorAll("[aria-expanded]");if(o.length>0){const a=o[0];await s.click(a),await B(()=>{e(a.getAttribute("aria-expanded")).toBe("true")})}})}},p={...r,parameters:{...r.parameters},play:async({canvasElement:l,step:c})=>{const t=W(l);await c("Verify mobile layout",async()=>{const n=await t.findByText(/Your Entire Creative Pipeline in One Workspace/i);e(n).toBeInTheDocument();const o=t.getAllByRole("button");e(o.length).toBeGreaterThan(0);const a=t.getByRole("button",{name:/^start coding$/i});await s.click(a)})},globals:{viewport:{value:"mobile1",isRotated:!1}}},g={...r,parameters:{...r.parameters},globals:{viewport:{value:"tablet",isRotated:!1}}},m={...r,parameters:{...r.parameters},globals:{viewport:{value:"wideScreen",isRotated:!1}}};var f,w,v,x,E;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <LandingLayout />,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);

    // ==== STEP 1: STRUCTURAL VERIFICATION ====
    await step('1. Verify complete page structure', async () => {
      // Hero section
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');

      // Verify all major sections exist
      // Note: StatsSection does not render a literal "Stats" heading, so we
      // assert on one of its metric labels instead (e.g. "Active Developers").
      // StatsSection - verify via one of its labels
      const statsLabel = canvas.getByText(/Active Developers/i);
      expect(statsLabel).toBeInTheDocument();
      expect(statsLabel).toBeVisible();

      // FeatureGrid - there can be multiple \\"Instant Preview\\" matches across stories,
      // so be explicit: look for a heading that contains this text.
      const instantPreviewHeadings = canvas.getAllByRole('heading', {
        name: /Instant Preview/i
      });
      expect(instantPreviewHeadings.length).toBeGreaterThanOrEqual(1);
      expect(instantPreviewHeadings[0]).toBeVisible();

      // DetailedFeatures
      const detailedFeaturesHeading = canvas.getByText(/Everything You Need to Build Faster/i);
      expect(detailedFeaturesHeading).toBeInTheDocument();
      expect(detailedFeaturesHeading).toBeVisible();

      // Benefits
      const benefitsHeading = canvas.getByText(/Why Choose Lumenforge.io/i);
      expect(benefitsHeading).toBeInTheDocument();
      expect(benefitsHeading).toBeVisible();

      // Use Cases
      const useCasesHeading = canvas.getByText(/Perfect for Teams Like Yours/i);
      expect(useCasesHeading).toBeInTheDocument();
      expect(useCasesHeading).toBeVisible();

      // Comparison
      const comparisonHeading = canvas.getByText(/Compare to Alternatives/i);
      expect(comparisonHeading).toBeInTheDocument();
      expect(comparisonHeading).toBeVisible();

      // Pricing
      const pricingHeading = canvas.getByText(/Simple, Transparent Pricing/i);
      expect(pricingHeading).toBeInTheDocument();
      expect(pricingHeading).toBeVisible();

      // FAQ
      const faqHeading = canvas.getByText(/Frequently Asked Questions/i);
      expect(faqHeading).toBeInTheDocument();
      expect(faqHeading).toBeVisible();
    });

    // ==== STEP 2: NAVIGATION TESTING ====
    await step('2. Test navigation buttons', async () => {
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toBeVisible();
      await userEvent.click(docsButton);

      // Find "Open Editor" button (first instance in nav)
      const openEditorButtons = canvas.getAllByRole('button', {
        name: /^open editor$/i
      });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0];
      await userEvent.click(openEditorButton);
    });

    // ==== STEP 3: HERO BUTTONS ====
    await step('3. Test hero CTA buttons', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      expect(startCodingButton).toBeInTheDocument();
      await userEvent.click(startCodingButton);
      const tryAIGeneratorButton = canvas.getByRole('button', {
        name: /^try ai generator$/i
      });
      expect(tryAIGeneratorButton).toBeInTheDocument();
      await userEvent.click(tryAIGeneratorButton);
    });

    // ==== STEP 4: CTA SECTIONS ====
    await step('4. Test CTA section buttons', async () => {
      // Some CTA buttons call window.open (e.g. PricingSection). In Storybook / test
      // context we don't actually want to open new tabs, so temporarily stub it.
      const originalWindowOpen = window.open;
      const openSpy = fn();
      // @ts-ignore - allow assignment for test environment
      window.open = openSpy;
      try {
        const ctaButtons = canvas.getAllByRole('button', {
          name: /start coding now|get started free|view demo|schedule demo/i
        });
        expect(ctaButtons.length).toBeGreaterThan(0);
        for (const button of ctaButtons.slice(0, 2)) {
          // Test first 2 CTA buttons
          expect(button).toBeVisible();
          await userEvent.click(button);
        }

        // Ensure our stub was called at least once
        expect(openSpy).toHaveBeenCalled();
      } finally {
        // Restore original window.open so we don't affect other stories
        window.open = originalWindowOpen;
      }
    });

    // ==== STEP 5: KEYBOARD NAVIGATION ====
    await step('5. Test keyboard navigation', async () => {
      const firstButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      firstButton.focus();
      expect(firstButton).toHaveFocus();

      // Tab through interactive elements
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');

      // Enter key activation
      const focusedElement = document.activeElement as HTMLElement;
      if (focusedElement && focusedElement.tagName === 'BUTTON') {
        await userEvent.keyboard('{Enter}');
      }
    });

    // ==== STEP 6: SCROLL AND VIEWPORT ====
    await step('6. Test scroll behavior', async () => {
      // Scroll to bottom
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
      await waitFor(() => {
        expect(footer).toBeInTheDocument();
      }, {
        timeout: 2000
      });

      // Scroll back to top
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      await waitFor(() => {
        const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
        expect(heading).toBeInTheDocument();
      }, {
        timeout: 2000
      });
    });

    // ==== STEP 7: ACCESSIBILITY VERIFICATION ====
    await step('7. Verify accessibility features', async () => {
      // All buttons should have accessible names
      const allButtons = canvas.getAllByRole('button');
      allButtons.forEach(button => {
        const name = button.textContent || button.getAttribute('aria-label');
        expect(name?.trim().length).toBeGreaterThan(0);
        expect(button).toBeVisible();
      });

      // All links should have hrefs
      const allLinks = canvas.getAllByRole('link');
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toBeTruthy();
      });

      // Verify heading hierarchy
      const headings = canvas.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(1);
      const h1 = headings.find(h => h.tagName === 'H1');
      expect(h1).toBeInTheDocument();
    });

    // ==== STEP 8: FEATURE SECTIONS INTERACTION ====
    await step('8. Test feature section interactions', async () => {
      // Verify feature cards are present (3 or more)
      const featureCards = canvasElement.querySelectorAll('article[role="article"]');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);

      // Test FAQ accordion if visible
      const faqButtons = canvasElement.querySelectorAll('[aria-expanded]');
      if (faqButtons.length > 0) {
        const firstFAQ = faqButtons[0] as HTMLElement;
        await userEvent.click(firstFAQ);
        await waitFor(() => {
          expect(firstFAQ.getAttribute('aria-expanded')).toBe('true');
        });
      }
    });
  }
}`,...(v=(w=r.parameters)==null?void 0:w.docs)==null?void 0:v.source},description:{story:`Full Landing Page Layout\r
\r
Complete landing page with all sections:\r
- Navigation\r
- Hero Section\r
- Stats Section\r
- Feature Grid\r
- CTA Sections\r
- Detailed Features\r
- Product Demo\r
- Benefits Section\r
- Use Cases\r
- Social Proof\r
- Integrations\r
- Comparison Table\r
- Pricing\r
- FAQ\r
- Footer\r
- Sticky CTA`,...(E=(x=r.parameters)==null?void 0:x.docs)==null?void 0:E.description}}};var A,I,S,k,C;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    ...Default.parameters
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Verify mobile layout', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      // Verify responsive behavior
      const navButtons = canvas.getAllByRole('button');
      expect(navButtons.length).toBeGreaterThan(0);

      // Test mobile interactions
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      await userEvent.click(startCodingButton);
    });
  },
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...(S=(I=p.parameters)==null?void 0:I.docs)==null?void 0:S.source},description:{story:"Mobile Viewport",...(C=(k=p.parameters)==null?void 0:k.docs)==null?void 0:C.description}}};var D,H,R,V,F;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    ...Default.parameters
  },
  globals: {
    viewport: {
      value: 'tablet',
      isRotated: false
    }
  }
}`,...(R=(H=g.parameters)==null?void 0:H.docs)==null?void 0:R.source},description:{story:"Tablet Viewport",...(F=(V=g.parameters)==null?void 0:V.docs)==null?void 0:F.description}}};var O,P,L,N,G;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    ...Default.parameters
  },
  globals: {
    viewport: {
      value: 'wideScreen',
      isRotated: false
    }
  }
}`,...(L=(P=m.parameters)==null?void 0:P.docs)==null?void 0:L.source},description:{story:"Desktop/Wide Screen Viewport",...(G=(N=m.parameters)==null?void 0:N.docs)==null?void 0:G.description}}};const te=["Default","Mobile","Tablet","WideScreen"];export{r as Default,p as Mobile,g as Tablet,m as WideScreen,te as __namedExportsOrder,ee as default};
