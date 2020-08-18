/* eslint-disable */
module.exports = {
name: "@yarnpkg/plugin-workspaces-analyze",
factory: function (require) {
var plugin;plugin=(()=>{var e={6987:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>m});var n=r(1115),o=r(8042),i=r(966),s=r(2594),a=r(8605),c=r(5622),d=r(5747),u=r(8835);class l{constructor(e){this._report=e,this._mimeTypes=new Map([[".html","text/html"],[".css","text/css"],[".js","text/javascript"],[".ico","image/x-icon"],[".json","application/json"],[".woff","font/woff"],[".woff2","font/woff2"]]),this._apiHandlers=new Map,this.init=(e=3e3,t="127.0.0.1")=>{this._httpServer.listen(e,t,()=>{this._report.reportInfo(null,`Server is listening at http://${t}:${e}`)})},this._getContentType=e=>{let t="application/octet-stream";const r=c.extname(e),n=this._mimeTypes.get(r);return n&&(t=n),t},this._serveStaticContent=(e,t)=>{const r=this._getContentType(e);t.setHeader("Content-Type",r),"/"===e&&(e="/index.html");const n=require.resolve("lodash/ceil");this._report.reportInfo(null,"serving static from: "+n),console.log(d.readFileSync(n))},this._serveDynamicContent=(e,t)=>{const r=u.parse(e.url,!0),{pathname:n,query:o}=r,i=this._apiHandlers.get(n);i&&i(n,o,(e,r,n,o=[])=>{for(const e of o)t.setHeader(...e);t.setHeader("Content-Type",r),t.writeHead(e),t.end(n)})},this._httpServer=(0,a.createServer)((e,t)=>{const r=u.parse(e.url,!1).pathname;this._apiHandlers.has(r)?this._serveDynamicContent(e,t):this._serveStaticContent(r,t)})}setApiHandler(e,t){this._apiHandlers.set(e,t)}}var p=function(e,t,r,n){var o,i=arguments.length,s=i<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,n);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(i<3?o(s):i>3?o(t,r,s):o(t,r))||s);return i>3&&s&&Object.defineProperty(t,r,s),s};class f extends s.BaseCommand{async execute(){const e=await i.Configuration.find(this.context.cwd,this.context.plugins);return(await i.StreamReport.start({configuration:e,stdout:this.context.stdout},async e=>{e.reportInfo(null,"start web server");const t=new l(e);t.setApiHandler("/deps",(t,r,o)=>{try{o(200,"application/json",(()=>{const{stdout:e}=n.sync("yarn",["workspaces","list","--json"]);return e})())}catch(t){e.reportError(null,"Failed to list workspaces: "+t.message),o(200,"application/json",JSON.stringify(t))}}),t.init(3211,"localhost")})).exitCode()}}f.usage=o.Command.Usage({category:"Workspace-related commands",description:"Analyze and visualize dependencies between workspaces in the project",details:"\n      This command will analyze dependencies between all workspaces in the project and start a local web server to visualize and interact with the dependency graph.\n    ",examples:[["Analyze dependencies and start the visualization web server using defaults","yarn workspaces analyze"]]}),p([o.Command.Path("workspaces","analyze")],f.prototype,"execute",null);const m={commands:[f]}},7566:(e,t,r)=>{"use strict";const n=r(3129),o=r(4951),i=r(779);function s(e,t,r){const s=o(e,t,r),a=n.spawn(s.command,s.args,s.options);return i.hookChildProcess(a,s),a}e.exports=s,e.exports.spawn=s,e.exports.sync=function(e,t,r){const s=o(e,t,r),a=n.spawnSync(s.command,s.args,s.options);return a.error=a.error||i.verifyENOENTSync(a.status,s),a},e.exports._parse=o,e.exports._enoent=i},779:e=>{"use strict";const t="win32"===process.platform;function r(e,t){return Object.assign(new Error(`${t} ${e.command} ENOENT`),{code:"ENOENT",errno:"ENOENT",syscall:`${t} ${e.command}`,path:e.command,spawnargs:e.args})}function n(e,n){return t&&1===e&&!n.file?r(n.original,"spawn"):null}e.exports={hookChildProcess:function(e,r){if(!t)return;const o=e.emit;e.emit=function(t,i){if("exit"===t){const t=n(i,r);if(t)return o.call(e,"error",t)}return o.apply(e,arguments)}},verifyENOENT:n,verifyENOENTSync:function(e,n){return t&&1===e&&!n.file?r(n.original,"spawnSync"):null},notFoundError:r}},4951:(e,t,r)=>{"use strict";const n=r(5622),o=r(7447),i=r(7066),s=r(5187),a="win32"===process.platform,c=/\.(?:com|exe)$/i,d=/node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;function u(e){if(!a)return e;const t=function(e){e.file=o(e);const t=e.file&&s(e.file);return t?(e.args.unshift(e.file),e.command=t,o(e)):e.file}(e),r=!c.test(t);if(e.options.forceShell||r){const r=d.test(t);e.command=n.normalize(e.command),e.command=i.command(e.command),e.args=e.args.map(e=>i.argument(e,r));const o=[e.command].concat(e.args).join(" ");e.args=["/d","/s","/c",`"${o}"`],e.command=process.env.comspec||"cmd.exe",e.options.windowsVerbatimArguments=!0}return e}e.exports=function(e,t,r){t&&!Array.isArray(t)&&(r=t,t=null);const n={command:e,args:t=t?t.slice(0):[],options:r=Object.assign({},r),file:void 0,original:{command:e,args:t}};return r.shell?n:u(n)}},7066:e=>{"use strict";const t=/([()\][%!^"`<>&|;, *?])/g;e.exports.command=function(e){return e=e.replace(t,"^$1")},e.exports.argument=function(e,r){return e=(e=`"${e=(e=(e=""+e).replace(/(\\*)"/g,'$1$1\\"')).replace(/(\\*)$/,"$1$1")}"`).replace(t,"^$1"),r&&(e=e.replace(t,"^$1")),e}},5187:(e,t,r)=>{"use strict";const n=r(5747),o=r(1470);e.exports=function(e){const t=Buffer.alloc(150);let r;try{r=n.openSync(e,"r"),n.readSync(r,t,0,150,0),n.closeSync(r)}catch(e){}return o(t.toString())}},7447:(e,t,r)=>{"use strict";const n=r(5622),o=r(7945),i=r(7127);function s(e,t){const r=e.options.env||process.env,s=process.cwd(),a=null!=e.options.cwd,c=a&&void 0!==process.chdir&&!process.chdir.disabled;if(c)try{process.chdir(e.options.cwd)}catch(e){}let d;try{d=o.sync(e.command,{path:r[i({env:r})],pathExt:t?n.delimiter:void 0})}catch(e){}finally{c&&process.chdir(s)}return d&&(d=n.resolve(a?e.options.cwd:"",d)),d}e.exports=function(e){return s(e)||s(e,!0)}},5939:(e,t,r)=>{var n=r(7180),o=function(){},i=function(e,t,r){if("function"==typeof t)return i(e,null,t);t||(t={}),r=n(r||o);var s=e._writableState,a=e._readableState,c=t.readable||!1!==t.readable&&e.readable,d=t.writable||!1!==t.writable&&e.writable,u=!1,l=function(){e.writable||p()},p=function(){d=!1,c||r.call(e)},f=function(){c=!1,d||r.call(e)},m=function(t){r.call(e,t?new Error("exited with error code: "+t):null)},h=function(t){r.call(e,t)},g=function(){process.nextTick(y)},y=function(){if(!u)return(!c||a&&a.ended&&!a.destroyed)&&(!d||s&&s.ended&&!s.destroyed)?void 0:r.call(e,new Error("premature close"))},x=function(){e.req.on("finish",p)};return!function(e){return e.setHeader&&"function"==typeof e.abort}(e)?d&&!s&&(e.on("end",l),e.on("close",l)):(e.on("complete",p),e.on("abort",g),e.req?x():e.on("request",x)),function(e){return e.stdio&&Array.isArray(e.stdio)&&3===e.stdio.length}(e)&&e.on("exit",m),e.on("end",f),e.on("finish",p),!1!==t.error&&e.on("error",h),e.on("close",g),function(){u=!0,e.removeListener("complete",p),e.removeListener("abort",g),e.removeListener("request",x),e.req&&e.req.removeListener("finish",p),e.removeListener("end",l),e.removeListener("close",l),e.removeListener("finish",p),e.removeListener("exit",m),e.removeListener("end",f),e.removeListener("error",h),e.removeListener("close",g)}};e.exports=i},1115:(e,t,r)=>{"use strict";const n=r(5622),o=r(3129),i=r(7566),s=r(3097),a=r(5847),c=r(8385),d=r(9072),u=r(8379),{spawnedKill:l,spawnedCancel:p,setupTimeout:f,setExitHandler:m}=r(6350),{handleInput:h,getSpawnedResult:g,makeAllStream:y,validateInputSync:x}=r(4142),{mergePromise:v,getSpawnedPromise:b}=r(959),{joinCommand:w,parseCommand:S}=r(3234),E=(e,t,r={})=>{const o=i._parse(e,t,r);return e=o.command,t=o.args,(r={maxBuffer:1e8,buffer:!0,stripFinalNewline:!0,extendEnv:!0,preferLocal:!1,localDir:(r=o.options).cwd||process.cwd(),execPath:process.execPath,encoding:"utf8",reject:!0,cleanup:!0,all:!1,windowsHide:!0,...r}).env=(({env:e,extendEnv:t,preferLocal:r,localDir:n,execPath:o})=>{const i=t?{...process.env,...e}:e;return r?a.env({env:i,cwd:n,execPath:o}):i})(r),r.stdio=u(r),"win32"===process.platform&&"cmd"===n.basename(e,".exe")&&t.unshift("/q"),{file:e,args:t,options:r,parsed:o}},I=(e,t,r)=>"string"==typeof t||Buffer.isBuffer(t)?e.stripFinalNewline?s(t):t:void 0===r?void 0:"",T=(e,t,r)=>{const n=E(e,t,r),s=w(e,t);let a;try{a=o.spawn(n.file,n.args,n.options)}catch(e){const t=new o.ChildProcess,r=Promise.reject(d({error:e,stdout:"",stderr:"",all:"",command:s,parsed:n,timedOut:!1,isCanceled:!1,killed:!1}));return v(t,r)}const u=b(a),x=f(a,n.options,u),S=m(a,n.options,x),T={isCanceled:!1};a.kill=l.bind(null,a.kill.bind(a)),a.cancel=p.bind(null,a,T);const C=c(async()=>{const[{error:e,exitCode:t,signal:r,timedOut:o},i,c,u]=await g(a,n.options,S),l=I(n.options,i),p=I(n.options,c),f=I(n.options,u);if(e||0!==t||null!==r){const i=d({error:e,exitCode:t,signal:r,stdout:l,stderr:p,all:f,command:s,parsed:n,timedOut:o,isCanceled:T.isCanceled,killed:a.killed});if(!n.options.reject)return i;throw i}return{command:s,exitCode:0,stdout:l,stderr:p,all:f,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}});return i._enoent.hookChildProcess(a,n.parsed),h(a,n.options.input),a.all=y(a,n.options),v(a,C)};e.exports=T,e.exports.sync=(e,t,r)=>{const n=E(e,t,r),i=w(e,t);let s;x(n.options);try{s=o.spawnSync(n.file,n.args,n.options)}catch(e){throw d({error:e,stdout:"",stderr:"",all:"",command:i,parsed:n,timedOut:!1,isCanceled:!1,killed:!1})}const a=I(n.options,s.stdout,s.error),c=I(n.options,s.stderr,s.error);if(s.error||0!==s.status||null!==s.signal){const e=d({stdout:a,stderr:c,error:s.error,signal:s.signal,exitCode:s.status,command:i,parsed:n,timedOut:s.error&&"ETIMEDOUT"===s.error.code,isCanceled:!1,killed:null!==s.signal});if(!n.options.reject)return e;throw e}return{command:i,exitCode:0,stdout:a,stderr:c,failed:!1,timedOut:!1,isCanceled:!1,killed:!1}},e.exports.command=(e,t)=>{const[r,...n]=S(e);return T(r,n,t)},e.exports.commandSync=(e,t)=>{const[r,...n]=S(e);return T.sync(r,n,t)},e.exports.node=(e,t,r={})=>{t&&!Array.isArray(t)&&"object"==typeof t&&(r=t,t=[]);const n=u.node(r),{nodePath:o=process.execPath,nodeOptions:i=process.execArgv}=r;return T(o,[...i,e,...Array.isArray(t)?t:[]],{...r,stdin:void 0,stdout:void 0,stderr:void 0,stdio:n,shell:!1})}},3234:e=>{"use strict";const t=/ +/g,r=(e,t,r)=>{if(0===r)return[t];const n=e[e.length-1];return n.endsWith("\\")?[...e.slice(0,-1),`${n.slice(0,-1)} ${t}`]:[...e,t]};e.exports={joinCommand:(e,t=[])=>Array.isArray(t)?[e,...t].join(" "):e,parseCommand:e=>e.trim().split(t).reduce(r,[])}},9072:(e,t,r)=>{"use strict";const{signalsByName:n}=r(4552);e.exports=({stdout:e,stderr:t,all:r,error:o,signal:i,exitCode:s,command:a,timedOut:c,isCanceled:d,killed:u,parsed:{options:{timeout:l}}})=>{s=null===s?void 0:s;const p=void 0===(i=null===i?void 0:i)?void 0:n[i].description,f=`Command ${(({timedOut:e,timeout:t,errorCode:r,signal:n,signalDescription:o,exitCode:i,isCanceled:s})=>e?`timed out after ${t} milliseconds`:s?"was canceled":void 0!==r?"failed with "+r:void 0!==n?`was killed with ${n} (${o})`:void 0!==i?"failed with exit code "+i:"failed")({timedOut:c,timeout:l,errorCode:o&&o.code,signal:i,signalDescription:p,exitCode:s,isCanceled:d})}: ${a}`,m="[object Error]"===Object.prototype.toString.call(o),h=m?`${f}\n${o.message}`:f,g=[h,t,e].filter(Boolean).join("\n");return m?(o.originalMessage=o.message,o.message=g):o=new Error(g),o.shortMessage=h,o.command=a,o.exitCode=s,o.signal=i,o.signalDescription=p,o.stdout=e,o.stderr=t,void 0!==r&&(o.all=r),"bufferedData"in o&&delete o.bufferedData,o.failed=!0,o.timedOut=Boolean(c),o.isCanceled=d,o.killed=u&&!c,o}},6350:(e,t,r)=>{"use strict";const n=r(2087),o=r(4168),i=(e,t,r,n)=>{if(!s(t,r,n))return;const o=c(r),i=setTimeout(()=>{e("SIGKILL")},o);i.unref&&i.unref()},s=(e,{forceKillAfterTimeout:t},r)=>a(e)&&!1!==t&&r,a=e=>e===n.constants.signals.SIGTERM||"string"==typeof e&&"SIGTERM"===e.toUpperCase(),c=({forceKillAfterTimeout:e=!0})=>{if(!0===e)return 5e3;if(!Number.isFinite(e)||e<0)throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${e}\` (${typeof e})`);return e};e.exports={spawnedKill:(e,t="SIGTERM",r={})=>{const n=e(t);return i(e,t,r,n),n},spawnedCancel:(e,t)=>{e.kill()&&(t.isCanceled=!0)},setupTimeout:(e,{timeout:t,killSignal:r="SIGTERM"},n)=>{if(0===t||void 0===t)return n;if(!Number.isFinite(t)||t<0)throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${t}\` (${typeof t})`);let o;const i=new Promise((n,i)=>{o=setTimeout(()=>{((e,t,r)=>{e.kill(t),r(Object.assign(new Error("Timed out"),{timedOut:!0,signal:t}))})(e,r,i)},t)}),s=n.finally(()=>{clearTimeout(o)});return Promise.race([i,s])},setExitHandler:async(e,{cleanup:t,detached:r},n)=>{if(!t||r)return n;const i=o(()=>{e.kill()});return n.finally(()=>{i()})}}},959:e=>{"use strict";const t=(async()=>{})().constructor.prototype,r=["then","catch","finally"].map(e=>[e,Reflect.getOwnPropertyDescriptor(t,e)]);e.exports={mergePromise:(e,t)=>{for(const[n,o]of r){const r="function"==typeof t?(...e)=>Reflect.apply(o.value,t(),e):o.value.bind(t);Reflect.defineProperty(e,n,{...o,value:r})}return e},getSpawnedPromise:e=>new Promise((t,r)=>{e.on("exit",(e,r)=>{t({exitCode:e,signal:r})}),e.on("error",e=>{r(e)}),e.stdin&&e.stdin.on("error",e=>{r(e)})})}},8379:e=>{"use strict";const t=["stdin","stdout","stderr"],r=e=>{if(!e)return;const{stdio:r}=e;if(void 0===r)return t.map(t=>e[t]);if((e=>t.some(t=>void 0!==e[t]))(e))throw new Error("It's not possible to provide `stdio` in combination with one of "+t.map(e=>`\`${e}\``).join(", "));if("string"==typeof r)return r;if(!Array.isArray(r))throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof r}\``);const n=Math.max(r.length,t.length);return Array.from({length:n},(e,t)=>r[t])};e.exports=r,e.exports.node=e=>{const t=r(e);return"ipc"===t?"ipc":void 0===t||"string"==typeof t?[t,t,t,"ipc"]:t.includes("ipc")?t:[...t,"ipc"]}},4142:(e,t,r)=>{"use strict";const n=r(1200),o=r(8764),i=r(446),s=async(e,t)=>{if(e){e.destroy();try{return await t}catch(e){return e.bufferedData}}},a=(e,{encoding:t,buffer:r,maxBuffer:n})=>{if(e&&r)return t?o(e,{encoding:t,maxBuffer:n}):o.buffer(e,{maxBuffer:n})};e.exports={handleInput:(e,t)=>{void 0!==t&&void 0!==e.stdin&&(n(t)?t.pipe(e.stdin):e.stdin.end(t))},makeAllStream:(e,{all:t})=>{if(!t||!e.stdout&&!e.stderr)return;const r=i();return e.stdout&&r.add(e.stdout),e.stderr&&r.add(e.stderr),r},getSpawnedResult:async({stdout:e,stderr:t,all:r},{encoding:n,buffer:o,maxBuffer:i},c)=>{const d=a(e,{encoding:n,buffer:o,maxBuffer:i}),u=a(t,{encoding:n,buffer:o,maxBuffer:i}),l=a(r,{encoding:n,buffer:o,maxBuffer:2*i});try{return await Promise.all([c,d,u,l])}catch(n){return Promise.all([{error:n,signal:n.signal,timedOut:n.timedOut},s(e,d),s(t,u),s(r,l)])}},validateInputSync:({input:e})=>{if(n(e))throw new TypeError("The `input` option cannot be a stream in sync mode")}}},2137:(e,t,r)=>{"use strict";const{PassThrough:n}=r(2413);e.exports=e=>{e={...e};const{array:t}=e;let{encoding:r}=e;const o="buffer"===r;let i=!1;t?i=!(r||o):r=r||"utf8",o&&(r=null);const s=new n({objectMode:i});r&&s.setEncoding(r);let a=0;const c=[];return s.on("data",e=>{c.push(e),i?a=c.length:a+=e.length}),s.getBufferedValue=()=>t?c:o?Buffer.concat(c,a):c.join(""),s.getBufferedLength=()=>a,s}},8764:(e,t,r)=>{"use strict";const n=r(372),o=r(2137);class i extends Error{constructor(){super("maxBuffer exceeded"),this.name="MaxBufferError"}}async function s(e,t){if(!e)return Promise.reject(new Error("Expected a stream"));t={maxBuffer:1/0,...t};const{maxBuffer:r}=t;let s;return await new Promise((a,c)=>{const d=e=>{e&&(e.bufferedData=s.getBufferedValue()),c(e)};s=n(e,o(t),e=>{e?d(e):a()}),s.on("data",()=>{s.getBufferedLength()>r&&d(new i)})}),s.getBufferedValue()}e.exports=s,e.exports.default=s,e.exports.buffer=(e,t)=>s(e,{...t,encoding:"buffer"}),e.exports.array=(e,t)=>s(e,{...t,array:!0}),e.exports.MaxBufferError=i},8450:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SIGNALS=void 0;t.SIGNALS=[{name:"SIGHUP",number:1,action:"terminate",description:"Terminal closed",standard:"posix"},{name:"SIGINT",number:2,action:"terminate",description:"User interruption with CTRL-C",standard:"ansi"},{name:"SIGQUIT",number:3,action:"core",description:"User interruption with CTRL-\\",standard:"posix"},{name:"SIGILL",number:4,action:"core",description:"Invalid machine instruction",standard:"ansi"},{name:"SIGTRAP",number:5,action:"core",description:"Debugger breakpoint",standard:"posix"},{name:"SIGABRT",number:6,action:"core",description:"Aborted",standard:"ansi"},{name:"SIGIOT",number:6,action:"core",description:"Aborted",standard:"bsd"},{name:"SIGBUS",number:7,action:"core",description:"Bus error due to misaligned, non-existing address or paging error",standard:"bsd"},{name:"SIGEMT",number:7,action:"terminate",description:"Command should be emulated but is not implemented",standard:"other"},{name:"SIGFPE",number:8,action:"core",description:"Floating point arithmetic error",standard:"ansi"},{name:"SIGKILL",number:9,action:"terminate",description:"Forced termination",standard:"posix",forced:!0},{name:"SIGUSR1",number:10,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGSEGV",number:11,action:"core",description:"Segmentation fault",standard:"ansi"},{name:"SIGUSR2",number:12,action:"terminate",description:"Application-specific signal",standard:"posix"},{name:"SIGPIPE",number:13,action:"terminate",description:"Broken pipe or socket",standard:"posix"},{name:"SIGALRM",number:14,action:"terminate",description:"Timeout or timer",standard:"posix"},{name:"SIGTERM",number:15,action:"terminate",description:"Termination",standard:"ansi"},{name:"SIGSTKFLT",number:16,action:"terminate",description:"Stack is empty or overflowed",standard:"other"},{name:"SIGCHLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"posix"},{name:"SIGCLD",number:17,action:"ignore",description:"Child process terminated, paused or unpaused",standard:"other"},{name:"SIGCONT",number:18,action:"unpause",description:"Unpaused",standard:"posix",forced:!0},{name:"SIGSTOP",number:19,action:"pause",description:"Paused",standard:"posix",forced:!0},{name:"SIGTSTP",number:20,action:"pause",description:'Paused using CTRL-Z or "suspend"',standard:"posix"},{name:"SIGTTIN",number:21,action:"pause",description:"Background process cannot read terminal input",standard:"posix"},{name:"SIGBREAK",number:21,action:"terminate",description:"User interruption with CTRL-BREAK",standard:"other"},{name:"SIGTTOU",number:22,action:"pause",description:"Background process cannot write to terminal output",standard:"posix"},{name:"SIGURG",number:23,action:"ignore",description:"Socket received out-of-band data",standard:"bsd"},{name:"SIGXCPU",number:24,action:"core",description:"Process timed out",standard:"bsd"},{name:"SIGXFSZ",number:25,action:"core",description:"File too big",standard:"bsd"},{name:"SIGVTALRM",number:26,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGPROF",number:27,action:"terminate",description:"Timeout or timer",standard:"bsd"},{name:"SIGWINCH",number:28,action:"ignore",description:"Terminal window size changed",standard:"bsd"},{name:"SIGIO",number:29,action:"terminate",description:"I/O is available",standard:"other"},{name:"SIGPOLL",number:29,action:"terminate",description:"Watched event",standard:"other"},{name:"SIGINFO",number:29,action:"ignore",description:"Request for process information",standard:"other"},{name:"SIGPWR",number:30,action:"terminate",description:"Device running out of power",standard:"systemv"},{name:"SIGSYS",number:31,action:"core",description:"Invalid system call",standard:"other"},{name:"SIGUNUSED",number:31,action:"terminate",description:"Invalid system call",standard:"other"}]},4552:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.signalsByNumber=t.signalsByName=void 0;var n=r(2087),o=r(6652),i=r(9910);const s=function(e,{name:t,number:r,description:n,supported:o,action:i,forced:s,standard:a}){return{...e,[t]:{name:t,number:r,description:n,supported:o,action:i,forced:s,standard:a}}},a=(0,o.getSignals)().reduce(s,{});t.signalsByName=a;const c=function(e,t){const r=d(e,t);if(void 0===r)return{};const{name:n,description:o,supported:i,action:s,forced:a,standard:c}=r;return{[e]:{name:n,number:e,description:o,supported:i,action:s,forced:a,standard:c}}},d=function(e,t){const r=t.find(({name:t})=>n.constants.signals[t]===e);return void 0!==r?r:t.find(t=>t.number===e)},u=function(){const e=(0,o.getSignals)(),t=i.SIGRTMAX+1,r=Array.from({length:t},(t,r)=>c(r,e));return Object.assign({},...r)}();t.signalsByNumber=u},9910:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SIGRTMAX=t.getRealtimeSignals=void 0;t.getRealtimeSignals=function(){const e=o-n+1;return Array.from({length:e},r)};const r=function(e,t){return{name:"SIGRT"+(t+1),number:n+t,action:"terminate",description:"Application-specific signal (realtime)",standard:"posix"}},n=34,o=64;t.SIGRTMAX=o},6652:(e,t,r)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getSignals=void 0;var n=r(2087),o=r(8450),i=r(9910);t.getSignals=function(){const e=(0,i.getRealtimeSignals)();return[...o.SIGNALS,...e].map(s)};const s=function({name:e,number:t,description:r,action:o,forced:i=!1,standard:s}){const{signals:{[e]:a}}=n.constants,c=void 0!==a;return{name:e,number:c?a:t,description:r,supported:c,action:o,forced:i,standard:s}}},1200:e=>{"use strict";const t=e=>null!==e&&"object"==typeof e&&"function"==typeof e.pipe;t.writable=e=>t(e)&&!1!==e.writable&&"function"==typeof e._write&&"object"==typeof e._writableState,t.readable=e=>t(e)&&!1!==e.readable&&"function"==typeof e._read&&"object"==typeof e._readableState,t.duplex=e=>t.writable(e)&&t.readable(e),t.transform=e=>t.duplex(e)&&"function"==typeof e._transform&&"object"==typeof e._transformState,e.exports=t},4151:(e,t,r)=>{var n;r(5747);function o(e,t,r){if("function"==typeof t&&(r=t,t={}),!r){if("function"!=typeof Promise)throw new TypeError("callback not provided");return new Promise((function(r,n){o(e,t||{},(function(e,t){e?n(e):r(t)}))}))}n(e,t||{},(function(e,n){e&&("EACCES"===e.code||t&&t.ignoreErrors)&&(e=null,n=!1),r(e,n)}))}n="win32"===process.platform||global.TESTING_WINDOWS?r(3202):r(2151),e.exports=o,o.sync=function(e,t){try{return n.sync(e,t||{})}catch(e){if(t&&t.ignoreErrors||"EACCES"===e.code)return!1;throw e}}},2151:(e,t,r)=>{e.exports=o,o.sync=function(e,t){return i(n.statSync(e),t)};var n=r(5747);function o(e,t,r){n.stat(e,(function(e,n){r(e,!e&&i(n,t))}))}function i(e,t){return e.isFile()&&function(e,t){var r=e.mode,n=e.uid,o=e.gid,i=void 0!==t.uid?t.uid:process.getuid&&process.getuid(),s=void 0!==t.gid?t.gid:process.getgid&&process.getgid(),a=parseInt("100",8),c=parseInt("010",8),d=parseInt("001",8),u=a|c;return r&d||r&c&&o===s||r&a&&n===i||r&u&&0===i}(e,t)}},3202:(e,t,r)=>{e.exports=i,i.sync=function(e,t){return o(n.statSync(e),e,t)};var n=r(5747);function o(e,t,r){return!(!e.isSymbolicLink()&&!e.isFile())&&function(e,t){var r=void 0!==t.pathExt?t.pathExt:process.env.PATHEXT;if(!r)return!0;if(-1!==(r=r.split(";")).indexOf(""))return!0;for(var n=0;n<r.length;n++){var o=r[n].toLowerCase();if(o&&e.substr(-o.length).toLowerCase()===o)return!0}return!1}(t,r)}function i(e,t,r){n.stat(e,(function(n,i){r(n,!n&&o(i,e,t))}))}},446:(e,t,r)=>{"use strict";const{PassThrough:n}=r(2413);e.exports=function(){var e=[],t=new n({objectMode:!0});return t.setMaxListeners(0),t.add=r,t.isEmpty=o,t.on("unpipe",i),Array.prototype.slice.call(arguments).forEach(r),t;function r(n){return Array.isArray(n)?(n.forEach(r),this):(e.push(n),n.once("end",i.bind(null,n)),n.once("error",t.emit.bind(t,"error")),n.pipe(t,{end:!1}),this)}function o(){return 0==e.length}function i(r){!(e=e.filter((function(e){return e!==r}))).length&&t.readable&&t.end()}}},1573:e=>{"use strict";const t=(e,t)=>{for(const r of Reflect.ownKeys(t))Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r));return e};e.exports=t,e.exports.default=t},5847:(e,t,r)=>{"use strict";e=r.nmd(e);const n=r(5622),o=r(7127),i=e=>{let t;e={cwd:process.cwd(),path:process.env[o()],execPath:process.execPath,...e};let r=n.resolve(e.cwd);const i=[];for(;t!==r;)i.push(n.join(r,"node_modules/.bin")),t=r,r=n.resolve(r,"..");const s=n.resolve(e.cwd,e.execPath,"..");return i.push(s),i.concat(e.path).join(n.delimiter)};e.exports=i,e.exports.default=i,e.exports.env=t=>{const r={...(t={env:process.env,...t}).env},n=o({env:r});return t.path=r[n],r[n]=e.exports(t),r}},1162:(e,t,r)=>{var n=r(8984);function o(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}e.exports=n(o),o.proto=o((function(){Object.defineProperty(Function.prototype,"once",{value:function(){return o(this)},configurable:!0})}))},7180:(e,t,r)=>{var n=r(8984);function o(e){var t=function(){return t.called?t.value:(t.called=!0,t.value=e.apply(this,arguments))};return t.called=!1,t}function i(e){var t=function(){if(t.called)throw new Error(t.onceError);return t.called=!0,t.value=e.apply(this,arguments)},r=e.name||"Function wrapped with `once`";return t.onceError=r+" shouldn't be called more than once",t.called=!1,t}e.exports=n(o),e.exports.strict=n(i),o.proto=o((function(){Object.defineProperty(Function.prototype,"once",{value:function(){return o(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return i(this)},configurable:!0})}))},8385:(e,t,r)=>{"use strict";const n=r(1573),o=new WeakMap,i=(e,t={})=>{if("function"!=typeof e)throw new TypeError("Expected a function");let r,i=0;const s=e.displayName||e.name||"<anonymous>",a=function(...n){if(o.set(a,++i),1===i)r=e.apply(this,n),e=null;else if(!0===t.throw)throw new Error(`Function \`${s}\` can only be called once`);return r};return n(a,e),o.set(a,i),a};e.exports=i,e.exports.default=i,e.exports.callCount=e=>{if(!o.has(e))throw new Error(`The given function \`${e.name}\` is not wrapped by the \`onetime\` package`);return o.get(e)}},7127:e=>{"use strict";const t=(e={})=>{const t=e.env||process.env;return"win32"!==(e.platform||process.platform)?"PATH":Object.keys(t).reverse().find(e=>"PATH"===e.toUpperCase())||"Path"};e.exports=t,e.exports.default=t},372:(e,t,r)=>{var n=r(1162),o=r(5939),i=r(5747),s=function(){},a=/^v?\.0/.test(process.version),c=function(e){return"function"==typeof e},d=function(e,t,r,d){d=n(d);var u=!1;e.on("close",(function(){u=!0})),o(e,{readable:t,writable:r},(function(e){if(e)return d(e);u=!0,d()}));var l=!1;return function(t){if(!u&&!l)return l=!0,function(e){return!!a&&(!!i&&((e instanceof(i.ReadStream||s)||e instanceof(i.WriteStream||s))&&c(e.close)))}(e)?e.close(s):function(e){return e.setHeader&&c(e.abort)}(e)?e.abort():c(e.destroy)?e.destroy():void d(t||new Error("stream was destroyed"))}},u=function(e){e()},l=function(e,t){return e.pipe(t)};e.exports=function(){var e,t=Array.prototype.slice.call(arguments),r=c(t[t.length-1]||s)&&t.pop()||s;if(Array.isArray(t[0])&&(t=t[0]),t.length<2)throw new Error("pump requires two streams per minimum");var n=t.map((function(o,i){var s=i<t.length-1;return d(o,s,i>0,(function(t){e||(e=t),t&&n.forEach(u),s||(n.forEach(u),r(e))}))}));return t.reduce(l)}},1470:(e,t,r)=>{"use strict";const n=r(7719);e.exports=(e="")=>{const t=e.match(n);if(!t)return null;const[r,o]=t[0].replace(/#! ?/,"").split(" "),i=r.split("/").pop();return"env"===i?o:o?`${i} ${o}`:i}},7719:e=>{"use strict";e.exports=/^#!(.*)/},4168:(e,t,r)=>{var n,o=r(2357),i=r(667),s=/^win/i.test(process.platform),a=r(8614);function c(){l&&(l=!1,i.forEach((function(e){try{process.removeListener(e,u[e])}catch(e){}})),process.emit=h,process.reallyExit=f,n.count-=1)}function d(e,t,r){n.emitted[e]||(n.emitted[e]=!0,n.emit(e,t,r))}"function"!=typeof a&&(a=a.EventEmitter),process.__signal_exit_emitter__?n=process.__signal_exit_emitter__:((n=process.__signal_exit_emitter__=new a).count=0,n.emitted={}),n.infinite||(n.setMaxListeners(1/0),n.infinite=!0),e.exports=function(e,t){o.equal(typeof e,"function","a callback must be provided for exit handler"),!1===l&&p();var r="exit";t&&t.alwaysLast&&(r="afterexit");return n.on(r,e),function(){n.removeListener(r,e),0===n.listeners("exit").length&&0===n.listeners("afterexit").length&&c()}},e.exports.unload=c;var u={};i.forEach((function(e){u[e]=function(){process.listeners(e).length===n.count&&(c(),d("exit",null,e),d("afterexit",null,e),s&&"SIGHUP"===e&&(e="SIGINT"),process.kill(process.pid,e))}})),e.exports.signals=function(){return i},e.exports.load=p;var l=!1;function p(){l||(l=!0,n.count+=1,i=i.filter((function(e){try{return process.on(e,u[e]),!0}catch(e){return!1}})),process.emit=g,process.reallyExit=m)}var f=process.reallyExit;function m(e){process.exitCode=e||0,d("exit",process.exitCode,null),d("afterexit",process.exitCode,null),f.call(process,process.exitCode)}var h=process.emit;function g(e,t){if("exit"===e){void 0!==t&&(process.exitCode=t);var r=h.apply(this,arguments);return d("exit",process.exitCode,null),d("afterexit",process.exitCode,null),r}return h.apply(this,arguments)}},667:e=>{e.exports=["SIGABRT","SIGALRM","SIGHUP","SIGINT","SIGTERM"],"win32"!==process.platform&&e.exports.push("SIGVTALRM","SIGXCPU","SIGXFSZ","SIGUSR2","SIGTRAP","SIGSYS","SIGQUIT","SIGIOT"),"linux"===process.platform&&e.exports.push("SIGIO","SIGPOLL","SIGPWR","SIGSTKFLT","SIGUNUSED")},3097:e=>{"use strict";e.exports=e=>{const t="string"==typeof e?"\n":"\n".charCodeAt(),r="string"==typeof e?"\r":"\r".charCodeAt();return e[e.length-1]===t&&(e=e.slice(0,e.length-1)),e[e.length-1]===r&&(e=e.slice(0,e.length-1)),e}},7945:(e,t,r)=>{const n="win32"===process.platform||"cygwin"===process.env.OSTYPE||"msys"===process.env.OSTYPE,o=r(5622),i=n?";":":",s=r(4151),a=e=>Object.assign(new Error("not found: "+e),{code:"ENOENT"}),c=(e,t)=>{const r=t.colon||i,o=e.match(/\//)||n&&e.match(/\\/)?[""]:[...n?[process.cwd()]:[],...(t.path||process.env.PATH||"").split(r)],s=n?t.pathExt||process.env.PATHEXT||".EXE;.CMD;.BAT;.COM":"",a=n?s.split(r):[""];return n&&-1!==e.indexOf(".")&&""!==a[0]&&a.unshift(""),{pathEnv:o,pathExt:a,pathExtExe:s}},d=(e,t,r)=>{"function"==typeof t&&(r=t,t={}),t||(t={});const{pathEnv:n,pathExt:i,pathExtExe:d}=c(e,t),u=[],l=r=>new Promise((i,s)=>{if(r===n.length)return t.all&&u.length?i(u):s(a(e));const c=n[r],d=/^".*"$/.test(c)?c.slice(1,-1):c,l=o.join(d,e),f=!d&&/^\.[\\\/]/.test(e)?e.slice(0,2)+l:l;i(p(f,r,0))}),p=(e,r,n)=>new Promise((o,a)=>{if(n===i.length)return o(l(r+1));const c=i[n];s(e+c,{pathExt:d},(i,s)=>{if(!i&&s){if(!t.all)return o(e+c);u.push(e+c)}return o(p(e,r,n+1))})});return r?l(0).then(e=>r(null,e),r):l(0)};e.exports=d,d.sync=(e,t)=>{t=t||{};const{pathEnv:r,pathExt:n,pathExtExe:i}=c(e,t),d=[];for(let a=0;a<r.length;a++){const c=r[a],u=/^".*"$/.test(c)?c.slice(1,-1):c,l=o.join(u,e),p=!u&&/^\.[\\\/]/.test(e)?e.slice(0,2)+l:l;for(let e=0;e<n.length;e++){const r=p+n[e];try{if(s.sync(r,{pathExt:i})){if(!t.all)return r;d.push(r)}}catch(e){}}}if(t.all&&d.length)return d;if(t.nothrow)return null;throw a(e)}},8984:e=>{e.exports=function e(t,r){if(t&&r)return e(t)(r);if("function"!=typeof t)throw new TypeError("need wrapper function");return Object.keys(t).forEach((function(e){n[e]=t[e]})),n;function n(){for(var e=new Array(arguments.length),r=0;r<e.length;r++)e[r]=arguments[r];var n=t.apply(this,e),o=e[e.length-1];return"function"==typeof n&&n!==o&&Object.keys(o).forEach((function(e){n[e]=o[e]})),n}}},2594:e=>{"use strict";e.exports=require("@yarnpkg/cli")},966:e=>{"use strict";e.exports=require("@yarnpkg/core")},2357:e=>{"use strict";e.exports=require("assert")},3129:e=>{"use strict";e.exports=require("child_process")},8042:e=>{"use strict";e.exports=require("clipanion")},8614:e=>{"use strict";e.exports=require("events")},5747:e=>{"use strict";e.exports=require("fs")},8605:e=>{"use strict";e.exports=require("http")},2087:e=>{"use strict";e.exports=require("os")},5622:e=>{"use strict";e.exports=require("path")},2413:e=>{"use strict";e.exports=require("stream")},8835:e=>{"use strict";e.exports=require("url")}},t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={id:n,loaded:!1,exports:{}};return e[n](o,o.exports,r),o.loaded=!0,o.exports}return r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),r(6987)})();
return plugin;
}
};