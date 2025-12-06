import{r,j as e}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";const f=({event:c="OnUpdate",payload:m={},repeat:a=!0,interval:o=16})=>{const[u,s]=r.useState(0),[n,p]=r.useState(.016);return r.useEffect(()=>{if(a){const v=setInterval(()=>{s(g=>g+1),p(Math.random()*.02+.014)},o);return()=>clearInterval(v)}else s(1)},[a,o]),e.jsxs("div",{style:{padding:16,background:"var(--slate-panel, #16181d)",border:"1px solid var(--slate-border, #26292f)",borderRadius:8,fontFamily:"var(--font-mono, monospace)",fontSize:12},children:[e.jsxs("div",{style:{color:"var(--slate-accent, #3f8cff)",marginBottom:8},children:["🎮 Runtime Event: ",c]}),e.jsxs("div",{style:{color:"var(--slate-text-muted, #9ba1aa)",marginBottom:8},children:["Frames: ",u," | Delta: ",n.toFixed(4),"s"]}),e.jsx("pre",{style:{background:"var(--slate-bg, #0f1115)",padding:8,borderRadius:4,color:"var(--slate-text, #e4e7eb)",overflow:"auto"},children:JSON.stringify({...m,deltaTime:n},null,2)})]})},y={title:"Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnUpdate",component:f,parameters:{layout:"padded",chromatic:{disable:!0}},tags:["autodocs"]},t={args:{event:"OnUpdate",payload:{},repeat:!0,interval:16}};var d,i,l;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    event: 'OnUpdate',
    payload: {},
    repeat: true,
    interval: 16
  }
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const E=["Event"];export{t as Event,E as __namedExportsOrder,y as default};
