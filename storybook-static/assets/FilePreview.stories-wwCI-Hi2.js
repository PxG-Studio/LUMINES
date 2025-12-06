import{j as i}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";const l=({content:o=`// File content will appear here

function example() {
  return true;
}`,language:e="javascript",fileName:U="file.json"})=>i.jsxs("div",{style:{width:"100%",height:"100%",background:"var(--slate-bg, #0f1115)",overflow:"auto",padding:16,fontFamily:"var(--font-mono, monospace)"},children:[i.jsxs("div",{style:{color:"var(--slate-text-muted, #9ba1aa)",fontSize:11,marginBottom:12,borderBottom:"1px solid var(--slate-border, #26292f)",paddingBottom:8},children:[U," (",e,")"]}),i.jsx("pre",{style:{margin:0,color:"var(--slate-text, #e4e7eb)",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap",wordWrap:"break-word"},children:o})]});try{l.displayName="FilePreview",l.__docgenInfo={description:"",displayName:"FilePreview",props:{content:{defaultValue:{value:`// File content will appear here

function example() {
  return true;
}`},description:"",name:"content",required:!1,type:{name:"string | undefined"}},language:{defaultValue:{value:"javascript"},description:"",name:"language",required:!1,type:{name:"string | undefined"}},fileName:{defaultValue:{value:"file.json"},description:"",name:"fileName",required:!1,type:{name:"string | undefined"}}}}}catch{}const $={title:"Lumenforge.io Design System/Application Pages/Filesystem/FilePreview",component:l,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01,pauseAnimationAtEnd:!0}},tags:["autodocs"]},a={args:{fileName:"example.js",language:"javascript",content:`function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet('World');
console.log(message);`}},n={args:{fileName:"config.json",language:"json",content:`{
  "name": "wissil",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`}},t={args:{fileName:"types.ts",language:"typescript",content:`interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(data: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    name: data.name || 'Anonymous',
    email: data.email || '',
  };
}`}},r={args:{fileName:"empty.txt",language:"text",content:""}},s={args:{fileName:"large-file.js",language:"javascript",content:Array(50).fill(0).map((o,e)=>`// Line ${e+1}
const item${e} = { id: ${e}, value: 'Item ${e}' };`).join(`

`)}};var c,m,p;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    fileName: 'example.js',
    language: 'javascript',
    content: \`function greet(name) {
  return \\\`Hello, \\\${name}!\\\`;
}

const message = greet('World');
console.log(message);\`
  }
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var d,g,u;n.parameters={...n.parameters,docs:{...(d=n.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    fileName: 'config.json',
    language: 'json',
    content: \`{
  "name": "wissil",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}\`
  }
}`,...(u=(g=n.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};var f,v,y;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    fileName: 'types.ts',
    language: 'typescript',
    content: \`interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(data: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    name: data.name || 'Anonymous',
    email: data.email || '',
  };
}\`
  }
}`,...(y=(v=t.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var j,x,N;r.parameters={...r.parameters,docs:{...(j=r.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    fileName: 'empty.txt',
    language: 'text',
    content: ''
  }
}`,...(N=(x=r.parameters)==null?void 0:x.docs)==null?void 0:N.source}}};var S,h,w;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:"{\n  args: {\n    fileName: 'large-file.js',\n    language: 'javascript',\n    content: Array(50).fill(0).map((_, i) => `// Line ${i + 1}\\nconst item${i} = { id: ${i}, value: 'Item ${i}' };`).join('\\n\\n')\n  }\n}",...(w=(h=s.parameters)==null?void 0:h.docs)==null?void 0:w.source}}};const F=["JavaScript","JSON","TypeScript","Empty","LongContent"];export{r as Empty,n as JSON,a as JavaScript,s as LongContent,t as TypeScript,F as __namedExportsOrder,$ as default};
