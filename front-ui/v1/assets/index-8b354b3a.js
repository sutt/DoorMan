import{S as q,i as S,s as T,G as J,H as K,e as X,C as y,g as U,m as j,J as Q,p as F,t as C,q as E,n as D,r as G,V,X as W,Y,Z,b as L,Q as M,I as N,K as O,T as P,ah as R,y as p}from"./index-607392ea.js";import{a as x}from"./Button-89e1d00d.js";import{b as $}from"./ModifyUpload.svelte_svelte_type_style_lang-ba6baa96.js";/* empty css                                                    */import{X as ee}from"./Blocks-a0ac8a4c.js";function le(i){let e;const t=i[12].default,l=V(t,i,i[14],null);return{c(){l&&l.c()},m(n,_){l&&l.m(n,_),e=!0},p(n,_){l&&l.p&&(!e||_&16384)&&W(l,t,n,n[14],e?Z(t,n[14],_,null):Y(n[14]),null)},i(n){e||(F(l,n),e=!0)},o(n){C(l,n),e=!1},d(n){l&&l.d(n)}}}function te(i){let e,t,l,n,_,c,m,d,r;return c=new x({props:{size:i[4],variant:"secondary",elem_id:i[1],elem_classes:i[2],visible:i[3],style:i[0],$$slots:{default:[le]},$$scope:{ctx:i}}}),c.$on("click",i[8]),{c(){e=J("input"),_=K(),X(c.$$.fragment),y(e,"class","hide svelte-ydeks8"),y(e,"accept",i[7]),y(e,"type","file"),e.multiple=t=i[5]==="multiple"||void 0,y(e,"webkitdirectory",l=i[5]==="directory"||void 0),y(e,"mozdirectory",n=i[5]==="directory"||void 0)},m(a,u){U(a,e,u),i[13](e),U(a,_,u),j(c,a,u),m=!0,d||(r=Q(e,"change",i[9]),d=!0)},p(a,[u]){(!m||u&128)&&y(e,"accept",a[7]),(!m||u&32&&t!==(t=a[5]==="multiple"||void 0))&&(e.multiple=t),(!m||u&32&&l!==(l=a[5]==="directory"||void 0))&&y(e,"webkitdirectory",l),(!m||u&32&&n!==(n=a[5]==="directory"||void 0))&&y(e,"mozdirectory",n);const o={};u&16&&(o.size=a[4]),u&2&&(o.elem_id=a[1]),u&4&&(o.elem_classes=a[2]),u&8&&(o.visible=a[3]),u&1&&(o.style=a[0]),u&16384&&(o.$$scope={dirty:u,ctx:a}),c.$set(o)},i(a){m||(F(c.$$.fragment,a),m=!0)},o(a){C(c.$$.fragment,a),m=!1},d(a){a&&E(e),i[13](null),a&&E(_),D(c,a),d=!1,r()}}}function ie(i,e,t){let{$$slots:l={},$$scope:n}=e,{style:_={}}=e,{elem_id:c=""}=e,{elem_classes:m=[]}=e,{visible:d=!0}=e,{size:r=_.size||"lg"}=e,{file_count:a}=e,{file_types:u=["file"]}=e,{include_file_metadata:o=!0}=e,h;const v=G();let z;u==null?z=null:(u=u.map(f=>f.startsWith(".")?f:f+"/*"),z=u.join(", "));const s=()=>{h.click()},B=f=>{let k=Array.from(f);if(f.length){a==="single"&&(k=[f[0]]);var w=[];k.forEach((A,H)=>{w[H]=o?{name:A.name,size:A.size,data:"",blob:A}:A,w.filter(I=>I!==void 0).length===f.length&&v("load",a=="single"?w[0]:w)})}},g=f=>{const k=f.target;k.files&&B(k.files)};function b(f){L[f?"unshift":"push"](()=>{h=f,t(6,h)})}return i.$$set=f=>{"style"in f&&t(0,_=f.style),"elem_id"in f&&t(1,c=f.elem_id),"elem_classes"in f&&t(2,m=f.elem_classes),"visible"in f&&t(3,d=f.visible),"size"in f&&t(4,r=f.size),"file_count"in f&&t(5,a=f.file_count),"file_types"in f&&t(10,u=f.file_types),"include_file_metadata"in f&&t(11,o=f.include_file_metadata),"$$scope"in f&&t(14,n=f.$$scope)},[_,c,m,d,r,a,h,z,s,g,u,o,l,b,n]}class ne extends q{constructor(e){super(),S(this,e,ie,te,T,{style:0,elem_id:1,elem_classes:2,visible:3,size:4,file_count:5,file_types:10,include_file_metadata:11})}}function se(i){let e=i[7](i[4])+"",t;return{c(){t=N(e)},m(l,n){U(l,t,n)},p(l,n){n&144&&e!==(e=l[7](l[4])+"")&&O(t,e)},d(l){l&&E(t)}}}function fe(i){let e,t;return e=new ne({props:{elem_id:i[1],elem_classes:i[2],style:i[0],visible:i[3],file_count:i[5],file_types:i[6],$$slots:{default:[se]},$$scope:{ctx:i}}}),e.$on("click",i[11]),e.$on("load",i[8]),{c(){X(e.$$.fragment)},m(l,n){j(e,l,n),t=!0},p(l,[n]){const _={};n&2&&(_.elem_id=l[1]),n&4&&(_.elem_classes=l[2]),n&1&&(_.style=l[0]),n&8&&(_.visible=l[3]),n&32&&(_.file_count=l[5]),n&64&&(_.file_types=l[6]),n&8336&&(_.$$scope={dirty:n,ctx:l}),e.$set(_)},i(l){t||(F(e.$$.fragment,l),t=!0)},o(l){C(e.$$.fragment,l),t=!1},d(l){D(e,l)}}}function ae(i,e,t){let l;M(i,ee,s=>t(7,l=s));let{style:n={}}=e,{elem_id:_=""}=e,{elem_classes:c=[]}=e,{visible:m=!0}=e,{label:d}=e,{value:r}=e,{file_count:a}=e,{file_types:u=["file"]}=e,{root:o}=e;async function h({detail:s}){t(9,r=s),await P();let B=(Array.isArray(s)?s:[s]).map(g=>g.blob);R(o,B).then(async g=>{g.error?(Array.isArray(s)?s:[s]).forEach(async(b,f)=>{b.data=await $(b.blob)}):(Array.isArray(s)?s:[s]).forEach((b,f)=>{g.files&&(b.orig_name=b.name,b.name=g.files[f],b.is_file=!0)}),v("change",r),v("upload",s)})}const v=G();function z(s){p.call(this,i,s)}return i.$$set=s=>{"style"in s&&t(0,n=s.style),"elem_id"in s&&t(1,_=s.elem_id),"elem_classes"in s&&t(2,c=s.elem_classes),"visible"in s&&t(3,m=s.visible),"label"in s&&t(4,d=s.label),"value"in s&&t(9,r=s.value),"file_count"in s&&t(5,a=s.file_count),"file_types"in s&&t(6,u=s.file_types),"root"in s&&t(10,o=s.root)},[n,_,c,m,d,a,u,l,h,r,o,z]}class ue extends q{constructor(e){super(),S(this,e,ae,fe,T,{style:0,elem_id:1,elem_classes:2,visible:3,label:4,value:9,file_count:5,file_types:6,root:10})}}const de=ue,be=["static"];export{de as Component,be as modes};
//# sourceMappingURL=index-8b354b3a.js.map
