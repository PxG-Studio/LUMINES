import{j as n,r as W}from"./iframe-BXkX_8oL.js";import{F as L}from"./FileTree-Cle7a5tZ.js";import"./preload-helper-C1FmrZbK.js";const $={title:"Lumenforge.io Design System/Application Pages/Filesystem/FileTree",component:L,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},d=e=>{const[r,D]=W.useState(new Set(e.defaultExpanded||["Blueprints"]));return n.jsx(L,{...e,expandedPaths:r,onFileSelect:C=>console.log("Selected:",C)})},t={render:e=>n.jsx(d,{...e}),args:{files:[{name:"Blueprints",type:"folder",path:"/Blueprints",children:[{name:"TurnSystem.json",type:"file",path:"/Blueprints/TurnSystem.json"},{name:"CardLogic.json",type:"file",path:"/Blueprints/CardLogic.json"}]},{name:"Templates",type:"folder",path:"/Templates",children:[]},{name:"Assets",type:"folder",path:"/Assets",children:[{name:"Sprites",type:"folder",path:"/Assets/Sprites",children:[]}]}],defaultExpanded:["Blueprints"]}},s={render:e=>n.jsx(d,{...e}),args:{files:[{name:"src",type:"folder",path:"/src",children:[{name:"components",type:"folder",path:"/src/components",children:[{name:"ui",type:"folder",path:"/src/components/ui",children:[{name:"Button.tsx",type:"file",path:"/src/components/ui/Button.tsx"},{name:"Card.tsx",type:"file",path:"/src/components/ui/Card.tsx"}]}]}]}],defaultExpanded:["src","src/components","src/components/ui"]}},a={render:e=>n.jsx(d,{...e}),args:{files:[{name:"Blueprints",type:"folder",path:"/Blueprints",children:Array.from({length:20},(e,r)=>({name:`Blueprint${r+1}.json`,type:"file",path:`/Blueprints/Blueprint${r+1}.json`}))}],defaultExpanded:["Blueprints"]}},o={args:{files:[]}},i={args:{files:[]},render:e=>n.jsxs("div",{style:{padding:16,color:"var(--slate-text-muted, #9ba1aa)",fontStyle:"italic"},children:[n.jsx("div",{style:{marginBottom:8},children:"Loading file tree..."}),n.jsx("div",{style:{fontSize:12,opacity:.7},children:"Scanning filesystem"})]})},p={args:{files:[]},render:e=>n.jsxs("div",{style:{padding:16,background:"rgba(220, 38, 38, 0.1)",border:"1px solid rgba(220, 38, 38, 0.3)",borderRadius:4,color:"var(--slate-text, #e4e7eb)"},children:[n.jsx("div",{style:{color:"#ef4444",fontWeight:"bold",marginBottom:8},children:"⚠️ Error loading file tree"}),n.jsx("div",{style:{fontSize:12,opacity:.8},children:"Failed to read directory: /project"})]})};var l,c,m;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    files: [{
      name: 'Blueprints',
      type: 'folder',
      path: '/Blueprints',
      children: [{
        name: 'TurnSystem.json',
        type: 'file',
        path: '/Blueprints/TurnSystem.json'
      }, {
        name: 'CardLogic.json',
        type: 'file',
        path: '/Blueprints/CardLogic.json'
      }]
    }, {
      name: 'Templates',
      type: 'folder',
      path: '/Templates',
      children: []
    }, {
      name: 'Assets',
      type: 'folder',
      path: '/Assets',
      children: [{
        name: 'Sprites',
        type: 'folder',
        path: '/Assets/Sprites',
        children: []
      }]
    }],
    defaultExpanded: ['Blueprints']
  }
}`,...(m=(c=t.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,f,g;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    files: [{
      name: 'src',
      type: 'folder',
      path: '/src',
      children: [{
        name: 'components',
        type: 'folder',
        path: '/src/components',
        children: [{
          name: 'ui',
          type: 'folder',
          path: '/src/components/ui',
          children: [{
            name: 'Button.tsx',
            type: 'file',
            path: '/src/components/ui/Button.tsx'
          }, {
            name: 'Card.tsx',
            type: 'file',
            path: '/src/components/ui/Card.tsx'
          }]
        }]
      }]
    }],
    defaultExpanded: ['src', 'src/components', 'src/components/ui']
  }
}`,...(g=(f=s.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};var y,h,x;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: args => <InteractiveWrapper {...args} />,
  args: {
    files: [{
      name: 'Blueprints',
      type: 'folder',
      path: '/Blueprints',
      children: Array.from({
        length: 20
      }, (_, i) => ({
        name: \`Blueprint\${i + 1}.json\`,
        type: 'file' as const,
        path: \`/Blueprints/Blueprint\${i + 1}.json\`
      }))
    }],
    defaultExpanded: ['Blueprints']
  }
}`,...(x=(h=a.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var B,S,j;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    files: []
  }
}`,...(j=(S=o.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var v,E,b;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    files: []
  },
  render: args => <div style={{
    padding: 16,
    color: 'var(--slate-text-muted, #9ba1aa)',
    fontStyle: 'italic'
  }}>\r
      <div style={{
      marginBottom: 8
    }}>Loading file tree...</div>\r
      <div style={{
      fontSize: 12,
      opacity: 0.7
    }}>Scanning filesystem</div>\r
    </div>
}`,...(b=(E=i.parameters)==null?void 0:E.docs)==null?void 0:b.source}}};var A,T,F;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    files: []
  },
  render: args => <div style={{
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
        ⚠️ Error loading file tree\r
      </div>\r
      <div style={{
      fontSize: 12,
      opacity: 0.8
    }}>\r
        Failed to read directory: /project\r
      </div>\r
    </div>
}`,...(F=(T=p.parameters)==null?void 0:T.docs)==null?void 0:F.source}}};const R=["Default","DeepNesting","ManyFiles","Empty","Loading","Error"];export{s as DeepNesting,t as Default,o as Empty,p as Error,i as Loading,a as ManyFiles,R as __namedExportsOrder,$ as default};
