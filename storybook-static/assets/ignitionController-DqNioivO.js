import{u as Fe,n as je,j as Lt}from"./wissilFs-D_4fnc1y.js";import{u as ge}from"./editorState-BZUma5kk.js";import{U as et}from"./unityBridge-ChVzu39L.js";const tt=/import\s+(?:[^"']+from\s+)?["']([^"']+)["']/g,nt=/require\s*\(\s*["']([^"']+)["']\s*\)/g;function Wt($){const R=Fe.getState(),T=new Set,x={};function V(ae){const Z=je(ae);if(T.has(Z))return;T.add(Z);const pe=R.readFile(Z);if(!pe){x[Z]=[];return}const se=[];let de;for(tt.lastIndex=0;(de=tt.exec(pe))!==null;){const he=de[1],ye=rt(Z,he);ye&&se.push(ye)}for(nt.lastIndex=0;(de=nt.exec(pe))!==null;){const he=de[1],ye=rt(Z,he);ye&&se.push(ye)}x[Z]=se,se.forEach(he=>{R.exists(he)&&V(he)})}const K=je($);return R.exists(K)&&V(K),x}function rt($,R){if(!R.startsWith(".")&&!R.startsWith("/"))return null;if(R.startsWith(".")){const T=$.split("/").slice(0,-1).join("/");let x=Lt(T,R);x=x.replace(/\.(js|ts|tsx|jsx)$/,"");const V=Fe.getState(),K=["",".ts",".tsx",".js",".jsx","/index.ts","/index.js"];for(const ae of K){const Z=x+ae;if(V.exists(Z))return je(Z)}return je(x)}return R.startsWith("/")?je(R.slice(1)):null}function Vt($){const R=new Set,T=[];function x(V){if(R.has(V))return;R.add(V),($[V]||[]).forEach(ae=>{$[ae]&&x(ae)}),T.push(V)}return Object.keys($).forEach(V=>x(V)),T}var at={exports:{}};(function($){(R=>{var T=Object.defineProperty,x=Object.getOwnPropertyDescriptor,V=Object.getOwnPropertyNames,K=Object.prototype.hasOwnProperty,ae=(t,n)=>{for(var r in n)T(t,r,{get:n[r],enumerable:!0})},Z=(t,n,r,c)=>{if(n&&typeof n=="object"||typeof n=="function")for(let h of V(n))!K.call(t,h)&&h!==r&&T(t,h,{get:()=>n[h],enumerable:!(c=x(n,h))||c.enumerable});return t},pe=t=>Z(T({},"__esModule",{value:!0}),t),se=(t,n,r)=>new Promise((c,h)=>{var w=u=>{try{E(r.next(u))}catch(S){h(S)}},f=u=>{try{E(r.throw(u))}catch(S){h(S)}},E=u=>u.done?c(u.value):Promise.resolve(u.value).then(w,f);E((r=r.apply(t,n)).next())}),de={};ae(de,{analyzeMetafile:()=>Pt,analyzeMetafileSync:()=>It,build:()=>St,buildSync:()=>Ot,context:()=>$t,default:()=>Mt,formatMessages:()=>Tt,formatMessagesSync:()=>Ct,initialize:()=>Ut,stop:()=>Dt,transform:()=>jt,transformSync:()=>Rt,version:()=>_t}),R.exports=pe(de);function he(t){let n=c=>{if(c===null)r.write8(0);else if(typeof c=="boolean")r.write8(1),r.write8(+c);else if(typeof c=="number")r.write8(2),r.write32(c|0);else if(typeof c=="string")r.write8(3),r.write(ue(c));else if(c instanceof Uint8Array)r.write8(4),r.write(c);else if(c instanceof Array){r.write8(5),r.write32(c.length);for(let h of c)n(h)}else{let h=Object.keys(c);r.write8(6),r.write32(h.length);for(let w of h)r.write(ue(w)),n(c[w])}},r=new Ne;return r.write32(0),r.write32(t.id<<1|+!t.isRequest),n(t.value),Me(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ye(t){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return xe(r.read());case 4:return r.read();case 5:{let f=r.read32(),E=[];for(let u=0;u<f;u++)E.push(n());return E}case 6:{let f=r.read32(),E={};for(let u=0;u<f;u++)E[xe(r.read())]=n();return E}default:throw new Error("Invalid packet")}},r=new Ne(t),c=r.read32(),h=(c&1)===0;c>>>=1;let w=n();if(r.ptr!==t.length)throw new Error("Invalid packet");return{id:c,isRequest:h,value:w}}var Ne=class{constructor(t=new Uint8Array(1024)){this.buf=t,this.len=0,this.ptr=0}_write(t){if(this.len+t>this.buf.length){let n=new Uint8Array((this.len+t)*2);n.set(this.buf),this.buf=n}return this.len+=t,this.len-t}write8(t){let n=this._write(1);this.buf[n]=t}write32(t){let n=this._write(4);Me(this.buf,t,n)}write(t){let n=this._write(4+t.length);Me(this.buf,t.length,n),this.buf.set(t,n+4)}_read(t){if(this.ptr+t>this.buf.length)throw new Error("Invalid packet");return this.ptr+=t,this.ptr-t}read8(){return this.buf[this._read(1)]}read32(){return Le(this.buf,this._read(4))}read(){let t=this.read32(),n=new Uint8Array(t),r=this._read(n.length);return n.set(this.buf.subarray(r,r+t)),n}},ue,xe,Ae;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let t=new TextEncoder,n=new TextDecoder;ue=r=>t.encode(r),xe=r=>n.decode(r),Ae='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ue=t=>Buffer.from(t),xe=t=>{let{buffer:n,byteOffset:r,byteLength:c}=t;return Buffer.from(n,r,c).toString()},Ae='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ue("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Ae} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function Le(t,n){return t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24}function Me(t,n,r){t[r++]=n,t[r++]=n>>8,t[r++]=n>>16,t[r++]=n>>24}var ee=JSON.stringify,We="warning",Ve="silent";function ze(t){if(te(t,"target"),t.indexOf(",")>=0)throw new Error(`Invalid target: ${t}`);return t}var Te=()=>null,J=t=>typeof t=="boolean"?null:"a boolean",_=t=>typeof t=="string"?null:"a string",Pe=t=>t instanceof RegExp?null:"a RegExp object",we=t=>typeof t=="number"&&t===(t|0)?null:"an integer",Ge=t=>typeof t=="function"?null:"a function",Q=t=>Array.isArray(t)?null:"an array",ce=t=>typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"an object",dt=t=>typeof t=="object"&&t!==null?null:"an array or an object",ht=t=>t instanceof WebAssembly.Module?null:"a WebAssembly.Module",qe=t=>typeof t=="object"&&!Array.isArray(t)?null:"an object or null",Je=t=>typeof t=="string"||typeof t=="boolean"?null:"a string or a boolean",mt=t=>typeof t=="string"||typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"a string or an object",gt=t=>typeof t=="string"||Array.isArray(t)?null:"a string or an array",Ye=t=>typeof t=="string"||t instanceof Uint8Array?null:"a string or a Uint8Array",pt=t=>typeof t=="string"||t instanceof URL?null:"a string or a URL";function i(t,n,r,c){let h=t[r];if(n[r+""]=!0,h===void 0)return;let w=c(h);if(w!==null)throw new Error(`${ee(r)} must be ${w}`);return h}function X(t,n,r){for(let c in t)if(!(c in n))throw new Error(`Invalid option ${r}: ${ee(c)}`)}function yt(t){let n=Object.create(null),r=i(t,n,"wasmURL",pt),c=i(t,n,"wasmModule",ht),h=i(t,n,"worker",J);return X(t,n,"in initialize() call"),{wasmURL:r,wasmModule:c,worker:h}}function He(t){let n;if(t!==void 0){n=Object.create(null);for(let r in t){let c=t[r];if(typeof c=="string"||c===!1)n[r]=c;else throw new Error(`Expected ${ee(r)} in mangle cache to map to either a string or false`)}}return n}function Oe(t,n,r,c,h){let w=i(n,r,"color",J),f=i(n,r,"logLevel",_),E=i(n,r,"logLimit",we);w!==void 0?t.push(`--color=${w}`):c&&t.push("--color=true"),t.push(`--log-level=${f||h}`),t.push(`--log-limit=${E||0}`)}function te(t,n,r){if(typeof t!="string")throw new Error(`Expected value for ${n}${r!==void 0?" "+ee(r):""} to be a string, got ${typeof t} instead`);return t}function Qe(t,n,r){let c=i(n,r,"legalComments",_),h=i(n,r,"sourceRoot",_),w=i(n,r,"sourcesContent",J),f=i(n,r,"target",gt),E=i(n,r,"format",_),u=i(n,r,"globalName",_),S=i(n,r,"mangleProps",Pe),O=i(n,r,"reserveProps",Pe),C=i(n,r,"mangleQuoted",J),G=i(n,r,"minify",J),N=i(n,r,"minifySyntax",J),A=i(n,r,"minifyWhitespace",J),ne=i(n,r,"minifyIdentifiers",J),p=i(n,r,"lineLimit",we),L=i(n,r,"drop",Q),W=i(n,r,"dropLabels",Q),g=i(n,r,"charset",_),a=i(n,r,"treeShaking",J),l=i(n,r,"ignoreAnnotations",J),o=i(n,r,"jsx",_),m=i(n,r,"jsxFactory",_),y=i(n,r,"jsxFragment",_),k=i(n,r,"jsxImportSource",_),P=i(n,r,"jsxDev",J),e=i(n,r,"jsxSideEffects",J),s=i(n,r,"define",ce),d=i(n,r,"logOverride",ce),v=i(n,r,"supported",ce),j=i(n,r,"pure",Q),M=i(n,r,"keepNames",J),U=i(n,r,"platform",_),B=i(n,r,"tsconfigRaw",mt);if(c&&t.push(`--legal-comments=${c}`),h!==void 0&&t.push(`--source-root=${h}`),w!==void 0&&t.push(`--sources-content=${w}`),f&&(Array.isArray(f)?t.push(`--target=${Array.from(f).map(ze).join(",")}`):t.push(`--target=${ze(f)}`)),E&&t.push(`--format=${E}`),u&&t.push(`--global-name=${u}`),U&&t.push(`--platform=${U}`),B&&t.push(`--tsconfig-raw=${typeof B=="string"?B:JSON.stringify(B)}`),G&&t.push("--minify"),N&&t.push("--minify-syntax"),A&&t.push("--minify-whitespace"),ne&&t.push("--minify-identifiers"),p&&t.push(`--line-limit=${p}`),g&&t.push(`--charset=${g}`),a!==void 0&&t.push(`--tree-shaking=${a}`),l&&t.push("--ignore-annotations"),L)for(let D of L)t.push(`--drop:${te(D,"drop")}`);if(W&&t.push(`--drop-labels=${Array.from(W).map(D=>te(D,"dropLabels")).join(",")}`),S&&t.push(`--mangle-props=${S.source}`),O&&t.push(`--reserve-props=${O.source}`),C!==void 0&&t.push(`--mangle-quoted=${C}`),o&&t.push(`--jsx=${o}`),m&&t.push(`--jsx-factory=${m}`),y&&t.push(`--jsx-fragment=${y}`),k&&t.push(`--jsx-import-source=${k}`),P&&t.push("--jsx-dev"),e&&t.push("--jsx-side-effects"),s)for(let D in s){if(D.indexOf("=")>=0)throw new Error(`Invalid define: ${D}`);t.push(`--define:${D}=${te(s[D],"define",D)}`)}if(d)for(let D in d){if(D.indexOf("=")>=0)throw new Error(`Invalid log override: ${D}`);t.push(`--log-override:${D}=${te(d[D],"log override",D)}`)}if(v)for(let D in v){if(D.indexOf("=")>=0)throw new Error(`Invalid supported: ${D}`);const I=v[D];if(typeof I!="boolean")throw new Error(`Expected value for supported ${ee(D)} to be a boolean, got ${typeof I} instead`);t.push(`--supported:${D}=${I}`)}if(j)for(let D of j)t.push(`--pure:${te(D,"pure")}`);M&&t.push("--keep-names")}function wt(t,n,r,c,h){var w;let f=[],E=[],u=Object.create(null),S=null,O=null;Oe(f,n,u,r,c),Qe(f,n,u);let C=i(n,u,"sourcemap",Je),G=i(n,u,"bundle",J),N=i(n,u,"splitting",J),A=i(n,u,"preserveSymlinks",J),ne=i(n,u,"metafile",J),p=i(n,u,"outfile",_),L=i(n,u,"outdir",_),W=i(n,u,"outbase",_),g=i(n,u,"tsconfig",_),a=i(n,u,"resolveExtensions",Q),l=i(n,u,"nodePaths",Q),o=i(n,u,"mainFields",Q),m=i(n,u,"conditions",Q),y=i(n,u,"external",Q),k=i(n,u,"packages",_),P=i(n,u,"alias",ce),e=i(n,u,"loader",ce),s=i(n,u,"outExtension",ce),d=i(n,u,"publicPath",_),v=i(n,u,"entryNames",_),j=i(n,u,"chunkNames",_),M=i(n,u,"assetNames",_),U=i(n,u,"inject",Q),B=i(n,u,"banner",ce),D=i(n,u,"footer",ce),I=i(n,u,"entryPoints",dt),z=i(n,u,"absWorkingDir",_),F=i(n,u,"stdin",ce),q=(w=i(n,u,"write",J))!=null?w:h,re=i(n,u,"allowOverwrite",J),le=i(n,u,"mangleCache",ce);if(u.plugins=!0,X(n,u,`in ${t}() call`),C&&f.push(`--sourcemap${C===!0?"":`=${C}`}`),G&&f.push("--bundle"),re&&f.push("--allow-overwrite"),N&&f.push("--splitting"),A&&f.push("--preserve-symlinks"),ne&&f.push("--metafile"),p&&f.push(`--outfile=${p}`),L&&f.push(`--outdir=${L}`),W&&f.push(`--outbase=${W}`),g&&f.push(`--tsconfig=${g}`),k&&f.push(`--packages=${k}`),a){let b=[];for(let Y of a){if(te(Y,"resolve extension"),Y.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${Y}`);b.push(Y)}f.push(`--resolve-extensions=${b.join(",")}`)}if(d&&f.push(`--public-path=${d}`),v&&f.push(`--entry-names=${v}`),j&&f.push(`--chunk-names=${j}`),M&&f.push(`--asset-names=${M}`),o){let b=[];for(let Y of o){if(te(Y,"main field"),Y.indexOf(",")>=0)throw new Error(`Invalid main field: ${Y}`);b.push(Y)}f.push(`--main-fields=${b.join(",")}`)}if(m){let b=[];for(let Y of m){if(te(Y,"condition"),Y.indexOf(",")>=0)throw new Error(`Invalid condition: ${Y}`);b.push(Y)}f.push(`--conditions=${b.join(",")}`)}if(y)for(let b of y)f.push(`--external:${te(b,"external")}`);if(P)for(let b in P){if(b.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${b}`);f.push(`--alias:${b}=${te(P[b],"alias",b)}`)}if(B)for(let b in B){if(b.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${b}`);f.push(`--banner:${b}=${te(B[b],"banner",b)}`)}if(D)for(let b in D){if(b.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${b}`);f.push(`--footer:${b}=${te(D[b],"footer",b)}`)}if(U)for(let b of U)f.push(`--inject:${te(b,"inject")}`);if(e)for(let b in e){if(b.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${b}`);f.push(`--loader:${b}=${te(e[b],"loader",b)}`)}if(s)for(let b in s){if(b.indexOf("=")>=0)throw new Error(`Invalid out extension: ${b}`);f.push(`--out-extension:${b}=${te(s[b],"out extension",b)}`)}if(I)if(Array.isArray(I))for(let b=0,Y=I.length;b<Y;b++){let oe=I[b];if(typeof oe=="object"&&oe!==null){let fe=Object.create(null),ie=i(oe,fe,"in",_),$e=i(oe,fe,"out",_);if(X(oe,fe,"in entry point at index "+b),ie===void 0)throw new Error('Missing property "in" for entry point at index '+b);if($e===void 0)throw new Error('Missing property "out" for entry point at index '+b);E.push([$e,ie])}else E.push(["",te(oe,"entry point at index "+b)])}else for(let b in I)E.push([b,te(I[b],"entry point",b)]);if(F){let b=Object.create(null),Y=i(F,b,"contents",Ye),oe=i(F,b,"resolveDir",_),fe=i(F,b,"sourcefile",_),ie=i(F,b,"loader",_);X(F,b,'in "stdin" object'),fe&&f.push(`--sourcefile=${fe}`),ie&&f.push(`--loader=${ie}`),oe&&(O=oe),typeof Y=="string"?S=ue(Y):Y instanceof Uint8Array&&(S=Y)}let ke=[];if(l)for(let b of l)b+="",ke.push(b);return{entries:E,flags:f,write:q,stdinContents:S,stdinResolveDir:O,absWorkingDir:z,nodePaths:ke,mangleCache:He(le)}}function vt(t,n,r,c){let h=[],w=Object.create(null);Oe(h,n,w,r,c),Qe(h,n,w);let f=i(n,w,"sourcemap",Je),E=i(n,w,"sourcefile",_),u=i(n,w,"loader",_),S=i(n,w,"banner",_),O=i(n,w,"footer",_),C=i(n,w,"mangleCache",ce);return X(n,w,`in ${t}() call`),f&&h.push(`--sourcemap=${f===!0?"external":f}`),E&&h.push(`--sourcefile=${E}`),u&&h.push(`--loader=${u}`),S&&h.push(`--banner=${S}`),O&&h.push(`--footer=${O}`),{flags:h,mangleCache:He(C)}}function bt(t){const n={},r={didClose:!1,reason:""};let c={},h=0,w=0,f=new Uint8Array(16*1024),E=0,u=g=>{let a=E+g.length;if(a>f.length){let o=new Uint8Array(a*2);o.set(f),f=o}f.set(g,E),E+=g.length;let l=0;for(;l+4<=E;){let o=Le(f,l);if(l+4+o>E)break;l+=4,A(f.subarray(l,l+o)),l+=o}l>0&&(f.copyWithin(0,l,E),E-=l)},S=g=>{r.didClose=!0,g&&(r.reason=": "+(g.message||g));const a="The service was stopped"+r.reason;for(let l in c)c[l](a,null);c={}},O=(g,a,l)=>{if(r.didClose)return l("The service is no longer running"+r.reason,null);let o=h++;c[o]=(m,y)=>{try{l(m,y)}finally{g&&g.unref()}},g&&g.ref(),t.writeToStdin(he({id:o,isRequest:!0,value:a}))},C=(g,a)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);t.writeToStdin(he({id:g,isRequest:!1,value:a}))},G=(g,a)=>se(this,null,function*(){try{if(a.command==="ping"){C(g,{});return}if(typeof a.key=="number"){const l=n[a.key];if(!l)return;const o=l[a.command];if(o){yield o(g,a);return}}throw new Error("Invalid command: "+a.command)}catch(l){const o=[ve(l,t,null,void 0,"")];try{C(g,{errors:o})}catch{}}}),N=!0,A=g=>{if(N){N=!1;let l=String.fromCharCode(...g);if(l!=="0.19.12")throw new Error(`Cannot start service: Host version "0.19.12" does not match binary version ${ee(l)}`);return}let a=ye(g);if(a.isRequest)G(a.id,a.value);else{let l=c[a.id];delete c[a.id],a.value.error?l(a.value.error,{}):l(null,a.value)}};return{readFromStdout:u,afterClose:S,service:{buildOrContext:({callName:g,refs:a,options:l,isTTY:o,defaultWD:m,callback:y})=>{let k=0;const P=w++,e={},s={ref(){++k===1&&a&&a.ref()},unref(){--k===0&&(delete n[P],a&&a.unref())}};n[P]=e,s.ref(),xt(g,P,O,C,s,t,e,l,o,m,(d,v)=>{try{y(d,v)}finally{s.unref()}})},transform:({callName:g,refs:a,input:l,options:o,isTTY:m,fs:y,callback:k})=>{const P=Xe();let e=s=>{try{if(typeof l!="string"&&!(l instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:d,mangleCache:v}=vt(g,o,m,Ve),j={command:"transform",flags:d,inputFS:s!==null,input:s!==null?ue(s):typeof l=="string"?ue(l):l};v&&(j.mangleCache=v),O(a,j,(M,U)=>{if(M)return k(new Error(M),null);let B=Ee(U.errors,P),D=Ee(U.warnings,P),I=1,z=()=>{if(--I===0){let F={warnings:D,code:U.code,map:U.map,mangleCache:void 0,legalComments:void 0};"legalComments"in U&&(F.legalComments=U==null?void 0:U.legalComments),U.mangleCache&&(F.mangleCache=U==null?void 0:U.mangleCache),k(null,F)}};if(B.length>0)return k(_e("Transform failed",B,D),null);U.codeFS&&(I++,y.readFile(U.code,(F,q)=>{F!==null?k(F,null):(U.code=q,z())})),U.mapFS&&(I++,y.readFile(U.map,(F,q)=>{F!==null?k(F,null):(U.map=q,z())})),z()})}catch(d){let v=[];try{Oe(v,o,{},m,Ve)}catch{}const j=ve(d,t,P,void 0,"");O(a,{command:"error",flags:v,error:j},()=>{j.detail=P.load(j.detail),k(_e("Transform failed",[j],[]),null)})}};if((typeof l=="string"||l instanceof Uint8Array)&&l.length>1024*1024){let s=e;e=()=>y.writeFile(l,s)}e(null)},formatMessages:({callName:g,refs:a,messages:l,options:o,callback:m})=>{if(!o)throw new Error(`Missing second argument in ${g}() call`);let y={},k=i(o,y,"kind",_),P=i(o,y,"color",J),e=i(o,y,"terminalWidth",we);if(X(o,y,`in ${g}() call`),k===void 0)throw new Error(`Missing "kind" in ${g}() call`);if(k!=="error"&&k!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${g}() call`);let s={command:"format-msgs",messages:me(l,"messages",null,"",e),isWarning:k==="warning"};P!==void 0&&(s.color=P),e!==void 0&&(s.terminalWidth=e),O(a,s,(d,v)=>{if(d)return m(new Error(d),null);m(null,v.messages)})},analyzeMetafile:({callName:g,refs:a,metafile:l,options:o,callback:m})=>{o===void 0&&(o={});let y={},k=i(o,y,"color",J),P=i(o,y,"verbose",J);X(o,y,`in ${g}() call`);let e={command:"analyze-metafile",metafile:l};k!==void 0&&(e.color=k),P!==void 0&&(e.verbose=P),O(a,e,(s,d)=>{if(s)return m(new Error(s),null);m(null,d.result)})}}}}function xt(t,n,r,c,h,w,f,E,u,S,O){const C=Xe(),G=t==="context",N=(p,L)=>{const W=[];try{Oe(W,E,{},u,We)}catch{}const g=ve(p,w,C,void 0,L);r(h,{command:"error",flags:W,error:g},()=>{g.detail=C.load(g.detail),O(_e(G?"Context failed":"Build failed",[g],[]),null)})};let A;if(typeof E=="object"){const p=E.plugins;if(p!==void 0){if(!Array.isArray(p))return N(new Error('"plugins" must be an array'),"");A=p}}if(A&&A.length>0){if(w.isSync)return N(new Error("Cannot use plugins in synchronous API calls"),"");Et(n,r,c,h,w,f,E,A,C).then(p=>{if(!p.ok)return N(p.error,p.pluginName);try{ne(p.requestPlugins,p.runOnEndCallbacks,p.scheduleOnDisposeCallbacks)}catch(L){N(L,"")}},p=>N(p,""));return}try{ne(null,(p,L)=>L([],[]),()=>{})}catch(p){N(p,"")}function ne(p,L,W){const g=w.hasFS,{entries:a,flags:l,write:o,stdinContents:m,stdinResolveDir:y,absWorkingDir:k,nodePaths:P,mangleCache:e}=wt(t,E,u,We,g);if(o&&!w.hasFS)throw new Error('The "write" option is unavailable in this environment');const s={command:"build",key:n,entries:a,flags:l,write:o,stdinContents:m,stdinResolveDir:y,absWorkingDir:k||S,nodePaths:P,context:G};p&&(s.plugins=p),e&&(s.mangleCache=e);const d=(M,U)=>{const B={errors:Ee(M.errors,C),warnings:Ee(M.warnings,C),outputFiles:void 0,metafile:void 0,mangleCache:void 0},D=B.errors.slice(),I=B.warnings.slice();M.outputFiles&&(B.outputFiles=M.outputFiles.map(kt)),M.metafile&&(B.metafile=JSON.parse(M.metafile)),M.mangleCache&&(B.mangleCache=M.mangleCache),M.writeToStdout!==void 0&&console.log(xe(M.writeToStdout).replace(/\n$/,"")),L(B,(z,F)=>{if(D.length>0||z.length>0){const q=_e("Build failed",D.concat(z),I.concat(F));return U(q,null,z,F)}U(null,B,z,F)})};let v,j;G&&(f["on-end"]=(M,U)=>new Promise(B=>{d(U,(D,I,z,F)=>{const q={errors:z,warnings:F};j&&j(D,I),v=void 0,j=void 0,c(M,q),B()})})),r(h,s,(M,U)=>{if(M)return O(new Error(M),null);if(!G)return d(U,(I,z)=>(W(),O(I,z)));if(U.errors.length>0)return O(_e("Context failed",U.errors,U.warnings),null);let B=!1;const D={rebuild:()=>(v||(v=new Promise((I,z)=>{let F;j=(re,le)=>{F||(F=()=>re?z(re):I(le))};const q=()=>{r(h,{command:"rebuild",key:n},(le,ke)=>{le?z(new Error(le)):F?F():q()})};q()})),v),watch:(I={})=>new Promise((z,F)=>{if(!w.hasFS)throw new Error('Cannot use the "watch" API in this environment');X(I,{},"in watch() call"),r(h,{command:"watch",key:n},le=>{le?F(new Error(le)):z(void 0)})}),serve:(I={})=>new Promise((z,F)=>{if(!w.hasFS)throw new Error('Cannot use the "serve" API in this environment');const q={},re=i(I,q,"port",we),le=i(I,q,"host",_),ke=i(I,q,"servedir",_),b=i(I,q,"keyfile",_),Y=i(I,q,"certfile",_),oe=i(I,q,"fallback",_),fe=i(I,q,"onRequest",Ge);X(I,q,"in serve() call");const ie={command:"serve",key:n,onRequest:!!fe};re!==void 0&&(ie.port=re),le!==void 0&&(ie.host=le),ke!==void 0&&(ie.servedir=ke),b!==void 0&&(ie.keyfile=b),Y!==void 0&&(ie.certfile=Y),oe!==void 0&&(ie.fallback=oe),r(h,ie,($e,Ft)=>{if($e)return F(new Error($e));fe&&(f["serve-request"]=(Bt,Nt)=>{fe(Nt.args),c(Bt,{})}),z(Ft)})}),cancel:()=>new Promise(I=>{if(B)return I();r(h,{command:"cancel",key:n},()=>{I()})}),dispose:()=>new Promise(I=>{if(B)return I();B=!0,r(h,{command:"dispose",key:n},()=>{I(),W(),h.unref()})})};h.ref(),O(null,D)})}}var Et=(t,n,r,c,h,w,f,E,u)=>se(void 0,null,function*(){let S=[],O=[],C={},G={},N=[],A=0,ne=0,p=[],L=!1;E=[...E];for(let a of E){let l={};if(typeof a!="object")throw new Error(`Plugin at index ${ne} must be an object`);const o=i(a,l,"name",_);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${ne} is missing a name`);try{let m=i(a,l,"setup",Ge);if(typeof m!="function")throw new Error("Plugin is missing a setup function");X(a,l,`on plugin ${ee(o)}`);let y={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};ne++;let P=m({initialOptions:f,resolve:(e,s={})=>{if(!L)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof e!="string")throw new Error("The path to resolve must be a string");let d=Object.create(null),v=i(s,d,"pluginName",_),j=i(s,d,"importer",_),M=i(s,d,"namespace",_),U=i(s,d,"resolveDir",_),B=i(s,d,"kind",_),D=i(s,d,"pluginData",Te);return X(s,d,"in resolve() call"),new Promise((I,z)=>{const F={command:"resolve",path:e,key:t,pluginName:o};if(v!=null&&(F.pluginName=v),j!=null&&(F.importer=j),M!=null&&(F.namespace=M),U!=null&&(F.resolveDir=U),B!=null)F.kind=B;else throw new Error('Must specify "kind" when calling "resolve"');D!=null&&(F.pluginData=u.store(D)),n(c,F,(q,re)=>{q!==null?z(new Error(q)):I({errors:Ee(re.errors,u),warnings:Ee(re.warnings,u),path:re.path,external:re.external,sideEffects:re.sideEffects,namespace:re.namespace,suffix:re.suffix,pluginData:u.load(re.pluginData)})})})},onStart(e){let s='This error came from the "onStart" callback registered here:',d=Re(new Error(s),h,"onStart");S.push({name:o,callback:e,note:d}),y.onStart=!0},onEnd(e){let s='This error came from the "onEnd" callback registered here:',d=Re(new Error(s),h,"onEnd");O.push({name:o,callback:e,note:d}),y.onEnd=!0},onResolve(e,s){let d='This error came from the "onResolve" callback registered here:',v=Re(new Error(d),h,"onResolve"),j={},M=i(e,j,"filter",Pe),U=i(e,j,"namespace",_);if(X(e,j,`in onResolve() call for plugin ${ee(o)}`),M==null)throw new Error("onResolve() call is missing a filter");let B=A++;C[B]={name:o,callback:s,note:v},y.onResolve.push({id:B,filter:M.source,namespace:U||""})},onLoad(e,s){let d='This error came from the "onLoad" callback registered here:',v=Re(new Error(d),h,"onLoad"),j={},M=i(e,j,"filter",Pe),U=i(e,j,"namespace",_);if(X(e,j,`in onLoad() call for plugin ${ee(o)}`),M==null)throw new Error("onLoad() call is missing a filter");let B=A++;G[B]={name:o,callback:s,note:v},y.onLoad.push({id:B,filter:M.source,namespace:U||""})},onDispose(e){N.push(e)},esbuild:h.esbuild});P&&(yield P),p.push(y)}catch(m){return{ok:!1,error:m,pluginName:o}}}w["on-start"]=(a,l)=>se(void 0,null,function*(){let o={errors:[],warnings:[]};yield Promise.all(S.map(m=>se(void 0,[m],function*({name:y,callback:k,note:P}){try{let e=yield k();if(e!=null){if(typeof e!="object")throw new Error(`Expected onStart() callback in plugin ${ee(y)} to return an object`);let s={},d=i(e,s,"errors",Q),v=i(e,s,"warnings",Q);X(e,s,`from onStart() callback in plugin ${ee(y)}`),d!=null&&o.errors.push(...me(d,"errors",u,y,void 0)),v!=null&&o.warnings.push(...me(v,"warnings",u,y,void 0))}}catch(e){o.errors.push(ve(e,h,u,P&&P(),y))}}))),r(a,o)}),w["on-resolve"]=(a,l)=>se(void 0,null,function*(){let o={},m="",y,k;for(let P of l.ids)try{({name:m,callback:y,note:k}=C[P]);let e=yield y({path:l.path,importer:l.importer,namespace:l.namespace,resolveDir:l.resolveDir,kind:l.kind,pluginData:u.load(l.pluginData)});if(e!=null){if(typeof e!="object")throw new Error(`Expected onResolve() callback in plugin ${ee(m)} to return an object`);let s={},d=i(e,s,"pluginName",_),v=i(e,s,"path",_),j=i(e,s,"namespace",_),M=i(e,s,"suffix",_),U=i(e,s,"external",J),B=i(e,s,"sideEffects",J),D=i(e,s,"pluginData",Te),I=i(e,s,"errors",Q),z=i(e,s,"warnings",Q),F=i(e,s,"watchFiles",Q),q=i(e,s,"watchDirs",Q);X(e,s,`from onResolve() callback in plugin ${ee(m)}`),o.id=P,d!=null&&(o.pluginName=d),v!=null&&(o.path=v),j!=null&&(o.namespace=j),M!=null&&(o.suffix=M),U!=null&&(o.external=U),B!=null&&(o.sideEffects=B),D!=null&&(o.pluginData=u.store(D)),I!=null&&(o.errors=me(I,"errors",u,m,void 0)),z!=null&&(o.warnings=me(z,"warnings",u,m,void 0)),F!=null&&(o.watchFiles=Ce(F,"watchFiles")),q!=null&&(o.watchDirs=Ce(q,"watchDirs"));break}}catch(e){o={id:P,errors:[ve(e,h,u,k&&k(),m)]};break}r(a,o)}),w["on-load"]=(a,l)=>se(void 0,null,function*(){let o={},m="",y,k;for(let P of l.ids)try{({name:m,callback:y,note:k}=G[P]);let e=yield y({path:l.path,namespace:l.namespace,suffix:l.suffix,pluginData:u.load(l.pluginData),with:l.with});if(e!=null){if(typeof e!="object")throw new Error(`Expected onLoad() callback in plugin ${ee(m)} to return an object`);let s={},d=i(e,s,"pluginName",_),v=i(e,s,"contents",Ye),j=i(e,s,"resolveDir",_),M=i(e,s,"pluginData",Te),U=i(e,s,"loader",_),B=i(e,s,"errors",Q),D=i(e,s,"warnings",Q),I=i(e,s,"watchFiles",Q),z=i(e,s,"watchDirs",Q);X(e,s,`from onLoad() callback in plugin ${ee(m)}`),o.id=P,d!=null&&(o.pluginName=d),v instanceof Uint8Array?o.contents=v:v!=null&&(o.contents=ue(v)),j!=null&&(o.resolveDir=j),M!=null&&(o.pluginData=u.store(M)),U!=null&&(o.loader=U),B!=null&&(o.errors=me(B,"errors",u,m,void 0)),D!=null&&(o.warnings=me(D,"warnings",u,m,void 0)),I!=null&&(o.watchFiles=Ce(I,"watchFiles")),z!=null&&(o.watchDirs=Ce(z,"watchDirs"));break}}catch(e){o={id:P,errors:[ve(e,h,u,k&&k(),m)]};break}r(a,o)});let W=(a,l)=>l([],[]);O.length>0&&(W=(a,l)=>{se(void 0,null,function*(){const o=[],m=[];for(const{name:y,callback:k,note:P}of O){let e,s;try{const d=yield k(a);if(d!=null){if(typeof d!="object")throw new Error(`Expected onEnd() callback in plugin ${ee(y)} to return an object`);let v={},j=i(d,v,"errors",Q),M=i(d,v,"warnings",Q);X(d,v,`from onEnd() callback in plugin ${ee(y)}`),j!=null&&(e=me(j,"errors",u,y,void 0)),M!=null&&(s=me(M,"warnings",u,y,void 0))}}catch(d){e=[ve(d,h,u,P&&P(),y)]}if(e){o.push(...e);try{a.errors.push(...e)}catch{}}if(s){m.push(...s);try{a.warnings.push(...s)}catch{}}}l(o,m)})});let g=()=>{for(const a of N)setTimeout(()=>a(),0)};return L=!0,{ok:!0,requestPlugins:p,runOnEndCallbacks:W,scheduleOnDisposeCallbacks:g}});function Xe(){const t=new Map;let n=0;return{load(r){return t.get(r)},store(r){if(r===void 0)return-1;const c=n++;return t.set(c,r),c}}}function Re(t,n,r){let c,h=!1;return()=>{if(h)return c;h=!0;try{let w=(t.stack+"").split(`
`);w.splice(1,1);let f=Ke(n,w,r);if(f)return c={text:t.message,location:f},c}catch{}}}function ve(t,n,r,c,h){let w="Internal error",f=null;try{w=(t&&t.message||t)+""}catch{}try{f=Ke(n,(t.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:h,text:w,location:f,notes:c?[c]:[],detail:r?r.store(t):-1}}function Ke(t,n,r){let c="    at ";if(t.readFileSync&&!n[0].startsWith(c)&&n[1].startsWith(c))for(let h=1;h<n.length;h++){let w=n[h];if(w.startsWith(c))for(w=w.slice(c.length);;){let f=/^(?:new |async )?\S+ \((.*)\)$/.exec(w);if(f){w=f[1];continue}if(f=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(w),f){w=f[1];continue}if(f=/^(\S+):(\d+):(\d+)$/.exec(w),f){let E;try{E=t.readFileSync(f[1],"utf8")}catch{break}let u=E.split(/\r\n|\r|\n|\u2028|\u2029/)[+f[2]-1]||"",S=+f[3]-1,O=u.slice(S,S+r.length)===r?r.length:0;return{file:f[1],namespace:"file",line:+f[2],column:ue(u.slice(0,S)).length,length:ue(u.slice(S,S+O)).length,lineText:u+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function _e(t,n,r){let c=5;t+=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,c+1).map((w,f)=>{if(f===c)return`
...`;if(!w.location)return`
error: ${w.text}`;let{file:E,line:u,column:S}=w.location,O=w.pluginName?`[plugin: ${w.pluginName}] `:"";return`
${E}:${u}:${S}: ERROR: ${O}${w.text}`}).join("");let h=new Error(t);for(const[w,f]of[["errors",n],["warnings",r]])Object.defineProperty(h,w,{configurable:!0,enumerable:!0,get:()=>f,set:E=>Object.defineProperty(h,w,{configurable:!0,enumerable:!0,value:E})});return h}function Ee(t,n){for(const r of t)r.detail=n.load(r.detail);return t}function Ze(t,n,r){if(t==null)return null;let c={},h=i(t,c,"file",_),w=i(t,c,"namespace",_),f=i(t,c,"line",we),E=i(t,c,"column",we),u=i(t,c,"length",we),S=i(t,c,"lineText",_),O=i(t,c,"suggestion",_);if(X(t,c,n),S){const C=S.slice(0,(E&&E>0?E:0)+(u&&u>0?u:0)+(r&&r>0?r:80));!/[\x7F-\uFFFF]/.test(C)&&!/\n/.test(S)&&(S=C)}return{file:h||"",namespace:w||"",line:f||0,column:E||0,length:u||0,lineText:S||"",suggestion:O||""}}function me(t,n,r,c,h){let w=[],f=0;for(const E of t){let u={},S=i(E,u,"id",_),O=i(E,u,"pluginName",_),C=i(E,u,"text",_),G=i(E,u,"location",qe),N=i(E,u,"notes",Q),A=i(E,u,"detail",Te),ne=`in element ${f} of "${n}"`;X(E,u,ne);let p=[];if(N)for(const L of N){let W={},g=i(L,W,"text",_),a=i(L,W,"location",qe);X(L,W,ne),p.push({text:g||"",location:Ze(a,ne,h)})}w.push({id:S||"",pluginName:O||c,text:C||"",location:Ze(G,ne,h),notes:p,detail:r?r.store(A):-1}),f++}return w}function Ce(t,n){const r=[];for(const c of t){if(typeof c!="string")throw new Error(`${ee(n)} must be an array of strings`);r.push(c)}return r}function kt({path:t,contents:n,hash:r}){let c=null;return{path:t,contents:n,hash:r,get text(){const h=this.contents;return(c===null||h!==n)&&(n=h,c=xe(h)),c}}}var _t="0.19.12",St=t=>Se().build(t),$t=t=>Se().context(t),jt=(t,n)=>Se().transform(t,n),Tt=(t,n)=>Se().formatMessages(t,n),Pt=(t,n)=>Se().analyzeMetafile(t,n),Ot=()=>{throw new Error('The "buildSync" API only works in node')},Rt=()=>{throw new Error('The "transformSync" API only works in node')},Ct=()=>{throw new Error('The "formatMessagesSync" API only works in node')},It=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Dt=()=>{Ie&&Ie()},be,Ie,De,Se=()=>{if(De)return De;throw be?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Ut=t=>{t=yt(t||{});let n=t.wasmURL,r=t.wasmModule,c=t.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(be)throw new Error('Cannot call "initialize" more than once');return be=At(n||"",r,c),be.catch(()=>{be=void 0}),be},At=(t,n,r)=>se(void 0,null,function*(){let c;if(r){let S=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              go: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8) + 1
                    // setTimeout has been seen to fire up to 1 millisecond early
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                // JS values that Go currently has references to, indexed by reference id
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                // mapping from JS values to reference ids
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1)
              console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin)
              resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.19.12"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok)
            throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});c=new Worker(URL.createObjectURL(S))}else{let S=(C=>{var G=(p,L,W)=>new Promise((g,a)=>{var l=y=>{try{m(W.next(y))}catch(k){a(k)}},o=y=>{try{m(W.throw(y))}catch(k){a(k)}},m=y=>y.done?g(y.value):Promise.resolve(y.value).then(l,o);m((W=W.apply(p,L)).next())});let N,A={};for(let p=self;p;p=Object.getPrototypeOf(p))for(let L of Object.getOwnPropertyNames(p))L in A||Object.defineProperty(A,L,{get:()=>self[L]});(()=>{const p=()=>{const g=new Error("not implemented");return g.code="ENOSYS",g};if(!A.fs){let g="";A.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(a,l){g+=W.decode(l);const o=g.lastIndexOf(`
`);return o!=-1&&(console.log(g.substring(0,o)),g=g.substring(o+1)),l.length},write(a,l,o,m,y,k){if(o!==0||m!==l.length||y!==null){k(p());return}const P=this.writeSync(a,l);k(null,P)},chmod(a,l,o){o(p())},chown(a,l,o,m){m(p())},close(a,l){l(p())},fchmod(a,l,o){o(p())},fchown(a,l,o,m){m(p())},fstat(a,l){l(p())},fsync(a,l){l(null)},ftruncate(a,l,o){o(p())},lchown(a,l,o,m){m(p())},link(a,l,o){o(p())},lstat(a,l){l(p())},mkdir(a,l,o){o(p())},open(a,l,o,m){m(p())},read(a,l,o,m,y,k){k(p())},readdir(a,l){l(p())},readlink(a,l){l(p())},rename(a,l,o){o(p())},rmdir(a,l){l(p())},stat(a,l){l(p())},symlink(a,l,o){o(p())},truncate(a,l,o){o(p())},unlink(a,l){l(p())},utimes(a,l,o,m){m(p())}}}if(A.process||(A.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw p()},pid:-1,ppid:-1,umask(){throw p()},cwd(){throw p()},chdir(){throw p()}}),!A.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!A.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!A.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!A.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const L=new TextEncoder("utf-8"),W=new TextDecoder("utf-8");A.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=e=>{e!==0&&console.warn("exit code:",e)},this._exitPromise=new Promise(e=>{this._resolveExitPromise=e}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const g=(e,s)=>{this.mem.setUint32(e+0,s,!0),this.mem.setUint32(e+4,Math.floor(s/4294967296),!0)},a=e=>{const s=this.mem.getUint32(e+0,!0),d=this.mem.getInt32(e+4,!0);return s+d*4294967296},l=e=>{const s=this.mem.getFloat64(e,!0);if(s===0)return;if(!isNaN(s))return s;const d=this.mem.getUint32(e,!0);return this._values[d]},o=(e,s)=>{if(typeof s=="number"&&s!==0){if(isNaN(s)){this.mem.setUint32(e+4,2146959360,!0),this.mem.setUint32(e,0,!0);return}this.mem.setFloat64(e,s,!0);return}if(s===void 0){this.mem.setFloat64(e,0,!0);return}let v=this._ids.get(s);v===void 0&&(v=this._idPool.pop(),v===void 0&&(v=this._values.length),this._values[v]=s,this._goRefCounts[v]=0,this._ids.set(s,v)),this._goRefCounts[v]++;let j=0;switch(typeof s){case"object":s!==null&&(j=1);break;case"string":j=2;break;case"symbol":j=3;break;case"function":j=4;break}this.mem.setUint32(e+4,2146959360|j,!0),this.mem.setUint32(e,v,!0)},m=e=>{const s=a(e+0),d=a(e+8);return new Uint8Array(this._inst.exports.mem.buffer,s,d)},y=e=>{const s=a(e+0),d=a(e+8),v=new Array(d);for(let j=0;j<d;j++)v[j]=l(s+j*8);return v},k=e=>{const s=a(e+0),d=a(e+8);return W.decode(new DataView(this._inst.exports.mem.buffer,s,d))},P=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":e=>{e>>>=0;const s=this.mem.getInt32(e+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(s)},"runtime.wasmWrite":e=>{e>>>=0;const s=a(e+8),d=a(e+16),v=this.mem.getInt32(e+24,!0);A.fs.writeSync(s,new Uint8Array(this._inst.exports.mem.buffer,d,v))},"runtime.resetMemoryDataView":e=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":e=>{e>>>=0,g(e+8,(P+performance.now())*1e6)},"runtime.walltime":e=>{e>>>=0;const s=new Date().getTime();g(e+8,s/1e3),this.mem.setInt32(e+16,s%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":e=>{e>>>=0;const s=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(s,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(s);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},a(e+8)+1)),this.mem.setInt32(e+16,s,!0)},"runtime.clearTimeoutEvent":e=>{e>>>=0;const s=this.mem.getInt32(e+8,!0);clearTimeout(this._scheduledTimeouts.get(s)),this._scheduledTimeouts.delete(s)},"runtime.getRandomData":e=>{e>>>=0,crypto.getRandomValues(m(e+8))},"syscall/js.finalizeRef":e=>{e>>>=0;const s=this.mem.getUint32(e+8,!0);if(this._goRefCounts[s]--,this._goRefCounts[s]===0){const d=this._values[s];this._values[s]=null,this._ids.delete(d),this._idPool.push(s)}},"syscall/js.stringVal":e=>{e>>>=0,o(e+24,k(e+8))},"syscall/js.valueGet":e=>{e>>>=0;const s=Reflect.get(l(e+8),k(e+16));e=this._inst.exports.getsp()>>>0,o(e+32,s)},"syscall/js.valueSet":e=>{e>>>=0,Reflect.set(l(e+8),k(e+16),l(e+32))},"syscall/js.valueDelete":e=>{e>>>=0,Reflect.deleteProperty(l(e+8),k(e+16))},"syscall/js.valueIndex":e=>{e>>>=0,o(e+24,Reflect.get(l(e+8),a(e+16)))},"syscall/js.valueSetIndex":e=>{e>>>=0,Reflect.set(l(e+8),a(e+16),l(e+24))},"syscall/js.valueCall":e=>{e>>>=0;try{const s=l(e+8),d=Reflect.get(s,k(e+16)),v=y(e+32),j=Reflect.apply(d,s,v);e=this._inst.exports.getsp()>>>0,o(e+56,j),this.mem.setUint8(e+64,1)}catch(s){e=this._inst.exports.getsp()>>>0,o(e+56,s),this.mem.setUint8(e+64,0)}},"syscall/js.valueInvoke":e=>{e>>>=0;try{const s=l(e+8),d=y(e+16),v=Reflect.apply(s,void 0,d);e=this._inst.exports.getsp()>>>0,o(e+40,v),this.mem.setUint8(e+48,1)}catch(s){e=this._inst.exports.getsp()>>>0,o(e+40,s),this.mem.setUint8(e+48,0)}},"syscall/js.valueNew":e=>{e>>>=0;try{const s=l(e+8),d=y(e+16),v=Reflect.construct(s,d);e=this._inst.exports.getsp()>>>0,o(e+40,v),this.mem.setUint8(e+48,1)}catch(s){e=this._inst.exports.getsp()>>>0,o(e+40,s),this.mem.setUint8(e+48,0)}},"syscall/js.valueLength":e=>{e>>>=0,g(e+16,parseInt(l(e+8).length))},"syscall/js.valuePrepareString":e=>{e>>>=0;const s=L.encode(String(l(e+8)));o(e+16,s),g(e+24,s.length)},"syscall/js.valueLoadString":e=>{e>>>=0;const s=l(e+8);m(e+16).set(s)},"syscall/js.valueInstanceOf":e=>{e>>>=0,this.mem.setUint8(e+24,l(e+8)instanceof l(e+16)?1:0)},"syscall/js.copyBytesToGo":e=>{e>>>=0;const s=m(e+8),d=l(e+32);if(!(d instanceof Uint8Array||d instanceof Uint8ClampedArray)){this.mem.setUint8(e+48,0);return}const v=d.subarray(0,s.length);s.set(v),g(e+40,v.length),this.mem.setUint8(e+48,1)},"syscall/js.copyBytesToJS":e=>{e>>>=0;const s=l(e+8),d=m(e+16);if(!(s instanceof Uint8Array||s instanceof Uint8ClampedArray)){this.mem.setUint8(e+48,0);return}const v=d.subarray(0,s.length);s.set(v),g(e+40,v.length),this.mem.setUint8(e+48,1)},debug:e=>{console.log(e)}}}}run(g){return G(this,null,function*(){if(!(g instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=g,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,A,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[A,5],[this,6]]),this._idPool=[],this.exited=!1;let a=4096;const l=e=>{const s=a,d=L.encode(e+"\0");return new Uint8Array(this.mem.buffer,a,d.length).set(d),a+=d.length,a%8!==0&&(a+=8-a%8),s},o=this.argv.length,m=[];this.argv.forEach(e=>{m.push(l(e))}),m.push(0),Object.keys(this.env).sort().forEach(e=>{m.push(l(`${e}=${this.env[e]}`))}),m.push(0);const k=a;if(m.forEach(e=>{this.mem.setUint32(a,e,!0),this.mem.setUint32(a+4,0,!0),a+=8}),a>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(o,k),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(g){const a=this;return function(){const l={id:g,this:this,args:arguments};return a._pendingEvent=l,a._resume(),l.result}}}})(),N=({data:p})=>{let L=new TextDecoder,W=A.fs,g="";W.writeSync=(y,k)=>{if(y===1)C(k);else if(y===2){g+=L.decode(k);let P=g.split(`
`);P.length>1&&console.log(P.slice(0,-1).join(`
`)),g=P[P.length-1]}else throw new Error("Bad write");return k.length};let a=[],l,o=0;N=({data:y})=>(y.length>0&&(a.push(y),l&&l()),m),W.read=(y,k,P,e,s,d)=>{if(y!==0||P!==0||e!==k.length||s!==null)throw new Error("Bad read");if(a.length===0){l=()=>W.read(y,k,P,e,s,d);return}let v=a[0],j=Math.max(0,Math.min(e,v.length-o));k.set(v.subarray(o,o+j),P),o+=j,o===v.length&&(a.shift(),o=0),d(null,j)};let m=new A.Go;return m.argv=["","--service=0.19.12"],ne(p,m).then(y=>{C(null),m.run(y)},y=>{C(y)}),m};function ne(p,L){return G(this,null,function*(){if(p instanceof WebAssembly.Module)return WebAssembly.instantiate(p,L.importObject);const W=yield fetch(p);if(!W.ok)throw new Error(`Failed to download ${JSON.stringify(p)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(W.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(W,L.importObject)).instance;const g=yield W.arrayBuffer();return(yield WebAssembly.instantiate(g,L.importObject)).instance})}return p=>N(p)})(C=>c.onmessage({data:C})),O;c={onmessage:null,postMessage:C=>setTimeout(()=>O=S({data:C})),terminate(){if(O)for(let C of O._scheduledTimeouts.values())clearTimeout(C)}}}let h,w;const f=new Promise((S,O)=>{h=S,w=O});c.onmessage=({data:S})=>{c.onmessage=({data:O})=>E(O),S?w(S):h()},c.postMessage(n||new URL(t,location.href).toString());let{readFromStdout:E,service:u}=bt({writeToStdin(S){c.postMessage(S)},isSync:!1,hasFS:!1,esbuild:de});yield f,Ie=()=>{c.terminate(),be=void 0,Ie=void 0,De=void 0},De={build:S=>new Promise((O,C)=>u.buildOrContext({callName:"build",refs:null,options:S,isTTY:!1,defaultWD:"/",callback:(G,N)=>G?C(G):O(N)})),context:S=>new Promise((O,C)=>u.buildOrContext({callName:"context",refs:null,options:S,isTTY:!1,defaultWD:"/",callback:(G,N)=>G?C(G):O(N)})),transform:(S,O)=>new Promise((C,G)=>u.transform({callName:"transform",refs:null,input:S,options:O||{},isTTY:!1,fs:{readFile(N,A){A(new Error("Internal error"),null)},writeFile(N,A){A(null)}},callback:(N,A)=>N?G(N):C(A)})),formatMessages:(S,O)=>new Promise((C,G)=>u.formatMessages({callName:"formatMessages",refs:null,messages:S,options:O,callback:(N,A)=>N?G(N):C(A)})),analyzeMetafile:(S,O)=>new Promise((C,G)=>u.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof S=="string"?S:JSON.stringify(S),options:O,callback:(N,A)=>N?G(N):C(A)}))}}),Mt=de})($)})(at);var ut=at.exports;let st=!1,Ue=null;async function ct(){if(!st)return Ue||(Ue=(async()=>{try{await ut.initialize({wasmURL:"https://unpkg.com/esbuild-wasm@0.19.12/esbuild.wasm"}),st=!0}catch($){throw console.error("Failed to initialize esbuild:",$),$}})(),Ue)}function zt($){return $.endsWith(".tsx")?"tsx":$.endsWith(".ts")?"ts":$.endsWith(".jsx")?"jsx":$.endsWith(".js")?"js":$.endsWith(".json")?"json":$.endsWith(".css")?"css":"ts"}async function Gt($){const T=Fe.getState().readFile($);if(!T)return{code:""};const x=zt($);try{const V=await ut.transform(T,{loader:x,format:"esm",target:"es2020",sourcemap:!1,jsx:x==="tsx"||x==="jsx"?"automatic":void 0});return{code:V.code,map:V.map}}catch(V){const K=V;throw K.file=$,K}}async function qt($){await ct();const R=await Promise.all($.map(async x=>{try{const{code:V}=await Gt(x);return{path:x,code:V}}catch(V){throw V}})),T={};return R.forEach(({path:x,code:V})=>{T[x]=V}),T}function Jt($){return $?$.errors&&Array.isArray($.errors)?$.errors.map(R=>{const T=R.location;return T?`${R.text}
  at ${T.file}:${T.line}:${T.column}`:R.text}).join(`

`):$.message?$.message:String($):"Unknown build error"}async function it($){const R=ge.getState().setBuildStatus,T=ge.getState().setRuntimeError,x=ge.getState().pushMessage;try{R("running"),x(`[Build] Starting build for entry: ${$}`),await ct(),x("[Build] esbuild initialized");const V=Wt($);if(x(`[Build] Dependency graph built: ${Object.keys(V).length} files`),Object.keys(V).length===0)throw new Error(`No files found for entry: ${$}`);const K=Vt(V);x(`[Build] Transforming ${K.length} files...`);const ae=await qt(K);x("[Build] All files transformed successfully");let Z=`// WISSIL Build Output
// Entry: ${$}
// Files: ${K.length}

`;for(const pe of K){const se=ae[pe]||"";Z+=`// ===== FILE: ${pe} =====
`,Z+=`(function() {
`,Z+=se,Z+=`
})();

`}return R("idle"),x("[Build] Build completed successfully"),{bundle:Z,graph:V,transformed:ae,success:!0}}catch(V){const K=Jt(V);return R("error"),T(K),x(`[Build] Build failed: ${K}`),{bundle:"",graph:{},transformed:{},success:!1,error:K}}}const Yt=new Set;function Ht($){Yt.add($)}let H=null,Be=!1;function ft(){return H&&H.isConnected||(H&&(H.remove(),H=null),H=document.createElement("iframe"),H.sandbox.add("allow-scripts"),H.src="/wissil-sandbox.html",H.style.display="none",H.style.width="0",H.style.height="0",H.style.border="none",H.onload=()=>{Be=!0},document.body.appendChild(H)),H}function lt(){if(H){Be=!1;try{H.contentWindow&&H.contentWindow.postMessage({wissil:!0,type:"reset"},"*")}catch($){console.error("Error resetting sandbox:",$)}H.remove(),H=null,ft()}}function ot($){ft();const R=()=>{if(!H||!Be){setTimeout(R,100);return}try{H.contentWindow&&H.contentWindow.postMessage({wissil:!0,type:"execute",bundle:$},"*")}catch(T){console.error("Error executing bundle:",T);const{setRuntimeError:x}=ge.getState();x(`Sandbox execution error: ${T}`)}};R()}Ht($=>{const{pushMessage:R,setRuntimeError:T}=ge.getState();switch($.type){case"log":R(`[Runtime] ${$.payload}`);break;case"warn":R(`⚠️ [Runtime] ${$.payload}`);break;case"error":T($.payload),R(`❌ [Runtime Error] ${$.payload}`);break;case"runtime-error":T($.payload),R(`❌ [Runtime Error] ${$.payload}`);break;case"ready":$.payload==="Sandbox initialized"?R("✓ Sandbox ready"):R(`✓ ${$.payload}`);break}});class Zt{static async run(R="src/main.ts"){const T=ge.getState();T.setBuildStatus("running"),T.setRuntimeError(null),T.runtimeMessages=[],T.pushMessage(`[Ignition] Starting build for ${R}...`);try{const x=await it(R);if(!x.success||!x.bundle||x.bundle.trim()===""){T.setBuildStatus("error"),T.setRuntimeError(x.error||"Build produced an empty bundle.");return}T.setBuildStatus("idle"),T.pushMessage("[Ignition] Build successful, executing..."),ot(x.bundle)}catch(x){T.setBuildStatus("error"),T.setRuntimeError((x==null?void 0:x.message)||String(x)),T.pushMessage(`[Ignition] Build failed: ${(x==null?void 0:x.message)||String(x)}`)}}static async restart(R="src/main.ts"){const T=ge.getState();T.setBuildStatus("running"),T.setRuntimeError(null),T.runtimeMessages=[],T.pushMessage("[Ignition] Restarting runtime..."),et.destroy(),lt(),await new Promise(x=>setTimeout(x,200));try{const x=await it(R);if(!x.success||!x.bundle||x.bundle.trim()===""){T.setBuildStatus("error"),T.setRuntimeError(x.error||"Restart build error.");return}T.setBuildStatus("idle"),T.pushMessage("[Ignition] Restart complete, executing..."),ot(x.bundle)}catch(x){T.setBuildStatus("error"),T.setRuntimeError((x==null?void 0:x.message)||String(x)),T.pushMessage(`[Ignition] Restart failed: ${(x==null?void 0:x.message)||String(x)}`)}}static stop(){const R=ge.getState();R.setBuildStatus("idle"),R.setRuntimeError(null),R.runtimeMessages=[],R.pushMessage("[Ignition] Runtime stopped"),et.destroy(),lt()}static clearLogs(){const R=ge.getState();R.runtimeMessages=[]}}export{Zt as I};
