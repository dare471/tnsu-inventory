import{O as Q,k as I,bA as A,b_ as M,bE as O,a9 as U,v as W,x as b,ab as C,z as m,E as f,av as P,aw as Y,C as T,d as B,H as c,aR as N,bZ as ee,F as oe,G as re,ay as ne,I as k,J as R,a1 as te,K as L,r as se,a2 as ie,as as le,ar as ae,aq as ce,at as de,a_ as ue,Q as p,aC as fe}from"./mechanization.js";function Be(e,o){return Q(e,r=>{r!==void 0&&(o.value=r)}),I(()=>e.value===void 0?o.value:e.value)}const he=/^(\d|\.)+$/,H=/(\d|\.)+/;function ge(e,{c:o=1,offset:r=0,attachPx:t=!0}={}){if(typeof e=="number"){const n=(e+r)*o;return n===0?"0":`${n}px`}else if(typeof e=="string")if(he.test(e)){const n=(Number(e)+r)*o;return t?n===0?"0":`${n}px`:`${n}`}else{const n=H.exec(e);return n?e.replace(H,String((Number(n[0])+r)*o)):e}return e}var pe=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,ve=/^\w*$/;function be(e,o){if(A(e))return!1;var r=typeof e;return r=="number"||r=="symbol"||r=="boolean"||e==null||M(e)?!0:ve.test(e)||!pe.test(e)||o!=null&&e in Object(o)}var Ce="Expected a function";function _(e,o){if(typeof e!="function"||o!=null&&typeof o!="function")throw new TypeError(Ce);var r=function(){var t=arguments,n=o?o.apply(this,t):t[0],s=r.cache;if(s.has(n))return s.get(n);var l=e.apply(this,t);return r.cache=s.set(n,l)||s,l};return r.cache=new(_.Cache||O),r}_.Cache=O;var me=500;function xe(e){var o=_(e,function(t){return r.size===me&&r.clear(),t}),r=o.cache;return o}var ye=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,Ie=/\\(\\)?/g,ze=xe(function(e){var o=[];return e.charCodeAt(0)===46&&o.push(""),e.replace(ye,function(r,t,n,s){o.push(n?s.replace(Ie,"$1"):t||r)}),o});function $e(e,o){return A(e)?e:be(e,o)?[e]:ze(U(e))}function Se(e){if(typeof e=="string"||M(e))return e;var o=e+"";return o=="0"&&1/e==-1/0?"-0":o}function Pe(e,o){o=$e(o,e);for(var r=0,t=o.length;e!=null&&r<t;)e=e[Se(o[r++])];return r&&r==t?e:void 0}function Ne(e,o,r){var t=e==null?void 0:Pe(e,o);return t===void 0?r:t}const Re={iconMargin:"11px 8px 0 12px",iconMarginRtl:"11px 12px 0 8px",iconSize:"24px",closeIconSize:"16px",closeSize:"20px",closeMargin:"13px 14px 0 0",closeMarginRtl:"13px 0 0 14px",padding:"13px"};function Ee(e){const{lineHeight:o,borderRadius:r,fontWeightStrong:t,baseColor:n,dividerColor:s,actionColor:l,textColor1:u,textColor2:a,closeColorHover:h,closeColorPressed:v,closeIconColor:x,closeIconColorHover:y,closeIconColorPressed:d,infoColor:i,successColor:z,warningColor:$,errorColor:S,fontSize:E}=e;return Object.assign(Object.assign({},Re),{fontSize:E,lineHeight:o,titleFontWeight:t,borderRadius:r,border:`1px solid ${s}`,color:l,titleTextColor:u,iconColor:a,contentTextColor:a,closeBorderRadius:r,closeColorHover:h,closeColorPressed:v,closeIconColor:x,closeIconColorHover:y,closeIconColorPressed:d,borderInfo:`1px solid ${b(n,C(i,{alpha:.25}))}`,colorInfo:b(n,C(i,{alpha:.08})),titleTextColorInfo:u,iconColorInfo:i,contentTextColorInfo:a,closeColorHoverInfo:h,closeColorPressedInfo:v,closeIconColorInfo:x,closeIconColorHoverInfo:y,closeIconColorPressedInfo:d,borderSuccess:`1px solid ${b(n,C(z,{alpha:.25}))}`,colorSuccess:b(n,C(z,{alpha:.08})),titleTextColorSuccess:u,iconColorSuccess:z,contentTextColorSuccess:a,closeColorHoverSuccess:h,closeColorPressedSuccess:v,closeIconColorSuccess:x,closeIconColorHoverSuccess:y,closeIconColorPressedSuccess:d,borderWarning:`1px solid ${b(n,C($,{alpha:.33}))}`,colorWarning:b(n,C($,{alpha:.08})),titleTextColorWarning:u,iconColorWarning:$,contentTextColorWarning:a,closeColorHoverWarning:h,closeColorPressedWarning:v,closeIconColorWarning:x,closeIconColorHoverWarning:y,closeIconColorPressedWarning:d,borderError:`1px solid ${b(n,C(S,{alpha:.25}))}`,colorError:b(n,C(S,{alpha:.08})),titleTextColorError:u,iconColorError:S,contentTextColorError:a,closeColorHoverError:h,closeColorPressedError:v,closeIconColorError:x,closeIconColorHoverError:y,closeIconColorPressedError:d})}const Te={common:W,self:Ee},_e=m("alert",`
 line-height: var(--n-line-height);
 border-radius: var(--n-border-radius);
 position: relative;
 transition: background-color .3s var(--n-bezier);
 background-color: var(--n-color);
 text-align: start;
 word-break: break-word;
`,[f("border",`
 border-radius: inherit;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 transition: border-color .3s var(--n-bezier);
 border: var(--n-border);
 pointer-events: none;
 `),P("closable",[m("alert-body",[f("title",`
 padding-right: 24px;
 `)])]),f("icon",{color:"var(--n-icon-color)"}),m("alert-body",{padding:"var(--n-padding)"},[f("title",{color:"var(--n-title-text-color)"}),f("content",{color:"var(--n-content-text-color)"})]),Y({originalTransition:"transform .3s var(--n-bezier)",enterToProps:{transform:"scale(1)"},leaveToProps:{transform:"scale(0.9)"}}),f("icon",`
 position: absolute;
 left: 0;
 top: 0;
 align-items: center;
 justify-content: center;
 display: flex;
 width: var(--n-icon-size);
 height: var(--n-icon-size);
 font-size: var(--n-icon-size);
 margin: var(--n-icon-margin);
 `),f("close",`
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 position: absolute;
 right: 0;
 top: 0;
 margin: var(--n-close-margin);
 `),P("show-icon",[m("alert-body",{paddingLeft:"calc(var(--n-icon-margin-left) + var(--n-icon-size) + var(--n-icon-margin-right))"})]),P("right-adjust",[m("alert-body",{paddingRight:"calc(var(--n-close-size) + var(--n-padding) + 2px)"})]),m("alert-body",`
 border-radius: var(--n-border-radius);
 transition: border-color .3s var(--n-bezier);
 `,[f("title",`
 transition: color .3s var(--n-bezier);
 font-size: 16px;
 line-height: 19px;
 font-weight: var(--n-title-font-weight);
 `,[T("& +",[f("content",{marginTop:"9px"})])]),f("content",{transition:"color .3s var(--n-bezier)",fontSize:"var(--n-font-size)"})]),f("icon",{transition:"color .3s var(--n-bezier)"})]),we=Object.assign(Object.assign({},R.props),{title:String,showIcon:{type:Boolean,default:!0},type:{type:String,default:"default"},bordered:{type:Boolean,default:!0},closable:Boolean,onClose:Function,onAfterLeave:Function,onAfterHide:Function}),ke=B({name:"Alert",inheritAttrs:!1,props:we,slots:Object,setup(e){const{mergedClsPrefixRef:o,mergedBorderedRef:r,inlineThemeDisabled:t,mergedRtlRef:n}=k(e),s=R("Alert","-alert",_e,Te,e,o),l=te("Alert",n,o),u=I(()=>{const{common:{cubicBezierEaseInOut:d},self:i}=s.value,{fontSize:z,borderRadius:$,titleFontWeight:S,lineHeight:E,iconSize:D,iconMargin:w,iconMarginRtl:F,closeIconSize:j,closeBorderRadius:V,closeSize:K,closeMargin:Z,closeMarginRtl:G,padding:X}=i,{type:g}=e,{left:q,right:J}=ue(w);return{"--n-bezier":d,"--n-color":i[p("color",g)],"--n-close-icon-size":j,"--n-close-border-radius":V,"--n-close-color-hover":i[p("closeColorHover",g)],"--n-close-color-pressed":i[p("closeColorPressed",g)],"--n-close-icon-color":i[p("closeIconColor",g)],"--n-close-icon-color-hover":i[p("closeIconColorHover",g)],"--n-close-icon-color-pressed":i[p("closeIconColorPressed",g)],"--n-icon-color":i[p("iconColor",g)],"--n-border":i[p("border",g)],"--n-title-text-color":i[p("titleTextColor",g)],"--n-content-text-color":i[p("contentTextColor",g)],"--n-line-height":E,"--n-border-radius":$,"--n-font-size":z,"--n-title-font-weight":S,"--n-icon-size":D,"--n-icon-margin":w,"--n-icon-margin-rtl":F,"--n-close-size":K,"--n-close-margin":Z,"--n-close-margin-rtl":G,"--n-padding":X,"--n-icon-margin-left":q,"--n-icon-margin-right":J}}),a=t?L("alert",I(()=>e.type[0]),u,e):void 0,h=se(!0),v=()=>{const{onAfterLeave:d,onAfterHide:i}=e;d&&d(),i&&i()};return{rtlEnabled:l,mergedClsPrefix:o,mergedBordered:r,visible:h,handleCloseClick:()=>{var d;Promise.resolve((d=e.onClose)===null||d===void 0?void 0:d.call(e)).then(i=>{i!==!1&&(h.value=!1)})},handleAfterLeave:()=>{v()},mergedTheme:s,cssVars:t?void 0:u,themeClass:a==null?void 0:a.themeClass,onRender:a==null?void 0:a.onRender}},render(){var e;return(e=this.onRender)===null||e===void 0||e.call(this),c(ne,{onAfterLeave:this.handleAfterLeave},{default:()=>{const{mergedClsPrefix:o,$slots:r}=this,t={class:[`${o}-alert`,this.themeClass,this.closable&&`${o}-alert--closable`,this.showIcon&&`${o}-alert--show-icon`,!this.title&&this.closable&&`${o}-alert--right-adjust`,this.rtlEnabled&&`${o}-alert--rtl`],style:this.cssVars,role:"alert"};return this.visible?c("div",Object.assign({},N(this.$attrs,t)),this.closable&&c(ee,{clsPrefix:o,class:`${o}-alert__close`,onClick:this.handleCloseClick}),this.bordered&&c("div",{class:`${o}-alert__border`}),this.showIcon&&c("div",{class:`${o}-alert__icon`,"aria-hidden":"true"},oe(r.icon,()=>[c(ie,{clsPrefix:o},{default:()=>{switch(this.type){case"success":return c(de,null);case"info":return c(ce,null);case"warning":return c(ae,null);case"error":return c(le,null);default:return null}}})])),c("div",{class:[`${o}-alert-body`,this.mergedBordered&&`${o}-alert-body--bordered`]},re(r.header,n=>{const s=n||this.title;return s?c("div",{class:`${o}-alert-body__title`},s):null}),r.default&&c("div",{class:`${o}-alert-body__content`},r))):null}})}});function He(e){const{textColorBase:o,opacity1:r,opacity2:t,opacity3:n,opacity4:s,opacity5:l}=e;return{color:o,opacity1Depth:r,opacity2Depth:t,opacity3Depth:n,opacity4Depth:s,opacity5Depth:l}}const Ae={common:W,self:He},Me=m("icon",`
 height: 1em;
 width: 1em;
 line-height: 1em;
 text-align: center;
 display: inline-block;
 position: relative;
 fill: currentColor;
`,[P("color-transition",{transition:"color .3s var(--n-bezier)"}),P("depth",{color:"var(--n-color)"},[T("svg",{opacity:"var(--n-opacity)",transition:"opacity .3s var(--n-bezier)"})]),T("svg",{height:"1em",width:"1em"})]),Oe=Object.assign(Object.assign({},R.props),{depth:[String,Number],size:[Number,String],color:String,component:[Object,Function]}),Le=B({_n_icon__:!0,name:"Icon",inheritAttrs:!1,props:Oe,setup(e){const{mergedClsPrefixRef:o,inlineThemeDisabled:r}=k(e),t=R("Icon","-icon",Me,Ae,e,o),n=I(()=>{const{depth:l}=e,{common:{cubicBezierEaseInOut:u},self:a}=t.value;if(l!==void 0){const{color:h,[`opacity${l}Depth`]:v}=a;return{"--n-bezier":u,"--n-color":h,"--n-opacity":v}}return{"--n-bezier":u,"--n-color":"","--n-opacity":""}}),s=r?L("icon",I(()=>`${e.depth||"d"}`),n,e):void 0;return{mergedClsPrefix:o,mergedStyle:I(()=>{const{size:l,color:u}=e;return{fontSize:ge(l),color:u}}),cssVars:r?void 0:n,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){var e;const{$parent:o,depth:r,mergedClsPrefix:t,component:n,onRender:s,themeClass:l}=this;return!((e=o==null?void 0:o.$options)===null||e===void 0)&&e._n_icon__&&fe("icon","don't wrap `n-icon` inside `n-icon`"),s==null||s(),c("i",N(this.$attrs,{role:"img",class:[`${t}-icon`,l,{[`${t}-icon--depth`]:r,[`${t}-icon--color-transition`]:r!==void 0}],style:[this.cssVars,this.mergedStyle]}),n?c(n):this.$slots)}});export{ke as N,Le as a,Pe as b,$e as c,ge as f,Ne as g,be as i,Se as t,Be as u};
