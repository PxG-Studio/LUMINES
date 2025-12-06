import{j as r,R as G,T as W}from"./iframe-BXkX_8oL.js";import{S as H,H as M,F as U,a as Y}from"./SimpleNav-9elFKaWt.js";import"./preload-helper-C1FmrZbK.js";import"./Button-CDJro0XR.js";import"./File-BlZ5GgWr.js";const{action:q}=__STORYBOOK_MODULE_ACTIONS__,{expect:a,within:_,userEvent:p}=__STORYBOOK_MODULE_TEST__;function $({onNavigation:s}){const o=G.useCallback((n,e)=>{s&&s(n,e),console.log(`[Action] ${e} clicked - would navigate to: ${n}`)},[s]);return r.jsx(W,{children:r.jsxs("div",{style:{background:"var(--nv-bg-0)",minHeight:"100vh",color:"var(--nv-text-0)",display:"flex",flexDirection:"column"},children:[r.jsx(H,{onNavigation:o}),r.jsx(M,{onNavigation:o}),r.jsx("div",{style:{maxWidth:1100,margin:"0 auto",padding:"60px 32px"},children:r.jsx(U,{})}),r.jsx(Y,{})]})})}const Z={title:"Lumenforge.io Design System/WIS2L Framework/Landing/Shared Framework Components/Interactive Landing",id:"wis2l-landing-interactive-stories",component:$,parameters:{layout:"fullscreen",backgrounds:{default:"dark"},actions:{handles:["click"]}},tags:["autodocs"],argTypes:{onNavigation:{description:"Called whenever a navigation or hero button is clicked",table:{type:{summary:"(href: string, label: string) => void"}}}}},i={args:{onNavigation:(s,o)=>{q("navigate")({href:s,label:o}),console.log(`Navigation action from Storybook: ${o} → ${s}`)}},play:async({canvasElement:s,step:o})=>{const n=_(s);await o("Verify minimal landing structure",async()=>{const e=await n.findByText(/Your Entire Creative Pipeline in One Workspace/i);a(e).toBeInTheDocument();const t=n.getByRole("link",{name:/Lumenforge\.io/i});a(t).toBeVisible();const u=n.getAllByText(/Instant Preview|Clean Project Explorer|Code-First Workflow/i);a(u.length).toBeGreaterThanOrEqual(3)}),await o("Test all navigation buttons with actions",async()=>{const e=n.getByRole("button",{name:/^docs$/i});a(e).toBeVisible(),await p.click(e);const t=n.getAllByRole("button",{name:/^open editor$/i});a(t.length).toBeGreaterThan(0),await p.click(t[0])}),await o("Test hero buttons with actions",async()=>{const e=n.getByRole("button",{name:/^start coding$/i});a(e).toBeVisible(),await p.click(e);const t=n.getByRole("button",{name:/^try ai generator$/i});a(t).toBeVisible(),await p.click(t)}),await o("Verify Actions panel integration",async()=>{const e=n.getAllByRole("button");a(e.length).toBeGreaterThan(3),e.forEach(t=>{a(t).not.toBeDisabled(),a(t).toBeVisible()})})},parameters:{docs:{description:{story:`
### Interactive Landing Page (Minimal Version)

This story demonstrates the core landing page sections with full Actions panel integration.

**What's Included:**
- Navigation bar (SimpleNav)
- Hero section with CTAs
- Feature grid (3 cards)
- Footer

**Actions Panel:**
- All button clicks are logged to the Actions tab
- Each click shows \`{ href, label }\` object
- Console logs show navigation intent

**Use Cases:**
- Testing individual component interactions
- Verifying navigation wiring
- Debugging click handlers
- Demonstrating Actions panel integration

**Note:** This is a minimal version. For the full landing page with all sections, see \`LandingComponents\` story.
        `}}}},c={...i,parameters:{...i.parameters},globals:{viewport:{value:"mobile1",isRotated:!1}}},l={...i,parameters:{...i.parameters},globals:{viewport:{value:"tablet",isRotated:!1}}},g={...i,parameters:{...i.parameters},globals:{viewport:{value:"desktop",isRotated:!1}}},d={render:()=>r.jsx($,{}),play:async({canvasElement:s,step:o})=>{const n=_(s);await o("Verify structure without actions",async()=>{const e=await n.findByText(/Your Entire Creative Pipeline in One Workspace/i);a(e).toBeInTheDocument();const t=n.getAllByRole("button");a(t.length).toBeGreaterThan(3),t.forEach(u=>a(u).toBeVisible())})},parameters:{...i.parameters,actions:{disable:!0}},name:"Canvas Only (No Actions Logging)"};var m,h,v,b,y;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    onNavigation: (href: string, label: string) => {
      action('navigate')({
        href,
        label
      });
      console.log(\`Navigation action from Storybook: \${label} → \${href}\`);
    }
  },
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Verify minimal landing structure', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();

      // Verify core sections are present
      // Look specifically for the top‑nav logo link by accessible name.
      const logoLink = canvas.getByRole('link', {
        name: /Lumenforge\\.io/i
      });
      expect(logoLink).toBeVisible();
      const featureCards = canvas.getAllByText(/Instant Preview|Clean Project Explorer|Code-First Workflow/i);
      expect(featureCards.length).toBeGreaterThanOrEqual(3);
    });
    await step('Test all navigation buttons with actions', async () => {
      const docsButton = canvas.getByRole('button', {
        name: /^docs$/i
      });
      expect(docsButton).toBeVisible();
      await userEvent.click(docsButton);

      // Find "Open Editor" button (first instance)
      const openEditorButtons = canvas.getAllByRole('button', {
        name: /^open editor$/i
      });
      expect(openEditorButtons.length).toBeGreaterThan(0);
      await userEvent.click(openEditorButtons[0]);
    });
    await step('Test hero buttons with actions', async () => {
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
    await step('Verify Actions panel integration', async () => {
      // All button clicks should have triggered onNavigation
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(3);

      // Verify buttons are clickable
      allButtons.forEach(button => {
        expect(button).not.toBeDisabled();
        expect(button).toBeVisible();
      });
    });
  },
  parameters: {
    docs: {
      description: {
        story: \`
### Interactive Landing Page (Minimal Version)

This story demonstrates the core landing page sections with full Actions panel integration.

**What's Included:**
- Navigation bar (SimpleNav)
- Hero section with CTAs
- Feature grid (3 cards)
- Footer

**Actions Panel:**
- All button clicks are logged to the Actions tab
- Each click shows \\\`{ href, label }\\\` object
- Console logs show navigation intent

**Use Cases:**
- Testing individual component interactions
- Verifying navigation wiring
- Debugging click handlers
- Demonstrating Actions panel integration

**Note:** This is a minimal version. For the full landing page with all sections, see \\\`LandingComponents\\\` story.
        \`
      }
    }
  }
}`,...(v=(h=i.parameters)==null?void 0:h.docs)==null?void 0:v.source},description:{story:`Interactive Landing Page with Actions\r

**How to see Actions:**\r
1. Open the **Canvas** tab for this story\r
2. Open the **Actions** panel at the bottom\r
3. Click any navigation or hero button\r
4. See the \\\`navigate\\\` action logged with \\\`href\\\` and \\\`label\\\`\r

This is a minimal version showing only core sections (Nav, Hero, Features, Footer).\r
Use this for testing individual component interactions.`,...(y=(b=i.parameters)==null?void 0:b.docs)==null?void 0:y.description}}};var B,f,w,k,T;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    ...Default.parameters
  },
  globals: {
    viewport: {
      value: 'mobile1',
      isRotated: false
    }
  }
}`,...(w=(f=c.parameters)==null?void 0:f.docs)==null?void 0:w.source},description:{story:"Mobile Viewport - Interactive Landing",...(T=(k=c.parameters)==null?void 0:k.docs)==null?void 0:T.description}}};var x,A,E,C,V;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(E=(A=l.parameters)==null?void 0:A.docs)==null?void 0:E.source},description:{story:"Tablet Viewport - Interactive Landing",...(V=(C=l.parameters)==null?void 0:C.docs)==null?void 0:V.description}}};var D,L,R,I,O;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`{
  ...Default,
  parameters: {
    ...Default.parameters
  },
  globals: {
    viewport: {
      value: 'desktop',
      isRotated: false
    }
  }
}`,...(R=(L=g.parameters)==null?void 0:L.docs)==null?void 0:R.source},description:{story:"Desktop Viewport - Interactive Landing",...(O=(I=g.parameters)==null?void 0:I.docs)==null?void 0:O.description}}};var S,N,F,j,P;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  render: () => <InteractiveLandingLayout />,
  play: async ({
    canvasElement,
    step
  }) => {
    const canvas = within(canvasElement);
    await step('Verify structure without actions', async () => {
      const heading = await canvas.findByText(/Your Entire Creative Pipeline in One Workspace/i);
      expect(heading).toBeInTheDocument();
      const allButtons = canvas.getAllByRole('button');
      expect(allButtons.length).toBeGreaterThan(3);
      allButtons.forEach(btn => expect(btn).toBeVisible());
    });
  },
  parameters: {
    ...Default.parameters,
    actions: {
      disable: true
    }
  },
  // Clearer name in the UI so users understand this variant's purpose.
  name: 'Canvas Only (No Actions Logging)'
}`,...(F=(N=d.parameters)==null?void 0:N.docs)==null?void 0:F.source},description:{story:"No Actions - For testing without Actions panel noise",...(P=(j=d.parameters)==null?void 0:j.docs)==null?void 0:P.description}}};const ee=["Default","Mobile","Tablet","Desktop","WithoutActions"];export{i as Default,g as Desktop,c as Mobile,l as Tablet,d as WithoutActions,ee as __namedExportsOrder,Z as default};
