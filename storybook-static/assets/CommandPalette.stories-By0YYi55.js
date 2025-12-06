import{r as s,j as t}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";const b=({visible:r=!1,onClose:a,onCommandSelect:i,commands:_=[{id:"new-file",label:"New File",category:"File"},{id:"save",label:"Save",category:"File",shortcut:"Ctrl+S"},{id:"open-file",label:"Open File",category:"File"},{id:"command-palette",label:"Show Command Palette",category:"View",shortcut:"Ctrl+P"},{id:"toggle-sidebar",label:"Toggle Sidebar",category:"View"}]})=>{const[m,f]=s.useState(""),[d,o]=s.useState(0),y=s.useRef(null);s.useEffect(()=>{var e;r?(e=y.current)==null||e.focus():(f(""),o(0))},[r]);const n=_.filter(e=>e.label.toLowerCase().includes(m.toLowerCase()));return s.useEffect(()=>{d>=n.length&&o(0)},[n.length,d]),r?t.jsx("div",{style:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"10vh",zIndex:1e4},onClick:a,children:t.jsxs("div",{style:{width:"600px",maxWidth:"90vw",background:"var(--slate-panel, #16181d)",border:"1px solid var(--slate-border, #26292f)",borderRadius:8,boxShadow:"0 8px 32px rgba(0, 0, 0, 0.5)",overflow:"hidden"},onClick:e=>e.stopPropagation(),children:[t.jsx("div",{style:{padding:16,borderBottom:"1px solid var(--slate-border, #26292f)"},children:t.jsx("input",{ref:y,type:"text",placeholder:"Type a command...",value:m,onChange:e=>f(e.target.value),style:{width:"100%",padding:"8px 12px",background:"var(--slate-bg, #0f1115)",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,color:"var(--slate-text, #e4e7eb)",fontSize:14,outline:"none"},onKeyDown:e=>{if(e.key==="Escape")a==null||a();else if(e.key==="Enter"){const l=n[d];l&&(i==null||i(l.id),a==null||a())}else e.key==="ArrowDown"?(e.preventDefault(),o(l=>l<n.length-1?l+1:0)):e.key==="ArrowUp"&&(e.preventDefault(),o(l=>l>0?l-1:n.length-1))}})}),t.jsx("div",{style:{maxHeight:"400px",overflowY:"auto"},children:n.length===0?t.jsx("div",{style:{padding:24,textAlign:"center",color:"var(--slate-text-muted, #9ba1aa)",fontSize:13},children:"No commands found"}):n.map((e,l)=>t.jsxs("div",{onClick:()=>{i==null||i(e.id),a==null||a()},style:{padding:"12px 16px",background:d===l?"rgba(63, 140, 255, 0.1)":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid var(--slate-border, #26292f)"},onMouseEnter:()=>o(l),children:[t.jsxs("div",{children:[t.jsx("div",{style:{color:"var(--slate-text, #e4e7eb)",fontSize:13,marginBottom:2},children:e.label}),e.category&&t.jsx("div",{style:{color:"var(--slate-text-muted, #9ba1aa)",fontSize:11},children:e.category})]}),e.shortcut&&t.jsx("div",{style:{padding:"2px 6px",background:"var(--slate-bg, #0f1115)",borderRadius:4,fontSize:11,color:"var(--slate-text-muted, #9ba1aa)",fontFamily:"monospace"},children:e.shortcut})]},e.id))})]})}):null};try{b.displayName="CommandPalette",b.__docgenInfo={description:"",displayName:"CommandPalette",props:{visible:{defaultValue:{value:"false"},description:"",name:"visible",required:!1,type:{name:"boolean | undefined"}},onClose:{defaultValue:null,description:"",name:"onClose",required:!1,type:{name:"(() => void) | undefined"}},onCommandSelect:{defaultValue:null,description:"",name:"onCommandSelect",required:!1,type:{name:"((commandId: string) => void) | undefined"}},commands:{defaultValue:{value:`[\r
    { id: 'new-file', label: 'New File', category: 'File' },\r
    { id: 'save', label: 'Save', category: 'File', shortcut: 'Ctrl+S' },\r
    { id: 'open-file', label: 'Open File', category: 'File' },\r
    { id: 'command-palette', label: 'Show Command Palette', category: 'View', shortcut: 'Ctrl+P' },\r
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', category: 'View' },\r
  ]`},description:"",name:"commands",required:!1,type:{name:"Command[] | undefined"}}}}}catch{}const T={title:"Lumenforge.io Design System/Application Pages/Editor/AppShell/CommandPalette",component:b,parameters:{layout:"centered",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},I=r=>{const[a,i]=s.useState(r.visible||!1);return t.jsxs(t.Fragment,{children:[t.jsx("button",{onClick:()=>i(!0),style:{padding:"8px 16px",background:"#3f8cff",color:"white",border:"none",borderRadius:4,cursor:"pointer"},children:"Open Command Palette"}),t.jsx(b,{...r,visible:a,onClose:()=>i(!1)})]})},c={render:r=>t.jsx(I,{...r}),args:{visible:!0,commands:[{id:"new-file",label:"New File",category:"File"},{id:"save",label:"Save",category:"File",shortcut:"Ctrl+S"},{id:"open-file",label:"Open File",category:"File"},{id:"command-palette",label:"Show Command Palette",category:"View",shortcut:"Ctrl+P"},{id:"toggle-sidebar",label:"Toggle Sidebar",category:"View"}]}},p={render:r=>t.jsx(I,{...r}),args:{visible:!0,commands:[{id:"new-file",label:"New File",category:"File"},{id:"save",label:"Save",category:"File",shortcut:"Ctrl+S"},{id:"open-file",label:"Open File",category:"File"},{id:"search",label:"Search",category:"Edit",shortcut:"Ctrl+F"},{id:"replace",label:"Replace",category:"Edit",shortcut:"Ctrl+H"}]}},u={args:{visible:!0,commands:[]}},g={args:{visible:!1}};var h,v,x;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    visible: true,
    commands: [{
      id: 'new-file',
      label: 'New File',
      category: 'File'
    }, {
      id: 'save',
      label: 'Save',
      category: 'File',
      shortcut: 'Ctrl+S'
    }, {
      id: 'open-file',
      label: 'Open File',
      category: 'File'
    }, {
      id: 'command-palette',
      label: 'Show Command Palette',
      category: 'View',
      shortcut: 'Ctrl+P'
    }, {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      category: 'View'
    }]
  }
}`,...(x=(v=c.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var w,F,S;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    visible: true,
    commands: [{
      id: 'new-file',
      label: 'New File',
      category: 'File'
    }, {
      id: 'save',
      label: 'Save',
      category: 'File',
      shortcut: 'Ctrl+S'
    }, {
      id: 'open-file',
      label: 'Open File',
      category: 'File'
    }, {
      id: 'search',
      label: 'Search',
      category: 'Edit',
      shortcut: 'Ctrl+F'
    }, {
      id: 'replace',
      label: 'Replace',
      category: 'Edit',
      shortcut: 'Ctrl+H'
    }]
  }
}`,...(S=(F=p.parameters)==null?void 0:F.docs)==null?void 0:S.source}}};var j,E,C;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    visible: true,
    commands: []
  }
}`,...(C=(E=u.parameters)==null?void 0:E.docs)==null?void 0:C.source}}};var P,k,V;g.parameters={...g.parameters,docs:{...(P=g.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    visible: false
  }
}`,...(V=(k=g.parameters)==null?void 0:k.docs)==null?void 0:V.source}}};const O=["Default","WithSearch","Empty","Hidden"];export{c as Default,u as Empty,g as Hidden,p as WithSearch,O as __namedExportsOrder,T as default};
