import{r as y,j as t}from"./iframe-BXkX_8oL.js";const c=({files:i=[{name:"Blueprints",type:"folder",path:"/Blueprints",children:[{name:"TurnSystem.json",type:"file",path:"/Blueprints/TurnSystem.json"},{name:"CardLogic.json",type:"file",path:"/Blueprints/CardLogic.json"}]},{name:"Templates",type:"folder",path:"/Templates",children:[]},{name:"Assets",type:"folder",path:"/Assets",children:[{name:"Sprites",type:"folder",path:"/Assets/Sprites",children:[]}]}],onFileSelect:a,defaultExpanded:f=["/Blueprints"]})=>{const[l,m]=y.useState(new Set(f)),h=e=>{const n=new Set(l);n.has(e)?n.delete(e):n.add(e),m(n)},p=(e,n=0)=>{var u;const s=e.path||`/${e.name}`,o=l.has(s),d=e.type==="folder";return t.jsxs("div",{children:[t.jsxs("div",{onClick:()=>{d?h(s):a==null||a(s)},style:{padding:"4px 8px",paddingLeft:`${n*16+8}px`,cursor:"pointer",color:"var(--slate-text, #e4e7eb)",display:"flex",alignItems:"center",gap:4,fontSize:12,fontFamily:"var(--font-mono, monospace)",transition:"background 0.2s"},onMouseEnter:r=>{r.currentTarget.style.background="var(--slate-bg, #0f1115)"},onMouseLeave:r=>{r.currentTarget.style.background="transparent"},children:[t.jsx("span",{style:{fontSize:14},children:d?o?"📂":"📁":"📄"}),t.jsx("span",{children:e.name})]}),d&&o&&((u=e.children)==null?void 0:u.map(r=>p(r,n+1)))]},s)};return t.jsx("div",{style:{width:"100%",height:"100%",background:"var(--slate-panel, #16181d)",overflow:"auto",padding:8},children:i.map(e=>p(e))})};try{c.displayName="FileTree",c.__docgenInfo={description:"",displayName:"FileTree",props:{files:{defaultValue:{value:`[\r
    {\r
      name: 'Blueprints',\r
      type: 'folder',\r
      path: '/Blueprints',\r
      children: [\r
        { name: 'TurnSystem.json', type: 'file', path: '/Blueprints/TurnSystem.json' },\r
        { name: 'CardLogic.json', type: 'file', path: '/Blueprints/CardLogic.json' },\r
      ],\r
    },\r
    {\r
      name: 'Templates',\r
      type: 'folder',\r
      path: '/Templates',\r
      children: [],\r
    },\r
    {\r
      name: 'Assets',\r
      type: 'folder',\r
      path: '/Assets',\r
      children: [\r
        {\r
          name: 'Sprites',\r
          type: 'folder',\r
          path: '/Assets/Sprites',\r
          children: [],\r
        },\r
      ],\r
    },\r
  ]`},description:"",name:"files",required:!1,type:{name:"FileNode[] | undefined"}},onFileSelect:{defaultValue:null,description:"",name:"onFileSelect",required:!1,type:{name:"((path: string) => void) | undefined"}},expandedPaths:{defaultValue:null,description:"",name:"expandedPaths",required:!1,type:{name:"Set<string> | undefined"}},defaultExpanded:{defaultValue:{value:"['/Blueprints']"},description:"",name:"defaultExpanded",required:!1,type:{name:"string[] | undefined"}}}}}catch{}export{c as F};
