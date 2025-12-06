import{r as d,j as n}from"./iframe-BXkX_8oL.js";import{c as Z}from"./createLucideIcon-kSpmkMCE.js";import{X as $}from"./x-BrWRloni.js";import{C as T}from"./chevron-right-MEu87n6w.js";import"./preload-helper-C1FmrZbK.js";/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=Z("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]),j=({tabs:i=[],activeTabId:f,onTabSelect:o,onTabClose:a,onTabReorder:p})=>{const[u,m]=d.useState(null),[g,I]=d.useState(0),[q,V]=d.useState(!1),[X,B]=d.useState(!1),[c,E]=d.useState(null),y=d.useRef(null),w=d.useRef(null);d.useEffect(()=>{const e=()=>{if(!y.current||!w.current)return;const t=y.current,s=w.current;V(g>0),B(g<s.scrollWidth-t.clientWidth-10)};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[g,i]),d.useEffect(()=>{const e=t=>{if((t.ctrlKey||t.metaKey)&&t.key==="w"&&(t.preventDefault(),f&&(a==null||a(f))),(t.ctrlKey||t.metaKey)&&(t.key==="Tab"||t.key==="PageDown")){t.preventDefault();const l=(i.findIndex(r=>r.id===f)+1)%i.length;i[l]&&(o==null||o(i[l].id))}if((t.ctrlKey||t.metaKey)&&t.shiftKey&&(t.key==="Tab"||t.key==="PageUp")){t.preventDefault();const s=i.findIndex(r=>r.id===f),l=s>0?s-1:i.length-1;i[l]&&(o==null||o(i[l].id))}};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[f,i,o,a]);const L=e=>{if(!y.current)return;const t=y.current,s=200,l=e==="left"?g-s:g+s;t.scrollTo({left:l,behavior:"smooth"}),I(l)},G=(e,t)=>{m(t),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/html","")},N=(e,t)=>{if(e.preventDefault(),e.dataTransfer.dropEffect="move",u===null||u===t)return;const s=e.currentTarget.getBoundingClientRect(),l=s.left+s.width/2,r=e.clientX;r<l&&u>t?(p==null||p(u,t),m(t)):r>l&&u<t&&(p==null||p(u,t+1),m(t+1))},Y=()=>{m(null)},H=(e,t)=>{e.preventDefault(),e.stopPropagation(),E({visible:!0,x:e.clientX,y:e.clientY,tabId:t})},x=()=>{E(null)},D=(e,t)=>{t==null||t.stopPropagation(),a==null||a(e),x()},U=()=>{c&&(i.forEach(e=>{e.id!==c.tabId&&(a==null||a(e.id))}),x())},J=()=>{i.forEach(e=>{a==null||a(e.id)}),x()},Q=(e,t)=>{e.button===1&&(e.preventDefault(),a==null||a(t))};return n.jsxs("div",{style:{display:"flex",background:"var(--slate-panel, #16181d)",borderBottom:"1px solid var(--slate-border, #26292f)",position:"relative",overflow:"hidden"},onClick:x,children:[q&&n.jsx("button",{onClick:()=>L("left"),style:{padding:"8px 4px",background:"var(--slate-panel, #16181d)",border:"none",borderRight:"1px solid var(--slate-border, #26292f)",color:"var(--slate-text, #e4e7eb)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10},onMouseEnter:e=>{e.currentTarget.style.background="var(--slate-bg, #0f1115)"},onMouseLeave:e=>{e.currentTarget.style.background="var(--slate-panel, #16181d)"},children:n.jsx(ee,{size:16})}),n.jsx("div",{ref:y,style:{flex:1,overflowX:"auto",overflowY:"hidden",scrollBehavior:"smooth",display:"flex"},onScroll:e=>{I(e.currentTarget.scrollLeft)},children:n.jsx("div",{ref:w,style:{display:"flex",minWidth:"max-content"},children:i.map((e,t)=>{const s=f===e.id,l=u===t;return n.jsxs("div",{draggable:!0,onDragStart:r=>G(r,t),onDragOver:r=>N(r,t),onDragEnd:Y,onClick:()=>o==null?void 0:o(e.id),onContextMenu:r=>H(r,e.id),onMouseDown:r=>Q(r,e.id),style:{padding:"8px 16px",background:s?"var(--slate-bg, #0f1115)":"transparent",borderRight:"1px solid var(--slate-border, #26292f)",color:"var(--slate-text, #e4e7eb)",cursor:"pointer",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap",fontSize:12,minWidth:120,maxWidth:240,borderTop:s?"2px solid var(--slate-accent, #3f8cff)":"2px solid transparent",transition:"background 0.15s",opacity:l?.5:1,userSelect:"none"},onMouseEnter:r=>{s||(r.currentTarget.style.background="rgba(255, 255, 255, 0.05)")},onMouseLeave:r=>{s||(r.currentTarget.style.background="transparent")},children:[e.icon&&n.jsx("span",{children:e.icon}),n.jsx("span",{style:{flex:1,overflow:"hidden",textOverflow:"ellipsis"},children:e.label}),e.dirty&&n.jsx("span",{style:{width:6,height:6,borderRadius:"50%",background:"var(--slate-text-muted, #9ba1aa)",flexShrink:0}}),n.jsx("button",{onClick:r=>D(e.id,r),style:{padding:"2px 4px",background:"transparent",border:"none",color:"var(--slate-text-muted, #9ba1aa)",cursor:"pointer",borderRadius:2,fontSize:14,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s",flexShrink:0},onMouseEnter:r=>{r.currentTarget.style.background="rgba(255, 255, 255, 0.1)",r.currentTarget.style.color="#FFFFFF"},onMouseLeave:r=>{r.currentTarget.style.background="transparent",r.currentTarget.style.color="var(--slate-text-muted, #9ba1aa)"},children:n.jsx($,{size:12})})]},e.id)})})}),X&&n.jsx("button",{onClick:()=>L("right"),style:{padding:"8px 4px",background:"var(--slate-panel, #16181d)",border:"none",borderLeft:"1px solid var(--slate-border, #26292f)",color:"var(--slate-text, #e4e7eb)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:10},onMouseEnter:e=>{e.currentTarget.style.background="var(--slate-bg, #0f1115)"},onMouseLeave:e=>{e.currentTarget.style.background="var(--slate-panel, #16181d)"},children:n.jsx(T,{size:16})}),(c==null?void 0:c.visible)&&n.jsxs("div",{style:{position:"fixed",top:c.y,left:c.x,background:"var(--slate-panel, #16181d)",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,boxShadow:"0 4px 12px rgba(0, 0, 0, 0.3)",zIndex:1e3,minWidth:180,padding:4},onClick:e=>e.stopPropagation(),children:[n.jsx("div",{onClick:()=>D(c.tabId),style:{padding:"6px 12px",cursor:"pointer",color:"var(--slate-text, #e4e7eb)",fontSize:12,borderRadius:2},onMouseEnter:e=>{e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"},onMouseLeave:e=>{e.currentTarget.style.background="transparent"},children:"Close"}),n.jsx("div",{onClick:U,style:{padding:"6px 12px",cursor:"pointer",color:"var(--slate-text, #e4e7eb)",fontSize:12,borderRadius:2},onMouseEnter:e=>{e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"},onMouseLeave:e=>{e.currentTarget.style.background="transparent"},children:"Close Others"}),n.jsx("div",{onClick:J,style:{padding:"6px 12px",cursor:"pointer",color:"#EF4444",fontSize:12,borderRadius:2},onMouseEnter:e=>{e.currentTarget.style.background="rgba(239, 68, 68, 0.1)"},onMouseLeave:e=>{e.currentTarget.style.background="transparent"},children:"Close All"})]})]})};try{j.displayName="FileTabs",j.__docgenInfo={description:"",displayName:"FileTabs",props:{tabs:{defaultValue:{value:"[]"},description:"",name:"tabs",required:!1,type:{name:"Tab[] | undefined"}},activeTabId:{defaultValue:null,description:"",name:"activeTabId",required:!1,type:{name:"string | undefined"}},onTabSelect:{defaultValue:null,description:"",name:"onTabSelect",required:!1,type:{name:"((tabId: string) => void) | undefined"}},onTabClose:{defaultValue:null,description:"",name:"onTabClose",required:!1,type:{name:"((tabId: string) => void) | undefined"}},onTabReorder:{defaultValue:null,description:"",name:"onTabReorder",required:!1,type:{name:"((fromIndex: number, toIndex: number) => void) | undefined"}}}}}catch{}const ie={title:"Lumenforge.io Design System/Application Pages/Filesystem/FileTabs",component:j,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},v={args:{tabs:[{id:"1",label:"TurnSystem.json",dirty:!1},{id:"2",label:"CardLogic.json",dirty:!0},{id:"3",label:"GameManager.ts",dirty:!1}],activeTabId:"1"}},h={args:{tabs:[{id:"1",label:"config.json",dirty:!1,icon:"📄"},{id:"2",label:"component.tsx",dirty:!0,icon:"⚛️"},{id:"3",label:"styles.css",dirty:!1,icon:"🎨"}],activeTabId:"2"}},b={args:{tabs:[{id:"1",label:"file1.ts",dirty:!1},{id:"2",label:"file2.ts",dirty:!0},{id:"3",label:"file3.ts",dirty:!1},{id:"4",label:"file4.ts",dirty:!1},{id:"5",label:"file5.ts",dirty:!0},{id:"6",label:"file6.ts",dirty:!1}],activeTabId:"3"}},k={args:{tabs:[{id:"1",label:"unsaved1.json",dirty:!0},{id:"2",label:"unsaved2.json",dirty:!0}],activeTabId:"1"}};var M,S,A;v.parameters={...v.parameters,docs:{...(M=v.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'TurnSystem.json',
      dirty: false
    }, {
      id: '2',
      label: 'CardLogic.json',
      dirty: true
    }, {
      id: '3',
      label: 'GameManager.ts',
      dirty: false
    }],
    activeTabId: '1'
  }
}`,...(A=(S=v.parameters)==null?void 0:S.docs)==null?void 0:A.source}}};var z,F,R;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'config.json',
      dirty: false,
      icon: '📄'
    }, {
      id: '2',
      label: 'component.tsx',
      dirty: true,
      icon: '⚛️'
    }, {
      id: '3',
      label: 'styles.css',
      dirty: false,
      icon: '🎨'
    }],
    activeTabId: '2'
  }
}`,...(R=(F=h.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};var _,C,K;b.parameters={...b.parameters,docs:{...(_=b.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'file1.ts',
      dirty: false
    }, {
      id: '2',
      label: 'file2.ts',
      dirty: true
    }, {
      id: '3',
      label: 'file3.ts',
      dirty: false
    }, {
      id: '4',
      label: 'file4.ts',
      dirty: false
    }, {
      id: '5',
      label: 'file5.ts',
      dirty: true
    }, {
      id: '6',
      label: 'file6.ts',
      dirty: false
    }],
    activeTabId: '3'
  }
}`,...(K=(C=b.parameters)==null?void 0:C.docs)==null?void 0:K.source}}};var W,O,P;k.parameters={...k.parameters,docs:{...(W=k.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    tabs: [{
      id: '1',
      label: 'unsaved1.json',
      dirty: true
    }, {
      id: '2',
      label: 'unsaved2.json',
      dirty: true
    }],
    activeTabId: '1'
  }
}`,...(P=(O=k.parameters)==null?void 0:O.docs)==null?void 0:P.source}}};const le=["Default","WithIcons","ManyTabs","AllDirty"];export{k as AllDirty,v as Default,b as ManyTabs,h as WithIcons,le as __namedExportsOrder,ie as default};
