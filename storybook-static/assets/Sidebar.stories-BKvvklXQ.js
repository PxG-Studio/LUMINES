import{j as n,r as c}from"./iframe-BXkX_8oL.js";import{S as v}from"./Sidebar-CYhyiyMw.js";import"./preload-helper-C1FmrZbK.js";const T={title:"Lumenforge.io Design System/Application Pages/Editor/AppShell/Sidebar",component:v,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},l=e=>{const[i,E]=c.useState(e.collapsed||!1),[C,F]=c.useState(e.activeItemId);return n.jsx(v,{...e,collapsed:i,activeItemId:C,onToggleCollapse:()=>E(!i),onItemClick:j=>F(j)})},a={render:e=>n.jsx(l,{...e}),args:{collapsed:!1,items:[{id:"files",label:"Files",icon:"📁"},{id:"search",label:"Search",icon:"🔍"},{id:"source-control",label:"Source Control",icon:"📦",badge:"3"},{id:"extensions",label:"Extensions",icon:"🧩"}],activeItemId:"files"}},s={render:e=>n.jsx(l,{...e}),args:{collapsed:!0,items:[{id:"files",label:"Files",icon:"📁"},{id:"search",label:"Search",icon:"🔍"},{id:"source-control",label:"Source Control",icon:"📦",badge:"3"},{id:"extensions",label:"Extensions",icon:"🧩"}]}},o={render:e=>n.jsx(l,{...e}),args:{collapsed:!1,items:[{id:"files",label:"Files",icon:"📁"},{id:"search",label:"Search",icon:"🔍",badge:"12"},{id:"source-control",label:"Source Control",icon:"📦",badge:"3"},{id:"extensions",label:"Extensions",icon:"🧩",badge:"1"}],activeItemId:"search"}},r={render:e=>n.jsx(l,{...e}),args:{collapsed:!1,items:[{id:"files",label:"Files",icon:"📁"},{id:"search",label:"Search",icon:"🔍"},{id:"source-control",label:"Source Control",icon:"📦"},{id:"extensions",label:"Extensions",icon:"🧩"},{id:"debug",label:"Debug",icon:"🐛"},{id:"output",label:"Output",icon:"📤"},{id:"terminal",label:"Terminal",icon:"💻"},{id:"problems",label:"Problems",icon:"⚠️",badge:"5"}],activeItemId:"files"}};var t,d,b;a.parameters={...a.parameters,docs:{...(t=a.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    collapsed: false,
    items: [{
      id: 'files',
      label: 'Files',
      icon: '📁'
    }, {
      id: 'search',
      label: 'Search',
      icon: '🔍'
    }, {
      id: 'source-control',
      label: 'Source Control',
      icon: '📦',
      badge: '3'
    }, {
      id: 'extensions',
      label: 'Extensions',
      icon: '🧩'
    }],
    activeItemId: 'files'
  }
}`,...(b=(d=a.parameters)==null?void 0:d.docs)==null?void 0:b.source}}};var p,m,u;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    collapsed: true,
    items: [{
      id: 'files',
      label: 'Files',
      icon: '📁'
    }, {
      id: 'search',
      label: 'Search',
      icon: '🔍'
    }, {
      id: 'source-control',
      label: 'Source Control',
      icon: '📦',
      badge: '3'
    }, {
      id: 'extensions',
      label: 'Extensions',
      icon: '🧩'
    }]
  }
}`,...(u=(m=s.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var g,x,S;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    collapsed: false,
    items: [{
      id: 'files',
      label: 'Files',
      icon: '📁'
    }, {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      badge: '12'
    }, {
      id: 'source-control',
      label: 'Source Control',
      icon: '📦',
      badge: '3'
    }, {
      id: 'extensions',
      label: 'Extensions',
      icon: '🧩',
      badge: '1'
    }],
    activeItemId: 'search'
  }
}`,...(S=(x=o.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var f,I,h;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    collapsed: false,
    items: [{
      id: 'files',
      label: 'Files',
      icon: '📁'
    }, {
      id: 'search',
      label: 'Search',
      icon: '🔍'
    }, {
      id: 'source-control',
      label: 'Source Control',
      icon: '📦'
    }, {
      id: 'extensions',
      label: 'Extensions',
      icon: '🧩'
    }, {
      id: 'debug',
      label: 'Debug',
      icon: '🐛'
    }, {
      id: 'output',
      label: 'Output',
      icon: '📤'
    }, {
      id: 'terminal',
      label: 'Terminal',
      icon: '💻'
    }, {
      id: 'problems',
      label: 'Problems',
      icon: '⚠️',
      badge: '5'
    }],
    activeItemId: 'files'
  }
}`,...(h=(I=r.parameters)==null?void 0:I.docs)==null?void 0:h.source}}};const D=["Expanded","Collapsed","WithBadges","ManyItems"];export{s as Collapsed,a as Expanded,r as ManyItems,o as WithBadges,D as __namedExportsOrder,T as default};
