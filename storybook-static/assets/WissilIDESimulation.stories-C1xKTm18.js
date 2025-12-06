import{j as e,r as s,k as f,B as b,a as S}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";function p({left:t,center:n,right:r,bottom:d,top:a,height:l="100vh"}){return e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"320px 1fr 320px",gridTemplateRows:a?"auto 1fr 240px":"1fr 240px",height:l,background:"var(--slate-bg)",color:"var(--slate-text)",fontFamily:"var(--font-primary, system-ui)",overflow:"hidden"},children:[a&&e.jsx("div",{style:{gridColumn:"1 / 4",gridRow:"1",borderBottom:"1px solid var(--slate-border)",background:"var(--slate-panel)"},children:a}),e.jsx("div",{style:{gridColumn:"1",gridRow:a?"2":"1",borderRight:"1px solid var(--slate-border)",overflow:"auto",background:"var(--slate-panel)"},children:t||e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Left Panel"})}),e.jsx("div",{style:{gridColumn:"2",gridRow:a?"2":"1",overflow:"hidden",position:"relative",background:"var(--slate-bg)"},children:n||e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Center Panel"})}),e.jsx("div",{style:{gridColumn:"3",gridRow:a?"2":"1",borderLeft:"1px solid var(--slate-border)",overflow:"auto",background:"var(--slate-panel)"},children:r||e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Right Panel"})}),e.jsx("div",{style:{gridColumn:"1 / 4",gridRow:a?"3":"2",borderTop:"1px solid var(--slate-border)",overflow:"auto",background:"var(--slate-panel)"},children:d||e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Bottom Panel"})})]})}try{p.displayName="IDEShell",p.__docgenInfo={description:"",displayName:"IDEShell",props:{left:{defaultValue:null,description:"",name:"left",required:!1,type:{name:"ReactNode"}},center:{defaultValue:null,description:"",name:"center",required:!1,type:{name:"ReactNode"}},right:{defaultValue:null,description:"",name:"right",required:!1,type:{name:"ReactNode"}},bottom:{defaultValue:null,description:"",name:"bottom",required:!1,type:{name:"ReactNode"}},top:{defaultValue:null,description:"",name:"top",required:!1,type:{name:"ReactNode"}},height:{defaultValue:{value:"100vh"},description:"",name:"height",required:!1,type:{name:"string | undefined"}}}}}catch{}const j=[{id:"Ignis",label:"🔷 Ignis",icon:"🔷"},{id:"SceneGraph",label:"🌳 SceneGraph",icon:"🌳"},{id:"Shader",label:"🎨 Shader",icon:"🎨"},{id:"Templates",label:"✨ Templates",icon:"✨"},{id:"Runtime",label:"⚡ Runtime",icon:"⚡"},{id:"Waypoint",label:"🧭 Waypoint",icon:"🧭"}];function c({mode:t,setMode:n}){return e.jsx("div",{style:{height:36,display:"flex",alignItems:"center",padding:"0 12px",background:"var(--slate-panel)",borderBottom:"1px solid var(--slate-border)",gap:"4px"},children:j.map(r=>e.jsx("button",{onClick:()=>n(r.id),style:{padding:"4px 12px",background:t===r.id?"var(--slate-accent)":"transparent",color:t===r.id?"white":"var(--slate-text)",border:t===r.id?"1px solid var(--slate-accent)":"1px solid var(--slate-border)",borderRadius:4,cursor:"pointer",fontSize:"13px",fontWeight:t===r.id?600:400,transition:"all 0.2s",whiteSpace:"nowrap"},onMouseEnter:d=>{t!==r.id&&(d.currentTarget.style.background="var(--slate-bg)")},onMouseLeave:d=>{t!==r.id&&(d.currentTarget.style.background="transparent")},children:r.label},r.id))})}try{c.displayName="IDERibbon",c.__docgenInfo={description:"",displayName:"IDERibbon",props:{mode:{defaultValue:null,description:"",name:"mode",required:!0,type:{name:"string"}},setMode:{defaultValue:null,description:"",name:"setMode",required:!0,type:{name:"(mode: string) => void"}}}}}catch{}const u=({selectedNode:t})=>t?e.jsxs("div",{style:{width:"100%",height:"100%",background:"var(--slate-panel, #16181d)",overflow:"auto",padding:16},children:[e.jsx("div",{style:{color:"var(--slate-text, #e4e7eb)",fontWeight:"bold",fontSize:14,marginBottom:16},children:"Inspector"}),e.jsxs("div",{style:{marginBottom:16},children:[e.jsx("label",{style:{display:"block",color:"var(--slate-text-muted, #9ba1aa)",fontSize:11,marginBottom:4,textTransform:"uppercase"},children:"Node Type"}),e.jsx("div",{style:{padding:"8px 12px",background:"var(--slate-bg, #0f1115)",borderRadius:4,color:"var(--slate-text, #e4e7eb)",fontSize:12},children:t.type})]}),t.props&&Object.keys(t.props).length>0&&e.jsxs("div",{children:[e.jsx("label",{style:{display:"block",color:"var(--slate-text-muted, #9ba1aa)",fontSize:11,marginBottom:8,textTransform:"uppercase"},children:"Properties"}),Object.entries(t.props).map(([n,r])=>e.jsxs("div",{style:{marginBottom:12},children:[e.jsx("label",{style:{display:"block",color:"var(--slate-text, #e4e7eb)",fontSize:12,marginBottom:4},children:n}),e.jsx("input",{type:"text",defaultValue:String(r),style:{width:"100%",padding:"6px 8px",background:"var(--slate-bg, #0f1115)",border:"1px solid var(--slate-border, #26292f)",borderRadius:4,color:"var(--slate-text, #e4e7eb)",fontSize:12,outline:"none"}})]},n))]})]}):e.jsx("div",{style:{width:"100%",height:"100%",background:"var(--slate-panel, #16181d)",padding:16,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--slate-text-muted, #9ba1aa)",fontSize:13},children:"Select a node to edit properties"});try{u.displayName="BlueprintInspector",u.__docgenInfo={description:"",displayName:"BlueprintInspector",props:{selectedNode:{defaultValue:null,description:"",name:"selectedNode",required:!1,type:{name:"{ id: string; type: string; props?: Record<string, any> | undefined; } | undefined"}}}}}catch{}function w(){const[t]=s.useState([{timestamp:Date.now(),level:"info",message:"Unity WebGL runtime initialized"},{timestamp:Date.now()+100,level:"log",message:"Blueprint graph loaded"}]);return e.jsx("div",{style:{fontFamily:"var(--font-mono, monospace)",fontSize:"12px"},children:t.map((n,r)=>e.jsxs("div",{style:{padding:"4px 8px",color:n.level==="error"?"#ff6b6b":n.level==="warn"?"#ffaa44":"var(--slate-text)",borderLeft:`2px solid ${n.level==="error"?"#ff6b6b":n.level==="warn"?"#ffaa44":"var(--slate-border)"}`,marginBottom:"2px"},children:[e.jsxs("span",{style:{color:"var(--slate-text-muted)"},children:["[",new Date(n.timestamp).toLocaleTimeString(),"]"]})," ",n.message]},r))})}function I(){return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Timeline view - Animation and blueprint execution timeline"})}function P(){return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Event log - Blueprint events, runtime errors, Unity signals"})}function E(){const[t,n]=s.useState("console");return e.jsxs("div",{style:{height:"100%",display:"flex",flexDirection:"column"},children:[e.jsx("div",{style:{display:"flex",borderBottom:"1px solid var(--slate-border)",background:"var(--slate-panel)"},children:["console","timeline","events"].map(r=>e.jsx("button",{onClick:()=>n(r),style:{padding:"8px 16px",background:t===r?"var(--slate-bg)":"transparent",border:"none",borderBottom:t===r?"2px solid var(--slate-accent)":"none",color:t===r?"var(--slate-text)":"var(--slate-text-muted)",cursor:"pointer",fontSize:"13px",fontWeight:t===r?600:400},children:r.charAt(0).toUpperCase()+r.slice(1)},r))}),e.jsxs("div",{style:{flex:1,overflow:"auto",padding:"8px"},children:[t==="console"&&e.jsx(w,{}),t==="timeline"&&e.jsx(I,{}),t==="events"&&e.jsx(P,{})]})]})}const G={title:"Lumenforge.io Design System/Application Pages/Editor/IDE/WissilIDESimulation",parameters:{layout:"fullscreen",chromatic:{disableSnapshot:!0,delay:1e3}}},o=()=>{const[t,n]=s.useState("Ignis"),r=f();s.useEffect(()=>{const l={id:"demo",name:"Demo Graph",nodes:{},connections:{}};r.loadGraph(l)},[r]);const d=()=>{switch(t){case"Ignis":return e.jsx(S,{onSelect:l=>{r.getActiveGraph()&&r.addNode(l,{x:100,y:100})}});case"SceneGraph":return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"SceneGraph Panel"});case"Shader":return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Shader Library"});case"Templates":return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Template Browser"});default:return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Panel"})}},a=()=>{switch(t){case"Ignis":return e.jsx(b,{});case"SceneGraph":return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"SceneGraph Editor"});case"Shader":return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Shader Graph Editor"});case"Templates":return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Template Creator"});default:return e.jsx("div",{style:{padding:"16px",color:"var(--slate-text-muted)"},children:"Editor"})}};return e.jsx(p,{top:e.jsx(c,{mode:t,setMode:n}),left:d(),center:a(),right:e.jsx(u,{}),bottom:e.jsx(E,{})})},i=()=>e.jsx(p,{left:e.jsx("div",{style:{padding:"16px"},children:"Left Panel"}),center:e.jsx("div",{style:{padding:"16px"},children:"Center Panel"}),right:e.jsx("div",{style:{padding:"16px"},children:"Right Panel"}),bottom:e.jsx("div",{style:{padding:"16px"},children:"Bottom Panel"})});i.parameters={chromatic:{disableSnapshot:!1}};var x,m,v;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`() => {
  const [mode, setMode] = useState("Ignis");
  const graphStore = useBPGraphStore();
  useEffect(() => {
    // Load demo graph if available
    const demoGraph = {
      id: "demo",
      name: "Demo Graph",
      nodes: {},
      connections: {}
    };
    graphStore.loadGraph(demoGraph);
  }, [graphStore]);
  const renderLeftPanel = () => {
    switch (mode) {
      case "Ignis":
        return <NodePalette onSelect={type => {
          const graph = graphStore.getActiveGraph();
          if (graph) {
            graphStore.addNode(type, {
              x: 100,
              y: 100
            });
          }
        }} />;
      case "SceneGraph":
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>SceneGraph Panel</div>;
      case "Shader":
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>Shader Library</div>;
      case "Templates":
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>Template Browser</div>;
      default:
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>Panel</div>;
    }
  };
  const renderCenterPanel = () => {
    switch (mode) {
      case "Ignis":
        return <BPGraphCanvas />;
      case "SceneGraph":
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>SceneGraph Editor</div>;
      case "Shader":
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>Shader Graph Editor</div>;
      case "Templates":
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>Template Creator</div>;
      default:
        return <div style={{
          padding: "16px",
          color: "var(--slate-text-muted)"
        }}>Editor</div>;
    }
  };
  return <IDEShell top={<IDERibbon mode={mode} setMode={setMode} />} left={renderLeftPanel()} center={renderCenterPanel()} right={<BlueprintInspector />} bottom={<RuntimeConsole />} />;
}`,...(v=(m=o.parameters)==null?void 0:m.docs)==null?void 0:v.source}}};var g,h,y;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`() => <IDEShell left={<div style={{
  padding: "16px"
}}>Left Panel</div>} center={<div style={{
  padding: "16px"
}}>Center Panel</div>} right={<div style={{
  padding: "16px"
}}>Right Panel</div>} bottom={<div style={{
  padding: "16px"
}}>Bottom Panel</div>} />`,...(y=(h=i.parameters)==null?void 0:h.docs)==null?void 0:y.source}}};const C=["IDEPreview","IDELayout"];export{i as IDELayout,o as IDEPreview,C as __namedExportsOrder,G as default};
