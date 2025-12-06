import{j as e}from"./iframe-BXkX_8oL.js";import{U as u}from"./UnityPreviewDecorator-CZtXpJKS.js";import"./preload-helper-C1FmrZbK.js";import"./unityBridge-ChVzu39L.js";const g={title:"Lumenforge.io Design System/WIS2L Framework/Unity Bridge/MinimalUnity",component:()=>null,decorators:[(d,m)=>e.jsx(u,{buildUrl:"/UnityBuild",enabled:!0,children:e.jsx(d,{...m})})],parameters:{layout:"padded"}},r={render:()=>e.jsxs("div",{children:[e.jsx("h3",{style:{marginTop:0,marginBottom:12},children:"Minimal Unity WebGL Template"}),e.jsx("p",{style:{margin:0,opacity:.8},children:"This shows the default scene inside Storybook. The Unity WebGL build loads in the preview above."})]})},n={render:()=>e.jsxs("div",{children:[e.jsx("h3",{style:{marginTop:0,marginBottom:12},children:"Custom Unity Build"}),e.jsx("p",{style:{margin:0,opacity:.8},children:"You can specify a custom build URL using the buildUrl prop."})]}),args:{buildUrl:"/UnityBuild",unityEnabled:!0}};var i,t,o;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div>\r
      <h3 style={{
      marginTop: 0,
      marginBottom: 12
    }}>Minimal Unity WebGL Template</h3>\r
      <p style={{
      margin: 0,
      opacity: 0.8
    }}>\r
        This shows the default scene inside Storybook. The Unity WebGL build loads in the preview above.\r
      </p>\r
    </div>
}`,...(o=(t=r.parameters)==null?void 0:t.docs)==null?void 0:o.source}}};var s,a,l;n.parameters={...n.parameters,docs:{...(s=n.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <div>\r
      <h3 style={{
      marginTop: 0,
      marginBottom: 12
    }}>Custom Unity Build</h3>\r
      <p style={{
      margin: 0,
      opacity: 0.8
    }}>\r
        You can specify a custom build URL using the buildUrl prop.\r
      </p>\r
    </div>,
  args: {
    buildUrl: "/UnityBuild",
    unityEnabled: true
  }
}`,...(l=(a=n.parameters)==null?void 0:a.docs)==null?void 0:l.source}}};const b=["Default","WithCustomBuild"];export{r as Default,n as WithCustomBuild,b as __namedExportsOrder,g as default};
