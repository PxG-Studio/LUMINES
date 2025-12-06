import{r as d,j as e}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";const S=({event:u="OnStart",payload:v={},repeat:r=!1,interval:n=1e3})=>{const[s,o]=d.useState(0);return d.useEffect(()=>{if(r){const f=setInterval(()=>{o(y=>y+1)},n);return()=>clearInterval(f)}else o(1)},[r,n]),e.jsxs("div",{style:{padding:16,background:"var(--slate-panel, #16181d)",border:"1px solid var(--slate-border, #26292f)",borderRadius:8,fontFamily:"var(--font-mono, monospace)",fontSize:12},children:[e.jsxs("div",{style:{color:"var(--slate-accent, #3f8cff)",marginBottom:8},children:["🎮 Runtime Event: ",u]}),e.jsxs("div",{style:{color:"var(--slate-text-muted, #9ba1aa)",marginBottom:8},children:["Triggered: ",s," time",s!==1?"s":""]}),e.jsx("pre",{style:{background:"var(--slate-bg, #0f1115)",padding:8,borderRadius:4,color:"var(--slate-text, #e4e7eb)",overflow:"auto"},children:JSON.stringify(v,null,2)})]})},O={title:"Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnStart",component:S,parameters:{layout:"padded",chromatic:{disable:!0}},tags:["autodocs"]},t={args:{event:"OnStart",payload:{sceneId:"main",timestamp:Date.now()}}},a={args:{event:"OnStart",payload:{sceneId:"game",gameObjects:42,components:156}}};var c,i,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    event: 'OnStart',
    payload: {
      sceneId: 'main',
      timestamp: Date.now()
    }
  }
}`,...(m=(i=t.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var l,p,g;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    event: 'OnStart',
    payload: {
      sceneId: 'game',
      gameObjects: 42,
      components: 156
    }
  }
}`,...(g=(p=a.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const E=["Event","WithPayload"];export{t as Event,a as WithPayload,E as __namedExportsOrder,O as default};
