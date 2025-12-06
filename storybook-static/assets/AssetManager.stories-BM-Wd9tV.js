import{r as i,j as t,T as I}from"./iframe-BXkX_8oL.js";import{c as n}from"./createLucideIcon-kSpmkMCE.js";import{S as R}from"./search-CwVPrFhY.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=n("FileCode",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m10 13-2 2 2 2",key:"17smn8"}],["path",{d:"m14 17 2-2-2-2",key:"14mezr"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=n("File",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=n("Image",[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=n("Music",[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=n("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=n("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]),g=({assets:a=[],onAssetSelect:r,onAssetUpload:o,onAssetDelete:H})=>{const[f,D]=i.useState(""),[l,C]=i.useState("all"),[L,N]=i.useState("grid"),h=e=>{switch(e){case"texture":return t.jsx(E,{size:20});case"audio":return t.jsx(P,{size:20});case"script":return t.jsx($,{size:20});case"prefab":case"scene":return t.jsx(W,{size:20});default:return t.jsx(U,{size:20})}},x=e=>e<1024?`${e} B`:e<1024*1024?`${(e/1024).toFixed(1)} KB`:`${(e/(1024*1024)).toFixed(1)} MB`,m=a.filter(e=>{const s=e.name.toLowerCase().includes(f.toLowerCase()),V=l==="all"||e.type===l;return s&&V}),q=i.useCallback(e=>{const s=Array.from(e.target.files||[]);o==null||o(s)},[o]),B=["all","texture","model","audio","script","prefab","scene"];return t.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",background:"var(--slate-panel, #16181d)",border:"1px solid var(--slate-border, #26292f)",borderRadius:8,overflow:"hidden"},children:[t.jsxs("div",{style:{padding:"12px 16px",borderBottom:"1px solid var(--slate-border, #26292f)"},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},children:[t.jsx("h3",{style:{fontSize:14,fontWeight:600,color:"var(--slate-text, #e4e7eb)"},children:"Assets"}),t.jsx("div",{style:{display:"flex",gap:4},children:t.jsxs("label",{style:{padding:"4px 8px",background:"var(--slate-accent, #3f8cff)",border:"none",borderRadius:4,color:"#FFFFFF",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:4},children:[t.jsx(G,{size:12}),"Upload",t.jsx("input",{type:"file",multiple:!0,onChange:q,style:{display:"none"}})]})})]}),t.jsxs("div",{style:{position:"relative",marginBottom:12},children:[t.jsx(R,{size:14,style:{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",color:"var(--slate-text-muted, #9ba1aa)"}}),t.jsx("input",{type:"text",placeholder:"Search assets...",value:f,onChange:e=>D(e.target.value),style:{width:"100%",padding:"6px 8px 6px 32px",background:"var(--slate-bg, #0f1115)",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,color:"var(--slate-text, #e4e7eb)",fontSize:12,outline:"none"}})]}),t.jsx("div",{style:{display:"flex",gap:4,flexWrap:"wrap"},children:B.map(e=>t.jsx("button",{onClick:()=>C(e),style:{padding:"4px 8px",background:l===e?"var(--slate-accent, #3f8cff)":"transparent",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,color:l===e?"#FFFFFF":"var(--slate-text, #e4e7eb)",cursor:"pointer",fontSize:11,textTransform:"capitalize"},children:e},e))})]}),t.jsx("div",{style:{flex:1,overflowY:"auto",padding:12},children:m.length===0?t.jsx("div",{style:{textAlign:"center",padding:40,color:"var(--slate-text-muted, #9ba1aa)",fontSize:12},children:"No assets found"}):L==="grid"?t.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(120px, 1fr))",gap:12},children:m.map(e=>t.jsxs("div",{onClick:()=>r==null?void 0:r(e),style:{padding:12,background:"var(--slate-bg, #0f1115)",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,cursor:"pointer",transition:"all 0.2s"},onMouseEnter:s=>{s.currentTarget.style.background="var(--slate-panel-hover, #1e2127)",s.currentTarget.style.borderColor="var(--slate-accent, #3f8cff)"},onMouseLeave:s=>{s.currentTarget.style.background="var(--slate-bg, #0f1115)",s.currentTarget.style.borderColor="var(--slate-border, #26292f)"},children:[e.thumbnail?t.jsx("img",{src:e.thumbnail,alt:e.name,style:{width:"100%",height:80,objectFit:"cover",borderRadius:4,marginBottom:8}}):t.jsx("div",{style:{width:"100%",height:80,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--slate-panel, #16181d)",borderRadius:4,marginBottom:8,color:"var(--slate-text-muted, #9ba1aa)"},children:h(e.type)}),t.jsx("div",{style:{fontSize:11,fontWeight:500,color:"var(--slate-text, #e4e7eb)",marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:e.name}),t.jsx("div",{style:{fontSize:10,color:"var(--slate-text-muted, #9ba1aa)"},children:x(e.size)})]},e.id))}):t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:4},children:m.map(e=>t.jsxs("div",{onClick:()=>r==null?void 0:r(e),style:{display:"flex",alignItems:"center",gap:12,padding:8,background:"var(--slate-bg, #0f1115)",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,cursor:"pointer"},onMouseEnter:s=>{s.currentTarget.style.background="var(--slate-panel-hover, #1e2127)"},onMouseLeave:s=>{s.currentTarget.style.background="var(--slate-bg, #0f1115)"},children:[t.jsx("div",{style:{color:"var(--slate-text-muted, #9ba1aa)"},children:h(e.type)}),t.jsxs("div",{style:{flex:1},children:[t.jsx("div",{style:{fontSize:12,fontWeight:500,color:"var(--slate-text, #e4e7eb)"},children:e.name}),t.jsxs("div",{style:{fontSize:11,color:"var(--slate-text-muted, #9ba1aa)"},children:[e.path," • ",x(e.size)]})]})]},e.id))})})]})};try{g.displayName="AssetManager",g.__docgenInfo={description:"",displayName:"AssetManager",props:{assets:{defaultValue:{value:"[]"},description:"",name:"assets",required:!1,type:{name:"GameAsset[] | undefined"}},onAssetSelect:{defaultValue:null,description:"",name:"onAssetSelect",required:!1,type:{name:"((asset: GameAsset) => void) | undefined"}},onAssetUpload:{defaultValue:null,description:"",name:"onAssetUpload",required:!1,type:{name:"((files: File[]) => void) | undefined"}},onAssetDelete:{defaultValue:null,description:"",name:"onAssetDelete",required:!1,type:{name:"((asset: GameAsset) => void) | undefined"}}}}}catch{}const K={title:"Lumenforge.io Design System/Application Pages/GameDev/AssetManager",component:g,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,delay:1e3},docs:{description:{component:`
# Asset Manager

Manages game assets (textures, models, audio, scripts) for Unity and game development.

## Features

- **Asset Browser**: Grid and list view modes
- **Type Filtering**: Filter by asset type
- **Search**: Search assets by name
- **Upload**: Upload new assets
- **Thumbnails**: Visual preview of assets
        `}}},tags:["autodocs"],decorators:[a=>t.jsx(I,{children:t.jsx("div",{style:{height:"600px",width:"100%"},children:t.jsx(a,{})})})]},_=[{id:"1",name:"player_texture.png",type:"texture",path:"/Assets/Textures/player_texture.png",size:1024*512,lastModified:new Date,thumbnail:"https://via.placeholder.com/120x80?text=Texture"},{id:"2",name:"enemy_model.fbx",type:"model",path:"/Assets/Models/enemy_model.fbx",size:1024*1024*5,lastModified:new Date},{id:"3",name:"background_music.mp3",type:"audio",path:"/Assets/Audio/background_music.mp3",size:1024*1024*3,lastModified:new Date},{id:"4",name:"PlayerController.cs",type:"script",path:"/Assets/Scripts/PlayerController.cs",size:1024*2,lastModified:new Date},{id:"5",name:"MainScene.unity",type:"scene",path:"/Assets/Scenes/MainScene.unity",size:1024*50,lastModified:new Date}],d={args:{assets:_}},c={args:{assets:[]}},p={args:{assets:Array.from({length:100},(a,r)=>({id:`asset-${r}`,name:`asset_${r}.png`,type:"texture",path:`/Assets/Textures/asset_${r}.png`,size:1024*512,lastModified:new Date}))},parameters:{chromatic:{diffThreshold:.02}}},u={args:{assets:_,onAssetSelect:a=>{console.log("Selected asset:",a)},onAssetUpload:a=>{console.log("Uploading files:",a)},onAssetDelete:a=>{console.log("Deleting asset:",a)}}};var y,v,b;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    assets: sampleAssets
  }
}`,...(b=(v=d.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var j,k,M;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    assets: []
  }
}`,...(M=(k=c.parameters)==null?void 0:k.docs)==null?void 0:M.source}}};var w,z,A;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    assets: Array.from({
      length: 100
    }, (_, i) => ({
      id: \`asset-\${i}\`,
      name: \`asset_\${i}.png\`,
      type: 'texture' as const,
      path: \`/Assets/Textures/asset_\${i}.png\`,
      size: 1024 * 512,
      lastModified: new Date()
    }))
  },
  parameters: {
    chromatic: {
      diffThreshold: 0.02
    }
  }
}`,...(A=(z=p.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var S,F,T;u.parameters={...u.parameters,docs:{...(S=u.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    assets: sampleAssets,
    onAssetSelect: asset => {
      console.log('Selected asset:', asset);
    },
    onAssetUpload: files => {
      console.log('Uploading files:', files);
    },
    onAssetDelete: asset => {
      console.log('Deleting asset:', asset);
    }
  }
}`,...(T=(F=u.parameters)==null?void 0:F.docs)==null?void 0:T.source}}};const J=["Default","Empty","LargeList","WithHandlers"];export{d as Default,c as Empty,p as LargeList,u as WithHandlers,J as __namedExportsOrder,K as default};
