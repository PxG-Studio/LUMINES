import{j as r,T as R}from"./iframe-BXkX_8oL.js";import{I as k,a as T,b as M,c as w,d as C}from"./IgnitionProvider-MnQcKbU3.js";import{u as d}from"./editorState-BZUma5kk.js";import"./preload-helper-C1FmrZbK.js";import"./Button-CDJro0XR.js";import"./ignitionController-DqNioivO.js";import"./wissilFs-D_4fnc1y.js";import"./unityBridge-ChVzu39L.js";const z={title:"Lumenforge.io Design System/WIS2L Framework/Ignition/Shared Framework Components/IgnitionComponents",decorators:[e=>r.jsx(R,{children:r.jsx(e,{})})],parameters:{layout:"fullscreen",backgrounds:{default:"dark"}},tags:["autodocs"]},t={render:()=>r.jsx("div",{style:{padding:"20px",background:"var(--nv-bg-1)"},children:r.jsx(k,{})})},s={render:()=>r.jsx("div",{style:{padding:"20px",background:"var(--nv-bg-1)",display:"flex",gap:"20px"},children:r.jsx(T,{})})},o={render:()=>{const e=d(n=>n.pushMessage);return r.jsxs("div",{style:{width:"100vw",height:"400px",background:"var(--nv-bg-0)"},children:[r.jsx("div",{style:{padding:"20px"},children:r.jsx("button",{onClick:()=>e(`[${new Date().toLocaleTimeString()}] Test message`),style:{marginBottom:"10px",padding:"8px 16px"},children:"Add Message"})}),r.jsx(M,{})]})}},i={render:()=>{const e=d(n=>n.setRuntimeError);return r.jsx(w,{children:r.jsxs("div",{style:{width:"100vw",height:"100vh",background:"var(--nv-bg-0)",padding:"20px"},children:[r.jsx("button",{onClick:()=>e(`Sample runtime error:

Error: Cannot read property 'foo' of undefined
    at App.tsx:42:15
    at render (ReactDOM.js:1234:56)`),style:{padding:"10px 20px",fontSize:"16px"},children:"Trigger Error"}),r.jsx(C,{})]})})}},a={render:()=>{const e=d(p=>p.pushMessage),n=d(p=>p.setRuntimeError);return r.jsx(w,{children:r.jsxs("div",{style:{width:"100vw",height:"100vh",background:"var(--nv-bg-0)",display:"flex",flexDirection:"column"},children:[r.jsx("div",{style:{padding:"20px",borderBottom:"1px solid var(--nv-border)"},children:r.jsx(k,{})}),r.jsxs("div",{style:{flex:1,padding:"20px"},children:[r.jsxs("div",{style:{marginBottom:"20px"},children:[r.jsx("button",{onClick:()=>e(`[${new Date().toLocaleTimeString()}] Test log message`),style:{marginRight:"10px",padding:"8px 16px"},children:"Add Log"}),r.jsx("button",{onClick:()=>n("Sample runtime error"),style:{padding:"8px 16px"},children:"Trigger Error"})]}),r.jsx(M,{})]})]})})}};var g,c,l;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "20px",
    background: "var(--nv-bg-1)"
  }}>\r
      <IgnitionRuntimeBar />\r
    </div>
}`,...(l=(c=t.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var u,m,x;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: "20px",
    background: "var(--nv-bg-1)",
    display: "flex",
    gap: "20px"
  }}>\r
      <IgnitionStatusIndicator />\r
    </div>
}`,...(x=(m=s.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var v,h,b;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => {
    const pushMessage = useEditorState(s => s.pushMessage);
    return <div style={{
      width: "100vw",
      height: "400px",
      background: "var(--nv-bg-0)"
    }}>\r
        <div style={{
        padding: "20px"
      }}>\r
          <button onClick={() => pushMessage(\`[\${new Date().toLocaleTimeString()}] Test message\`)} style={{
          marginBottom: "10px",
          padding: "8px 16px"
        }}>\r
            Add Message\r
          </button>\r
        </div>\r
        <IgnitionMessageStream />\r
      </div>;
  }
}`,...(b=(h=o.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var y,S,j;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => {
    const setErr = useEditorState(s => s.setRuntimeError);
    return <IgnitionProvider>\r
        <div style={{
        width: "100vw",
        height: "100vh",
        background: "var(--nv-bg-0)",
        padding: "20px"
      }}>\r
          <button onClick={() => setErr("Sample runtime error:\\n\\nError: Cannot read property 'foo' of undefined\\n    at App.tsx:42:15\\n    at render (ReactDOM.js:1234:56)")} style={{
          padding: "10px 20px",
          fontSize: "16px"
        }}>\r
            Trigger Error\r
          </button>\r
          <IgnitionErrorOverlay />\r
        </div>\r
      </IgnitionProvider>;
  }
}`,...(j=(S=i.parameters)==null?void 0:S.docs)==null?void 0:j.source}}};var E,I,f;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const pushMessage = useEditorState(s => s.pushMessage);
    const setErr = useEditorState(s => s.setRuntimeError);
    return <IgnitionProvider>\r
        <div style={{
        width: "100vw",
        height: "100vh",
        background: "var(--nv-bg-0)",
        display: "flex",
        flexDirection: "column"
      }}>\r
          <div style={{
          padding: "20px",
          borderBottom: "1px solid var(--nv-border)"
        }}>\r
            <IgnitionRuntimeBar />\r
          </div>\r
          <div style={{
          flex: 1,
          padding: "20px"
        }}>\r
            <div style={{
            marginBottom: "20px"
          }}>\r
              <button onClick={() => pushMessage(\`[\${new Date().toLocaleTimeString()}] Test log message\`)} style={{
              marginRight: "10px",
              padding: "8px 16px"
            }}>\r
                Add Log\r
              </button>\r
              <button onClick={() => setErr("Sample runtime error")} style={{
              padding: "8px 16px"
            }}>\r
                Trigger Error\r
              </button>\r
            </div>\r
            <IgnitionMessageStream />\r
          </div>\r
        </div>\r
      </IgnitionProvider>;
  }
}`,...(f=(I=a.parameters)==null?void 0:I.docs)==null?void 0:f.source}}};const U=["RuntimeBar","StatusIndicator","MessageStream","ErrorOverlay","FullRuntimeUI"];export{i as ErrorOverlay,a as FullRuntimeUI,o as MessageStream,t as RuntimeBar,s as StatusIndicator,U as __namedExportsOrder,z as default};
