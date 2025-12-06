import{j as e}from"./iframe-BXkX_8oL.js";import{A as E}from"./AppShell-DtP9LtO4.js";import{S as P}from"./Sidebar-CYhyiyMw.js";import{T as s}from"./TopBar-IF7Bn62b.js";import{F as D}from"./FileTree-Cle7a5tZ.js";import"./preload-helper-C1FmrZbK.js";const q={title:"Lumenforge.io Design System/Application Pages/Editor/AppShell/AppShell",component:E,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},a=()=>e.jsx("div",{style:{padding:16,color:"var(--slate-text, #e4e7eb)",fontFamily:"var(--font-mono, monospace)"},children:"Editor Content Area"}),c=()=>e.jsx("div",{style:{padding:16,color:"var(--slate-text, #e4e7eb)"},children:"Inspector Panel"}),r={args:{sidebarVisible:!0,panelsVisible:!0,fullscreen:!1,sidebar:e.jsx(P,{}),topBar:e.jsx(s,{}),children:e.jsx(a,{}),panels:e.jsx(c,{})}},n={args:{sidebarVisible:!1,panelsVisible:!0,fullscreen:!1,topBar:e.jsx(s,{}),children:e.jsx(a,{}),panels:e.jsx(c,{})}},l={args:{sidebarVisible:!0,panelsVisible:!1,fullscreen:!1,sidebar:e.jsx(P,{}),topBar:e.jsx(s,{}),children:e.jsx(a,{})}},i={args:{sidebarVisible:!1,panelsVisible:!1,fullscreen:!0,topBar:e.jsx(s,{}),children:e.jsx(a,{})}},t={args:{sidebarVisible:!1,panelsVisible:!1,fullscreen:!1,topBar:e.jsx(s,{}),children:e.jsx(a,{})}},o={args:{sidebarVisible:!0,panelsVisible:!0,fullscreen:!1,sidebar:e.jsx(D,{}),topBar:e.jsx(s,{}),children:e.jsx(a,{}),panels:e.jsx(c,{})}},d={args:{sidebarVisible:!0,panelsVisible:!0,fullscreen:!1,sidebar:e.jsx("div",{style:{padding:16,color:"var(--slate-text-muted, #9ba1aa)"},children:"Loading sidebar..."}),topBar:e.jsx(s,{}),children:e.jsx("div",{style:{padding:16,color:"var(--slate-text-muted, #9ba1aa)",display:"flex",alignItems:"center",justifyContent:"center",height:"100%"},children:e.jsx("div",{children:"Loading editor..."})}),panels:e.jsx("div",{style:{padding:16,color:"var(--slate-text-muted, #9ba1aa)"},children:"Loading panels..."})}};var p,u,b;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
    sidebar: <Sidebar />,
    topBar: <TopBar />,
    children: <MockContent />,
    panels: <MockPanels />
  }
}`,...(b=(u=r.parameters)==null?void 0:u.docs)==null?void 0:b.source}}};var m,f,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    sidebarVisible: false,
    panelsVisible: true,
    fullscreen: false,
    topBar: <TopBar />,
    children: <MockContent />,
    panels: <MockPanels />
  }
}`,...(g=(f=n.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var x,h,j;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    sidebarVisible: true,
    panelsVisible: false,
    fullscreen: false,
    sidebar: <Sidebar />,
    topBar: <TopBar />,
    children: <MockContent />
  }
}`,...(j=(h=l.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var V,v,B;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    sidebarVisible: false,
    panelsVisible: false,
    fullscreen: true,
    topBar: <TopBar />,
    children: <MockContent />
  }
}`,...(B=(v=i.parameters)==null?void 0:v.docs)==null?void 0:B.source}}};var S,y,T;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    sidebarVisible: false,
    panelsVisible: false,
    fullscreen: false,
    topBar: <TopBar />,
    children: <MockContent />
  }
}`,...(T=(y=t.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var M,C,k;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
    sidebar: <FileTree />,
    topBar: <TopBar />,
    children: <MockContent />,
    panels: <MockPanels />
  }
}`,...(k=(C=o.parameters)==null?void 0:C.docs)==null?void 0:k.source}}};var L,A,F;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
    sidebar: <div style={{
      padding: 16,
      color: 'var(--slate-text-muted, #9ba1aa)'
    }}>\r
        Loading sidebar...\r
      </div>,
    topBar: <TopBar />,
    children: <div style={{
      padding: 16,
      color: 'var(--slate-text-muted, #9ba1aa)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>\r
        <div>Loading editor...</div>\r
      </div>,
    panels: <div style={{
      padding: 16,
      color: 'var(--slate-text-muted, #9ba1aa)'
    }}>\r
        Loading panels...\r
      </div>
  }
}`,...(F=(A=d.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};const w=["Default","SidebarCollapsed","PanelsHidden","Fullscreen","Minimal","WithFileTree","Loading"];export{r as Default,i as Fullscreen,d as Loading,t as Minimal,l as PanelsHidden,n as SidebarCollapsed,o as WithFileTree,w as __namedExportsOrder,q as default};
