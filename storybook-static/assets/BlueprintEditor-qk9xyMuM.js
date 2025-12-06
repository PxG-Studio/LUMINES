import{j as e,B as d,N as c,a}from"./iframe-BXkX_8oL.js";import{useMDXComponents as l}from"./index-4MjfFERE.js";import{M as h,C as r,S as t}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function s(i){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Lumenforge.io Design System/WIS2L Framework/Ignis/Documentation/Blueprint Editor",id:"wis2l-ignis-blueprint-docs-stories",name:"Blueprint Editor WIS2L Docs"}),`
`,e.jsx(n.h1,{id:"blueprint-editor",children:"Blueprint Editor"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Blueprint Editor"})," is the visual scripting environment for WISSIL, equivalent to Unreal Engine Blueprints or Unity Visual Scripting."]}),`
`,e.jsx(n.p,{children:"It runs fully in-browser, supports drag-and-drop nodes, wires, panning, zooming, execution preview, and code generation."}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsx(n.p,{children:"The Ignis Blueprint Editor provides a complete visual scripting solution for game development, allowing developers to create game logic without writing code directly. It features:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Node-based visual programming"})," - Drag and drop nodes to create logic flows"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Real-time execution"})," - Execute and debug blueprints in the browser"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Unity integration"})," - Direct connection to Unity WebGL runtime"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Code generation"})," - Automatically generate Unity C# scripts"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"AI assistance"})," - LUNA-powered graph generation and optimization"]}),`
`]}),`
`,e.jsx(n.h2,{id:"components",children:"Components"}),`
`,e.jsx(n.h3,{id:"bpgraphcanvas",children:e.jsx(n.code,{children:"BPGraphCanvas"})}),`
`,e.jsx(n.p,{children:"The main canvas container for an entire node graph. Supports panning, zooming, node dragging, wire connections, and multi-selection."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Features:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Pan with middle mouse or Shift+Left click"}),`
`,e.jsx(n.li,{children:"Zoom with mouse wheel"}),`
`,e.jsx(n.li,{children:"Drag nodes to reposition"}),`
`,e.jsx(n.li,{children:"Connect nodes by clicking sockets"}),`
`,e.jsx(n.li,{children:"Multi-select with Shift+Click"}),`
`,e.jsx(n.li,{children:"Keyboard shortcuts (Delete, Ctrl+D to duplicate)"}),`
`]}),`
`,e.jsx(r,{children:e.jsx(t,{name:"Canvas",children:()=>e.jsx(d,{})})}),`
`,e.jsx(n.h3,{id:"noderenderer",children:e.jsx(n.code,{children:"NodeRenderer"})}),`
`,e.jsx(n.p,{children:"Renders individual nodes, including title bar, sockets, and data fields."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Features:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Color-coded by category"}),`
`,e.jsx(n.li,{children:"Draggable with snap-to-grid"}),`
`,e.jsx(n.li,{children:"Socket connections (input/output)"}),`
`,e.jsx(n.li,{children:"Type-safe socket connections"}),`
`,e.jsx(n.li,{children:"Visual feedback on hover and selection"}),`
`]}),`
`,e.jsx(r,{children:e.jsx(t,{name:"NodeRenderer",children:()=>e.jsx("div",{style:{position:"relative",width:400,height:300},children:e.jsx(c,{node:{id:"test",type:"Print",nodeType:"exec",title:"Print",position:{x:50,y:50},inputs:[{id:"exec_in",name:"Exec",type:"exec",direction:"input"},{id:"message_in",name:"Message",type:"string",direction:"input",required:!0}],outputs:[{id:"exec_out",name:"Exec",type:"exec",direction:"output"}],data:{message:"Hello World"}}})})})}),`
`,e.jsx(n.h3,{id:"nodepalette",children:e.jsx(n.code,{children:"NodePalette"})}),`
`,e.jsx(n.p,{children:"Searchable menu for discovering and adding nodes to the canvas."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Features:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Search nodes by name or category"}),`
`,e.jsx(n.li,{children:"Filter by category"}),`
`,e.jsx(n.li,{children:"Node descriptions and icons"}),`
`,e.jsx(n.li,{children:"One-click node creation"}),`
`]}),`
`,e.jsx(r,{children:e.jsx(t,{name:"NodePalette",children:()=>e.jsx("div",{style:{width:300,height:500},children:e.jsx(a,{onSelectNode:o=>console.log("Selected:",o)})})})}),`
`,e.jsx(n.h2,{id:"node-types",children:"Node Types"}),`
`,e.jsx(n.h3,{id:"flow-control-nodes",children:"Flow Control Nodes"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Branch"})," - Conditional execution based on boolean value"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Delay"})," - Wait for specified duration"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Sequence"})," - Execute multiple outputs in sequence"]}),`
`]}),`
`,e.jsx(n.h3,{id:"math-nodes",children:"Math Nodes"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Add"})," - Add two numbers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Subtract"})," - Subtract two numbers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Multiply"})," - Multiply two numbers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Divide"})," - Divide two numbers"]}),`
`]}),`
`,e.jsx(n.h3,{id:"unity-api-nodes",children:"Unity API Nodes"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"GetPosition"})," - Get GameObject position"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SetPosition"})," - Set GameObject position"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"PlaySound"})," - Play audio clip"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SpawnPrefab"})," - Instantiate prefab"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"DestroyObject"})," - Destroy GameObject"]}),`
`]}),`
`,e.jsx(n.h3,{id:"event-nodes",children:"Event Nodes"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Start"})," - Called when script starts"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Update"})," - Called every frame"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"OnTriggerEnter"})," - Called on collision enter"]}),`
`]}),`
`,e.jsx(n.h2,{id:"usage-example",children:"Usage Example"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import { useBPGraphStore } from '@/ignis/blueprint/store/BPGraphStore';\r
import { NodeLibrary } from '@/ignis/blueprint/library/NodeLibrary';\r
import { BPInterpreter } from '@/ignis/blueprint/runtime/BPInterpreter';\r
\r
// Create a new blueprint graph\r
const graphId = useBPGraphStore.getState().createGraph("My Blueprint");\r
\r
// Add nodes\r
const startDef = NodeLibrary.get("Start");\r
const startNode = startDef.create();\r
startNode.id = "start1";\r
startNode.position = { x: 100, y: 100 };\r
useBPGraphStore.getState().addNode(graphId, startNode);\r
\r
// Execute graph\r
const graph = useBPGraphStore.getState().getCurrentGraph();\r
const interpreter = new BPInterpreter(graph);\r
interpreter.execute();
`})}),`
`,e.jsx(n.h2,{id:"integration",children:"Integration"}),`
`,e.jsx(n.p,{children:"The Blueprint Editor integrates with:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"WISSIL File System"})," - Save/load blueprints as JSON files"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Unity Runtime"})," - Execute blueprints in Unity WebGL"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"LUNA AI"})," - AI-assisted graph generation and optimization"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Code Generator"})," - Export to Unity C# scripts"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Ignition"})," - Runtime execution and debugging"]}),`
`]}),`
`,e.jsx(n.h2,{id:"next-steps",children:"Next Steps"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Explore the ",e.jsx(n.a,{href:"/ignis/blueprint/node-library",children:"Node Library"})]}),`
`,e.jsxs(n.li,{children:["Learn about ",e.jsx(n.a,{href:"/ignis/blueprint/runtime",children:"Runtime Execution"})]}),`
`,e.jsxs(n.li,{children:["See ",e.jsx(n.a,{href:"/ignis/blueprint/unity-integration",children:"Unity Integration"})]}),`
`]})]})}function m(i={}){const{wrapper:n}={...l(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{m as default};
