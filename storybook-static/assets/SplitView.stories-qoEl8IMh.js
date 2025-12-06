import{j as e,T as p}from"./iframe-BXkX_8oL.js";import{S as i}from"./SplitView-DFJKalL5.js";import{P as a}from"./Panel-C-bJBWon.js";import"./preload-helper-C1FmrZbK.js";const g={title:"Lumenforge.io Design System/Components/Layouts/SplitView",component:i,decorators:[m=>e.jsx(p,{children:e.jsx("div",{style:{padding:"24px",background:"var(--nv-bg-0)",height:"500px"},children:e.jsx(m,{})})})],parameters:{layout:"fullscreen",backgrounds:{default:"dark"}},tags:["autodocs"]},r={render:()=>e.jsxs(i,{direction:"horizontal",initial:250,min:150,max:400,children:[e.jsx(a,{children:"Left Panel"}),e.jsx(a,{children:"Right Panel"})]})},n={render:()=>e.jsxs(i,{direction:"vertical",initial:200,min:100,max:300,children:[e.jsx(a,{children:"Top Panel"}),e.jsx(a,{children:"Bottom Panel"})]})};var t,o,l;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => <SplitView direction="horizontal" initial={250} min={150} max={400}>\r
      <Panel>Left Panel</Panel>\r
      <Panel>Right Panel</Panel>\r
    </SplitView>
}`,...(l=(o=r.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};var s,c,d;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <SplitView direction="vertical" initial={200} min={100} max={300}>\r
      <Panel>Top Panel</Panel>\r
      <Panel>Bottom Panel</Panel>\r
    </SplitView>
}`,...(d=(c=n.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};const j=["Horizontal","Vertical"];export{r as Horizontal,n as Vertical,j as __namedExportsOrder,g as default};
