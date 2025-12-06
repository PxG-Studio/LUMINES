import{r as o,j as n}from"./iframe-BXkX_8oL.js";import"./preload-helper-C1FmrZbK.js";const x={registerPlugin:s=>console.log("Registering plugin:",s)},E={title:"Lumenforge.io Design System/Integrations/Plugins/ExamplePlugin",parameters:{layout:"fullscreen"}},i=()=>{var a;const[s,l]=o.useState("loading"),[e,g]=o.useState(null),[m,c]=o.useState(null);return o.useEffect(()=>{async function t(){try{const r={manifest:{name:"Example Plugin",id:"com.example.plugin",version:"1.0.0",author:"Example Author",description:"An example plugin",permissions:["nodes"],extensionPoints:{nodes:["ExampleNode"]}},module:{ExampleNode:{type:"ExampleNode",title:"Example Node"}},id:"com.example.plugin",url:"http://localhost:5000/example-plugin"};x.registerPlugin(r),g(r),l("loaded")}catch(r){c(r instanceof Error?r.message:"Unknown error"),l("error")}}t()},[]),s==="loading"?n.jsx("div",{children:"Loading plugin..."}):s==="error"?n.jsxs("div",{children:["Error loading plugin: ",m]}):n.jsxs("div",{style:{padding:"16px"},children:[n.jsxs("h1",{children:["Plugin Loaded: ",e==null?void 0:e.manifest.name]}),n.jsxs("p",{children:[n.jsx("strong",{children:"ID:"})," ",e==null?void 0:e.manifest.id]}),n.jsxs("p",{children:[n.jsx("strong",{children:"Version:"})," ",e==null?void 0:e.manifest.version]}),n.jsxs("p",{children:[n.jsx("strong",{children:"Author:"})," ",e==null?void 0:e.manifest.author]}),n.jsxs("p",{children:[n.jsx("strong",{children:"Description:"})," ",e==null?void 0:e.manifest.description]}),n.jsx("h2",{children:"Extension Points"}),n.jsx("ul",{children:(a=e==null?void 0:e.manifest.extensionPoints.nodes)==null?void 0:a.map(t=>n.jsx("li",{children:t},t))})]})};var d,u,p;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`() => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [plugin, setPlugin] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      try {
        // Example: Load from URL
        // const loaded = await pluginLoader.loadPlugin('http://localhost:5000/example-plugin');

        // For demo purposes, create a mock plugin
        const mockPlugin = {
          manifest: {
            name: "Example Plugin",
            id: "com.example.plugin",
            version: "1.0.0",
            author: "Example Author",
            description: "An example plugin",
            permissions: ["nodes"],
            extensionPoints: {
              nodes: ["ExampleNode"]
            }
          },
          module: {
            ExampleNode: {
              type: "ExampleNode",
              title: "Example Node"
              // ... node definition
            }
          },
          id: "com.example.plugin",
          url: "http://localhost:5000/example-plugin"
        };
        pluginRegistry.registerPlugin(mockPlugin);
        setPlugin(mockPlugin);
        setStatus('loaded');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStatus('error');
      }
    }
    load();
  }, []);
  if (status === 'loading') {
    return <div>Loading plugin...</div>;
  }
  if (status === 'error') {
    return <div>Error loading plugin: {error}</div>;
  }
  return <div style={{
    padding: "16px"
  }}>\r
      <h1>Plugin Loaded: {plugin?.manifest.name}</h1>\r
      <p><strong>ID:</strong> {plugin?.manifest.id}</p>\r
      <p><strong>Version:</strong> {plugin?.manifest.version}</p>\r
      <p><strong>Author:</strong> {plugin?.manifest.author}</p>\r
      <p><strong>Description:</strong> {plugin?.manifest.description}</p>\r
      \r
      <h2>Extension Points</h2>\r
      <ul>\r
        {plugin?.manifest.extensionPoints.nodes?.map((node: string) => <li key={node}>{node}</li>)}\r
      </ul>\r
    </div>;
}`,...(p=(u=i.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const P=["LoadedPlugin"];export{i as LoadedPlugin,P as __namedExportsOrder,E as default};
