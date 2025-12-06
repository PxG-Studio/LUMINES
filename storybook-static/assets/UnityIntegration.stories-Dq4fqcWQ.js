import{r as o,j as e,T as M}from"./iframe-BXkX_8oL.js";import{P as _,S as D,R as G}from"./square-BBxQQJRg.js";import"./preload-helper-C1FmrZbK.js";import"./createLucideIcon-kSpmkMCE.js";const m=({buildUrl:n="/unity/Build",loaderUrl:f="/unity/Build.loader.js",onReady:c,onError:r,onProgress:u})=>{const g=o.useRef(null),[a,L]=o.useState(null),[i,d]=o.useState(!1),[C,h]=o.useState(!1),[x,R]=o.useState(0);o.useEffect(()=>{if(!g.current)return;(async()=>{try{d(!0);const s=document.createElement("script");return s.src=f,s.async=!0,s.onload=()=>{window.createUnityInstance&&window.createUnityInstance(g.current,{dataUrl:`${n}.data`,frameworkUrl:`${n}.framework.js`,codeUrl:`${n}.wasm`,streamingAssetsUrl:"StreamingAssets",companyName:"WISSIL",productName:"Game Dev IDE",productVersion:"1.0.0"},t=>{R(t),u==null||u(t)}).then(t=>{L(t),d(!1),c==null||c(t)}).catch(t=>{d(!1),r==null||r(t)})},s.onerror=()=>{const t=new Error("Failed to load Unity WebGL loader");d(!1),r==null||r(t)},document.body.appendChild(s),()=>{document.body.removeChild(s)}}catch(s){const t=s instanceof Error?s:new Error("Failed to initialize Unity");d(!1),r==null||r(t)}})()},[n,f,c,r,u]);const P=o.useCallback(()=>{a&&(a.SendMessage("GameManager","Play"),h(!0))},[a]),B=o.useCallback(()=>{a&&(a.SendMessage("GameManager","Stop"),h(!1))},[a]),z=o.useCallback(()=>{a&&a.SendMessage("GameManager","Reload")},[a]);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",background:"var(--slate-bg, #0f1115)",border:"1px solid var(--slate-border, #26292f)",borderRadius:8,overflow:"hidden"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"var(--slate-panel, #16181d)",borderBottom:"1px solid var(--slate-border, #26292f)"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("span",{style:{fontSize:12,fontWeight:500,color:"var(--slate-text, #e4e7eb)"},children:"Unity Runtime"}),i&&e.jsxs("span",{style:{fontSize:11,color:"var(--slate-text-muted, #9ba1aa)"},children:["Loading... ",Math.round(x*100),"%"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[C?e.jsxs("button",{onClick:B,style:{padding:"6px 12px",background:"#ef4444",border:"none",borderRadius:4,color:"#FFFFFF",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:12},children:[e.jsx(D,{size:14}),"Stop"]}):e.jsxs("button",{onClick:P,disabled:!a||i,style:{padding:"6px 12px",background:"var(--slate-accent, #3f8cff)",border:"none",borderRadius:4,color:"#FFFFFF",cursor:a&&!i?"pointer":"not-allowed",opacity:a&&!i?1:.5,display:"flex",alignItems:"center",gap:4,fontSize:12},children:[e.jsx(_,{size:14}),"Play"]}),e.jsx("button",{onClick:z,disabled:!a||i,style:{padding:"6px 12px",background:"transparent",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,color:"var(--slate-text, #e4e7eb)",cursor:a&&!i?"pointer":"not-allowed",opacity:a&&!i?1:.5,display:"flex",alignItems:"center",gap:4,fontSize:12},children:e.jsx(G,{size:14})})]})]}),e.jsx("div",{ref:g,style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"#000000",position:"relative"},children:i&&e.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",color:"#FFFFFF",fontSize:14},children:["Loading Unity... ",Math.round(x*100),"%"]})})]})};try{m.displayName="UnityIntegration",m.__docgenInfo={description:"",displayName:"UnityIntegration",props:{buildUrl:{defaultValue:{value:"/unity/Build"},description:"",name:"buildUrl",required:!1,type:{name:"string | undefined"}},loaderUrl:{defaultValue:{value:"/unity/Build.loader.js"},description:"",name:"loaderUrl",required:!1,type:{name:"string | undefined"}},onReady:{defaultValue:null,description:"",name:"onReady",required:!1,type:{name:"((instance: UnityInstance) => void) | undefined"}},onError:{defaultValue:null,description:"",name:"onError",required:!1,type:{name:"((error: Error) => void) | undefined"}},onProgress:{defaultValue:null,description:"",name:"onProgress",required:!1,type:{name:"((progress: number) => void) | undefined"}}}}}catch{}const T={title:"Lumenforge.io Design System/Application Pages/GameDev/UnityIntegration",component:m,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.02,delay:3e3,pauseAnimationAtEnd:!0},docs:{description:{component:`
# Unity Integration

Integration with Unity WebGL runtime for game development.

## Features

- **Unity WebGL Loading**: Loads Unity builds in the browser
- **Play/Stop Controls**: Control game execution
- **Scene Reload**: Reload Unity scenes
- **Progress Tracking**: Shows loading progress

## Usage

\`\`\`tsx
<UnityIntegration
  buildUrl="/unity/Build"
  loaderUrl="/unity/Build.loader.js"
  onReady={(instance) => {
    // Unity is ready
    instance.SendMessage('GameManager', 'Play');
  }}
/>
\`\`\`
        `}}},tags:["autodocs"],decorators:[n=>e.jsx(M,{children:e.jsx("div",{style:{height:"100vh",width:"100vw"},children:e.jsx(n,{})})})]},l={args:{buildUrl:"/unity/Build",loaderUrl:"/unity/Build.loader.js"},parameters:{chromatic:{disableSnapshot:!0}}},p={args:{...l.args,onReady:n=>{console.log("Unity ready:",n)},onProgress:n=>{console.log("Loading progress:",n)},onError:n=>{console.error("Unity error:",n)}},parameters:{chromatic:{disableSnapshot:!0}}},y={args:{...l.args},parameters:{chromatic:{delay:500}}};var b,U,S;l.parameters={...l.parameters,docs:{...(b=l.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    buildUrl: '/unity/Build',
    loaderUrl: '/unity/Build.loader.js'
  },
  parameters: {
    chromatic: {
      disableSnapshot: true // Unity canvas is dynamic
    }
  }
}`,...(S=(U=l.parameters)==null?void 0:U.docs)==null?void 0:S.source}}};var v,j,I;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    onReady: instance => {
      console.log('Unity ready:', instance);
    },
    onProgress: progress => {
      console.log('Loading progress:', progress);
    },
    onError: error => {
      console.error('Unity error:', error);
    }
  },
  parameters: {
    chromatic: {
      disableSnapshot: true
    }
  }
}`,...(I=(j=p.parameters)==null?void 0:j.docs)==null?void 0:I.source}}};var F,w,k;y.parameters={...y.parameters,docs:{...(F=y.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    ...Default.args
  },
  parameters: {
    chromatic: {
      delay: 500 // Capture loading state
    }
  }
}`,...(k=(w=y.parameters)==null?void 0:w.docs)==null?void 0:k.source}}};const $=["Default","WithHandlers","Loading"];export{l as Default,y as Loading,p as WithHandlers,$ as __namedExportsOrder,T as default};
