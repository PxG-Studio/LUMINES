import{j as s,T as j}from"./iframe-BXkX_8oL.js";import{E as A,G as P}from"./EditorContainer-Cw7jCgEI.js";import"./preload-helper-C1FmrZbK.js";import"./AppShell-DtP9LtO4.js";import"./TopBar-IF7Bn62b.js";import"./FileTree-Cle7a5tZ.js";import"./createLucideIcon-kSpmkMCE.js";import"./x-BrWRloni.js";import"./index-CK8k0bZz.js";import"./wissilFs-D_4fnc1y.js";import"./SearchReplace-cZtd_Djc.js";import"./search-CwVPrFhY.js";import"./chevron-down-CpZuDMZN.js";import"./square-BBxQQJRg.js";import"./SplitPane-DnPtLZ3c.js";import"./git-branch-DExO_pBL.js";import"./chevron-right-MEu87n6w.js";const B={title:"Lumenforge.io Design System/Application Pages/Editor/Complete/EditorContainer",component:A,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,delay:2e3,pauseAnimationAtEnd:!0},docs:{description:{component:`
# Complete Editor Container

The full-featured game development IDE editor with:
- Monaco Editor with IntelliSense
- File tree and tab management
- Runtime preview (WebContainer)
- Git integration
- Split editor support
- Unity integration

## Features

- **Code Editing**: Full Monaco Editor with TypeScript support
- **File Management**: Virtual file system with tree view
- **Runtime**: Live preview with WebContainer
- **Git**: Complete Git workflow integration
- **Game Dev**: Unity WebGL integration
        `}}},tags:["autodocs"],decorators:[p=>s.jsx(j,{children:s.jsx(P,{children:s.jsx(p,{})})})]},e={args:{initialFiles:[{path:"/src/App.tsx",content:`import React from 'react';

function App() {
  return (
    <div>
      <h1>Game Development IDE</h1>
      <p>Welcome to WISSIL</p>
    </div>
  );
}

export default App;`},{path:"/src/components/Player.tsx",content:`import React from 'react';

export const Player: React.FC = () => {
  return <div>Player Component</div>;
};`},{path:"/package.json",content:JSON.stringify({name:"game-project",version:"1.0.0",dependencies:{react:"^18.3.0",unity:"^2022.3.0"}},null,2)}],showRuntime:!0,showGit:!0}},t={args:{...e.args,showGit:!1}},r={args:{...e.args,showRuntime:!1}},n={args:{...e.args,showSplitEditor:!0}},o={args:{...e.args,showRuntime:!1,showGit:!1}},a={args:{initialFiles:Array.from({length:50},(p,i)=>({path:`/src/components/Component${i}.tsx`,content:`export const Component${i} = () => <div>Component ${i}</div>;`})),showRuntime:!0,showGit:!0},parameters:{chromatic:{diffThreshold:.02}}};var m,c,l;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    initialFiles: [{
      path: '/src/App.tsx',
      content: \`import React from 'react';

function App() {
  return (
    <div>
      <h1>Game Development IDE</h1>
      <p>Welcome to WISSIL</p>
    </div>
  );
}

export default App;\`
    }, {
      path: '/src/components/Player.tsx',
      content: \`import React from 'react';

export const Player: React.FC = () => {
  return <div>Player Component</div>;
};\`
    }, {
      path: '/package.json',
      content: JSON.stringify({
        name: 'game-project',
        version: '1.0.0',
        dependencies: {
          react: '^18.3.0',
          unity: '^2022.3.0'
        }
      }, null, 2)
    }],
    showRuntime: true,
    showGit: true
  }
}`,...(l=(c=e.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var u,d,h;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showGit: false
  }
}`,...(h=(d=t.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var g,f,w;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showRuntime: false
  }
}`,...(w=(f=r.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var v,S,x;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showSplitEditor: true
  }
}`,...(x=(S=n.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var y,C,G;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showRuntime: false,
    showGit: false
  }
}`,...(G=(C=o.parameters)==null?void 0:C.docs)==null?void 0:G.source}}};var R,E,D;a.parameters={...a.parameters,docs:{...(R=a.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    initialFiles: Array.from({
      length: 50
    }, (_, i) => ({
      path: \`/src/components/Component\${i}.tsx\`,
      content: \`export const Component\${i} = () => <div>Component \${i}</div>;\`
    })),
    showRuntime: true,
    showGit: true
  },
  parameters: {
    chromatic: {
      diffThreshold: 0.02 // Allow more variance for large projects
    }
  }
}`,...(D=(E=a.parameters)==null?void 0:E.docs)==null?void 0:D.source}}};const H=["Default","WithRuntime","WithGit","SplitEditor","Minimal","LargeProject"];export{e as Default,a as LargeProject,o as Minimal,n as SplitEditor,r as WithGit,t as WithRuntime,H as __namedExportsOrder,B as default};
