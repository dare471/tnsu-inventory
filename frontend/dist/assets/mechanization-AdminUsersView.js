import{i as M,a as ee,N as $e}from"./mechanization-inventory.js";import{v as Ve,ab as Ae,z as ce,E as i,ax as he,C as te,av as C,ae as ve,d as ye,aJ as ae,H as u,G as A,aB as Fe,aF as Ue,I as We,J as we,$ as Le,r as g,K as Me,k as P,a4 as le,Q as F,aH as ie,aK as N,a8 as Oe,aL as Te,L as He,f as oe,w as c,b as o,Y as E,q as D,o as O,i as d,p as T,t as re,g as fe,B as ne,a as Pe,c as be,U as Ee,T as De,aM as me}from"./mechanization.js";import{u as je,N as pe}from"./mechanization-Icon.js";import{N as Ie}from"./mechanization-Form.js";import{N as j}from"./mechanization-FormItem.js";import{N as se}from"./mechanization-Input.js";import{N as de}from"./mechanization-Space.js";import{b as Ke}from"./mechanization-Dropdown.js";const Ye={buttonHeightSmall:"14px",buttonHeightMedium:"18px",buttonHeightLarge:"22px",buttonWidthSmall:"14px",buttonWidthMedium:"18px",buttonWidthLarge:"22px",buttonWidthPressedSmall:"20px",buttonWidthPressedMedium:"24px",buttonWidthPressedLarge:"28px",railHeightSmall:"18px",railHeightMedium:"22px",railHeightLarge:"26px",railWidthSmall:"32px",railWidthMedium:"40px",railWidthLarge:"48px"};function Je(e){const{primaryColor:f,opacityDisabled:m,borderRadius:r,textColor3:h}=e;return Object.assign(Object.assign({},Ye),{iconColor:h,textColor:"white",loadingColor:f,opacityDisabled:m,railColor:"rgba(0, 0, 0, .14)",railColorActive:f,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:r,railBorderRadiusMedium:r,railBorderRadiusLarge:r,buttonBorderRadiusSmall:r,buttonBorderRadiusMedium:r,buttonBorderRadiusLarge:r,boxShadowFocus:`0 0 0 2px ${Ae(f,{alpha:.2})}`})}const Xe={common:Ve,self:Je},qe=ce("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[i("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),i("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),i("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),ce("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[he({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),i("checked, unchecked",`
 transition: color .3s var(--n-bezier);
 color: var(--n-text-color);
 box-sizing: border-box;
 position: absolute;
 white-space: nowrap;
 top: 0;
 bottom: 0;
 display: flex;
 align-items: center;
 line-height: 1;
 `),i("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),i("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),te("&:focus",[i("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),C("round",[i("rail","border-radius: calc(var(--n-rail-height) / 2);",[i("button","border-radius: calc(var(--n-button-height) / 2);")])]),ve("disabled",[ve("icon",[C("rubber-band",[C("pressed",[i("rail",[i("button","max-width: var(--n-button-width-pressed);")])]),i("rail",[te("&:active",[i("button","max-width: var(--n-button-width-pressed);")])]),C("active",[C("pressed",[i("rail",[i("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),i("rail",[te("&:active",[i("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),C("active",[i("rail",[i("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),i("rail",`
 overflow: hidden;
 height: var(--n-rail-height);
 min-width: var(--n-rail-width);
 border-radius: var(--n-rail-border-radius);
 cursor: pointer;
 position: relative;
 transition:
 opacity .3s var(--n-bezier),
 background .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 background-color: var(--n-rail-color);
 `,[i("button-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 font-size: calc(var(--n-button-height) - 4px);
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 line-height: 1;
 `,[he()]),i("button",`
 align-items: center; 
 top: var(--n-offset);
 left: var(--n-offset);
 height: var(--n-button-height);
 width: var(--n-button-width-pressed);
 max-width: var(--n-button-width);
 border-radius: var(--n-button-border-radius);
 background-color: var(--n-button-color);
 box-shadow: var(--n-button-box-shadow);
 box-sizing: border-box;
 cursor: inherit;
 content: "";
 position: absolute;
 transition:
 background-color .3s var(--n-bezier),
 left .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 max-width .3s var(--n-bezier),
 box-shadow .3s var(--n-bezier);
 `)]),C("active",[i("rail","background-color: var(--n-rail-color-active);")]),C("loading",[i("rail",`
 cursor: wait;
 `)]),C("disabled",[i("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Ge=Object.assign(Object.assign({},we.props),{size:String,value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},spinProps:Object,onChange:[Function,Array]});let H;const ge=ye({name:"Switch",props:Ge,slots:Object,setup(e){H===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?H=CSS.supports("width","max(1px)"):H=!1:H=!0);const{mergedClsPrefixRef:f,inlineThemeDisabled:m,mergedComponentPropsRef:r}=We(e),h=we("Switch","-switch",qe,Xe,e,f),y=Le(e,{mergedSize(l){var B,R;if(e.size!==void 0)return e.size;if(l)return l.mergedSize.value;const V=(R=(B=r==null?void 0:r.value)===null||B===void 0?void 0:B.Switch)===null||R===void 0?void 0:R.size;return V||"medium"}}),{mergedSizeRef:w,mergedDisabledRef:x}=y,n=g(e.defaultValue),_=Oe(e,"value"),k=je(_,n),p=P(()=>k.value===e.checkedValue),s=g(!1),b=g(!1),S=P(()=>{const{railStyle:l}=e;if(l)return l({focused:b.value,checked:p.value})});function U(l){const{"onUpdate:value":B,onChange:R,onUpdateValue:V}=e,{nTriggerFormInput:X,nTriggerFormChange:q}=y;B&&le(B,l),V&&le(V,l),R&&le(R,l),n.value=l,X(),q()}function I(){const{nTriggerFormFocus:l}=y;l()}function K(){const{nTriggerFormBlur:l}=y;l()}function Y(){e.loading||x.value||(k.value!==e.checkedValue?U(e.checkedValue):U(e.uncheckedValue))}function t(){b.value=!0,I()}function a(){b.value=!1,K(),s.value=!1}function v(l){e.loading||x.value||l.key===" "&&(k.value!==e.checkedValue?U(e.checkedValue):U(e.uncheckedValue),s.value=!1)}function J(l){e.loading||x.value||l.key===" "&&(l.preventDefault(),s.value=!0)}const ue=P(()=>{const{value:l}=w,{self:{opacityDisabled:B,railColor:R,railColorActive:V,buttonBoxShadow:X,buttonColor:q,boxShadowFocus:xe,loadingColor:ke,textColor:Se,iconColor:Ce,[F("buttonHeight",l)]:z,[F("buttonWidth",l)]:Ne,[F("buttonWidthPressed",l)]:_e,[F("railHeight",l)]:$,[F("railWidth",l)]:L,[F("railBorderRadius",l)]:Be,[F("buttonBorderRadius",l)]:Re},common:{cubicBezierEaseInOut:ze}}=h.value;let G,Q,Z;return H?(G=`calc((${$} - ${z}) / 2)`,Q=`max(${$}, ${z})`,Z=`max(${L}, calc(${L} + ${z} - ${$}))`):(G=ie((N($)-N(z))/2),Q=ie(Math.max(N($),N(z))),Z=N($)>N(z)?L:ie(N(L)+N(z)-N($))),{"--n-bezier":ze,"--n-button-border-radius":Re,"--n-button-box-shadow":X,"--n-button-color":q,"--n-button-width":Ne,"--n-button-width-pressed":_e,"--n-button-height":z,"--n-height":Q,"--n-offset":G,"--n-opacity-disabled":B,"--n-rail-border-radius":Be,"--n-rail-color":R,"--n-rail-color-active":V,"--n-rail-height":$,"--n-rail-width":L,"--n-width":Z,"--n-box-shadow-focus":xe,"--n-loading-color":ke,"--n-text-color":Se,"--n-icon-color":Ce}}),W=m?Me("switch",P(()=>w.value[0]),ue,e):void 0;return{handleClick:Y,handleBlur:a,handleFocus:t,handleKeyup:v,handleKeydown:J,mergedRailStyle:S,pressed:s,mergedClsPrefix:f,mergedValue:k,checked:p,mergedDisabled:x,cssVars:m?void 0:ue,themeClass:W==null?void 0:W.themeClass,onRender:W==null?void 0:W.onRender}},render(){const{mergedClsPrefix:e,mergedDisabled:f,checked:m,mergedRailStyle:r,onRender:h,$slots:y}=this;h==null||h();const{checked:w,unchecked:x,icon:n,"checked-icon":_,"unchecked-icon":k}=y,p=!(ae(n)&&ae(_)&&ae(k));return u("div",{role:"switch","aria-checked":m,class:[`${e}-switch`,this.themeClass,p&&`${e}-switch--icon`,m&&`${e}-switch--active`,f&&`${e}-switch--disabled`,this.round&&`${e}-switch--round`,this.loading&&`${e}-switch--loading`,this.pressed&&`${e}-switch--pressed`,this.rubberBand&&`${e}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},u("div",{class:`${e}-switch__rail`,"aria-hidden":"true",style:r},A(w,s=>A(x,b=>s||b?u("div",{"aria-hidden":!0,class:`${e}-switch__children-placeholder`},u("div",{class:`${e}-switch__rail-placeholder`},u("div",{class:`${e}-switch__button-placeholder`}),s),u("div",{class:`${e}-switch__rail-placeholder`},u("div",{class:`${e}-switch__button-placeholder`}),b)):null)),u("div",{class:`${e}-switch__button`},A(n,s=>A(_,b=>A(k,S=>u(Fe,null,{default:()=>this.loading?u(Ue,Object.assign({key:"loading",clsPrefix:e,strokeWidth:20},this.spinProps)):this.checked&&(b||s)?u("div",{class:`${e}-switch__button-icon`,key:b?"checked-icon":"icon"},b||s):!this.checked&&(S||s)?u("div",{class:`${e}-switch__button-icon`,key:S?"unchecked-icon":"icon"},S||s):null})))),A(w,s=>s&&u("div",{key:"checked",class:`${e}-switch__checked`},s)),A(x,s=>s&&u("div",{key:"unchecked",class:`${e}-switch__unchecked`},s)))))}}),rt=ye({__name:"AdminUsersView",setup(e){const f=g(!0),m=g(!1),r=g(""),h=g(""),y=g([]),w=g([]),x=g([]),n=me({email:"",fullName:"",role:"site_mechanic",isActive:!0}),_=g(!1),k=Te.map(t=>({label:t.label,value:t.value})),p=me({}),s=P(()=>x.value.map(t=>({label:`${t.fullName} (${t.email})`,value:t.id})));function b(){Object.keys(p).forEach(t=>delete p[t]),w.value.forEach(t=>{p[t.role]=t.userId??""})}async function S(){f.value=!0,r.value="";try{const[t,a]=await Promise.all([M.listAdminUsers(),M.getApprovalRoute()]);y.value=t,w.value=a.assignments,x.value=a.users,b()}catch(t){r.value=D(t).detail}finally{f.value=!1}}async function U(){_.value=!0,r.value="",h.value="";try{await M.createAdminUser({email:n.email,fullName:n.fullName,role:n.role,isActive:n.isActive}),n.email="",n.fullName="",n.role="site_mechanic",n.isActive=!0,h.value="Пользователь добавлен.",await S()}catch(t){r.value=D(t).detail}finally{_.value=!1}}async function I(t){r.value="",h.value="";try{await M.updateAdminUser(t.id,{fullName:t.fullName,role:t.role,isActive:t.isActive}),h.value=`Пользователь ${t.fullName} обновлен.`,await S()}catch(a){r.value=D(a).detail}}async function K(){m.value=!0,r.value="",h.value="";try{const t=w.value.map(a=>({role:a.role,userId:p[a.role]}));if(t.some(a=>!a.userId))throw new Error("Назначьте пользователя на каждый шаг маршрута.");await M.updateApprovalRoute({assignments:t}),h.value="Маршрут согласования сохранен.",await S()}catch(t){r.value=D(t).detail||t.message}finally{m.value=!1}}const Y=[{title:"Email",key:"email"},{title:"ФИО",key:"fullName",render:t=>u(se,{value:t.fullName,onUpdateValue:a=>{t.fullName=a}})},{title:"Роль",key:"role",render:t=>u(ee,{value:t.role,options:k,style:"min-width:220px",onUpdateValue:a=>{t.role=a}})},{title:"Активен",key:"isActive",render:t=>u(ge,{value:t.isActive,onUpdateValue:a=>{t.isActive=a}})},{title:"Действие",key:"actions",render:t=>u(ne,{size:"small",type:"primary",onClick:()=>void I(t)},{default:()=>"Сохранить"})}];return He(()=>{S()}),(t,a)=>(O(),oe(o(E),{title:"Администрирование пользователей и маршрута"},{default:c(()=>[d(o(de),{vertical:"",size:16},{default:c(()=>[r.value?(O(),oe(o(pe),{key:0,type:"error"},{default:c(()=>[T(re(r.value),1)]),_:1})):fe("",!0),h.value?(O(),oe(o(pe),{key:1,type:"success"},{default:c(()=>[T(re(h.value),1)]),_:1})):fe("",!0),d(o(E),{title:"Добавить пользователя",size:"small"},{default:c(()=>[d(o(Ie),{"label-placement":"left","label-width":130},{default:c(()=>[d(o(j),{label:"Email"},{default:c(()=>[d(o(se),{value:n.email,"onUpdate:value":a[0]||(a[0]=v=>n.email=v),placeholder:"user@tnsukz.onmicrosoft.com"},null,8,["value"])]),_:1}),d(o(j),{label:"ФИО"},{default:c(()=>[d(o(se),{value:n.fullName,"onUpdate:value":a[1]||(a[1]=v=>n.fullName=v)},null,8,["value"])]),_:1}),d(o(j),{label:"Роль"},{default:c(()=>[d(o(ee),{value:n.role,"onUpdate:value":a[2]||(a[2]=v=>n.role=v),options:o(k)},null,8,["value","options"])]),_:1}),d(o(j),{label:"Активен"},{default:c(()=>[d(o(ge),{value:n.isActive,"onUpdate:value":a[3]||(a[3]=v=>n.isActive=v)},null,8,["value"])]),_:1}),d(o(ne),{type:"primary",loading:_.value,onClick:U},{default:c(()=>[...a[4]||(a[4]=[T("Добавить",-1)])]),_:1},8,["loading"])]),_:1})]),_:1}),d(o(E),{title:"Пользователи",size:"small"},{default:c(()=>[d(o($e),{loading:f.value,class:"t-data-table",columns:Y,data:y.value,bordered:!1,size:"small","row-key":v=>v.id},null,8,["loading","data","row-key"])]),_:1}),d(o(E),{title:"Маршрут согласования (закупка/дефектный акт)",size:"small"},{default:c(()=>[a[6]||(a[6]=Pe("p",{style:{margin:"0 0 12px",color:"var(--brand-text-muted)"}}," Для каждого шага выберите ровно одного активного пользователя. ",-1)),d(o(de),{vertical:"",size:10},{default:c(()=>[(O(!0),be(De,null,Ee(w.value,v=>(O(),be("div",{key:v.role,style:{display:"grid","grid-template-columns":"240px 1fr",gap:"12px","align-items":"center"}},[d(o(Ke),{type:"info"},{default:c(()=>[T(re(v.roleLabel),1)]),_:2},1024),d(o(ee),{value:p[v.role],"onUpdate:value":J=>p[v.role]=J,filterable:"",clearable:"",options:s.value,placeholder:"Выберите пользователя"},null,8,["value","onUpdate:value","options"])]))),128))]),_:1}),d(o(de),{style:{"margin-top":"14px"}},{default:c(()=>[d(o(ne),{type:"primary",loading:m.value,onClick:K},{default:c(()=>[...a[5]||(a[5]=[T("Сохранить маршрут",-1)])]),_:1},8,["loading"])]),_:1})]),_:1})]),_:1})]),_:1}))}});export{rt as default};
