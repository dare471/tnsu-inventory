import{y as ne,a7 as Re,A as O,as as y,D as c,d as Oe,G as h,H as Ke,b1 as it,aC as rt,al as nt,b2 as st,s as ut,a4 as dt,au as Le,b3 as Ee,F as ie,I as Ge,aD as ct,r as u,J as vt,ay as pt,a_ as ft,l as A,ah as Pe,P as re,b0 as De,b4 as Y,aj as mt,b5 as ht,N as J,K as bt,f as Ve,w as n,j as o,b as l,g as D,t as _e,h as Se,B as W,aa as Te,ad as We,a as k,_ as de,b6 as gt,c as Q,U as je,T as xe,b7 as ze,m as ee,o as V}from"./mechanization.js";import{i as R}from"./mechanization-inventory.js";import{u as yt}from"./mechanization-Icon.js";import{N as Me,a as ce}from"./mechanization-Input.js";import{N}from"./mechanization-Space.js";import{N as wt}from"./mechanization-Form.js";import{N as j}from"./mechanization-FormItem.js";import{a as U,N as _t}from"./mechanization-DataTable.js";import{_ as xt}from"./mechanization-_plugin-vue_export-helper.js";const p="0!important",Ye="-1px!important";function ve(a){return y(`${a}-type`,[O("& +",[ne("button",{},[y(`${a}-type`,[c("border",{borderLeftWidth:p}),c("state-border",{left:Ye})])])])])}function pe(a){return y(`${a}-type`,[O("& +",[ne("button",[y(`${a}-type`,[c("border",{borderTopWidth:p}),c("state-border",{top:Ye})])])])])}const kt=ne("button-group",`
 flex-wrap: nowrap;
 display: inline-flex;
 position: relative;
`,[Re("vertical",{flexDirection:"row"},[Re("rtl",[ne("button",[O("&:first-child:not(:last-child)",`
 margin-right: ${p};
 border-top-right-radius: ${p};
 border-bottom-right-radius: ${p};
 `),O("&:last-child:not(:first-child)",`
 margin-left: ${p};
 border-top-left-radius: ${p};
 border-bottom-left-radius: ${p};
 `),O("&:not(:first-child):not(:last-child)",`
 margin-left: ${p};
 margin-right: ${p};
 border-radius: ${p};
 `),ve("default"),y("ghost",[ve("primary"),ve("info"),ve("success"),ve("warning"),ve("error")])])])]),y("vertical",{flexDirection:"column"},[ne("button",[O("&:first-child:not(:last-child)",`
 margin-bottom: ${p};
 margin-left: ${p};
 margin-right: ${p};
 border-bottom-left-radius: ${p};
 border-bottom-right-radius: ${p};
 `),O("&:last-child:not(:first-child)",`
 margin-top: ${p};
 margin-left: ${p};
 margin-right: ${p};
 border-top-left-radius: ${p};
 border-top-right-radius: ${p};
 `),O("&:not(:first-child):not(:last-child)",`
 margin: ${p};
 border-radius: ${p};
 `),pe("default"),y("ghost",[pe("primary"),pe("info"),pe("success"),pe("warning"),pe("error")])])])]),$t={size:String,vertical:Boolean},Ct=Oe({name:"ButtonGroup",props:$t,setup(a){const{mergedClsPrefixRef:f,mergedRtlRef:_}=Ke(a);return it("-button-group",kt,f),nt(st,a),{rtlEnabled:rt("ButtonGroup",_,f),mergedClsPrefix:f}},render(){const{mergedClsPrefix:a}=this;return h("div",{class:[`${a}-button-group`,this.rtlEnabled&&`${a}-button-group--rtl`,this.vertical&&`${a}-button-group--vertical`],role:"group"},this.$slots)}}),St={buttonHeightSmall:"14px",buttonHeightMedium:"18px",buttonHeightLarge:"22px",buttonWidthSmall:"14px",buttonWidthMedium:"18px",buttonWidthLarge:"22px",buttonWidthPressedSmall:"20px",buttonWidthPressedMedium:"24px",buttonWidthPressedLarge:"28px",railHeightSmall:"18px",railHeightMedium:"22px",railHeightLarge:"26px",railWidthSmall:"32px",railWidthMedium:"40px",railWidthLarge:"48px"};function zt(a){const{primaryColor:f,opacityDisabled:_,borderRadius:b,textColor3:B}=a;return Object.assign(Object.assign({},St),{iconColor:B,textColor:"white",loadingColor:f,opacityDisabled:_,railColor:"rgba(0, 0, 0, .14)",railColorActive:f,buttonBoxShadow:"0 1px 4px 0 rgba(0, 0, 0, 0.3), inset 0 0 1px 0 rgba(0, 0, 0, 0.05)",buttonColor:"#FFF",railBorderRadiusSmall:b,railBorderRadiusMedium:b,railBorderRadiusLarge:b,buttonBorderRadiusSmall:b,buttonBorderRadiusMedium:b,buttonBorderRadiusLarge:b,boxShadowFocus:`0 0 0 2px ${dt(f,{alpha:.2})}`})}const Rt={common:ut,self:zt},Nt=ne("switch",`
 height: var(--n-height);
 min-width: var(--n-width);
 vertical-align: middle;
 user-select: none;
 -webkit-user-select: none;
 display: inline-flex;
 outline: none;
 justify-content: center;
 align-items: center;
`,[c("children-placeholder",`
 height: var(--n-rail-height);
 display: flex;
 flex-direction: column;
 overflow: hidden;
 pointer-events: none;
 visibility: hidden;
 `),c("rail-placeholder",`
 display: flex;
 flex-wrap: none;
 `),c("button-placeholder",`
 width: calc(1.75 * var(--n-rail-height));
 height: var(--n-rail-height);
 `),ne("base-loading",`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translateX(-50%) translateY(-50%);
 font-size: calc(var(--n-button-width) - 4px);
 color: var(--n-loading-color);
 transition: color .3s var(--n-bezier);
 `,[Le({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})]),c("checked, unchecked",`
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
 `),c("checked",`
 right: 0;
 padding-right: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),c("unchecked",`
 left: 0;
 justify-content: flex-end;
 padding-left: calc(1.25 * var(--n-rail-height) - var(--n-offset));
 `),O("&:focus",[c("rail",`
 box-shadow: var(--n-box-shadow-focus);
 `)]),y("round",[c("rail","border-radius: calc(var(--n-rail-height) / 2);",[c("button","border-radius: calc(var(--n-button-height) / 2);")])]),Re("disabled",[Re("icon",[y("rubber-band",[y("pressed",[c("rail",[c("button","max-width: var(--n-button-width-pressed);")])]),c("rail",[O("&:active",[c("button","max-width: var(--n-button-width-pressed);")])]),y("active",[y("pressed",[c("rail",[c("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])]),c("rail",[O("&:active",[c("button","left: calc(100% - var(--n-offset) - var(--n-button-width-pressed));")])])])])])]),y("active",[c("rail",[c("button","left: calc(100% - var(--n-button-width) - var(--n-offset))")])]),c("rail",`
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
 `,[c("button-icon",`
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
 `,[Le()]),c("button",`
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
 `)]),y("active",[c("rail","background-color: var(--n-rail-color-active);")]),y("loading",[c("rail",`
 cursor: wait;
 `)]),y("disabled",[c("rail",`
 cursor: not-allowed;
 opacity: .5;
 `)])]),Ut=Object.assign(Object.assign({},Ge.props),{size:String,value:{type:[String,Number,Boolean],default:void 0},loading:Boolean,defaultValue:{type:[String,Number,Boolean],default:!1},disabled:{type:Boolean,default:void 0},round:{type:Boolean,default:!0},"onUpdate:value":[Function,Array],onUpdateValue:[Function,Array],checkedValue:{type:[String,Number,Boolean],default:!0},uncheckedValue:{type:[String,Number,Boolean],default:!1},railStyle:Function,rubberBand:{type:Boolean,default:!0},spinProps:Object,onChange:[Function,Array]});let ke;const He=Oe({name:"Switch",props:Ut,slots:Object,setup(a){ke===void 0&&(typeof CSS<"u"?typeof CSS.supports<"u"?ke=CSS.supports("width","max(1px)"):ke=!1:ke=!0);const{mergedClsPrefixRef:f,inlineThemeDisabled:_,mergedComponentPropsRef:b}=Ke(a),B=Ge("Switch","-switch",Nt,Rt,a,f),d=ct(a,{mergedSize(s){var z,w;if(a.size!==void 0)return a.size;if(s)return s.mergedSize.value;const E=(w=(z=b==null?void 0:b.value)===null||z===void 0?void 0:z.Switch)===null||w===void 0?void 0:w.size;return E||"medium"}}),{mergedSizeRef:m,mergedDisabledRef:$}=d,M=u(a.defaultValue),C=mt(a,"value"),S=yt(C,M),H=A(()=>S.value===a.checkedValue),v=u(!1),g=u(!1),F=A(()=>{const{railStyle:s}=a;if(s)return s({focused:g.value,checked:H.value})});function te(s){const{"onUpdate:value":z,onChange:w,onUpdateValue:E}=a,{nTriggerFormInput:le,nTriggerFormChange:r}=d;z&&Pe(z,s),E&&Pe(E,s),w&&Pe(w,s),M.value=s,le(),r()}function $e(){const{nTriggerFormFocus:s}=d;s()}function I(){const{nTriggerFormBlur:s}=d;s()}function se(){a.loading||$.value||(S.value!==a.checkedValue?te(a.checkedValue):te(a.uncheckedValue))}function Z(){g.value=!0,$e()}function fe(){g.value=!1,I(),v.value=!1}function K(s){a.loading||$.value||s.key===" "&&(S.value!==a.checkedValue?te(a.checkedValue):te(a.uncheckedValue),v.value=!1)}function G(s){a.loading||$.value||s.key===" "&&(s.preventDefault(),v.value=!0)}const L=A(()=>{const{value:s}=m,{self:{opacityDisabled:z,railColor:w,railColorActive:E,buttonBoxShadow:le,buttonColor:r,boxShadowFocus:me,loadingColor:q,textColor:he,iconColor:be,[re("buttonHeight",s)]:T,[re("buttonWidth",s)]:Ne,[re("buttonWidthPressed",s)]:X,[re("railHeight",s)]:P,[re("railWidth",s)]:ae,[re("railBorderRadius",s)]:Ue,[re("buttonBorderRadius",s)]:Ae},common:{cubicBezierEaseInOut:Be}}=B.value;let oe,ge,ye;return ke?(oe=`calc((${P} - ${T}) / 2)`,ge=`max(${P}, ${T})`,ye=`max(${ae}, calc(${ae} + ${T} - ${P}))`):(oe=De((Y(P)-Y(T))/2),ge=De(Math.max(Y(P),Y(T))),ye=Y(P)>Y(T)?ae:De(Y(ae)+Y(T)-Y(P))),{"--n-bezier":Be,"--n-button-border-radius":Ae,"--n-button-box-shadow":le,"--n-button-color":r,"--n-button-width":Ne,"--n-button-width-pressed":X,"--n-button-height":T,"--n-height":ge,"--n-offset":oe,"--n-opacity-disabled":z,"--n-rail-border-radius":Ue,"--n-rail-color":w,"--n-rail-color-active":E,"--n-rail-height":P,"--n-rail-width":ae,"--n-width":ye,"--n-box-shadow-focus":me,"--n-loading-color":q,"--n-text-color":he,"--n-icon-color":be}}),x=_?vt("switch",A(()=>m.value[0]),L,a):void 0;return{handleClick:se,handleBlur:fe,handleFocus:Z,handleKeyup:K,handleKeydown:G,mergedRailStyle:F,pressed:v,mergedClsPrefix:f,mergedValue:S,checked:H,mergedDisabled:$,cssVars:_?void 0:L,themeClass:x==null?void 0:x.themeClass,onRender:x==null?void 0:x.onRender}},render(){const{mergedClsPrefix:a,mergedDisabled:f,checked:_,mergedRailStyle:b,onRender:B,$slots:d}=this;B==null||B();const{checked:m,unchecked:$,icon:M,"checked-icon":C,"unchecked-icon":S}=d,H=!(Ee(M)&&Ee(C)&&Ee(S));return h("div",{role:"switch","aria-checked":_,class:[`${a}-switch`,this.themeClass,H&&`${a}-switch--icon`,_&&`${a}-switch--active`,f&&`${a}-switch--disabled`,this.round&&`${a}-switch--round`,this.loading&&`${a}-switch--loading`,this.pressed&&`${a}-switch--pressed`,this.rubberBand&&`${a}-switch--rubber-band`],tabindex:this.mergedDisabled?void 0:0,style:this.cssVars,onClick:this.handleClick,onFocus:this.handleFocus,onBlur:this.handleBlur,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},h("div",{class:`${a}-switch__rail`,"aria-hidden":"true",style:b},ie(m,v=>ie($,g=>v||g?h("div",{"aria-hidden":!0,class:`${a}-switch__children-placeholder`},h("div",{class:`${a}-switch__rail-placeholder`},h("div",{class:`${a}-switch__button-placeholder`}),v),h("div",{class:`${a}-switch__rail-placeholder`},h("div",{class:`${a}-switch__button-placeholder`}),g)):null)),h("div",{class:`${a}-switch__button`},ie(M,v=>ie(C,g=>ie(S,F=>h(pt,null,{default:()=>this.loading?h(ft,Object.assign({key:"loading",clsPrefix:a,strokeWidth:20},this.spinProps)):this.checked&&(g||v)?h("div",{class:`${a}-switch__button-icon`,key:g?"checked-icon":"icon"},g||v):!this.checked&&(F||v)?h("div",{class:`${a}-switch__button-icon`,key:F?"unchecked-icon":"icon"},F||v):null})))),ie(m,v=>v&&h("div",{key:"checked",class:`${a}-switch__checked`},v)),ie($,v=>v&&h("div",{key:"unchecked",class:`${a}-switch__unchecked`},v)))))}}),At=[{label:"ТОО TANSU Construction",value:"tansu_construction"},{label:"ТОО KazPromService",value:"kazprom_service"}],Bt={class:"t-table-wrap"},It={class:"t-route-list"},Et=["title"],Pt={class:"t-route-row__field"},Dt={class:"t-route-list"},Vt=["title"],jt={class:"t-route-row__field"},Ot={class:"t-doc-approver-filters"},Ft={class:"t-route-list"},Lt=["title"],Tt={class:"t-route-row__field"},Wt=Oe({__name:"AdminUsersView",setup(a){const f=u("users"),_=u(!0),b=u(!0),B=u(!1),d=u(""),m=u(""),$=u([]),M=u(0),C=u(1),S=u(50),H=u(""),v=u(""),g=u("all"),F=u([]),te=u([]),$e=u([]),I=u(null),se=u([]),Z=ze({}),fe=u(!1),K=u(null),G=u("purchase_request"),L=u(null),x=u(""),s=u([]),z=u(!1),w=ze({}),E=u(!1);let le=null;const r=ze({employerCompany:null,zupEmployeeId:null,email:"",fullName:"",position:"",role:"site_mechanic",isActive:!0}),me=u(!1),q=u([]),he=u(!1),be=ht.map(e=>({label:e.label,value:e.value})),T=[{label:"Все",value:"all"},{label:"Активные",value:"active"},{label:"Неактивные",value:"inactive"}],Ne=A(()=>q.value.map(e=>({label:`${e.fullName} · ${e.position}${e.email?` · ${e.email}`:""}`,value:e.externalId})));J(()=>r.employerCompany,async e=>{if(r.zupEmployeeId=null,r.email="",r.fullName="",r.position="",q.value=[],!!e){he.value=!0,d.value="";try{q.value=await R.listZupEmployees(e),q.value.length||(d.value="Справочник ЗУП пуст или недоступен. Проверьте настройки Dictionary1C / ZUP.")}catch(t){d.value=ee(t).detail}finally{he.value=!1}}}),J(()=>r.zupEmployeeId,e=>{if(!e){r.email="",r.fullName="",r.position="";return}const t=q.value.find(i=>i.externalId===e);t&&(r.fullName=t.fullName,r.position=t.position,r.email=t.email)}),J(I,()=>{I.value&&qe()}),J([C,S],()=>{ue()});const X=ze({}),P=A(()=>te.value.map(e=>({label:`${e.fullName} (${e.email})`,value:e.id}))),ae=A(()=>$e.value.map(e=>({label:`${e.code} — ${e.projectName}`,value:e.id}))),Ue=A(()=>{var e;return(((e=K.value)==null?void 0:e.users)??[]).map(t=>({label:`${t.fullName} (${t.email})`,value:t.id}))}),Ae=A(()=>G.value==="defect_act"?"Дефектный акт":"Заявка"),Be=A(()=>s.value.map(e=>({label:`${Ae.value} ${e.number} — ${e.statusLabel}`,value:e.id}))),oe=A(()=>L.value?L.value:x.value.trim()||null);function ge(){Object.keys(X).forEach(e=>delete X[e]),F.value.forEach(e=>{X[e.role]=e.userId??""})}const ye=A(()=>({page:C.value,pageSize:S.value,itemCount:M.value,showSizePicker:!0,pageSizes:[25,50,100]}));async function ue(){_.value=!0,d.value="";try{const e=await R.listAdminUsers({search:H.value.trim()||void 0,role:v.value||void 0,isActive:g.value==="all"?void 0:g.value==="active",page:C.value,pageSize:S.value});$.value=e.items??[],M.value=e.total??$.value.length}catch(e){$.value=[],M.value=0,d.value=ee(e).detail}finally{_.value=!1}}async function Ce(){b.value=!0,d.value="";try{const[e,t]=await Promise.all([R.getApprovalRoute(),R.getProjects()]);F.value=e.assignments,te.value=e.users,$e.value=t,ge()}catch(e){d.value=ee(e).detail}finally{b.value=!1}}function Fe(){C.value=1,ue()}function Ze(){H.value="",v.value="",g.value="all",C.value=1,ue()}async function qe(){if(!I.value)return;const e=await R.getProjectApprovalRoute(I.value);se.value=e.assignments,Object.keys(Z).forEach(t=>delete Z[t]),e.assignments.forEach(t=>{Z[t.role]=t.userId??""})}async function Xe(){if(!r.employerCompany||!r.zupEmployeeId){d.value="Выберите компанию и сотрудника из ЗУП.";return}me.value=!0,d.value="",m.value="";try{await R.createAdminUser({employerCompany:r.employerCompany,zupEmployeeId:r.zupEmployeeId,role:r.role,isActive:r.isActive}),r.employerCompany=null,r.zupEmployeeId=null,r.email="",r.fullName="",r.position="",r.role="site_mechanic",r.isActive=!0,q.value=[],m.value="Пользователь добавлен.",await ue(),await Ce()}catch(e){d.value=ee(e).detail}finally{me.value=!1}}async function Je(e){d.value="",m.value="";try{await R.updateAdminUser(e.id,{fullName:e.fullName,role:e.role,isActive:e.isActive}),m.value=`Пользователь ${e.fullName} обновлен.`,await ue(),await Ce()}catch(t){d.value=ee(t).detail}}async function Qe(){B.value=!0,d.value="",m.value="";try{const e=F.value.map(t=>({role:t.role,userId:X[t.role]}));if(e.some(t=>!t.userId))throw new Error("Назначьте пользователя на каждый шаг маршрута.");await R.updateApprovalRoute({assignments:e}),m.value="Маршрут согласования сохранен.",await Ce()}catch(e){d.value=ee(e).detail||e.message}finally{B.value=!1}}async function et(){if(I.value){fe.value=!0,d.value="",m.value="";try{const e=se.value.map(t=>({role:t.role,userId:Z[t.role]}));if(e.some(t=>!t.userId))throw new Error("Назначьте пользователя на каждую проектную роль.");await R.updateProjectApprovalRoute(I.value,{assignments:e}),m.value="Проектный маршрут сохранен."}catch(e){d.value=ee(e).detail||e.message}finally{fe.value=!1}}}async function Ie(e){z.value=!0;try{s.value=await R.listAdminDocuments(G.value,e)}catch{s.value=[]}finally{z.value=!1}}function tt(e){le&&clearTimeout(le),le=setTimeout(()=>{Ie(e||void 0)},300)}J(G,()=>{L.value=null,x.value="",K.value=null,Ie()}),J(L,e=>{e&&(x.value="")}),J(x,e=>{e.trim()&&(L.value=null)}),J(f,e=>{e==="routes"&&!s.value.length&&Ie()});async function lt(){if(!oe.value){d.value="Выберите документ из списка или введите GUID.";return}d.value="",m.value="";const e=await R.getDocumentApprovers(G.value,oe.value);K.value={assignments:e.assignments,users:e.users},Object.keys(w).forEach(t=>delete w[t]),e.assignments.forEach(t=>{w[t.role]=t.userId??""})}async function at(){if(K.value){E.value=!0,d.value="",m.value="";try{const e=K.value.assignments.map(t=>({role:t.role,userId:w[t.role]}));if(e.some(t=>!t.userId))throw new Error("Назначьте пользователя на каждый шаг.");await R.updateDocumentApprovers(G.value,oe.value,{assignments:e}),m.value="Согласующие документа обновлены."}catch(e){d.value=ee(e).detail||e.message}finally{E.value=!1}}}const ot=[{title:"Email",key:"email",ellipsis:{tooltip:!0}},{title:"ФИО",key:"fullName",render:e=>h(ce,{value:e.fullName,onUpdateValue:t=>{e.fullName=t}})},{title:"Роль",key:"role",render:e=>h(U,{value:e.role,options:be,style:"min-width:220px",onUpdateValue:t=>{e.role=t}})},{title:"Активен",key:"isActive",width:100,render:e=>h(He,{value:e.isActive,onUpdateValue:t=>{e.isActive=t}})},{title:"Действие",key:"actions",width:120,render:e=>h(W,{size:"small",type:"primary",onClick:()=>void Je(e)},{default:()=>"Сохранить"})}];return bt(()=>{ue(),Ce()}),(e,t)=>(V(),Ve(l(de),{title:"Администрирование"},{default:n(()=>[o(l(N),{vertical:"",size:16},{default:n(()=>[d.value?(V(),Ve(l(Me),{key:0,type:"error"},{default:n(()=>[D(_e(d.value),1)]),_:1})):Se("",!0),m.value?(V(),Ve(l(Me),{key:1,type:"success"},{default:n(()=>[D(_e(m.value),1)]),_:1})):Se("",!0),o(l(Ct),null,{default:n(()=>[o(l(W),{type:f.value==="users"?"primary":"default",secondary:f.value!=="users",onClick:t[0]||(t[0]=i=>f.value="users")},{default:n(()=>[...t[15]||(t[15]=[D(" Пользователи ",-1)])]),_:1},8,["type","secondary"]),o(l(W),{type:f.value==="routes"?"primary":"default",secondary:f.value!=="routes",onClick:t[1]||(t[1]=i=>f.value="routes")},{default:n(()=>[...t[16]||(t[16]=[D(" Маршруты согласования ",-1)])]),_:1},8,["type","secondary"])]),_:1}),Te(k("div",null,[o(l(N),{vertical:"",size:16,style:{"margin-top":"8px"}},{default:n(()=>[o(l(de),{title:"Добавить пользователя",size:"small"},{default:n(()=>[o(l(wt),{"label-placement":"left","label-width":130},{default:n(()=>[o(l(j),{label:"Компания"},{default:n(()=>[o(l(U),{value:r.employerCompany,"onUpdate:value":t[2]||(t[2]=i=>r.employerCompany=i),options:l(At),placeholder:"Выберите компанию",clearable:""},null,8,["value","options"])]),_:1}),o(l(j),{label:"Сотрудник ЗУП"},{default:n(()=>[o(l(U),{value:r.zupEmployeeId,"onUpdate:value":t[3]||(t[3]=i=>r.zupEmployeeId=i),options:Ne.value,loading:he.value,disabled:!r.employerCompany,filterable:"",clearable:"",placeholder:"Выберите сотрудника"},null,8,["value","options","loading","disabled"])]),_:1}),o(l(j),{label:"ФИО"},{default:n(()=>[o(l(ce),{value:r.fullName,readonly:"",placeholder:"Из ЗУП"},null,8,["value"])]),_:1}),o(l(j),{label:"Должность"},{default:n(()=>[o(l(ce),{value:r.position,readonly:"",placeholder:"Из ЗУП"},null,8,["value"])]),_:1}),o(l(j),{label:"Email"},{default:n(()=>[o(l(ce),{value:r.email,readonly:"",placeholder:"Из ЗУП"},null,8,["value"])]),_:1}),o(l(j),{label:"Роль"},{default:n(()=>[o(l(U),{value:r.role,"onUpdate:value":t[4]||(t[4]=i=>r.role=i),options:l(be)},null,8,["value","options"])]),_:1}),o(l(j),{label:"Активен"},{default:n(()=>[o(l(He),{value:r.isActive,"onUpdate:value":t[5]||(t[5]=i=>r.isActive=i)},null,8,["value"])]),_:1}),o(l(W),{type:"primary",loading:me.value,disabled:!r.zupEmployeeId,onClick:Xe},{default:n(()=>[...t[17]||(t[17]=[D(" Добавить ",-1)])]),_:1},8,["loading","disabled"])]),_:1})]),_:1}),o(l(de),{title:"Список пользователей",size:"small"},{default:n(()=>[o(l(N),{vertical:"",size:12},{default:n(()=>[o(l(N),{vertical:"",size:12,class:"t-admin-filters"},{default:n(()=>[o(l(ce),{value:H.value,"onUpdate:value":t[6]||(t[6]=i=>H.value=i),clearable:"",placeholder:"Поиск по ФИО или email",onKeyup:gt(Fe,["enter"])},null,8,["value"]),o(l(N),{size:12,wrap:"",class:"t-admin-filters__row"},{default:n(()=>[o(l(U),{value:v.value,"onUpdate:value":t[7]||(t[7]=i=>v.value=i),class:"t-admin-filters__field",options:[{label:"Все роли",value:""},...l(be)],clearable:"",placeholder:"Роль"},null,8,["value","options"]),o(l(U),{value:g.value,"onUpdate:value":t[8]||(t[8]=i=>g.value=i),class:"t-admin-filters__field",options:T,placeholder:"Статус"},null,8,["value"])]),_:1}),o(l(N),{size:8,class:"t-admin-filters__actions"},{default:n(()=>[o(l(W),{type:"primary",onClick:Fe},{default:n(()=>[...t[18]||(t[18]=[D("Найти",-1)])]),_:1}),o(l(W),{secondary:"",onClick:Ze},{default:n(()=>[...t[19]||(t[19]=[D("Сбросить",-1)])]),_:1})]),_:1})]),_:1}),k("div",Bt,[o(l(_t),{loading:_.value,class:"t-data-table",columns:ot,data:$.value,bordered:!1,size:"small","row-key":i=>i.id,remote:"",pagination:ye.value,"onUpdate:page":t[9]||(t[9]=i=>{C.value=i}),"onUpdate:pageSize":t[10]||(t[10]=i=>{S.value=i,C.value=1})},null,8,["loading","data","row-key","pagination"])])]),_:1})]),_:1})]),_:1})],512),[[We,f.value==="users"]]),Te(k("div",null,[o(l(N),{vertical:"",size:16,style:{"margin-top":"8px"}},{default:n(()=>[o(l(de),{title:"Маршрут согласования (закупка/дефектный акт)",size:"small",loading:b.value},{default:n(()=>[k("div",It,[(V(!0),Q(xe,null,je(F.value,i=>(V(),Q("div",{key:i.role,class:"t-route-row"},[k("div",{class:"t-route-row__label",title:i.roleLabel},_e(i.roleLabel),9,Et),k("div",Pt,[o(l(U),{value:X[i.role],"onUpdate:value":we=>X[i.role]=we,filterable:"",clearable:"",options:P.value,placeholder:"Выберите пользователя"},null,8,["value","onUpdate:value","options"])])]))),128))]),o(l(N),{style:{"margin-top":"14px"}},{default:n(()=>[o(l(W),{type:"primary",loading:B.value,onClick:Qe},{default:n(()=>[...t[20]||(t[20]=[D("Сохранить маршрут",-1)])]),_:1},8,["loading"])]),_:1})]),_:1},8,["loading"]),o(l(de),{title:"Проектные согласующие (РП/СБ)",size:"small"},{default:n(()=>[o(l(N),{vertical:"",size:12},{default:n(()=>[o(l(j),{label:"Проект",class:"t-route-project-picker"},{default:n(()=>[o(l(U),{value:I.value,"onUpdate:value":t[11]||(t[11]=i=>I.value=i),filterable:"",clearable:"",options:ae.value,placeholder:"Выберите проект"},null,8,["value","options"])]),_:1}),I.value&&se.value.length?(V(),Q(xe,{key:0},[k("div",Dt,[(V(!0),Q(xe,null,je(se.value,i=>(V(),Q("div",{key:`project-${i.role}`,class:"t-route-row"},[k("div",{class:"t-route-row__label",title:i.roleLabel},_e(i.roleLabel),9,Vt),k("div",jt,[o(l(U),{value:Z[i.role],"onUpdate:value":we=>Z[i.role]=we,filterable:"",clearable:"",options:P.value,placeholder:"Выберите пользователя"},null,8,["value","onUpdate:value","options"])])]))),128))]),o(l(N),null,{default:n(()=>[o(l(W),{type:"primary",loading:fe.value,onClick:et},{default:n(()=>[...t[21]||(t[21]=[D(" Сохранить проектные назначения ",-1)])]),_:1},8,["loading"])]),_:1})],64)):Se("",!0)]),_:1})]),_:1}),o(l(de),{title:"Смена согласующего по документу",size:"small"},{default:n(()=>[o(l(N),{vertical:"",size:12},{default:n(()=>[k("div",Ot,[o(l(j),{label:"Тип документа"},{default:n(()=>[o(l(U),{value:G.value,"onUpdate:value":t[12]||(t[12]=i=>G.value=i),options:[{label:"Дефектный акт",value:"defect_act"},{label:"Заявка",value:"purchase_request"}]},null,8,["value"])]),_:1}),o(l(j),{label:"Документ"},{default:n(()=>[o(l(U),{value:L.value,"onUpdate:value":t[13]||(t[13]=i=>L.value=i),filterable:"",clearable:"",remote:"",loading:z.value,options:Be.value,placeholder:"Например: PR-00002",onSearch:tt},null,8,["value","loading","options"])]),_:1}),o(l(W),{type:"primary",onClick:lt},{default:n(()=>[...t[22]||(t[22]=[D("Загрузить",-1)])]),_:1})]),o(l(j),{label:"Или GUID",class:"t-doc-guid-field"},{default:n(()=>[o(l(ce),{value:x.value,"onUpdate:value":t[14]||(t[14]=i=>x.value=i),placeholder:"00000000-0000-0000-0000-000000000000",clearable:""},null,8,["value"])]),_:1}),K.value?(V(),Q(xe,{key:0},[k("div",Ft,[(V(!0),Q(xe,null,je(K.value.assignments,i=>(V(),Q("div",{key:`doc-${i.role}`,class:"t-route-row"},[k("div",{class:"t-route-row__label",title:i.roleLabel},_e(i.roleLabel),9,Lt),k("div",Tt,[o(l(U),{value:w[i.role],"onUpdate:value":we=>w[i.role]=we,filterable:"",clearable:"",options:Ue.value,placeholder:"Выберите пользователя"},null,8,["value","onUpdate:value","options"])])]))),128))]),o(l(N),null,{default:n(()=>[o(l(W),{type:"primary",loading:E.value,onClick:at},{default:n(()=>[...t[23]||(t[23]=[D(" Сохранить согласующих документа ",-1)])]),_:1},8,["loading"])]),_:1})],64)):Se("",!0)]),_:1})]),_:1})]),_:1})],512),[[We,f.value==="routes"]])]),_:1})]),_:1}))}}),Qt=xt(Wt,[["__scopeId","data-v-7baab5bf"]]);export{Qt as default};
