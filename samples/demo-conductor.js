// generated by composer v0.4.0

const composition = {
    "type": "if",
    "test": {
        "type": "action",
        "name": "/_/authenticate"
    },
    "consequent": {
        "type": "action",
        "name": "/_/success"
    },
    "alternate": {
        "type": "action",
        "name": "/_/failure"
    }
}

// do not edit below this point

const main=function({Compiler:e}){const t=new e;function n(e,t){return e.slice(-1)[0].next=1,e.push(...t),e}function s(e){
return 0===e.length?[{type:"empty"}]:e.map(r).reduce(n)}function r(e){const t=e.path;switch(e.type){case"sequence":return n([{
type:"pass",path:t}],s(e.components));case"action":return[{type:"action",name:e.name,path:t}];case"function":return[{
type:"function",exec:e.function.exec,path:t}];case"finally":var o=r(e.body);const u=r(e.finalizer);return(c=[[{type:"try",
path:t}],o,[{type:"exit"}],u].reduce(n))[0].catch=c.length-u.length,c;case"let":o=s(e.components);return[[{type:"let",
let:e.declarations,path:t}],o,[{type:"exit"}]].reduce(n);case"mask":return[[{type:"let",let:null,path:t}],o=s(e.components),[{
type:"exit"}]].reduce(n);case"try":o=r(e.body);const p=n(r(e.handler),[{type:"pass"}]);return(c=[[{type:"try",path:t}],o,[{
type:"exit"}]].reduce(n))[0].catch=c.length,c.slice(-1)[0].next=p.length,c.push(...p),c;case"if_nosave":
var a=r(e.consequent),i=n(r(e.alternate),[{type:"pass"}]),c=[[{type:"pass",path:t}],r(e.test),[{type:"choice",then:1,
else:a.length+1}]].reduce(n);return a.slice(-1)[0].next=i.length,c.push(...a),c.push(...i),c;case"while_nosave":a=r(e.body),
i=[{type:"pass"}],c=[[{type:"pass",path:t}],r(e.test),[{type:"choice",then:1,else:a.length+1}]].reduce(n)
;return a.slice(-1)[0].next=1-c.length-a.length,c.push(...a),c.push(...i),c;case"dowhile_nosave":var l=r(e.test);(c=[[{
type:"pass",path:t}],r(e.body),l,[{type:"choice",then:1,else:2}]].reduce(n)).slice(-1)[0].then=1-c.length,c.slice(-1)[0].else=1
;i=[{type:"pass"}];return c.push(...i),c}}this.require=require
;const o=r(t.lower(t.label(t.deserialize(composition)))),a=e=>"object"==typeof e&&null!==e&&!Array.isArray(e),i=e=>Promise.reject({
code:400,error:e}),c=e=>Promise.reject((e=>({code:"number"==typeof e.code&&e.code||500,
error:"string"==typeof e.error&&e.error||e.message||"string"==typeof e&&e||"An internal error occurred"}))(e))
;return e=>Promise.resolve().then(()=>(function(e){let t=0,n=[];if(void 0!==e.$resume){
if(!a(e.$resume))return i("The type of optional $resume parameter must be object");if(t=e.$resume.state,n=e.$resume.stack,
void 0!==t&&"number"!=typeof t)return i("The type of optional $resume.state parameter must be number")
;if(!Array.isArray(n))return i("The type of $resume.stack must be an array");delete e.$resume,s()}function s(){if(a(e)||(e={
value:e}),void 0!==e.error)for(e={error:e.error},t=void 0;n.length>0&&"number"!=typeof(t=n.shift().catch););}function r(t){
const s=[];let r=0;for(let e of n)null===e.let?r++:void 0!==e.let&&(0===r?s.push(e):r--);function o(e,t){
const n=s.find(t=>void 0!==t.let&&void 0!==t.let[e]);void 0!==n&&(n.let[e]=JSON.parse(JSON.stringify(t)))}
const a=s.reduceRight((e,t)=>"object"==typeof t.let?Object.assign(e,t.let):e,{});let i="(function(){try{"
;for(const e in a)i+=`var ${e}=arguments[1]['${e}'];`;i+=`return eval((${t}))(arguments[0])}finally{`
;for(const e in a)i+=`arguments[1]['${e}']=${e};`;i+="}})";try{return(0,eval)(i)(e,a)}finally{for(const e in a)o(e,a[e])}}
for(;;){if(void 0===t)return console.log("Entering final state"),console.log(JSON.stringify(e)),e.error?e:{params:e}
;const a=o[t];void 0!==a.path&&console.log(`Entering composition${a.path}`);const i=t;switch(t=void 0===a.next?void 0:i+a.next,
a.type){case"choice":t=i+(e.value?a.then:a.else);break;case"try":n.unshift({catch:i+a.catch});break;case"let":n.unshift({
let:JSON.parse(JSON.stringify(a.let))});break;case"exit":
if(0===n.length)return c(`State ${i} attempted to pop from an empty stack`);n.shift();break;case"action":return{action:a.name,
params:e,state:{$resume:{state:t,stack:n}}};case"function":let o;try{o=r(a.exec.code)}catch(e){console.error(e),o={
error:`An exception was caught at state ${i} (see log for details)`}}"function"==typeof o&&(o={
error:`State ${i} evaluated to a function`}),e=JSON.parse(JSON.stringify(void 0===o?e:o)),s();break;case"empty":s();break
;case"pass":break;default:return c(`State ${i} has an unknown type`)}}})(e)).catch(c)}(function(){
const e=require("util"),t=require("semver"),n={empty:{since:"0.4.0"},seq:{components:!0,since:"0.4.0"},sequence:{components:!0,
since:"0.4.0"},if:{args:[{_:"test"},{_:"consequent"},{_:"alternate",optional:!0}],since:"0.4.0"},if_nosave:{args:[{_:"test"},{
_:"consequent"},{_:"alternate",optional:!0}],since:"0.4.0"},while:{args:[{_:"test"},{_:"body"}],since:"0.4.0"},while_nosave:{
args:[{_:"test"},{_:"body"}],since:"0.4.0"},dowhile:{args:[{_:"body"},{_:"test"}],since:"0.4.0"},dowhile_nosave:{args:[{
_:"body"},{_:"test"}],since:"0.4.0"},try:{args:[{_:"body"},{_:"handler"}],since:"0.4.0"},finally:{args:[{_:"body"},{
_:"finalizer"}],since:"0.4.0"},retain:{components:!0,since:"0.4.0"},retain_catch:{components:!0,since:"0.4.0"},let:{args:[{
_:"declarations",type:"object"}],components:!0,since:"0.4.0"},mask:{components:!0,since:"0.4.0"},action:{args:[{_:"name",
type:"string"},{_:"action",type:"object",optional:!0}],since:"0.4.0"},composition:{args:[{_:"name",type:"string"},{
_:"composition"}],since:"0.4.0"},repeat:{args:[{_:"count",type:"number"}],components:!0,since:"0.4.0"},retry:{args:[{_:"count",
type:"number"}],components:!0,since:"0.4.0"},value:{args:[{_:"value",type:"value"}],since:"0.4.0"},literal:{args:[{_:"value",
type:"value"}],since:"0.4.0"},function:{args:[{_:"function",type:"object"}],since:"0.4.0"}};class s extends Error{
constructor(t,n){super(t+(void 0!==n?"\nArgument: "+e.inspect(n):""))}}class Composition{static[Symbol.hasInstance](e){
return e.constructor&&e.constructor.name===Composition.name}constructor(e){return Object.assign(this,e)}visit(e){
const t=n[this.type];t.components&&(this.components=this.components.map(e))
;for(let n of t.args||[])void 0===n.type&&(this[n._]=e(this[n._],n._))}}class r{task(e){
if(arguments.length>1)throw new s("Too many arguments");if(null===e)return this.empty();if(e instanceof Composition)return e
;if("function"==typeof e)return this.function(e);if("string"==typeof e)return this.action(e);throw new s("Invalid argument",e)}
function(e){if(arguments.length>1)throw new s("Too many arguments")
;if("function"==typeof e&&-1!==(e=`${e}`).indexOf("[native code]"))throw new s("Cannot capture native function",e)
;if("string"==typeof e&&(e={kind:"nodejs:default",code:e}),"object"!=typeof e||null===e)throw new s("Invalid argument",e)
;return new Composition({type:"function",function:{exec:e}})}_empty(){return this.sequence()}_seq(e){
return this.sequence(...e.components)}_value(e){return this._literal(e)}_literal(e){return this.let({value:e.value},()=>value)}
_retain(e){return this.let({params:null},e=>{params=e},this.mask(...e.components),e=>({params:params,result:e}))}
_retain_catch(e){return this.seq(this.retain(this.finally(this.seq(...e.components),e=>({result:e}))),({params:e,result:t})=>({
params:e,result:t.result}))}_if(e){return this.let({params:null},e=>{params=e
},this.if_nosave(this.mask(e.test),this.seq(()=>params,this.mask(e.consequent)),this.seq(()=>params,this.mask(e.alternate))))}
_while(e){return this.let({params:null},e=>{params=e
},this.while_nosave(this.mask(e.test),this.seq(()=>params,this.mask(e.body),e=>{params=e})),()=>params)}_dowhile(e){
return this.let({params:null},e=>{params=e},this.dowhile_nosave(this.seq(()=>params,this.mask(e.body),e=>{params=e
}),this.mask(e.test)),()=>params)}_repeat(e){return this.let({count:e.count
},this.while(()=>count-- >0,this.mask(this.seq(...e.components))))}_retry(e){return this.let({count:e.count},e=>({params:e
}),this.dowhile(this.finally(({params:e})=>e,this.mask(this.retain_catch(...e.components))),({result:e})=>void 0!==e.error&&count-- >0),({result:e})=>e)
}static init(){for(let e in n){const t=n[e];r.prototype[e]=r.prototype[e]||function(){const n=new Composition({type:e
}),r=t.args&&t.args.length||0;if(!t.components&&arguments.length>r)throw new s("Too many arguments");for(let e=0;e<r;++e){
const r=t.args[e],o=r.optional?arguments[e]||null:arguments[e];switch(r.type){case void 0:n[r._]=this.task(o);continue
;case"value":if("function"==typeof o)throw new s("Invalid argument",o);n[r._]=void 0===o?{}:o;continue;case"object":
if(null===o||Array.isArray(o))throw new s("Invalid argument",o);default:if(typeof o!==r.type)throw new s("Invalid argument",o)
;n[r._]=o}}return t.components&&(n.components=Array.prototype.slice.call(arguments,r).map(e=>this.task(e))),n}}}
get combinators(){return n}deserialize(e){if(arguments.length>1)throw new s("Too many arguments")
;return(e=new Composition(e)).visit(e=>this.deserialize(e)),e}label(e){if(arguments.length>1)throw new s("Too many arguments")
;if(!(e instanceof Composition))throw new s("Invalid argument",e)
;const t=e=>(n,s,r)=>((n=new Composition(n)).path=e+(void 0!==s?void 0===r?`.${s}`:`[${s}]`:""),n.visit(t(n.path)),n)
;return t("")(e)}lower(e,n=[]){if(arguments.length>2)throw new s("Too many arguments")
;if(!(e instanceof Composition))throw new s("Invalid argument",e)
;if(!Array.isArray(n)&&"boolean"!=typeof n&&"string"!=typeof n)throw new s("Invalid argument",n);if(!1===n)return e
;!0!==n&&""!==n||(n=[]),"string"==typeof n&&(n=Object.keys(this.combinators).filter(e=>t.gte(n,this.combinators[e].since)))
;const r=e=>{for(e=new Composition(e);n.indexOf(e.type)<0&&this[`_${e.type}`];){const t=e.path;e=this[`_${e.type}`](e),
void 0!==t&&(e.path=t)}return e.visit(r),e};return r(e)}}return r.init(),{ComposerError:s,Composition:Composition,Compiler:r}
}());
