import{S as z,i as F,s as L,e as y,H as G,G as q,C as k,m as S,g as w,p as B,t as O,n as J,q as C,N as R,r as V,ab as W,I as P,K as Q,M as j,E as v,J as D,a0 as X,x as Y,$ as Z,b as H,a as I,h as p,j as x,k as K,y as A}from"./index-607392ea.js";/* empty css                                                  */import{g as $,B as ee}from"./Button-89e1d00d.js";import{B as le}from"./BlockTitle-72acdb19.js";/* empty css                                                    */import"./Info-77176ded.js";function M(l,e,t){const s=l.slice();return s[15]=e[t],s}function te(l){let e;return{c(){e=P(l[3])},m(t,s){w(t,e,s)},p(t,s){s&8&&Q(e,t[3])},d(t){t&&C(e)}}}function U(l){let e,t,s,a,f,u=l[15]+"",n,h,d,b;function m(){return l[12](l[15])}function i(...c){return l[13](l[15],...c)}return{c(){e=q("label"),t=q("input"),a=G(),f=q("span"),n=P(u),h=G(),t.disabled=l[2],t.checked=s=l[0].includes(l[15]),k(t,"type","checkbox"),k(t,"name","test"),k(t,"class","svelte-1qxcj04"),k(f,"class","ml-2 svelte-1qxcj04"),k(e,"style",l[6]),k(e,"class","svelte-1qxcj04"),j(e,"disabled",l[2]),j(e,"selected",l[0].includes(l[15]))},m(c,r){w(c,e,r),v(e,t),v(e,a),v(e,f),v(f,n),v(e,h),d||(b=[D(t,"change",m),D(t,"input",i)],d=!0)},p(c,r){l=c,r&4&&(t.disabled=l[2]),r&3&&s!==(s=l[0].includes(l[15]))&&(t.checked=s),r&2&&u!==(u=l[15]+"")&&Q(n,u),r&64&&k(e,"style",l[6]),r&4&&j(e,"disabled",l[2]),r&3&&j(e,"selected",l[0].includes(l[15]))},d(c){c&&C(e),d=!1,X(b)}}}function se(l){let e,t,s,a;e=new le({props:{show_label:l[5],info:l[4],$$slots:{default:[te]},$$scope:{ctx:l}}});let f=l[1],u=[];for(let n=0;n<f.length;n+=1)u[n]=U(M(l,f,n));return{c(){y(e.$$.fragment),t=G(),s=q("div");for(let n=0;n<u.length;n+=1)u[n].c();k(s,"class","wrap svelte-1qxcj04"),k(s,"data-testid","checkbox-group")},m(n,h){S(e,n,h),w(n,t,h),w(n,s,h);for(let d=0;d<u.length;d+=1)u[d]&&u[d].m(s,null);a=!0},p(n,[h]){const d={};if(h&32&&(d.show_label=n[5]),h&16&&(d.info=n[4]),h&262152&&(d.$$scope={dirty:h,ctx:n}),e.$set(d),h&455){f=n[1];let b;for(b=0;b<f.length;b+=1){const m=M(n,f,b);u[b]?u[b].p(m,h):(u[b]=U(m),u[b].c(),u[b].m(s,null))}for(;b<u.length;b+=1)u[b].d(1);u.length=f.length}},i(n){a||(B(e.$$.fragment,n),a=!0)},o(n){O(e.$$.fragment,n),a=!1},d(n){J(e,n),n&&C(t),n&&C(s),R(u,n)}}}function ne(l,e,t){let s,{value:a=[]}=e,f=a.slice(),{value_is_output:u=!1}=e,{style:n={}}=e,{choices:h}=e,{disabled:d=!1}=e,{label:b}=e,{info:m=void 0}=e,{show_label:i}=e;const c=V(),r=_=>{a.includes(_)?a.splice(a.indexOf(_),1):a.push(_),t(0,a)};function g(){c("change",a),u||c("input")}W(()=>{t(9,u=!1)});const N=_=>r(_),T=(_,E)=>c("select",{index:h.indexOf(_),value:_,selected:E.currentTarget.checked});return l.$$set=_=>{"value"in _&&t(0,a=_.value),"value_is_output"in _&&t(9,u=_.value_is_output),"style"in _&&t(10,n=_.style),"choices"in _&&t(1,h=_.choices),"disabled"in _&&t(2,d=_.disabled),"label"in _&&t(3,b=_.label),"info"in _&&t(4,m=_.info),"show_label"in _&&t(5,i=_.show_label)},l.$$.update=()=>{l.$$.dirty&2049&&JSON.stringify(a)!==JSON.stringify(f)&&(t(11,f=a.slice()),g()),l.$$.dirty&1024&&t(6,{item_container:s}=$(n,["item_container"]),s)},[a,h,d,b,m,i,s,c,r,u,n,f,N,T]}class ie extends z{constructor(e){super(),F(this,e,ne,se,L,{value:0,value_is_output:9,style:10,choices:1,disabled:2,label:3,info:4,show_label:5})}}function ae(l){let e,t,s,a,f,u;const n=[l[11]];let h={};for(let i=0;i<n.length;i+=1)h=Y(h,n[i]);e=new Z({props:h});function d(i){l[12](i)}function b(i){l[13](i)}let m={choices:l[5],label:l[8],info:l[9],style:l[6],show_label:l[10],disabled:l[7]==="static"};return l[0]!==void 0&&(m.value=l[0]),l[1]!==void 0&&(m.value_is_output=l[1]),s=new ie({props:m}),H.push(()=>I(s,"value",d)),H.push(()=>I(s,"value_is_output",b)),s.$on("select",l[14]),s.$on("change",l[15]),s.$on("input",l[16]),{c(){y(e.$$.fragment),t=G(),y(s.$$.fragment)},m(i,c){S(e,i,c),w(i,t,c),S(s,i,c),u=!0},p(i,c){const r=c&2048?p(n,[x(i[11])]):{};e.$set(r);const g={};c&32&&(g.choices=i[5]),c&256&&(g.label=i[8]),c&512&&(g.info=i[9]),c&64&&(g.style=i[6]),c&1024&&(g.show_label=i[10]),c&128&&(g.disabled=i[7]==="static"),!a&&c&1&&(a=!0,g.value=i[0],K(()=>a=!1)),!f&&c&2&&(f=!0,g.value_is_output=i[1],K(()=>f=!1)),s.$set(g)},i(i){u||(B(e.$$.fragment,i),B(s.$$.fragment,i),u=!0)},o(i){O(e.$$.fragment,i),O(s.$$.fragment,i),u=!1},d(i){J(e,i),i&&C(t),J(s,i)}}}function ue(l){let e,t;return e=new ee({props:{visible:l[4],elem_id:l[2],elem_classes:l[3],type:"fieldset",disable:typeof l[6].container=="boolean"&&!l[6].container,$$slots:{default:[ae]},$$scope:{ctx:l}}}),{c(){y(e.$$.fragment)},m(s,a){S(e,s,a),t=!0},p(s,[a]){const f={};a&16&&(f.visible=s[4]),a&4&&(f.elem_id=s[2]),a&8&&(f.elem_classes=s[3]),a&64&&(f.disable=typeof s[6].container=="boolean"&&!s[6].container),a&135139&&(f.$$scope={dirty:a,ctx:s}),e.$set(f)},i(s){t||(B(e.$$.fragment,s),t=!0)},o(s){O(e.$$.fragment,s),t=!1},d(s){J(e,s)}}}function oe(l,e,t){let{elem_id:s=""}=e,{elem_classes:a=[]}=e,{visible:f=!0}=e,{value:u=[]}=e,{value_is_output:n=!1}=e,{choices:h}=e,{style:d={}}=e,{mode:b}=e,{label:m="Checkbox Group"}=e,{info:i=void 0}=e,{show_label:c}=e,{loading_status:r}=e;function g(o){u=o,t(0,u)}function N(o){n=o,t(1,n)}function T(o){A.call(this,l,o)}function _(o){A.call(this,l,o)}function E(o){A.call(this,l,o)}return l.$$set=o=>{"elem_id"in o&&t(2,s=o.elem_id),"elem_classes"in o&&t(3,a=o.elem_classes),"visible"in o&&t(4,f=o.visible),"value"in o&&t(0,u=o.value),"value_is_output"in o&&t(1,n=o.value_is_output),"choices"in o&&t(5,h=o.choices),"style"in o&&t(6,d=o.style),"mode"in o&&t(7,b=o.mode),"label"in o&&t(8,m=o.label),"info"in o&&t(9,i=o.info),"show_label"in o&&t(10,c=o.show_label),"loading_status"in o&&t(11,r=o.loading_status)},[u,n,s,a,f,h,d,b,m,i,c,r,g,N,T,_,E]}class fe extends z{constructor(e){super(),F(this,e,oe,ue,L,{elem_id:2,elem_classes:3,visible:4,value:0,value_is_output:1,choices:5,style:6,mode:7,label:8,info:9,show_label:10,loading_status:11})}}const me=fe,ge=["static","dynamic"],ke=l=>({type:{payload:"Array<string>"},description:{payload:"list of selected choices"},example_data:l.choices.length?[l.choices[0]]:[]});export{me as Component,ke as document,ge as modes};
//# sourceMappingURL=index-f0f0f216.js.map
