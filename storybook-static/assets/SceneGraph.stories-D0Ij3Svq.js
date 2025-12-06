import{r as m,j as e,T as O}from"./iframe-BXkX_8oL.js";import{C as H}from"./chevron-down-CpZuDMZN.js";import{C as N}from"./chevron-right-MEu87n6w.js";import{c as x}from"./createLucideIcon-kSpmkMCE.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=x("Box",[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=x("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=x("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=x("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]),q=({node:t,level:n,expanded:o,onToggle:s,onSelect:d})=>{const i=o.has(t.id),c=t.children&&t.children.length>0,f=()=>{switch(t.type){case"Camera":return e.jsx(P,{size:14});case"Light":return e.jsx(F,{size:14});case"Mesh":return e.jsx(R,{size:14});default:return e.jsx(A,{size:14})}};return e.jsxs("div",{children:[e.jsxs("div",{onClick:()=>d(t),style:{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",paddingLeft:`${n*16+8}px`,background:t.selected?"rgba(63, 140, 255, 0.2)":"transparent",cursor:"pointer",fontSize:12,color:t.active?"var(--slate-text, #e4e7eb)":"var(--slate-text-muted, #9ba1aa)"},onMouseEnter:a=>{t.selected||(a.currentTarget.style.background="var(--slate-panel-hover, #1e2127)")},onMouseLeave:a=>{t.selected||(a.currentTarget.style.background="transparent")},children:[c?e.jsx("button",{onClick:a=>{a.stopPropagation(),s(t)},style:{background:"transparent",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",color:"var(--slate-text-muted, #9ba1aa)"},children:i?e.jsx(H,{size:12}):e.jsx(N,{size:12})}):e.jsx("div",{style:{width:12}}),e.jsx("div",{style:{color:"var(--slate-text-muted, #9ba1aa)"},children:f()}),e.jsx("span",{style:{opacity:t.active?1:.5,textDecoration:t.active?"none":"line-through"},children:t.name})]}),c&&i&&e.jsx("div",{children:t.children.map(a=>e.jsx(q,{node:a,level:n+1,expanded:o,onToggle:s,onSelect:d},a.id))})]})},b=({root:t,onNodeSelect:n,onNodeToggle:o})=>{const[s,d]=m.useState(new Set),[i,c]=m.useState(null),f=m.useCallback(r=>{d(l=>{const p=new Set(l);return p.has(r.id)?p.delete(r.id):p.add(r.id),p}),o==null||o(r)},[o]),a=m.useCallback(r=>{c(r),n==null||n(r)},[n]);if(!t)return e.jsx("div",{style:{padding:16,textAlign:"center",color:"var(--slate-text-muted, #9ba1aa)",fontSize:12},children:"No scene loaded"});const S=r=>{var l;return{...r,selected:r.id===(i==null?void 0:i.id),children:(l=r.children)==null?void 0:l.map(S)}},I=S(t);return e.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100%",background:"var(--slate-panel, #16181d)",border:"1px solid var(--slate-border, #26292f)",borderRadius:8,overflow:"hidden"},children:[e.jsx("div",{style:{padding:"8px 12px",borderBottom:"1px solid var(--slate-border, #26292f)",fontSize:12,fontWeight:500,color:"var(--slate-text, #e4e7eb)"},children:"Hierarchy"}),e.jsx("div",{style:{flex:1,overflowY:"auto",padding:4},children:e.jsx(q,{node:I,level:0,expanded:s,onToggle:f,onSelect:a})})]})};try{b.displayName="SceneGraph",b.__docgenInfo={description:"",displayName:"SceneGraph",props:{root:{defaultValue:null,description:"",name:"root",required:!1,type:{name:"SceneNode | undefined"}},onNodeSelect:{defaultValue:null,description:"",name:"onNodeSelect",required:!1,type:{name:"((node: SceneNode) => void) | undefined"}},onNodeToggle:{defaultValue:null,description:"",name:"onNodeToggle",required:!1,type:{name:"((node: SceneNode) => void) | undefined"}}}}}catch{}const Q={title:"Lumenforge.io Design System/Application Pages/GameDev/SceneGraph",component:b,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,delay:500},docs:{description:{component:`
# Scene Graph

Visual representation of Unity scene hierarchy, similar to Unity's Hierarchy panel.

## Features

- **Hierarchy Tree**: Expandable/collapsible scene tree
- **Node Selection**: Select scene nodes
- **Type Icons**: Visual indicators for different node types
- **Active/Inactive**: Visual distinction for active/inactive objects
        `}}},tags:["autodocs"],decorators:[t=>e.jsx(O,{children:e.jsx("div",{style:{height:"600px",width:"300px"},children:e.jsx(t,{})})})]},B={id:"root",name:"Main Scene",type:"GameObject",active:!0,children:[{id:"camera",name:"Main Camera",type:"Camera",active:!0},{id:"light",name:"Directional Light",type:"Light",active:!0},{id:"player",name:"Player",type:"GameObject",active:!0,children:[{id:"player-mesh",name:"PlayerMesh",type:"Mesh",active:!0},{id:"player-collider",name:"Collider",type:"GameObject",active:!0}]},{id:"enemies",name:"Enemies",type:"GameObject",active:!0,children:[{id:"enemy-1",name:"Enemy 1",type:"GameObject",active:!0},{id:"enemy-2",name:"Enemy 2",type:"GameObject",active:!1}]}]},u={args:{root:B}},h={args:{root:void 0}},y={args:{root:B,onNodeSelect:t=>{console.log("Selected node:",t)},onNodeToggle:t=>{console.log("Toggled node:",t)}}},g={args:{root:void 0},render:()=>e.jsxs("div",{style:{padding:16,color:"var(--slate-text-muted, #9ba1aa)",fontStyle:"italic"},children:[e.jsx("div",{style:{marginBottom:8},children:"Loading scene graph..."}),e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Connecting to Unity runtime"})]})},v={args:{root:void 0},render:()=>e.jsxs("div",{style:{padding:16,background:"rgba(220, 38, 38, 0.1)",border:"1px solid rgba(220, 38, 38, 0.3)",borderRadius:4,color:"var(--slate-text, #e4e7eb)"},children:[e.jsx("div",{style:{color:"#ef4444",fontWeight:"bold",marginBottom:8},children:"⚠️ Error loading scene graph"}),e.jsx("div",{style:{fontSize:12,opacity:.8},children:"Failed to connect to Unity runtime"}),e.jsx("div",{style:{fontSize:11,opacity:.6,marginTop:4},children:"Check Unity WebGL build is running"})]})};var j,k,C;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    root: sampleScene
  }
}`,...(C=(k=u.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};var z,L,E;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    root: undefined
  }
}`,...(E=(L=h.parameters)==null?void 0:L.docs)==null?void 0:E.source}}};var G,M,T;y.parameters={...y.parameters,docs:{...(G=y.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    root: sampleScene,
    onNodeSelect: node => {
      console.log('Selected node:', node);
    },
    onNodeToggle: node => {
      console.log('Toggled node:', node);
    }
  }
}`,...(T=(M=y.parameters)==null?void 0:M.docs)==null?void 0:T.source}}};var w,_,D;g.parameters={...g.parameters,docs:{...(w=g.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    root: undefined
  },
  render: () => <div style={{
    padding: 16,
    color: 'var(--slate-text-muted, #9ba1aa)',
    fontStyle: 'italic'
  }}>\r
      <div style={{
      marginBottom: 8
    }}>Loading scene graph...</div>\r
      <div style={{
      fontSize: 12,
      opacity: 0.7
    }}>Connecting to Unity runtime</div>\r
    </div>
}`,...(D=(_=g.parameters)==null?void 0:_.docs)==null?void 0:D.source}}};var U,V,W;v.parameters={...v.parameters,docs:{...(U=v.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    root: undefined
  },
  render: () => <div style={{
    padding: 16,
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    borderRadius: 4,
    color: 'var(--slate-text, #e4e7eb)'
  }}>\r
      <div style={{
      color: '#ef4444',
      fontWeight: 'bold',
      marginBottom: 8
    }}>\r
        ⚠️ Error loading scene graph\r
      </div>\r
      <div style={{
      fontSize: 12,
      opacity: 0.8
    }}>\r
        Failed to connect to Unity runtime\r
      </div>\r
      <div style={{
      fontSize: 11,
      opacity: 0.6,
      marginTop: 4
    }}>\r
        Check Unity WebGL build is running\r
      </div>\r
    </div>
}`,...(W=(V=v.parameters)==null?void 0:V.docs)==null?void 0:W.source}}};const X=["Default","Empty","WithHandlers","Loading","Error"];export{u as Default,h as Empty,v as Error,g as Loading,y as WithHandlers,X as __namedExportsOrder,Q as default};
