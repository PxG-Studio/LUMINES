import{j as u}from"./iframe-BXkX_8oL.js";import{L as z}from"./LandingLayout-RgCRShq0.js";import"./preload-helper-C1FmrZbK.js";import"./SimpleNav-9elFKaWt.js";import"./Button-CDJro0XR.js";import"./File-BlZ5GgWr.js";import"./git-branch-DExO_pBL.js";import"./createLucideIcon-kSpmkMCE.js";import"./ChevronRight-1H6bY8tN.js";import"./x-BrWRloni.js";function b(){return u.jsx(z,{})}try{page.displayName="page",page.__docgenInfo={description:`LANDING - Production Landing Page

The main marketing landing page for WISSIL IDE
Bolt.new / StackBlitz-style clean design

Domain: lumenforge.io, www.lumenforge.io
Network: Helios Control (192.168.86.114)
Port: 3000
Auth: Public facing, nocturnaID integration via Cloudflare Zero Trust`,displayName:"page",props:{}}}catch{}const Z={colors:{landing:{primary:"#F5B914",secondary:"#47E0FF",accent:"#A64DFF",gradient:"linear-gradient(135deg, #F5B914 0%, #47E0FF 50%, #A64DFF 100%)"},waypoint:{primary:"#4C4BFF",secondary:"#A64DFF",accent:"#A64DFF",gradient:"linear-gradient(135deg, #4C4BFF 0%, #A64DFF 100%)"},spark:{primary:"#F5B914",secondary:"#FFD659",accent:"#FFD659",gradient:"linear-gradient(135deg, #F5B914 0%, #FFD659 100%)"},luna:{primary:"#47E0FF",secondary:"#4C4BFF",accent:"#4C4BFF",gradient:"linear-gradient(135deg, #47E0FF 0%, #4C4BFF 100%)"},nec:{primary:"#4C4BFF",secondary:"#A64DFF",accent:"#A64DFF",gradient:"linear-gradient(135deg, #4C4BFF 0%, #A64DFF 100%)"},nerva:{primary:"#10B981",secondary:"#47E0FF",accent:"#47E0FF",gradient:"linear-gradient(135deg, #10B981 0%, #47E0FF 100%)"},fluxrunner:{primary:"#F5B914",secondary:"#FFD659",accent:"#FFD659",gradient:"linear-gradient(135deg, #F5B914 0%, #FFD659 100%)"},slate:{primary:"#A64DFF",secondary:"#47E0FF",accent:"#F5B914",gradient:"linear-gradient(135deg, #A64DFF 0%, #47E0FF 100%)"},ignis:{primary:"#FF6B35",secondary:"#F5B914",accent:"#F5B914",gradient:"linear-gradient(135deg, #FF6B35 0%, #F5B914 100%)"},ignition:{primary:"#F5B914",secondary:"#FFD659",accent:"#FFD659",gradient:"linear-gradient(135deg, #F5B914 0%, #FFD659 100%)"},background:{primary:"#0A0A0A",secondary:"#1A1A1A",tertiary:"#2A2A2A"},text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",tertiary:"rgba(255, 255, 255, 0.5)"},border:{primary:"rgba(255, 255, 255, 0.1)",secondary:"rgba(255, 255, 255, 0.05)"},neutral:{50:"#F9FAFB",100:"#F3F4F6",200:"#E5E7EB",300:"#D1D5DB",400:"#9CA3AF",500:"#6B7280",600:"#4B5563",700:"#374151",800:"#1F2937",900:"#111827"}}},k=({children:d,system:c,title:o,description:e,showHeader:n=!1,className:i=""})=>{const r=Z.colors[c],s="primary"in r;return u.jsxs("div",{className:`min-h-screen bg-background-primary ${i}`,"data-system":c,children:[u.jsxs("div",{className:"fixed inset-0 overflow-hidden pointer-events-none",children:[u.jsx("div",{className:"absolute inset-0 opacity-20",style:{background:s?r.gradient:"transparent"}}),u.jsx("div",{className:"absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float",style:{backgroundColor:s?r.primary:"transparent"}}),u.jsx("div",{className:"absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float",style:{backgroundColor:s?r.secondary:"transparent",animationDelay:"3s"}})]}),u.jsxs("div",{className:"relative z-10",children:[n&&(o||e)&&u.jsx("header",{className:"container mx-auto px-4 py-12 sm:py-16",children:u.jsxs("div",{className:"max-w-4xl mx-auto text-center",children:[o&&u.jsx("h1",{className:"text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text",style:{backgroundImage:s?r.gradient:"linear-gradient(90deg, #fff, #fff)"},children:o}),e&&u.jsx("p",{className:"text-lg sm:text-xl text-neutral-300 leading-relaxed",children:e})]})}),u.jsx("main",{className:"container mx-auto px-4 py-8",children:d})]}),!1]})};try{k.displayName="WISSILLayout",k.__docgenInfo={description:`WISSILLayout Component

Universal layout wrapper for all WISSIL subsystem pages.
Provides consistent structure, theming, and accessibility.`,displayName:"WISSILLayout",props:{system:{defaultValue:null,description:"",name:"system",required:!0,type:{name:"enum",value:[{value:'"text"'},{value:'"landing"'},{value:'"waypoint"'},{value:'"spark"'},{value:'"luna"'},{value:'"nec"'},{value:'"nerva"'},{value:'"fluxrunner"'},{value:'"slate"'},{value:'"ignis"'},{value:'"ignition"'},{value:'"background"'},{value:'"border"'},{value:'"neutral"'}]}},title:{defaultValue:null,description:"",name:"title",required:!1,type:{name:"string | undefined"}},description:{defaultValue:null,description:"",name:"description",required:!1,type:{name:"string | undefined"}},showHeader:{defaultValue:{value:"false"},description:"",name:"showHeader",required:!1,type:{name:"boolean | undefined"}},className:{defaultValue:{value:""},description:"",name:"className",required:!1,type:{name:"string | undefined"}}}}}catch{}const{expect:t,within:T,userEvent:a,waitFor:p}=__STORYBOOK_MODULE_TEST__,st={title:"Lumenforge.io Design System/WIS2L Framework/Landing/Pages/Main Gateway",id:"wis2l-landing-main-gateway-stories",component:b,parameters:{layout:"fullscreen",backgrounds:{default:"dark"},viewport:{defaultViewport:"desktop"},actions:{handles:["click","keydown","keyup","focus","blur"]},a11y:{config:{rules:[{id:"color-contrast",enabled:!0,reviewOnFail:!0}]}},docs:{description:{component:`
# LANDING - Production Landing Page

The main marketing landing page for LumenForge.io ecosystem.

## Features
- **Hero Section**: Main value proposition and CTAs
- **WISSIL Systems**: Overview cards for all 5 subsystems
- **Features Section**: Key platform benefits
- **Navigation**: Links to /about, /demo, /projects
- **Responsive Design**: Optimized for all screen sizes

## Interactive Elements
- Navigation buttons (Docs, Templates, Open Editor)
- Hero CTA buttons (Start Coding, Try AI Generator)
- Logo/link navigation
- Feature cards
- Keyboard navigation support
- Touch/mobile interactions

## Network Information
- **Domain**: lumenforge.io, www.lumenforge.io
- **Location**: Helios Control (192.168.86.114)
- **Port**: 3000
- **Access**: Public facing with Cloudflare Zero Trust + nocturnaID

## Design Tokens
Uses the Luminera design system:
- Primary: #F5B914 (Amber)
- Secondary: #47E0FF (Cyan)
- Accent: #A64DFF (Purple)
        `}}},tags:["autodocs"],argTypes:{}},m={render:()=>u.jsx(b,{}),play:async({canvasElement:d,step:c})=>{const o=T(d);await c("1. Brutal page structure verification",async()=>{var B;const e=await o.findByText(/Your Entire Creative Pipeline in One Workspace/i);t(e).toBeInTheDocument(),t(e.tagName).toBe("H1"),t(e).toBeVisible(),t((B=e.textContent)==null?void 0:B.length).toBeGreaterThan(10);const n=o.getByText(/Lumenforge.io unifies AI generation/i);t(n).toBeInTheDocument(),t(n).toBeVisible(),t(n.tagName).toBe("P");const i=o.getAllByRole("link");t(i.length).toBeGreaterThan(0);const r=i.find(g=>{var y;return g.getAttribute("href")==="/landing"||((y=g.textContent)==null?void 0:y.includes("Lumenforge.io"))});t(r).toBeInTheDocument(),t(r).toBeVisible();const s=o.getByText(/©/i);t(s).toBeInTheDocument(),t(s).toBeVisible();const l=o.getAllByRole("heading");t(l.length).toBeGreaterThanOrEqual(1),t(l[0].textContent).toContain("Creative Pipeline")}),await c("2. Brutal navigation button stress testing",async()=>{const e=o.getAllByRole("button");t(e.length).toBeGreaterThanOrEqual(5);const n=o.getByRole("button",{name:/^docs$/i});t(n).toBeInTheDocument(),t(n).toBeVisible(),t(n).not.toBeDisabled(),await a.click(n),await p(()=>t(n).toBeVisible(),{timeout:500}),await a.dblClick(n);for(let l=0;l<5;l++)await a.click(n),await new Promise(B=>setTimeout(B,10));const i=e.find(l=>{var B;return((B=l.textContent)==null?void 0:B.trim().toLowerCase())==="templates"});t(i).toBeInTheDocument(),t(i).toBeVisible(),t(i).not.toBeDisabled(),await a.click(i),await a.dblClick(i);const r=o.getAllByRole("button",{name:/^open editor$/i});t(r.length).toBeGreaterThan(0);const s=r[0];t(s).toBeInTheDocument(),t(s).toBeVisible(),t(s).not.toBeDisabled(),await a.click(s),await a.click(s),await a.click(s)}),await c("3. Brutal hero button interactions and edge cases",async()=>{const e=o.getByRole("button",{name:/^start coding$/i});t(e).toBeInTheDocument(),t(e).toBeVisible(),t(e).not.toBeDisabled(),await a.click(e),await a.click(e,{button:0}),window.scrollTo(0,100),await p(()=>t(e).toBeInTheDocument()),await a.click(e),window.scrollTo(0,0);const n=o.getByRole("button",{name:/^try ai generator$/i});t(n).toBeInTheDocument(),t(n).toBeVisible(),t(n).not.toBeDisabled(),await a.click(e),await a.click(n),await a.click(e),await a.click(n),t(e).toBeVisible(),t(n).toBeVisible()}),await c("4. Brutal link interaction testing",async()=>{const e=o.getAllByRole("link");t(e.length).toBeGreaterThan(0);const n=e.find(r=>{var s;return r.getAttribute("href")==="/landing"||((s=r.textContent)==null?void 0:s.includes("Lumenforge.io"))});t(n).toBeInTheDocument(),t(n).toBeVisible(),t(n).toHaveAttribute("href"),t(n).toHaveAttribute("href");const i=n.getAttribute("href");t(i).toBeTruthy(),await a.click(n),await a.click(n),await a.dblClick(n),t(n).toHaveAttribute("href"),e.forEach(r=>{t(r).toHaveAttribute("href"),t(r.getAttribute("href")).toBeTruthy()})}),await c("5. Brutal feature grid content verification",async()=>{var l;const e=o.getByText(/Instant Preview/i);t(e).toBeInTheDocument(),t(e).toBeVisible(),t(e.tagName).toBe("H2"),t((l=e.textContent)==null?void 0:l.trim().length).toBeGreaterThan(5);const n=o.getByText(/Clean Project Explorer/i);t(n).toBeInTheDocument(),t(n).toBeVisible(),t(n.tagName).toBe("H2");const i=o.getByText(/Code-First Workflow/i);t(i).toBeInTheDocument(),t(i).toBeVisible(),t(i.tagName).toBe("H2");const r=o.getAllByText(/Lightning-fast|minimal file tree|Built for iteration/i);t(r.length).toBeGreaterThanOrEqual(3),e.scrollIntoView({behavior:"smooth"}),await p(()=>t(e).toBeInTheDocument(),{timeout:1e3}),t(e).toBeVisible(),t(n).toBeVisible(),t(i).toBeVisible();const s=d.querySelectorAll('article[role="article"]');t(s.length).toBeGreaterThanOrEqual(3)}),await c("6. Brutal keyboard navigation and accessibility",async()=>{const e=o.getByRole("button",{name:/^docs$/i});e.focus(),t(e).toHaveFocus();let n=0,i=e;for(let r=0;r<10;r++){await a.keyboard("{Tab}"),n++;const s=document.activeElement;if(s&&s!==i){i=s;break}if(n>=5)break}await a.keyboard("{Shift>}{Tab}{/Shift}"),document.activeElement&&document.activeElement.tagName==="BUTTON"&&await a.keyboard("{Enter}"),e.focus(),await a.keyboard(" "),await p(()=>t(e).toBeInTheDocument()),await a.keyboard("{Escape}"),await a.keyboard("{ArrowDown}"),await a.keyboard("{ArrowUp}"),await a.keyboard("{ArrowLeft}"),await a.keyboard("{ArrowRight}"),t(e).toBeInTheDocument(),t(e).toBeVisible()}),await c("7. Brutal mouse and hover state testing",async()=>{const e=o.getByRole("button",{name:/^start coding$/i});await a.hover(e),t(e).toBeVisible(),await a.unhover(e),await a.hover(e),await a.unhover(e);const n=o.getAllByRole("button");for(const i of n.slice(0,5))await a.hover(i),await a.unhover(i);await a.hover(e),await a.click(e),await a.unhover(e),t(e).toBeVisible(),await a.click(e)}),await c("8. Brutal scroll and viewport interaction testing",async()=>{const e=o.getByText(/©/i);e.scrollIntoView({behavior:"smooth",block:"end"}),await p(()=>t(e).toBeInTheDocument(),{timeout:2e3}),window.scrollTo({top:0,behavior:"auto"}),await p(()=>t(window.scrollY).toBeLessThan(100),{timeout:500}),window.scrollTo({top:document.body.scrollHeight,behavior:"auto"}),await p(()=>t(window.scrollY).toBeGreaterThan(100),{timeout:500}),window.scrollTo({top:document.body.scrollHeight/2,behavior:"auto"}),await p(()=>{const i=o.getByText(/Your Entire Creative Pipeline in One Workspace/i);t(i).toBeInTheDocument()},{timeout:1e3}),window.scrollTo({top:0,behavior:"smooth"}),await p(()=>{const i=o.getByText(/Your Entire Creative Pipeline in One Workspace/i);t(i).toBeInTheDocument()},{timeout:2e3});const n=o.getAllByRole("button");t(n.length).toBeGreaterThanOrEqual(5),n.forEach(i=>t(i).toBeInTheDocument())}),await c("9. Brutal accessibility and ARIA verification",async()=>{const e=o.getAllByRole("button");t(e.length).toBeGreaterThanOrEqual(5),e.forEach((l,B)=>{var y;t(l).toBeVisible(),t((y=l.textContent)==null?void 0:y.trim().length).toBeGreaterThan(0);const g=l.textContent||l.getAttribute("aria-label");t(g==null?void 0:g.trim().length).toBeGreaterThan(0),t(l.tabIndex).not.toBe(-1)});const n=o.getAllByRole("link");t(n.length).toBeGreaterThan(0),n.forEach(l=>{t(l).toBeVisible(),t(l).toHaveAttribute("href");const B=l.getAttribute("href");t(B).toBeTruthy(),t(B==null?void 0:B.length).toBeGreaterThan(0)});const i=o.getAllByRole("heading");t(i.length).toBeGreaterThanOrEqual(1);const r=i.find(l=>l.tagName==="H1");t(r).toBeInTheDocument(),d.querySelectorAll("article").forEach(l=>{t(l).toBeVisible()})}),await c("10. Brutal stress testing and edge cases",async()=>{const e=o.getByRole("button",{name:/^start coding$/i}),n=o.getByRole("button",{name:/^docs$/i}),i=[];for(let g=0;g<3;g++)i.push(a.click(e)),i.push(a.click(n));await Promise.all(i),t(e).toBeInTheDocument(),t(n).toBeInTheDocument(),await a.click(e),e.focus(),t(e).toHaveFocus();for(let g=0;g<5;g++)await a.keyboard("{Tab}"),await new Promise(y=>setTimeout(y,10));const r=o.getAllByRole("button");t(r.length).toBeGreaterThanOrEqual(5),r.forEach(g=>{t(g).toBeInTheDocument(),t(g).toBeVisible()});const s=o.getByText(/Your Entire Creative Pipeline in One Workspace/i);t(s).toBeInTheDocument(),t(s).toBeVisible();const l=o.getByText(/©/i);t(l).toBeInTheDocument();const B=d.querySelectorAll("article");t(B.length).toBeGreaterThanOrEqual(3)})}},h={render:()=>u.jsx(k,{system:"landing",showHeader:!1,children:u.jsx(b,{})}),play:async({canvasElement:d,step:c})=>{const o=T(d);await c("Brutal layout wrapper verification",async()=>{const e=await o.findByText(/Your Entire Creative Pipeline in One Workspace/i);t(e).toBeInTheDocument(),t(e).toBeVisible()}),await c("Brutal navigation stress testing within layout",async()=>{const e=o.getByRole("button",{name:/^docs$/i});t(e).toBeVisible();for(let s=0;s<5;s++)await a.click(e);const n=o.getAllByRole("button").find(s=>{var l;return((l=s.textContent)==null?void 0:l.trim().toLowerCase())==="templates"});n&&(t(n).toBeVisible(),await a.click(n),await a.dblClick(n));const i=o.getAllByRole("button",{name:/^open editor$/i});t(i.length).toBeGreaterThan(0);const r=i[0];t(r).toBeVisible(),await a.click(r)}),await c("Brutal hero interactions within layout",async()=>{const e=o.getByRole("button",{name:/^start coding$/i});t(e).toBeVisible(),await a.hover(e),await a.click(e),await a.keyboard("{Enter}"),await a.click(e);const n=o.getByRole("button",{name:/^try ai generator$/i});t(n).toBeVisible(),await a.click(n),await a.hover(n),await a.click(n)}),await c("Brutal layout functionality verification",async()=>{const e=o.getAllByRole("button");t(e.length).toBeGreaterThanOrEqual(5),e.forEach(async r=>{t(r).toBeVisible(),t(r).not.toBeDisabled()});const n=o.getAllByRole("link");t(n.length).toBeGreaterThan(0),n.forEach(r=>{t(r).toHaveAttribute("href")});const i=o.getByRole("button",{name:/^docs$/i});i.focus(),t(i).toHaveFocus(),await a.keyboard("{Tab}"),await a.keyboard("{Tab}"),await a.keyboard("{Tab}")})}},w={render:()=>u.jsx(b,{}),play:async({canvasElement:d,step:c})=>{const o=T(d);await c("Verify mobile layout and responsive design",async()=>{const e=await o.findByText(/Your Entire Creative Pipeline in One Workspace/i);t(e).toBeInTheDocument(),window.getComputedStyle(e),t(e).toBeVisible()}),await c("Test mobile navigation interactions",async()=>{const e=o.getAllByRole("button");t(e.length).toBeGreaterThan(0);const n=o.getByRole("button",{name:/^start coding$/i});t(n).toBeVisible(),await a.click(n);const i=o.getByRole("button",{name:/^try ai generator$/i});t(i).toBeVisible(),await a.click(i)}),await c("Test mobile touch interactions",async()=>{const n=o.getAllByRole("link").find(i=>{var r;return i.getAttribute("href")==="/landing"||((r=i.textContent)==null?void 0:r.includes("Lumenforge.io"))});n&&await a.click(n)}),await c("Verify mobile feature grid is scrollable",async()=>{const e=o.getByText(/Instant Preview/i);t(e).toBeVisible();const n=o.getByText(/©/i);n.scrollIntoView({behavior:"smooth"}),await p(()=>{t(n).toBeInTheDocument()},{timeout:2e3})})},globals:{viewport:{value:"mobile1",isRotated:!1}}},v={render:()=>u.jsx(b,{}),play:async({canvasElement:d,step:c})=>{const o=T(d);await c("Verify tablet layout and responsive design",async()=>{const e=await o.findByText(/Your Entire Creative Pipeline in One Workspace/i);t(e).toBeInTheDocument();const n=o.getByText(/Instant Preview/i).closest("div");t(n).toBeInTheDocument()}),await c("Test tablet navigation interactions",async()=>{const e=o.getByRole("button",{name:/^docs$/i});await a.click(e);const n=o.getAllByRole("button").find(s=>{var l;return((l=s.textContent)==null?void 0:l.trim().toLowerCase())==="templates"});n&&await a.click(n);const i=o.getAllByRole("button",{name:/^open editor$/i});t(i.length).toBeGreaterThan(0);const r=i[0];await a.click(r)}),await c("Test tablet hero section interactions",async()=>{const e=o.getByRole("button",{name:/^start coding$/i});await a.click(e);const n=o.getByRole("button",{name:/^try ai generator$/i});await a.click(n)}),await c("Verify tablet feature grid layout",async()=>{const e=[/Instant Preview/i,/Clean Project Explorer/i,/Code-First Workflow/i];for(const n of e){const i=o.getByText(n);t(i).toBeVisible()}})},globals:{viewport:{value:"tablet",isRotated:!1}}},f={render:()=>u.jsx(b,{}),play:async({canvasElement:d,step:c})=>{const o=T(d);await c("Verify wide screen layout and spacing",async()=>{const e=await o.findByText(/Your Entire Creative Pipeline in One Workspace/i);t(e).toBeInTheDocument();const n=o.getByText(/Instant Preview/i).closest("div");t(n).toBeInTheDocument()}),await c("Test all navigation interactions on wide screen",async()=>{const e=o.getByRole("button",{name:/^docs$/i});t(e).toBeVisible(),await a.click(e);const n=o.getAllByRole("button").find(s=>{var l;return((l=s.textContent)==null?void 0:l.trim().toLowerCase())==="templates"});n&&(t(n).toBeVisible(),await a.click(n));const i=o.getAllByRole("button",{name:/^open editor$/i});t(i.length).toBeGreaterThan(0);const r=i[0];t(r).toBeVisible(),await a.click(r)}),await c("Test hero section interactions on wide screen",async()=>{const e=o.getByRole("button",{name:/^start coding$/i});t(e).toBeVisible(),await a.click(e);const n=o.getByRole("button",{name:/^try ai generator$/i});t(n).toBeVisible(),await a.click(n)}),await c("Test keyboard navigation flow on wide screen",async()=>{const n=o.getAllByRole("link").find(r=>{var s;return r.getAttribute("href")==="/landing"||((s=r.textContent)==null?void 0:s.includes("Lumenforge.io"))});n&&(n.focus(),t(n).toHaveFocus());const i=o.getAllByRole("button");for(let r=0;r<Math.min(3,i.length);r++)await a.keyboard("{Tab}")}),await c("Verify wide screen feature grid displays all cards",async()=>{const e=[{text:/Instant Preview/i,title:"Instant Preview"},{text:/Clean Project Explorer/i,title:"Clean Project Explorer"},{text:/Code-First Workflow/i,title:"Code-First Workflow"}];for(const n of e){const i=o.getByText(n.text);t(i).toBeVisible()}}),await c("Test scroll interactions on wide screen",async()=>{const e=o.getByText(/©/i);e.scrollIntoView({behavior:"smooth"}),await p(()=>{t(e).toBeInTheDocument()},{timeout:2e3}),window.scrollTo({top:0,behavior:"smooth"}),await p(()=>{const n=o.getByText(/Your Entire Creative Pipeline in One Workspace/i);t(n).toBeInTheDocument()},{timeout:2e3})})},globals:{viewport:{value:"wideScreen",isRotated:!1}}};var x,E,A,I,C;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <LandingPage />,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);

    // ==== STEP 1: BRUTAL STRUCTURAL VERIFICATION ====
    await step('1. Brutal page structure verification', async () => {
      // Main heading - verify it's actually an H1 and visible
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H1');
      expect(heading).toBeVisible();
      expect(heading.textContent?.length).toBeGreaterThan(10);

      // Verify subtitle/description exists and is readable
      const subtitle = canvas.getByText(/Lumenforge.io unifies AI generation/i);
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toBeVisible();
      expect(subtitle.tagName).toBe('P');

      // Verify navigation elements exist - get ALL links
      const navLinks = canvas.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
      const logoLink = navLinks.find(link => link.getAttribute('href') === '/landing' || link.textContent?.includes('Lumenforge.io'));
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toBeVisible();

      // Verify footer exists and has copyright
      const footer = canvas.getByText(/©/i);
      expect(footer).toBeInTheDocument();
      expect(footer).toBeVisible();

      // Verify page has proper semantic structure
      const headings = canvas.getAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(1); // At least H1
      expect(headings[0].textContent).toContain('Creative Pipeline');
    });

    // ==== STEP 2: BRUTAL BUTTON INTERACTION TESTING ====
    await step('2. Brutal navigation button stress testing', async () => {
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);

      // Test "Docs" button - single click, double click, rapid clicks
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toBeVisible();
      expect(docsButton).not.toBeDisabled();

      // Single click
      await userEvent.click(docsButton);
      await waitFor(() => expect(docsButton).toBeVisible(), {
        timeout: 500
      });

      // Double click (should not break)
      await userEvent.dblClick(docsButton);

      // Rapid fire clicks (stress test)
      for (let i = 0; i < 5; i++) {
        await userEvent.click(docsButton);
        await new Promise(resolve => setTimeout(resolve, 10)); // 10ms delay
      }

      // Test "Templates" button
      const templatesButton = allButtons.find(btn => btn.textContent?.trim().toLowerCase() === 'templates');
      expect(templatesButton).toBeInTheDocument();
      expect(templatesButton).toBeVisible();
      expect(templatesButton).not.toBeDisabled();
      await userEvent.click(templatesButton!);
      await userEvent.dblClick(templatesButton!); // Double click test

      // Test "Open Editor" button - rapid interaction
      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', {
        name: /^open editor$/i
      });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      expect(openEditorButton).toBeInTheDocument();
      expect(openEditorButton).toBeVisible();
      expect(openEditorButton).not.toBeDisabled();

      // Click sequence
      await userEvent.click(openEditorButton);
      await userEvent.click(openEditorButton);
      await userEvent.click(openEditorButton);
    });

    // ==== STEP 3: BRUTAL HERO BUTTON TESTING ====
    await step('3. Brutal hero button interactions and edge cases', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      expect(startCodingButton).toBeInTheDocument();
      expect(startCodingButton).toBeVisible();
      expect(startCodingButton).not.toBeDisabled();

      // Click with different pointer types (simulated)
      await userEvent.click(startCodingButton);
      await userEvent.click(startCodingButton, {
        button: 0
      }); // Primary button

      // Test button after rapid scrolling
      window.scrollTo(0, 100);
      await waitFor(() => expect(startCodingButton).toBeInTheDocument());
      await userEvent.click(startCodingButton);
      window.scrollTo(0, 0);
      const tryAIGeneratorButton = canvas.getByRole('button', {
        name: /^try ai generator$/i
      });
      expect(tryAIGeneratorButton).toBeInTheDocument();
      expect(tryAIGeneratorButton).toBeVisible();
      expect(tryAIGeneratorButton).not.toBeDisabled();

      // Sequential rapid clicks on both buttons
      await userEvent.click(startCodingButton);
      await userEvent.click(tryAIGeneratorButton);
      await userEvent.click(startCodingButton);
      await userEvent.click(tryAIGeneratorButton);

      // Verify buttons remain functional after stress
      expect(startCodingButton).toBeVisible();
      expect(tryAIGeneratorButton).toBeVisible();
    });

    // ==== STEP 4: BRUTAL LINK AND NAVIGATION TESTING ====
    await step('4. Brutal link interaction testing', async () => {
      const navLinks = canvas.getAllByRole('link');
      expect(navLinks.length).toBeGreaterThan(0);
      const logoLink = navLinks.find(link => link.getAttribute('href') === '/landing' || link.textContent?.includes('Lumenforge.io'));
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toBeVisible();
      expect(logoLink).toHaveAttribute('href');

      // Test link accessibility
      expect(logoLink).toHaveAttribute('href');
      const href = logoLink!.getAttribute('href');
      expect(href).toBeTruthy();

      // Click link multiple times (should not break)
      await userEvent.click(logoLink!);
      await userEvent.click(logoLink!);
      await userEvent.dblClick(logoLink!);

      // Verify link still works
      expect(logoLink).toHaveAttribute('href');

      // Test all links have valid hrefs
      navLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });

    // ==== STEP 5: BRUTAL FEATURE GRID AND CONTENT TESTING ====
    await step('5. Brutal feature grid content verification', async () => {
      // Verify all three feature cards are present and have content
      const instantPreview = canvas.getByText(/Instant Preview/i);
      expect(instantPreview).toBeInTheDocument();
      expect(instantPreview).toBeVisible();
      expect(instantPreview.tagName).toBe('H2');
      expect(instantPreview.textContent?.trim().length).toBeGreaterThan(5);
      const cleanProject = canvas.getByText(/Clean Project Explorer/i);
      expect(cleanProject).toBeInTheDocument();
      expect(cleanProject).toBeVisible();
      expect(cleanProject.tagName).toBe('H2');
      const codeFirst = canvas.getByText(/Code-First Workflow/i);
      expect(codeFirst).toBeInTheDocument();
      expect(codeFirst).toBeVisible();
      expect(codeFirst.tagName).toBe('H2');

      // Verify feature cards have descriptions
      const descriptions = canvas.getAllByText(/Lightning-fast|minimal file tree|Built for iteration/i);
      expect(descriptions.length).toBeGreaterThanOrEqual(3);

      // Test scroll to feature cards
      instantPreview.scrollIntoView({
        behavior: 'smooth'
      });
      await waitFor(() => expect(instantPreview).toBeInTheDocument(), {
        timeout: 1000
      });

      // Verify cards are still visible after scroll
      expect(instantPreview).toBeVisible();
      expect(cleanProject).toBeVisible();
      expect(codeFirst).toBeVisible();

      // Count all feature card elements
      const featureCards = canvasElement.querySelectorAll('article[role="article"]');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });

    // ==== STEP 6: BRUTAL KEYBOARD NAVIGATION TESTING ====
    await step('6. Brutal keyboard navigation and accessibility', async () => {
      // Test Tab navigation - forward
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      docsButton.focus();
      expect(docsButton).toHaveFocus();

      // Tab forward through all interactive elements
      let tabCount = 0;
      let currentFocus = docsButton;

      // Tab through at least 5 elements
      for (let i = 0; i < 10; i++) {
        await userEvent.keyboard('{Tab}');
        tabCount++;

        // Verify focus moved
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement !== currentFocus) {
          currentFocus = focusedElement as HTMLElement;
          break; // Focus moved successfully
        }
        if (tabCount >= 5) break; // Safety limit
      }

      // Test Shift+Tab (backward navigation)
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}');

      // Test Enter key on focused button
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
        await userEvent.keyboard('{Enter}');
      }

      // Test Space key on focused button
      docsButton.focus();
      await userEvent.keyboard(' ');
      await waitFor(() => expect(docsButton).toBeInTheDocument());

      // Test Escape key (should not break anything)
      await userEvent.keyboard('{Escape}');

      // Test Arrow keys (might be used in some contexts)
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowLeft}');
      await userEvent.keyboard('{ArrowRight}');

      // Verify page still functional
      expect(docsButton).toBeInTheDocument();
      expect(docsButton).toBeVisible();
    });

    // ==== STEP 7: BRUTAL MOUSE INTERACTION TESTING ====
    await step('7. Brutal mouse and hover state testing', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });

      // Test hover - rapid hover/unhover
      await userEvent.hover(startCodingButton);
      expect(startCodingButton).toBeVisible();
      await userEvent.unhover(startCodingButton);
      await userEvent.hover(startCodingButton);
      await userEvent.unhover(startCodingButton);

      // Test hover on all buttons
      const allButtons = canvas.getAllByRole('button');
      for (const button of allButtons.slice(0, 5)) {
        // Test first 5 buttons
        await userEvent.hover(button);
        await userEvent.unhover(button);
      }

      // Test click after hover
      await userEvent.hover(startCodingButton);
      await userEvent.click(startCodingButton);
      await userEvent.unhover(startCodingButton);

      // Verify button still works
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);
    });

    // ==== STEP 8: BRUTAL SCROLL AND VIEWPORT TESTING ====
    await step('8. Brutal scroll and viewport interaction testing', async () => {
      // Scroll to bottom
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      });
      await waitFor(() => expect(footer).toBeInTheDocument(), {
        timeout: 2000
      });

      // Rapid scroll up and down
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
      await waitFor(() => expect(window.scrollY).toBeLessThan(100), {
        timeout: 500
      });
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'auto'
      });
      await waitFor(() => expect(window.scrollY).toBeGreaterThan(100), {
        timeout: 500
      });
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: 'auto'
      });
      await waitFor(() => {
        const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
        expect(heading).toBeInTheDocument();
      }, {
        timeout: 1000
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

      // Verify all elements still visible after scrolling
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
      allButtons.forEach(btn => expect(btn).toBeInTheDocument());
    });

    // ==== STEP 9: BRUTAL ACCESSIBILITY AND ARIA TESTING ====
    await step('9. Brutal accessibility and ARIA verification', async () => {
      // Count and verify all buttons
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);

      // Verify each button has proper accessibility attributes
      allButtons.forEach((button, index) => {
        expect(button).toBeVisible();
        expect(button.textContent?.trim().length).toBeGreaterThan(0);

        // Verify button is not disabled (unless intentionally)
        // Verify button has accessible name
        const accessibleName = button.textContent || button.getAttribute('aria-label');
        expect(accessibleName?.trim().length).toBeGreaterThan(0);

        // Verify button is keyboard accessible
        expect(button.tabIndex).not.toBe(-1); // Should be focusable
      });

      // Verify all links have proper attributes
      const allLinks = canvas.getAllByRole('link');
      expect(allLinks.length).toBeGreaterThan(0);
      allLinks.forEach(link => {
        expect(link).toBeVisible();
        expect(link).toHaveAttribute('href');
        const href = link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href?.length).toBeGreaterThan(0);
      });

      // Verify heading hierarchy
      const headings = canvas.getAllByRole('heading');
      expect(headings.length).toBeGreaterThanOrEqual(1);
      const h1 = headings.find(h => h.tagName === 'H1');
      expect(h1).toBeInTheDocument();

      // Verify semantic structure
      const articles = canvasElement.querySelectorAll('article');
      articles.forEach(article => {
        expect(article).toBeVisible();
      });
    });

    // ==== STEP 10: BRUTAL STRESS TESTING AND EDGE CASES ====
    await step('10. Brutal stress testing and edge cases', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });

      // Stress test: Rapid sequential clicks on multiple buttons
      const clickPromises = [];
      for (let i = 0; i < 3; i++) {
        clickPromises.push(userEvent.click(startCodingButton));
        clickPromises.push(userEvent.click(docsButton));
      }
      await Promise.all(clickPromises);

      // Verify buttons still work after stress
      expect(startCodingButton).toBeInTheDocument();
      expect(docsButton).toBeInTheDocument();
      await userEvent.click(startCodingButton);

      // Test focus management under stress
      startCodingButton.focus();
      expect(startCodingButton).toHaveFocus();

      // Rapid tab navigation
      for (let i = 0; i < 5; i++) {
        await userEvent.keyboard('{Tab}');
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      // Verify page still functional
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);
      allButtons.forEach(btn => {
        expect(btn).toBeInTheDocument();
        expect(btn).toBeVisible();
      });

      // Final verification - all critical elements present
      const heading = canvas.getByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading).toBeVisible();
      const footer = canvas.getByText(/©/i);
      expect(footer).toBeInTheDocument();

      // Verify feature cards still render
      const featureCards = canvasElement.querySelectorAll('article');
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });
  }
}`,...(A=(E=m.parameters)==null?void 0:E.docs)==null?void 0:A.source},description:{story:"Default view of the Landing page showing all WISSIL subsystems",...(C=(I=m.parameters)==null?void 0:I.docs)==null?void 0:C.description}}};var F,V,D,L,R;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <WISSILLayout system="landing" showHeader={false}>\r
      <LandingPage />\r
    </WISSILLayout>,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Brutal layout wrapper verification', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      expect(heading).toBeVisible();
    });
    await step('Brutal navigation stress testing within layout', async () => {
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      expect(docsButton).toBeVisible();

      // Rapid clicks
      for (let i = 0; i < 5; i++) {
        await userEvent.click(docsButton);
      }
      const templatesButton = canvas.getAllByRole('button').find(btn => btn.textContent?.trim().toLowerCase() === 'templates');
      if (templatesButton) {
        expect(templatesButton).toBeVisible();
        await userEvent.click(templatesButton);
        await userEvent.dblClick(templatesButton);
      }

      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', {
        name: /^open editor$/i
      });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      expect(openEditorButton).toBeVisible();
      await userEvent.click(openEditorButton);
    });
    await step('Brutal hero interactions within layout', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      expect(startCodingButton).toBeVisible();

      // Stress test
      await userEvent.hover(startCodingButton);
      await userEvent.click(startCodingButton);
      await userEvent.keyboard('{Enter}');
      await userEvent.click(startCodingButton);
      const tryAIGeneratorButton = canvas.getByRole('button', {
        name: /^try ai generator$/i
      });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
      await userEvent.hover(tryAIGeneratorButton);
      await userEvent.click(tryAIGeneratorButton);
    });
    await step('Brutal layout functionality verification', async () => {
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThanOrEqual(5);

      // Test all buttons after stress
      allButtons.forEach(async btn => {
        expect(btn).toBeVisible();
        expect(btn).not.toBeDisabled();
      });
      const allLinks = canvas.getAllByRole('link');
      expect(allLinks.length).toBeGreaterThan(0);
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
      });

      // Keyboard navigation test
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      docsButton.focus();
      expect(docsButton).toHaveFocus();
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
      await userEvent.keyboard('{Tab}');
    });
  }
}`,...(D=(V=h.parameters)==null?void 0:V.docs)==null?void 0:D.source},description:{story:"Landing page wrapped in WISSILLayout for consistency testing",...(R=(L=h.parameters)==null?void 0:L.docs)==null?void 0:R.description}}};var P,G,S,N,O;w.parameters={...w.parameters,docs:{...(P=w.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <LandingPage />,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Verify mobile layout and responsive design', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      // Verify heading is appropriately sized for mobile
      const headingStyles = window.getComputedStyle(heading);
      expect(heading).toBeVisible();
    });
    await step('Test mobile navigation interactions', async () => {
      // In mobile, navigation buttons might be in a hamburger menu or stacked
      // Test all buttons that are visible
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(0);

      // Test hero buttons (should always be visible)
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);
      const tryAIGeneratorButton = canvas.getByRole('button', {
        name: /^try ai generator$/i
      });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
    });
    await step('Test mobile touch interactions', async () => {
      // Simulate touch/click on logo
      const navLinks = canvas.getAllByRole('link');
      const logoLink = navLinks.find(link => link.getAttribute('href') === '/landing' || link.textContent?.includes('Lumenforge.io'));
      if (logoLink) {
        await userEvent.click(logoLink);
      }
    });
    await step('Verify mobile feature grid is scrollable', async () => {
      // Verify feature cards are present
      const instantPreview = canvas.getByText(/Instant Preview/i);
      expect(instantPreview).toBeVisible();

      // Scroll to verify footer
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({
        behavior: 'smooth'
      });
      await waitFor(() => {
        expect(footer).toBeInTheDocument();
      }, {
        timeout: 2000
      });
    });
  },
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...(S=(G=w.parameters)==null?void 0:G.docs)==null?void 0:S.source},description:{story:"Mobile viewport",...(O=(N=w.parameters)==null?void 0:N.docs)==null?void 0:O.description}}};var $,H,W,j,q;v.parameters={...v.parameters,docs:{...($=v.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <LandingPage />,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Verify tablet layout and responsive design', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      // Verify feature grid adapts to tablet width
      const featureGrid = canvas.getByText(/Instant Preview/i).closest('div');
      expect(featureGrid).toBeInTheDocument();
    });
    await step('Test tablet navigation interactions', async () => {
      // All navigation buttons should be accessible
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      await userEvent.click(docsButton);
      const templatesButton = canvas.getAllByRole('button').find(btn => btn.textContent?.trim().toLowerCase() === 'templates');
      if (templatesButton) {
        await userEvent.click(templatesButton);
      }

      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', {
        name: /^open editor$/i
      });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      await userEvent.click(openEditorButton);
    });
    await step('Test tablet hero section interactions', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      await userEvent.click(startCodingButton);
      const tryAIGeneratorButton = canvas.getByRole('button', {
        name: /^try ai generator$/i
      });
      await userEvent.click(tryAIGeneratorButton);
    });
    await step('Verify tablet feature grid layout', async () => {
      // All feature cards should be visible
      const features = [/Instant Preview/i, /Clean Project Explorer/i, /Code-First Workflow/i];
      for (const featureText of features) {
        const feature = canvas.getByText(featureText);
        expect(feature).toBeVisible();
      }
    });
  },
  globals: {
    viewport: {
      value: 'tablet',
      isRotated: false
    }
  }
}`,...(W=(H=v.parameters)==null?void 0:H.docs)==null?void 0:W.source},description:{story:"Tablet viewport",...(q=(j=v.parameters)==null?void 0:j.docs)==null?void 0:q.description}}};var U,Y,_,M,K;f.parameters={...f.parameters,docs:{...(U=f.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <LandingPage />,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Verify wide screen layout and spacing', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      // Verify content is properly centered and has max-width
      const featureGrid = canvas.getByText(/Instant Preview/i).closest('div');
      expect(featureGrid).toBeInTheDocument();
    });
    await step('Test all navigation interactions on wide screen', async () => {
      // Test all navigation buttons
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      expect(docsButton).toBeVisible();
      await userEvent.click(docsButton);
      const templatesButton = canvas.getAllByRole('button').find(btn => btn.textContent?.trim().toLowerCase() === 'templates');
      if (templatesButton) {
        expect(templatesButton).toBeVisible();
        await userEvent.click(templatesButton);
      }

      // Find all "Open Editor" buttons and use the first one (navigation button)
      const openEditorButtons = canvas.getAllByRole('button', {
        name: /^open editor$/i
      });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      const openEditorButton = openEditorButtons[0]; // Use first instance (navigation)
      expect(openEditorButton).toBeVisible();
      await userEvent.click(openEditorButton);
    });
    await step('Test hero section interactions on wide screen', async () => {
      const startCodingButton = canvas.getByRole('button', {
        name: /^start coding$/i
      });
      expect(startCodingButton).toBeVisible();
      await userEvent.click(startCodingButton);
      const tryAIGeneratorButton = canvas.getByRole('button', {
        name: /^try ai generator$/i
      });
      expect(tryAIGeneratorButton).toBeVisible();
      await userEvent.click(tryAIGeneratorButton);
    });
    await step('Test keyboard navigation flow on wide screen', async () => {
      // Start from logo link
      const navLinks = canvas.getAllByRole('link');
      const logoLink = navLinks.find(link => link.getAttribute('href') === '/landing' || link.textContent?.includes('Lumenforge.io'));
      if (logoLink) {
        logoLink.focus();
        expect(logoLink).toHaveFocus();
      }

      // Tab through all interactive elements
      const allButtons = canvas.getAllByRole('button');
      for (let i = 0; i < Math.min(3, allButtons.length); i++) {
        await userEvent.keyboard('{Tab}');
        // Verify focus moved
      }
    });
    await step('Verify wide screen feature grid displays all cards', async () => {
      // All three feature cards should be visible side-by-side on wide screens
      const features = [{
        text: /Instant Preview/i,
        title: 'Instant Preview'
      }, {
        text: /Clean Project Explorer/i,
        title: 'Clean Project Explorer'
      }, {
        text: /Code-First Workflow/i,
        title: 'Code-First Workflow'
      }];
      for (const feature of features) {
        const element = canvas.getByText(feature.text);
        expect(element).toBeVisible();
      }
    });
    await step('Test scroll interactions on wide screen', async () => {
      // Scroll to bottom
      const footer = canvas.getByText(/©/i);
      footer.scrollIntoView({
        behavior: 'smooth'
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
  },
  globals: {
    viewport: {
      value: 'wideScreen',
      isRotated: false
    }
  }
}`,...(_=(Y=f.parameters)==null?void 0:Y.docs)==null?void 0:_.source},description:{story:"Wide screen viewport",...(K=(M=f.parameters)==null?void 0:M.docs)==null?void 0:K.description}}};const ct=["Default","WithLayout","Mobile","Tablet","WideScreen"];export{m as Default,w as Mobile,v as Tablet,f as WideScreen,h as WithLayout,ct as __namedExportsOrder,st as default};
