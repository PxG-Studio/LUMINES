import{j as e}from"./iframe-BXkX_8oL.js";import{M as r,E as I}from"./EditorContainer-Cw7jCgEI.js";import"./preload-helper-C1FmrZbK.js";import"./AppShell-DtP9LtO4.js";import"./TopBar-IF7Bn62b.js";import"./FileTree-Cle7a5tZ.js";import"./createLucideIcon-kSpmkMCE.js";import"./x-BrWRloni.js";import"./index-CK8k0bZz.js";import"./wissilFs-D_4fnc1y.js";import"./SearchReplace-cZtd_Djc.js";import"./search-CwVPrFhY.js";import"./chevron-down-CpZuDMZN.js";import"./square-BBxQQJRg.js";import"./SplitPane-DnPtLZ3c.js";import"./git-branch-DExO_pBL.js";import"./chevron-right-MEu87n6w.js";const V={title:"Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/MonacoEditor",component:r,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01}},tags:["autodocs"]},t={args:{filePath:"/example.ts",language:"typescript",height:"600px"},render:n=>e.jsx("div",{style:{height:"100vh",background:"#0A0A0A"},children:e.jsx(r,{...n})})},o={args:{filePath:"/example.js",language:"javascript",height:"600px"},render:n=>e.jsx("div",{style:{height:"100vh",background:"#0A0A0A"},children:e.jsx(r,{...n})})},i={args:{filePath:"/example.tsx",language:"typescript",height:"600px"},render:n=>e.jsx("div",{style:{height:"100vh",background:"#0A0A0A"},children:e.jsx(r,{...n})})},a={args:{filePath:"/config.json",language:"json",height:"600px"},render:n=>e.jsx("div",{style:{height:"100vh",background:"#0A0A0A"},children:e.jsx(r,{...n})})},s={render:()=>e.jsx(I,{initialFiles:[{path:"/src/App.tsx",content:`export default function App() {
  return <div>Hello</div>;
}`},{path:"/src/index.ts",content:'console.log("Hello World");'},{path:"/package.json",content:`{
  "name": "my-app",
  "version": "1.0.0"
}`}]})},d={render:()=>e.jsx("div",{style:{height:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",color:"#9ba1aa",fontFamily:"monospace"},children:e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{marginBottom:8},children:"Loading Monaco Editor..."}),e.jsx("div",{style:{fontSize:12,opacity:.7},children:"Initializing editor instance"})]})})},c={render:()=>e.jsx("div",{style:{height:"100vh",background:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",fontFamily:"monospace"},children:e.jsxs("div",{style:{textAlign:"center",background:"rgba(220, 38, 38, 0.1)",border:"1px solid rgba(220, 38, 38, 0.3)",borderRadius:4,padding:16},children:[e.jsx("div",{style:{fontWeight:"bold",marginBottom:8},children:"⚠️ Editor Error"}),e.jsx("div",{style:{fontSize:12,opacity:.8},children:"Failed to load file: /example.ts"}),e.jsx("div",{style:{fontSize:11,opacity:.6,marginTop:8},children:"File not found or access denied"})]})})};var l,p,g;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    filePath: '/example.ts',
    language: 'typescript',
    height: '600px'
  },
  render: args => <div style={{
    height: '100vh',
    background: '#0A0A0A'
  }}>\r
      <MonacoEditor {...args} />\r
    </div>
}`,...(g=(p=t.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var m,h,u;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    filePath: '/example.js',
    language: 'javascript',
    height: '600px'
  },
  render: args => <div style={{
    height: '100vh',
    background: '#0A0A0A'
  }}>\r
      <MonacoEditor {...args} />\r
    </div>
}`,...(u=(h=o.parameters)==null?void 0:h.docs)==null?void 0:u.source}}};var v,x,y;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    filePath: '/example.tsx',
    language: 'typescript',
    height: '600px'
  },
  render: args => <div style={{
    height: '100vh',
    background: '#0A0A0A'
  }}>\r
      <MonacoEditor {...args} />\r
    </div>
}`,...(y=(x=i.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var f,A,j;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    filePath: '/config.json',
    language: 'json',
    height: '600px'
  },
  render: args => <div style={{
    height: '100vh',
    background: '#0A0A0A'
  }}>\r
      <MonacoEditor {...args} />\r
    </div>
}`,...(j=(A=a.parameters)==null?void 0:A.docs)==null?void 0:j.source}}};var b,E,S;s.parameters={...s.parameters,docs:{...(b=s.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <EditorContainer initialFiles={[{
    path: '/src/App.tsx',
    content: 'export default function App() {\\n  return <div>Hello</div>;\\n}'
  }, {
    path: '/src/index.ts',
    content: 'console.log("Hello World");'
  }, {
    path: '/package.json',
    content: '{\\n  "name": "my-app",\\n  "version": "1.0.0"\\n}'
  }]} />
}`,...(S=(E=s.parameters)==null?void 0:E.docs)==null?void 0:S.source}}};var k,F,M;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: () => <div style={{
    height: '100vh',
    background: '#0A0A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ba1aa',
    fontFamily: 'monospace'
  }}>\r
      <div style={{
      textAlign: 'center'
    }}>\r
        <div style={{
        marginBottom: 8
      }}>Loading Monaco Editor...</div>\r
        <div style={{
        fontSize: 12,
        opacity: 0.7
      }}>Initializing editor instance</div>\r
      </div>\r
    </div>
}`,...(M=(F=d.parameters)==null?void 0:F.docs)==null?void 0:M.source}}};var P,z,C;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    height: '100vh',
    background: '#0A0A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ef4444',
    fontFamily: 'monospace'
  }}>\r
      <div style={{
      textAlign: 'center',
      background: 'rgba(220, 38, 38, 0.1)',
      border: '1px solid rgba(220, 38, 38, 0.3)',
      borderRadius: 4,
      padding: 16
    }}>\r
        <div style={{
        fontWeight: 'bold',
        marginBottom: 8
      }}>\r
          ⚠️ Editor Error\r
        </div>\r
        <div style={{
        fontSize: 12,
        opacity: 0.8
      }}>\r
          Failed to load file: /example.ts\r
        </div>\r
        <div style={{
        fontSize: 11,
        opacity: 0.6,
        marginTop: 8
      }}>\r
          File not found or access denied\r
        </div>\r
      </div>\r
    </div>
}`,...(C=(z=c.parameters)==null?void 0:z.docs)==null?void 0:C.source}}};const X=["Default","JavaScript","TypeScript","JSON","FullEditorContainer","Loading","Error"];export{t as Default,c as Error,s as FullEditorContainer,a as JSON,o as JavaScript,d as Loading,i as TypeScript,X as __namedExportsOrder,V as default};
