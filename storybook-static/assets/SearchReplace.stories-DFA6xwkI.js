import{j as e,r as m,R as g}from"./iframe-BXkX_8oL.js";import{S as s}from"./SearchReplace-cZtd_Djc.js";import{F as p}from"./index-CK8k0bZz.js";import"./preload-helper-C1FmrZbK.js";import"./search-CwVPrFhY.js";import"./createLucideIcon-kSpmkMCE.js";import"./chevron-down-CpZuDMZN.js";import"./x-BrWRloni.js";const b={title:"Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/SearchReplace",component:s,parameters:{layout:"fullscreen",chromatic:{diffThreshold:.01}},tags:["autodocs"]},f=()=>{const t=m.useRef(null);return e.jsxs("div",{style:{height:"100vh",position:"relative",background:"#0A0A0A"},children:[e.jsx(p,{height:"100%",language:"typescript",theme:"vs-dark",value:`function helloWorld() {
  const message = "Hello, World!";
  console.log(message);
  return message;
}

function goodbyeWorld() {
  const message = "Goodbye, World!";
  console.log(message);
  return message;
}

// Multiple occurrences of "message"
const msg1 = "First message";
const msg2 = "Second message";
const msg3 = "Third message";
`,onMount:a=>{t.current=a}}),e.jsx(s,{editor:t.current,visible:!0,onClose:()=>{}})]})},r={render:()=>e.jsx(f,{})},o={render:()=>{const t=m.useRef(null),[a,v]=g.useState(!0);return e.jsxs("div",{style:{height:"100vh",position:"relative",background:"#0A0A0A"},children:[e.jsx(p,{height:"100%",language:"typescript",theme:"vs-dark",value:`function example() {
  const oldName = "test";
  const anotherOldName = "test2";
  return oldName + anotherOldName;
}`,onMount:h=>{t.current=h}}),e.jsx(s,{editor:t.current,visible:!0,onClose:()=>{}})]})}};var n,c,i;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <EditorWithSearch />
}`,...(i=(c=r.parameters)==null?void 0:c.docs)==null?void 0:i.source}}};var l,d,u;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [replaceMode, setReplaceMode] = React.useState(true);
    return <div style={{
      height: '100vh',
      position: 'relative',
      background: '#0A0A0A'
    }}>\r
        <Editor height="100%" language="typescript" theme="vs-dark" value={\`function example() {
  const oldName = "test";
  const anotherOldName = "test2";
  return oldName + anotherOldName;
}\`} onMount={editor => {
        editorRef.current = editor;
      }} />\r
        <SearchReplace editor={editorRef.current} visible={true} onClose={() => {}} />\r
      </div>;
  }
}`,...(u=(d=o.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const N=["Default","WithReplace"];export{r as Default,o as WithReplace,N as __namedExportsOrder,b as default};
