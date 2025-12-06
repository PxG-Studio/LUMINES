import{j as t}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";const b=({tabs:p=[{id:"1",label:"Untitled-1",dirty:!0},{id:"2",label:"file.json",dirty:!1}],activeTabId:L,onTabClick:c,onTabClose:u})=>t.jsx("div",{style:{display:"flex",background:"var(--slate-panel, #16181d)",borderBottom:"1px solid var(--slate-border, #26292f)",overflowX:"auto",overflowY:"hidden"},children:p.map(a=>{const n=L===a.id;return t.jsxs("div",{onClick:()=>c==null?void 0:c(a.id),style:{padding:"8px 16px",background:n?"var(--slate-bg, #0f1115)":"transparent",borderRight:"1px solid var(--slate-border, #26292f)",color:"var(--slate-text, #e4e7eb)",cursor:"pointer",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap",fontSize:12,minWidth:120,borderTop:n?"2px solid var(--slate-accent, #3f8cff)":"2px solid transparent",transition:"background 0.2s"},onMouseEnter:e=>{n||(e.currentTarget.style.background="var(--slate-bg, #0f1115)")},onMouseLeave:e=>{n||(e.currentTarget.style.background="transparent")},children:[a.icon&&t.jsx("span",{children:a.icon}),t.jsx("span",{style:{flex:1,overflow:"hidden",textOverflow:"ellipsis"},children:a.label}),a.dirty&&t.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--slate-text-muted, #9ba1aa)"}}),t.jsx("button",{onClick:e=>{e.stopPropagation(),u==null||u(a.id)},style:{padding:"2px 4px",background:"transparent",border:"none",color:"var(--slate-text-muted, #9ba1aa)",cursor:"pointer",borderRadius:2,fontSize:14,lineHeight:1,transition:"background 0.2s"},onMouseEnter:e=>{e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"},onMouseLeave:e=>{e.currentTarget.style.background="transparent"},children:"×"})]},a.id)})});try{b.displayName="Tabs",b.__docgenInfo={description:"",displayName:"Tabs",props:{tabs:{defaultValue:{value:`[\r
    { id: '1', label: 'Untitled-1', dirty: true },\r
    { id: '2', label: 'file.json', dirty: false },\r
  ]`},description:"",name:"tabs",required:!1,type:{name:"Tab[] | undefined"}},activeTabId:{defaultValue:null,description:"",name:"activeTabId",required:!1,type:{name:"string | undefined"}},onTabClick:{defaultValue:null,description:"",name:"onTabClick",required:!1,type:{name:"((tabId: string) => void) | undefined"}},onTabClose:{defaultValue:null,description:"",name:"onTabClose",required:!1,type:{name:"((tabId: string) => void) | undefined"}}}}}catch{}const P={title:"Lumenforge.io Design System/Application Pages/Editor/AppShell/Tabs",component:b,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},r={args:{tabs:[{id:"1",label:"Untitled-1",dirty:!0},{id:"2",label:"file.json",dirty:!1},{id:"3",label:"component.tsx",dirty:!1}],activeTabId:"1"}},s={args:{tabs:[{id:"1",label:"AppShell.tsx",dirty:!1,icon:"📄"},{id:"2",label:"CommandPalette.tsx",dirty:!0,icon:"📄"},{id:"3",label:"Sidebar.tsx",dirty:!1,icon:"📄"},{id:"4",label:"Tabs.tsx",dirty:!1,icon:"📄"},{id:"5",label:"TopBar.tsx",dirty:!0,icon:"📄"}],activeTabId:"2"}},i={args:{tabs:[{id:"1",label:"saved-file.json",dirty:!1},{id:"2",label:"component.tsx",dirty:!1}],activeTabId:"1"}},l={args:{tabs:[{id:"1",label:"unsaved-1.tsx",dirty:!0},{id:"2",label:"unsaved-2.tsx",dirty:!0},{id:"3",label:"unsaved-3.tsx",dirty:!0}],activeTabId:"1"}},d={args:{tabs:[{id:"1",label:"file.json",dirty:!1}],activeTabId:"1"}},o={args:{tabs:[{id:"1",label:"very-long-file-name-that-should-truncate.tsx",dirty:!0},{id:"2",label:"another-extremely-long-file-name.json",dirty:!1}],activeTabId:"1"}};var f,m,y;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'Untitled-1',
      dirty: true
    }, {
      id: '2',
      label: 'file.json',
      dirty: false
    }, {
      id: '3',
      label: 'component.tsx',
      dirty: false
    }],
    activeTabId: '1'
  }
}`,...(y=(m=r.parameters)==null?void 0:m.docs)==null?void 0:y.source}}};var g,x,v;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'AppShell.tsx',
      dirty: false,
      icon: '📄'
    }, {
      id: '2',
      label: 'CommandPalette.tsx',
      dirty: true,
      icon: '📄'
    }, {
      id: '3',
      label: 'Sidebar.tsx',
      dirty: false,
      icon: '📄'
    }, {
      id: '4',
      label: 'Tabs.tsx',
      dirty: false,
      icon: '📄'
    }, {
      id: '5',
      label: 'TopBar.tsx',
      dirty: true,
      icon: '📄'
    }],
    activeTabId: '2'
  }
}`,...(v=(x=s.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var T,h,j;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'saved-file.json',
      dirty: false
    }, {
      id: '2',
      label: 'component.tsx',
      dirty: false
    }],
    activeTabId: '1'
  }
}`,...(j=(h=i.parameters)==null?void 0:h.docs)==null?void 0:j.source}}};var I,S,A;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'unsaved-1.tsx',
      dirty: true
    }, {
      id: '2',
      label: 'unsaved-2.tsx',
      dirty: true
    }, {
      id: '3',
      label: 'unsaved-3.tsx',
      dirty: true
    }],
    activeTabId: '1'
  }
}`,...(A=(S=l.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var k,_,w;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'file.json',
      dirty: false
    }],
    activeTabId: '1'
  }
}`,...(w=(_=d.parameters)==null?void 0:_.docs)==null?void 0:w.source}}};var E,M,D;o.parameters={...o.parameters,docs:{...(E=o.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'very-long-file-name-that-should-truncate.tsx',
      dirty: true
    }, {
      id: '2',
      label: 'another-extremely-long-file-name.json',
      dirty: false
    }],
    activeTabId: '1'
  }
}`,...(D=(M=o.parameters)==null?void 0:M.docs)==null?void 0:D.source}}};const R=["Default","MultipleTabs","AllClean","AllDirty","SingleTab","LongTabNames"];export{i as AllClean,l as AllDirty,r as Default,o as LongTabNames,s as MultipleTabs,d as SingleTab,R as __namedExportsOrder,P as default};
