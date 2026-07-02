import{a9 as vt,aa as ge,H as t,d as G,v as qe,Z as mt,_ as er,ab as tr,J as Se,y as Ze,C as W,z as x,ac as tt,ad as rr,ae as or,a2 as V,T as De,af as nr,ag as rt,ah as ir,ai as Fe,aj as ar,ak as lr,I as Re,r as _,O as sr,N as wt,al as Ie,P as ve,K as Xe,am as ur,a4 as fe,a6 as je,n as dr,k as B,a8 as N,an as He,ao as Ge,ap as Le,F as bt,L as We,M as Ue,aq as xt,ar as yt,as as Ct,at as Rt,au as cr,av as j,Q as ot,aw as nt,E as le,ax as fr,ay as St,az as gr,aA as it,B as pe,aB as hr,a0 as pr,aC as vr,aD as mr,a1 as wr,$ as br,a5 as xr,q as $e,f as be,w as oe,b as X,Y as yr,g as se,m as Cr,o as ne,i as de,p as Q,t as ee,a as Z,c as xe}from"./mechanization.js";import{d as kt,i as ce,N as Ae}from"./mechanization-inventory.js";import{u as Ne,f as ye,N as at}from"./mechanization-Icon.js";import{i as Rr,o as Sr}from"./mechanization-utils.js";import{c as kr,a as Pr,d as Lr,b as Or}from"./mechanization-Dropdown.js";import{u as Tr,E as Ir}from"./mechanization-Input.js";import{A as $r}from"./mechanization-Add.js";import{u as Br}from"./mechanization-use-message.js";import{N as Ee}from"./mechanization-Space.js";import{_ as zr}from"./mechanization-_plugin-vue_export-helper.js";function Dr(e,r,o,n){for(var i=-1,a=e==null?0:e.length;++i<a;)o=r(o,e[i],i,e);return o}function Ur(e){return function(r){return e==null?void 0:e[r]}}var Nr={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"},_r=Ur(Nr),Mr=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Fr="\\u0300-\\u036f",jr="\\ufe20-\\ufe2f",Ar="\\u20d0-\\u20ff",Er=Fr+jr+Ar,Hr="["+Er+"]",Wr=RegExp(Hr,"g");function Vr(e){return e=vt(e),e&&e.replace(Mr,_r).replace(Wr,"")}var qr=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;function Zr(e){return e.match(qr)||[]}var Xr=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;function Gr(e){return Xr.test(e)}var Pt="\\ud800-\\udfff",Yr="\\u0300-\\u036f",Kr="\\ufe20-\\ufe2f",Jr="\\u20d0-\\u20ff",Qr=Yr+Kr+Jr,Lt="\\u2700-\\u27bf",Ot="a-z\\xdf-\\xf6\\xf8-\\xff",eo="\\xac\\xb1\\xd7\\xf7",to="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",ro="\\u2000-\\u206f",oo=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",Tt="A-Z\\xc0-\\xd6\\xd8-\\xde",no="\\ufe0e\\ufe0f",It=eo+to+ro+oo,$t="['’]",lt="["+It+"]",io="["+Qr+"]",Bt="\\d+",ao="["+Lt+"]",zt="["+Ot+"]",Dt="[^"+Pt+It+Bt+Lt+Ot+Tt+"]",lo="\\ud83c[\\udffb-\\udfff]",so="(?:"+io+"|"+lo+")",uo="[^"+Pt+"]",Ut="(?:\\ud83c[\\udde6-\\uddff]){2}",Nt="[\\ud800-\\udbff][\\udc00-\\udfff]",Ce="["+Tt+"]",co="\\u200d",st="(?:"+zt+"|"+Dt+")",fo="(?:"+Ce+"|"+Dt+")",ut="(?:"+$t+"(?:d|ll|m|re|s|t|ve))?",dt="(?:"+$t+"(?:D|LL|M|RE|S|T|VE))?",_t=so+"?",Mt="["+no+"]?",go="(?:"+co+"(?:"+[uo,Ut,Nt].join("|")+")"+Mt+_t+")*",ho="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",po="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",vo=Mt+_t+go,mo="(?:"+[ao,Ut,Nt].join("|")+")"+vo,wo=RegExp([Ce+"?"+zt+"+"+ut+"(?="+[lt,Ce,"$"].join("|")+")",fo+"+"+dt+"(?="+[lt,Ce+st,"$"].join("|")+")",Ce+"?"+st+"+"+ut,Ce+"+"+dt,po,ho,Bt,mo].join("|"),"g");function bo(e){return e.match(wo)||[]}function xo(e,r,o){return e=vt(e),r=r,r===void 0?Gr(e)?bo(e):Zr(e):e.match(r)||[]}var yo="['’]",Co=RegExp(yo,"g");function Ro(e){return function(r){return Dr(xo(Vr(r).replace(Co,"")),e,"")}}var So=Ro(function(e,r,o){return e+(o?"-":"")+r.toLowerCase()});const ko=ge("attach",()=>t("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},t("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},t("g",{fill:"currentColor","fill-rule":"nonzero"},t("path",{d:"M3.25735931,8.70710678 L7.85355339,4.1109127 C8.82986412,3.13460197 10.4127766,3.13460197 11.3890873,4.1109127 C12.365398,5.08722343 12.365398,6.67013588 11.3890873,7.64644661 L6.08578644,12.9497475 C5.69526215,13.3402718 5.06209717,13.3402718 4.67157288,12.9497475 C4.28104858,12.5592232 4.28104858,11.9260582 4.67157288,11.5355339 L9.97487373,6.23223305 C10.1701359,6.0369709 10.1701359,5.72038841 9.97487373,5.52512627 C9.77961159,5.32986412 9.4630291,5.32986412 9.26776695,5.52512627 L3.96446609,10.8284271 C3.18341751,11.6094757 3.18341751,12.8758057 3.96446609,13.6568542 C4.74551468,14.4379028 6.01184464,14.4379028 6.79289322,13.6568542 L12.0961941,8.35355339 C13.4630291,6.98671837 13.4630291,4.77064094 12.0961941,3.40380592 C10.7293591,2.0369709 8.51328163,2.0369709 7.14644661,3.40380592 L2.55025253,8 C2.35499039,8.19526215 2.35499039,8.51184464 2.55025253,8.70710678 C2.74551468,8.90236893 3.06209717,8.90236893 3.25735931,8.70710678 Z"}))))),Po=ge("cancel",()=>t("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},t("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},t("g",{fill:"currentColor","fill-rule":"nonzero"},t("path",{d:"M2.58859116,2.7156945 L2.64644661,2.64644661 C2.82001296,2.47288026 3.08943736,2.45359511 3.2843055,2.58859116 L3.35355339,2.64644661 L8,7.293 L12.6464466,2.64644661 C12.8417088,2.45118446 13.1582912,2.45118446 13.3535534,2.64644661 C13.5488155,2.84170876 13.5488155,3.15829124 13.3535534,3.35355339 L8.707,8 L13.3535534,12.6464466 C13.5271197,12.820013 13.5464049,13.0894374 13.4114088,13.2843055 L13.3535534,13.3535534 C13.179987,13.5271197 12.9105626,13.5464049 12.7156945,13.4114088 L12.6464466,13.3535534 L8,8.707 L3.35355339,13.3535534 C3.15829124,13.5488155 2.84170876,13.5488155 2.64644661,13.3535534 C2.45118446,13.1582912 2.45118446,12.8417088 2.64644661,12.6464466 L7.293,8 L2.64644661,3.35355339 C2.47288026,3.17998704 2.45359511,2.91056264 2.58859116,2.7156945 L2.64644661,2.64644661 L2.58859116,2.7156945 Z"}))))),Ft=ge("download",()=>t("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},t("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},t("g",{fill:"currentColor","fill-rule":"nonzero"},t("path",{d:"M3.5,13 L12.5,13 C12.7761424,13 13,13.2238576 13,13.5 C13,13.7454599 12.8231248,13.9496084 12.5898756,13.9919443 L12.5,14 L3.5,14 C3.22385763,14 3,13.7761424 3,13.5 C3,13.2545401 3.17687516,13.0503916 3.41012437,13.0080557 L3.5,13 L12.5,13 L3.5,13 Z M7.91012437,1.00805567 L8,1 C8.24545989,1 8.44960837,1.17687516 8.49194433,1.41012437 L8.5,1.5 L8.5,10.292 L11.1819805,7.6109127 C11.3555469,7.43734635 11.6249713,7.4180612 11.8198394,7.55305725 L11.8890873,7.6109127 C12.0626536,7.78447906 12.0819388,8.05390346 11.9469427,8.2487716 L11.8890873,8.31801948 L8.35355339,11.8535534 C8.17998704,12.0271197 7.91056264,12.0464049 7.7156945,11.9114088 L7.64644661,11.8535534 L4.1109127,8.31801948 C3.91565056,8.12275734 3.91565056,7.80617485 4.1109127,7.6109127 C4.28447906,7.43734635 4.55390346,7.4180612 4.7487716,7.55305725 L4.81801948,7.6109127 L7.5,10.292 L7.5,1.5 C7.5,1.25454011 7.67687516,1.05039163 7.91012437,1.00805567 L8,1 L7.91012437,1.00805567 Z"}))))),Lo=G({name:"ResizeSmall",render(){return t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},t("g",{fill:"none"},t("path",{d:"M5.5 4A1.5 1.5 0 0 0 4 5.5v1a.5.5 0 0 1-1 0v-1A2.5 2.5 0 0 1 5.5 3h1a.5.5 0 0 1 0 1h-1zM16 5.5A1.5 1.5 0 0 0 14.5 4h-1a.5.5 0 0 1 0-1h1A2.5 2.5 0 0 1 17 5.5v1a.5.5 0 0 1-1 0v-1zm0 9a1.5 1.5 0 0 1-1.5 1.5h-1a.5.5 0 0 0 0 1h1a2.5 2.5 0 0 0 2.5-2.5v-1a.5.5 0 0 0-1 0v1zm-12 0A1.5 1.5 0 0 0 5.5 16h1.25a.5.5 0 0 1 0 1H5.5A2.5 2.5 0 0 1 3 14.5v-1.25a.5.5 0 0 1 1 0v1.25zM8.5 7A1.5 1.5 0 0 0 7 8.5v3A1.5 1.5 0 0 0 8.5 13h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 11.5 7h-3zM8 8.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z",fill:"currentColor"})))}}),Oo=ge("retry",()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},t("path",{d:"M320,146s24.36-12-64-12A160,160,0,1,0,416,294",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px;"}),t("polyline",{points:"256 58 336 138 256 218",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}))),To=ge("rotateClockwise",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 12.7916 15.3658 15.2026 13 16.3265V14.5C13 14.2239 12.7761 14 12.5 14C12.2239 14 12 14.2239 12 14.5V17.5C12 17.7761 12.2239 18 12.5 18H15.5C15.7761 18 16 17.7761 16 17.5C16 17.2239 15.7761 17 15.5 17H13.8758C16.3346 15.6357 18 13.0128 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 10.2761 2.22386 10.5 2.5 10.5C2.77614 10.5 3 10.2761 3 10Z",fill:"currentColor"}),t("path",{d:"M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12ZM10 11C9.44772 11 9 10.5523 9 10C9 9.44772 9.44772 9 10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11Z",fill:"currentColor"}))),Io=ge("rotateClockwise",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 12.7916 4.63419 15.2026 7 16.3265V14.5C7 14.2239 7.22386 14 7.5 14C7.77614 14 8 14.2239 8 14.5V17.5C8 17.7761 7.77614 18 7.5 18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H6.12422C3.66539 15.6357 2 13.0128 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 10.2761 17.7761 10.5 17.5 10.5C17.2239 10.5 17 10.2761 17 10Z",fill:"currentColor"}),t("path",{d:"M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12ZM10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z",fill:"currentColor"}))),$o=ge("trash",()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},t("path",{d:"M432,144,403.33,419.74A32,32,0,0,1,371.55,448H140.46a32,32,0,0,1-31.78-28.26L80,144",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),t("rect",{x:"32",y:"64",width:"448",height:"80",rx:"16",ry:"16",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),t("line",{x1:"312",y1:"240",x2:"200",y2:"352",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),t("line",{x1:"312",y1:"352",x2:"200",y2:"240",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}))),Bo=ge("zoomIn",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M11.5 8.5C11.5 8.22386 11.2761 8 11 8H9V6C9 5.72386 8.77614 5.5 8.5 5.5C8.22386 5.5 8 5.72386 8 6V8H6C5.72386 8 5.5 8.22386 5.5 8.5C5.5 8.77614 5.72386 9 6 9H8V11C8 11.2761 8.22386 11.5 8.5 11.5C8.77614 11.5 9 11.2761 9 11V9H11C11.2761 9 11.5 8.77614 11.5 8.5Z",fill:"currentColor"}),t("path",{d:"M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z",fill:"currentColor"}))),zo=ge("zoomOut",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M11 8C11.2761 8 11.5 8.22386 11.5 8.5C11.5 8.77614 11.2761 9 11 9H6C5.72386 9 5.5 8.77614 5.5 8.5C5.5 8.22386 5.72386 8 6 8H11Z",fill:"currentColor"}),t("path",{d:"M14 8.5C14 5.46243 11.5376 3 8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.1464 16.8536L16.2157 16.9114C16.4106 17.0464 16.68 17.0271 16.8536 16.8536C17.0488 16.6583 17.0488 16.3417 16.8536 16.1464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z",fill:"currentColor"})));function Do(e){const{infoColor:r,successColor:o,warningColor:n,errorColor:i,textColor2:a,progressRailColor:l,fontSize:s,fontWeight:u}=e;return{fontSize:s,fontSizeCircle:"28px",fontWeightCircle:u,railColor:l,railHeight:"8px",iconSizeCircle:"36px",iconSizeLine:"18px",iconColor:r,iconColorInfo:r,iconColorSuccess:o,iconColorWarning:n,iconColorError:i,textColorCircle:a,textColorLineInner:"rgb(255, 255, 255)",textColorLineOuter:a,fillColor:r,fillColorInfo:r,fillColorSuccess:o,fillColorWarning:n,fillColorError:i,lineBgProcessing:"linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"}}const jt={name:"Progress",common:qe,self:Do};function Uo(e){const{iconColor:r,primaryColor:o,errorColor:n,textColor2:i,successColor:a,opacityDisabled:l,actionColor:s,borderColor:u,hoverColor:c,lineHeight:d,borderRadius:h,fontSize:C}=e;return{fontSize:C,lineHeight:d,borderRadius:h,draggerColor:s,draggerBorder:`1px dashed ${u}`,draggerBorderHover:`1px dashed ${o}`,itemColorHover:c,itemColorHoverError:tr(n,{alpha:.06}),itemTextColor:i,itemTextColorError:n,itemTextColorSuccess:a,itemIconColor:r,itemDisabledOpacity:l,itemBorderImageCardError:`1px solid ${n}`,itemBorderImageCard:`1px solid ${u}`}}const No=mt({name:"Upload",common:qe,peers:{Button:er,Progress:jt},self:Uo});function _o(){return{toolbarIconColor:"rgba(255, 255, 255, .9)",toolbarColor:"rgba(0, 0, 0, .35)",toolbarBoxShadow:"none",toolbarBorderRadius:"24px"}}const Mo=mt({name:"Image",common:qe,peers:{Tooltip:kr},self:_o});function Fo(){return t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M6 5C5.75454 5 5.55039 5.17688 5.50806 5.41012L5.5 5.5V14.5C5.5 14.7761 5.72386 15 6 15C6.24546 15 6.44961 14.8231 6.49194 14.5899L6.5 14.5V5.5C6.5 5.22386 6.27614 5 6 5ZM13.8536 5.14645C13.68 4.97288 13.4106 4.9536 13.2157 5.08859L13.1464 5.14645L8.64645 9.64645C8.47288 9.82001 8.4536 10.0894 8.58859 10.2843L8.64645 10.3536L13.1464 14.8536C13.3417 15.0488 13.6583 15.0488 13.8536 14.8536C14.0271 14.68 14.0464 14.4106 13.9114 14.2157L13.8536 14.1464L9.70711 10L13.8536 5.85355C14.0488 5.65829 14.0488 5.34171 13.8536 5.14645Z",fill:"currentColor"}))}function jo(){return t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M13.5 5C13.7455 5 13.9496 5.17688 13.9919 5.41012L14 5.5V14.5C14 14.7761 13.7761 15 13.5 15C13.2545 15 13.0504 14.8231 13.0081 14.5899L13 14.5V5.5C13 5.22386 13.2239 5 13.5 5ZM5.64645 5.14645C5.82001 4.97288 6.08944 4.9536 6.28431 5.08859L6.35355 5.14645L10.8536 9.64645C11.0271 9.82001 11.0464 10.0894 10.9114 10.2843L10.8536 10.3536L6.35355 14.8536C6.15829 15.0488 5.84171 15.0488 5.64645 14.8536C5.47288 14.68 5.4536 14.4106 5.58859 14.2157L5.64645 14.1464L9.79289 10L5.64645 5.85355C5.45118 5.65829 5.45118 5.34171 5.64645 5.14645Z",fill:"currentColor"}))}function Ao(){return t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M4.089 4.216l.057-.07a.5.5 0 0 1 .638-.057l.07.057L10 9.293l5.146-5.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 .057.638l-.057.07L10.707 10l5.147 5.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057L10 10.707l-5.146 5.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1-.057-.638l.057-.07L9.293 10L4.146 4.854a.5.5 0 0 1-.057-.638l.057-.07l-.057.07z",fill:"currentColor"}))}const Ye=Object.assign(Object.assign({},Se.props),{onPreviewPrev:Function,onPreviewNext:Function,showToolbar:{type:Boolean,default:!0},showToolbarTooltip:Boolean,renderToolbar:Function}),At=Ze("n-image"),Eo=W([W("body >",[x("image-container","position: fixed;")]),x("image-preview-container",`
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 `),x("image-preview-overlay",`
 z-index: -1;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background: rgba(0, 0, 0, .3);
 `,[tt()]),x("image-preview-toolbar",`
 z-index: 1;
 position: absolute;
 left: 50%;
 transform: translateX(-50%);
 border-radius: var(--n-toolbar-border-radius);
 height: 48px;
 bottom: 40px;
 padding: 0 12px;
 background: var(--n-toolbar-color);
 box-shadow: var(--n-toolbar-box-shadow);
 color: var(--n-toolbar-icon-color);
 transition: color .3s var(--n-bezier);
 display: flex;
 align-items: center;
 `,[x("base-icon",`
 padding: 0 8px;
 font-size: 28px;
 cursor: pointer;
 `),tt()]),x("image-preview-wrapper",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 pointer-events: none;
 `,[rr()]),x("image-preview",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: all;
 margin: auto;
 max-height: calc(100vh - 32px);
 max-width: calc(100vw - 32px);
 transition: transform .3s var(--n-bezier);
 `),x("image",`
 display: inline-flex;
 max-height: 100%;
 max-width: 100%;
 `,[or("preview-disabled",`
 cursor: pointer;
 `),W("img",`
 border-radius: inherit;
 `)])]),Be=32,Ho=Object.assign(Object.assign({},Ye),{src:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],onNext:Function,onPrev:Function,onClose:[Function,Array]}),Et=G({name:"ImagePreview",props:Ho,setup(e){const{src:r}=lr(e),{mergedClsPrefixRef:o}=Re(e),n=Se("Image","-image",Eo,Mo,e,o);let i=null;const a=_(null),l=_(null),s=_(!1),{localeRef:u}=Tr("Image"),c=_(e.defaultShow),d=N(e,"show"),h=Ne(d,c);function C(){const{value:g}=l;if(!i||!g)return;const{style:S}=g,w=i.getBoundingClientRect(),M=w.left+w.width/2,F=w.top+w.height/2;S.transformOrigin=`${M}px ${F}px`}function $(g){var S,w;switch(g.key){case" ":g.preventDefault();break;case"ArrowLeft":(S=e.onPrev)===null||S===void 0||S.call(e);break;case"ArrowRight":(w=e.onNext)===null||w===void 0||w.call(e);break;case"ArrowUp":g.preventDefault(),Te();break;case"ArrowDown":g.preventDefault(),Ke();break;case"Escape":Je();break}}function m(g){const{onUpdateShow:S,"onUpdate:show":w}=e;S&&fe(S,g),w&&fe(w,g),c.value=g,s.value=!0}sr(h,g=>{g?je("keydown",document,$):Ie("keydown",document,$)}),wt(()=>{Ie("keydown",document,$)});let f=0,k=0,R=0,I=0,y=0,v=0,p=0,T=0,z=!1;function O(g){const{clientX:S,clientY:w}=g;R=S-f,I=w-k,Lr(ie)}function L(g){const{mouseUpClientX:S,mouseUpClientY:w,mouseDownClientX:M,mouseDownClientY:F}=g,J=M-S,re=F-w,ae=`vertical${re>0?"Top":"Bottom"}`,he=`horizontal${J>0?"Left":"Right"}`;return{moveVerticalDirection:ae,moveHorizontalDirection:he,deltaHorizontal:J,deltaVertical:re}}function U(g){const{value:S}=a;if(!S)return{offsetX:0,offsetY:0};const w=S.getBoundingClientRect(),{moveVerticalDirection:M,moveHorizontalDirection:F,deltaHorizontal:J,deltaVertical:re}=g||{};let ae=0,he=0;return w.width<=window.innerWidth?ae=0:w.left>0?ae=(w.width-window.innerWidth)/2:w.right<window.innerWidth?ae=-(w.width-window.innerWidth)/2:F==="horizontalRight"?ae=Math.min((w.width-window.innerWidth)/2,y-(J??0)):ae=Math.max(-((w.width-window.innerWidth)/2),y-(J??0)),w.height<=window.innerHeight?he=0:w.top>0?he=(w.height-window.innerHeight)/2:w.bottom<window.innerHeight?he=-(w.height-window.innerHeight)/2:M==="verticalBottom"?he=Math.min((w.height-window.innerHeight)/2,v-(re??0)):he=Math.max(-((w.height-window.innerHeight)/2),v-(re??0)),{offsetX:ae,offsetY:he}}function b(g){Ie("mousemove",document,O),Ie("mouseup",document,b);const{clientX:S,clientY:w}=g;z=!1;const M=L({mouseUpClientX:S,mouseUpClientY:w,mouseDownClientX:p,mouseDownClientY:T}),F=U(M);R=F.offsetX,I=F.offsetY,ie()}const P=ve(At,null);function A(g){var S,w;if((w=(S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.onMousedown)===null||w===void 0||w.call(S,g),g.button!==0)return;const{clientX:M,clientY:F}=g;z=!0,f=M-R,k=F-I,y=R,v=I,p=M,T=F,ie(),je("mousemove",document,O),je("mouseup",document,b)}const Y=1.5;let q=0,D=1,E=0;function H(g){var S,w;(w=(S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.onDblclick)===null||w===void 0||w.call(S,g);const M=Oe();D=D===M?1:M,ie()}function K(){D=1,q=0}function ue(){var g;K(),E=0,(g=e.onPrev)===null||g===void 0||g.call(e)}function te(){var g;K(),E=0,(g=e.onNext)===null||g===void 0||g.call(e)}function me(){E-=90,ie()}function _e(){E+=90,ie()}function Me(){const{value:g}=a;if(!g)return 1;const{innerWidth:S,innerHeight:w}=window,M=Math.max(1,g.naturalHeight/(w-Be)),F=Math.max(1,g.naturalWidth/(S-Be));return Math.max(3,M*2,F*2)}function Oe(){const{value:g}=a;if(!g)return 1;const{innerWidth:S,innerHeight:w}=window,M=g.naturalHeight/(w-Be),F=g.naturalWidth/(S-Be);return M<1&&F<1?1:Math.max(M,F)}function Te(){const g=Me();D<g&&(q+=1,D=Math.min(g,Math.pow(Y,q)),ie())}function Ke(){if(D>.5){const g=D;q-=1,D=Math.max(.5,Math.pow(Y,q));const S=g-D;ie(!1);const w=U();D+=S,ie(!1),D-=S,R=w.offsetX,I=w.offsetY,ie()}}function Gt(){const g=r.value;g&&kt(g,void 0)}function ie(g=!0){var S;const{value:w}=a;if(!w)return;const{style:M}=w,F=dr((S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.style);let J="";if(typeof F=="string")J=`${F};`;else for(const ae in F)J+=`${So(ae)}: ${F[ae]};`;const re=`transform-origin: center; transform: translateX(${R}px) translateY(${I}px) rotate(${E}deg) scale(${D});`;z?M.cssText=`${J}cursor: grabbing; transition: none;${re}`:M.cssText=`${J}cursor: grab;${re}${g?"":"transition: none;"}`,g||w.offsetHeight}function Je(){if(h.value){const{onClose:g}=e;g&&fe(g),m(!1),c.value=!1}}function Yt(){D=Oe(),q=Math.ceil(Math.log(D)/Math.log(Y)),R=0,I=0,ie()}const Kt={setThumbnailEl:g=>{i=g}};function Jt(g,S){if(e.showToolbarTooltip){const{value:w}=n;return t(Pr,{to:!1,theme:w.peers.Tooltip,themeOverrides:w.peerOverrides.Tooltip,keepAliveOnHover:!1},{default:()=>u.value[S],trigger:()=>g})}else return g}const Qe=B(()=>{const{common:{cubicBezierEaseInOut:g},self:{toolbarIconColor:S,toolbarBorderRadius:w,toolbarBoxShadow:M,toolbarColor:F}}=n.value;return{"--n-bezier":g,"--n-toolbar-icon-color":S,"--n-toolbar-color":F,"--n-toolbar-border-radius":w,"--n-toolbar-box-shadow":M}}),{inlineThemeDisabled:et}=Re(),we=et?Xe("image-preview",void 0,Qe,e):void 0;function Qt(g){g.preventDefault()}return Object.assign({clsPrefix:o,previewRef:a,previewWrapperRef:l,previewSrc:r,mergedShow:h,appear:ur(),displayed:s,previewedImgProps:P==null?void 0:P.previewedImgPropsRef,handleWheel:Qt,handlePreviewMousedown:A,handlePreviewDblclick:H,syncTransformOrigin:C,handleAfterLeave:()=>{K(),E=0,s.value=!1},handleDragStart:g=>{var S,w;(w=(S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.onDragstart)===null||w===void 0||w.call(S,g),g.preventDefault()},zoomIn:Te,zoomOut:Ke,handleDownloadClick:Gt,rotateCounterclockwise:me,rotateClockwise:_e,handleSwitchPrev:ue,handleSwitchNext:te,withTooltip:Jt,resizeToOrignalImageSize:Yt,cssVars:et?void 0:Qe,themeClass:we==null?void 0:we.themeClass,onRender:we==null?void 0:we.onRender,doUpdateShow:m,close:Je},Kt)},render(){var e,r;const{clsPrefix:o,renderToolbar:n,withTooltip:i}=this,a=i(t(V,{clsPrefix:o,onClick:this.handleSwitchPrev},{default:Fo}),"tipPrevious"),l=i(t(V,{clsPrefix:o,onClick:this.handleSwitchNext},{default:jo}),"tipNext"),s=i(t(V,{clsPrefix:o,onClick:this.rotateCounterclockwise},{default:()=>t(Io,null)}),"tipCounterclockwise"),u=i(t(V,{clsPrefix:o,onClick:this.rotateClockwise},{default:()=>t(To,null)}),"tipClockwise"),c=i(t(V,{clsPrefix:o,onClick:this.resizeToOrignalImageSize},{default:()=>t(Lo,null)}),"tipOriginalSize"),d=i(t(V,{clsPrefix:o,onClick:this.zoomOut},{default:()=>t(zo,null)}),"tipZoomOut"),h=i(t(V,{clsPrefix:o,onClick:this.handleDownloadClick},{default:()=>t(Ft,null)}),"tipDownload"),C=i(t(V,{clsPrefix:o,onClick:()=>this.close()},{default:Ao}),"tipClose"),$=i(t(V,{clsPrefix:o,onClick:this.zoomIn},{default:()=>t(Bo,null)}),"tipZoomIn");return t(De,null,(r=(e=this.$slots).default)===null||r===void 0?void 0:r.call(e),t(nr,{show:this.mergedShow},{default:()=>{var m;return this.mergedShow||this.displayed?((m=this.onRender)===null||m===void 0||m.call(this),rt(t("div",{ref:"containerRef",class:[`${o}-image-preview-container`,this.themeClass],style:this.cssVars,onWheel:this.handleWheel},t(Fe,{name:"fade-in-transition",appear:this.appear},{default:()=>this.mergedShow?t("div",{class:`${o}-image-preview-overlay`,onClick:()=>this.close()}):null}),this.showToolbar?t(Fe,{name:"fade-in-transition",appear:this.appear},{default:()=>this.mergedShow?t("div",{class:`${o}-image-preview-toolbar`},n?n({nodes:{prev:a,next:l,rotateCounterclockwise:s,rotateClockwise:u,resizeToOriginalSize:c,zoomOut:d,zoomIn:$,download:h,close:C}}):t(De,null,this.onPrev?t(De,null,a,l):null,s,u,c,d,$,h,C)):null}):null,t(Fe,{name:"fade-in-scale-up-transition",onAfterLeave:this.handleAfterLeave,appear:this.appear,onEnter:this.syncTransformOrigin,onBeforeLeave:this.syncTransformOrigin},{default:()=>{const{previewedImgProps:f={}}=this;return rt(t("div",{class:`${o}-image-preview-wrapper`,ref:"previewWrapperRef"},t("img",Object.assign({},f,{draggable:!1,onMousedown:this.handlePreviewMousedown,onDblclick:this.handlePreviewDblclick,class:[`${o}-image-preview`,f.class],key:this.previewSrc,src:this.previewSrc,ref:"previewRef",onDragstart:this.handleDragStart}))),[[ar,this.mergedShow]])}})),[[ir,{enabled:this.mergedShow}]])):null}}))}}),Ht=Ze("n-image-group"),Wo=Object.assign(Object.assign({},Ye),{srcList:Array,current:Number,defaultCurrent:{type:Number,default:0},show:{type:Boolean,default:void 0},defaultShow:Boolean,onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],onUpdateCurrent:[Function,Array],"onUpdate:current":[Function,Array]}),Vo=G({name:"ImageGroup",props:Wo,setup(e){const{mergedClsPrefixRef:r}=Re(e),o=`c${He()}`,n=_(null),i=_(e.defaultShow),a=N(e,"show"),l=Ne(a,i),s=_(new Map),u=B(()=>{if(e.srcList){const O=new Map;return e.srcList.forEach((L,U)=>{O.set(`p${U}`,L)}),O}return s.value}),c=B(()=>Array.from(u.value.keys())),d=()=>c.value.length;function h(O,L){e.srcList&&Le("image-group","`n-image` can't be placed inside `n-image-group` when image group's `src-list` prop is set.");const U=`r${O}`;return s.value.has(`r${U}`)||s.value.set(U,L),function(){s.value.has(U)||s.value.delete(U)}}const C=_(e.defaultCurrent),$=N(e,"current"),m=Ne($,C),f=O=>{if(O!==m.value){const{onUpdateCurrent:L,"onUpdate:current":U}=e;L&&fe(L,O),U&&fe(U,O),C.value=O}},k=B(()=>c.value[m.value]),R=O=>{const L=c.value.indexOf(O);L!==m.value&&f(L)},I=B(()=>u.value.get(k.value));function y(O){const{onUpdateShow:L,"onUpdate:show":U}=e;L&&fe(L,O),U&&fe(U,O),i.value=O}function v(){y(!1)}const p=B(()=>{const O=(U,b)=>{for(let P=U;P<=b;P++){const A=c.value[P];if(u.value.get(A))return P}},L=O(m.value+1,d()-1);return L===void 0?O(0,m.value-1):L}),T=B(()=>{const O=(U,b)=>{for(let P=U;P>=b;P--){const A=c.value[P];if(u.value.get(A))return P}},L=O(m.value-1,0);return L===void 0?O(d()-1,m.value+1):L});function z(O){var L,U;O===1?(T.value!==void 0&&f(p.value),(L=e.onPreviewNext)===null||L===void 0||L.call(e)):(p.value!==void 0&&f(T.value),(U=e.onPreviewPrev)===null||U===void 0||U.call(e))}return Ge(Ht,{mergedClsPrefixRef:r,registerImageUrl:h,setThumbnailEl:O=>{var L;(L=n.value)===null||L===void 0||L.setThumbnailEl(O)},toggleShow:O=>{y(!0),R(O)},groupId:o,renderToolbarRef:N(e,"renderToolbar")}),{mergedClsPrefix:r,previewInstRef:n,mergedShow:l,src:I,onClose:v,next:()=>{z(1)},prev:()=>{z(-1)}}},render(){return t(Et,{theme:this.theme,themeOverrides:this.themeOverrides,ref:"previewInstRef",onPrev:this.prev,onNext:this.next,src:this.src,show:this.mergedShow,showToolbar:this.showToolbar,showToolbarTooltip:this.showToolbarTooltip,renderToolbar:this.renderToolbar,onClose:this.onClose},this.$slots)}}),qo=Object.assign({alt:String,height:[String,Number],imgProps:Object,previewedImgProps:Object,lazy:Boolean,intersectionObserverOptions:Object,objectFit:{type:String,default:"fill"},previewSrc:String,fallbackSrc:String,width:[String,Number],src:String,previewDisabled:Boolean,loadDescription:String,onError:Function,onLoad:Function},Ye);let Zo=0;const Xo=G({name:"Image",props:qo,slots:Object,inheritAttrs:!1,setup(e){const r=_(null),o=_(!1),n=_(null),i=ve(Ht,null),{mergedClsPrefixRef:a}=i||Re(e),l=B(()=>e.previewSrc||e.src),s=_(!1),u=Zo++,c=()=>{if(e.previewDisabled||o.value)return;if(i){i.setThumbnailEl(r.value),i.toggleShow(`r${u}`);return}const{value:f}=n;f&&(f.setThumbnailEl(r.value),s.value=!0)},d={click:()=>{c()},showPreview:c},h=_(!e.lazy);We(()=>{var f;(f=r.value)===null||f===void 0||f.setAttribute("data-group-id",(i==null?void 0:i.groupId)||"")}),We(()=>{if(e.lazy&&e.intersectionObserverOptions){let f;const k=Ue(()=>{f==null||f(),f=void 0,f=Sr(r.value,e.intersectionObserverOptions,h)});wt(()=>{k(),f==null||f()})}}),Ue(()=>{var f;e.src||((f=e.imgProps)===null||f===void 0||f.src),o.value=!1}),Ue(f=>{var k;const R=(k=i==null?void 0:i.registerImageUrl)===null||k===void 0?void 0:k.call(i,u,l.value||"");f(()=>{R==null||R()})});function C(f){var k,R;d.showPreview(),(R=(k=e.imgProps)===null||k===void 0?void 0:k.onClick)===null||R===void 0||R.call(k,f)}function $(){s.value=!1}const m=_(!1);return Ge(At,{previewedImgPropsRef:N(e,"previewedImgProps")}),Object.assign({mergedClsPrefix:a,groupId:i==null?void 0:i.groupId,previewInstRef:n,imageRef:r,mergedPreviewSrc:l,showError:o,shouldStartLoading:h,loaded:m,mergedOnClick:f=>{C(f)},onPreviewClose:$,mergedOnError:f=>{if(!h.value)return;o.value=!0;const{onError:k,imgProps:{onError:R}={}}=e;k==null||k(f),R==null||R(f)},mergedOnLoad:f=>{const{onLoad:k,imgProps:{onLoad:R}={}}=e;k==null||k(f),R==null||R(f),m.value=!0},previewShow:s},d)},render(){var e,r;const{mergedClsPrefix:o,imgProps:n={},loaded:i,$attrs:a,lazy:l}=this,s=bt(this.$slots.error,()=>[]),u=(r=(e=this.$slots).placeholder)===null||r===void 0?void 0:r.call(e),c=this.src||n.src,d=this.showError&&s.length?s:t("img",Object.assign(Object.assign({},n),{ref:"imageRef",width:this.width||n.width,height:this.height||n.height,src:this.showError?this.fallbackSrc:l&&this.intersectionObserverOptions?this.shouldStartLoading?c:void 0:c,alt:this.alt||n.alt,"aria-label":this.alt||n.alt,onClick:this.mergedOnClick,onError:this.mergedOnError,onLoad:this.mergedOnLoad,loading:Rr&&l&&!this.intersectionObserverOptions?"lazy":"eager",style:[n.style||"",u&&!i?{height:"0",width:"0",visibility:"hidden"}:"",{objectFit:this.objectFit}],"data-error":this.showError,"data-preview-src":this.previewSrc||this.src}));return t("div",Object.assign({},a,{role:"none",class:[a.class,`${o}-image`,(this.previewDisabled||this.showError)&&`${o}-image--preview-disabled`]}),this.groupId?d:t(Et,{theme:this.theme,themeOverrides:this.themeOverrides,ref:"previewInstRef",showToolbar:this.showToolbar,showToolbarTooltip:this.showToolbarTooltip,renderToolbar:this.renderToolbar,src:this.mergedPreviewSrc,show:!this.previewDisabled&&this.previewShow,onClose:this.onPreviewClose},{default:()=>d}),!i&&u)}}),Go={success:t(Rt,null),error:t(Ct,null),warning:t(yt,null),info:t(xt,null)},Yo=G({name:"ProgressCircle",props:{clsPrefix:{type:String,required:!0},status:{type:String,required:!0},strokeWidth:{type:Number,required:!0},fillColor:[String,Object],railColor:String,railStyle:[String,Object],percentage:{type:Number,default:0},offsetDegree:{type:Number,default:0},showIndicator:{type:Boolean,required:!0},indicatorTextColor:String,unit:String,viewBoxWidth:{type:Number,required:!0},gapDegree:{type:Number,required:!0},gapOffsetDegree:{type:Number,default:0}},setup(e,{slots:r}){const o=B(()=>{const a="gradient",{fillColor:l}=e;return typeof l=="object"?`${a}-${cr(JSON.stringify(l))}`:a});function n(a,l,s,u){const{gapDegree:c,viewBoxWidth:d,strokeWidth:h}=e,C=50,$=0,m=C,f=0,k=2*C,R=50+h/2,I=`M ${R},${R} m ${$},${m}
      a ${C},${C} 0 1 1 ${f},${-k}
      a ${C},${C} 0 1 1 ${-f},${k}`,y=Math.PI*2*C,v={stroke:u==="rail"?s:typeof e.fillColor=="object"?`url(#${o.value})`:s,strokeDasharray:`${Math.min(a,100)/100*(y-c)}px ${d*8}px`,strokeDashoffset:`-${c/2}px`,transformOrigin:l?"center":void 0,transform:l?`rotate(${l}deg)`:void 0};return{pathString:I,pathStyle:v}}const i=()=>{const a=typeof e.fillColor=="object",l=a?e.fillColor.stops[0]:"",s=a?e.fillColor.stops[1]:"";return a&&t("defs",null,t("linearGradient",{id:o.value,x1:"0%",y1:"100%",x2:"100%",y2:"0%"},t("stop",{offset:"0%","stop-color":l}),t("stop",{offset:"100%","stop-color":s})))};return()=>{const{fillColor:a,railColor:l,strokeWidth:s,offsetDegree:u,status:c,percentage:d,showIndicator:h,indicatorTextColor:C,unit:$,gapOffsetDegree:m,clsPrefix:f}=e,{pathString:k,pathStyle:R}=n(100,0,l,"rail"),{pathString:I,pathStyle:y}=n(d,u,a,"fill"),v=100+s;return t("div",{class:`${f}-progress-content`,role:"none"},t("div",{class:`${f}-progress-graph`,"aria-hidden":!0},t("div",{class:`${f}-progress-graph-circle`,style:{transform:m?`rotate(${m}deg)`:void 0}},t("svg",{viewBox:`0 0 ${v} ${v}`},i(),t("g",null,t("path",{class:`${f}-progress-graph-circle-rail`,d:k,"stroke-width":s,"stroke-linecap":"round",fill:"none",style:R})),t("g",null,t("path",{class:[`${f}-progress-graph-circle-fill`,d===0&&`${f}-progress-graph-circle-fill--empty`],d:I,"stroke-width":s,"stroke-linecap":"round",fill:"none",style:y}))))),h?t("div",null,r.default?t("div",{class:`${f}-progress-custom-content`,role:"none"},r.default()):c!=="default"?t("div",{class:`${f}-progress-icon`,"aria-hidden":!0},t(V,{clsPrefix:f},{default:()=>Go[c]})):t("div",{class:`${f}-progress-text`,style:{color:C},role:"none"},t("span",{class:`${f}-progress-text__percentage`},d),t("span",{class:`${f}-progress-text__unit`},$))):null)}}}),Ko={success:t(Rt,null),error:t(Ct,null),warning:t(yt,null),info:t(xt,null)},Jo=G({name:"ProgressLine",props:{clsPrefix:{type:String,required:!0},percentage:{type:Number,default:0},railColor:String,railStyle:[String,Object],fillColor:[String,Object],status:{type:String,required:!0},indicatorPlacement:{type:String,required:!0},indicatorTextColor:String,unit:{type:String,default:"%"},processing:{type:Boolean,required:!0},showIndicator:{type:Boolean,required:!0},height:[String,Number],railBorderRadius:[String,Number],fillBorderRadius:[String,Number]},setup(e,{slots:r}){const o=B(()=>ye(e.height)),n=B(()=>{var l,s;return typeof e.fillColor=="object"?`linear-gradient(to right, ${(l=e.fillColor)===null||l===void 0?void 0:l.stops[0]} , ${(s=e.fillColor)===null||s===void 0?void 0:s.stops[1]})`:e.fillColor}),i=B(()=>e.railBorderRadius!==void 0?ye(e.railBorderRadius):e.height!==void 0?ye(e.height,{c:.5}):""),a=B(()=>e.fillBorderRadius!==void 0?ye(e.fillBorderRadius):e.railBorderRadius!==void 0?ye(e.railBorderRadius):e.height!==void 0?ye(e.height,{c:.5}):"");return()=>{const{indicatorPlacement:l,railColor:s,railStyle:u,percentage:c,unit:d,indicatorTextColor:h,status:C,showIndicator:$,processing:m,clsPrefix:f}=e;return t("div",{class:`${f}-progress-content`,role:"none"},t("div",{class:`${f}-progress-graph`,"aria-hidden":!0},t("div",{class:[`${f}-progress-graph-line`,{[`${f}-progress-graph-line--indicator-${l}`]:!0}]},t("div",{class:`${f}-progress-graph-line-rail`,style:[{backgroundColor:s,height:o.value,borderRadius:i.value},u]},t("div",{class:[`${f}-progress-graph-line-fill`,m&&`${f}-progress-graph-line-fill--processing`],style:{maxWidth:`${e.percentage}%`,background:n.value,height:o.value,lineHeight:o.value,borderRadius:a.value}},l==="inside"?t("div",{class:`${f}-progress-graph-line-indicator`,style:{color:h}},r.default?r.default():`${c}${d}`):null)))),$&&l==="outside"?t("div",null,r.default?t("div",{class:`${f}-progress-custom-content`,style:{color:h},role:"none"},r.default()):C==="default"?t("div",{role:"none",class:`${f}-progress-icon ${f}-progress-icon--as-text`,style:{color:h}},c,d):t("div",{class:`${f}-progress-icon`,"aria-hidden":!0},t(V,{clsPrefix:f},{default:()=>Ko[C]}))):null)}}});function ct(e,r,o=100){return`m ${o/2} ${o/2-e} a ${e} ${e} 0 1 1 0 ${2*e} a ${e} ${e} 0 1 1 0 -${2*e}`}const Qo=G({name:"ProgressMultipleCircle",props:{clsPrefix:{type:String,required:!0},viewBoxWidth:{type:Number,required:!0},percentage:{type:Array,default:[0]},strokeWidth:{type:Number,required:!0},circleGap:{type:Number,required:!0},showIndicator:{type:Boolean,required:!0},fillColor:{type:Array,default:()=>[]},railColor:{type:Array,default:()=>[]},railStyle:{type:Array,default:()=>[]}},setup(e,{slots:r}){const o=B(()=>e.percentage.map((a,l)=>`${Math.PI*a/100*(e.viewBoxWidth/2-e.strokeWidth/2*(1+2*l)-e.circleGap*l)*2}, ${e.viewBoxWidth*8}`)),n=(i,a)=>{const l=e.fillColor[a],s=typeof l=="object"?l.stops[0]:"",u=typeof l=="object"?l.stops[1]:"";return typeof e.fillColor[a]=="object"&&t("linearGradient",{id:`gradient-${a}`,x1:"100%",y1:"0%",x2:"0%",y2:"100%"},t("stop",{offset:"0%","stop-color":s}),t("stop",{offset:"100%","stop-color":u}))};return()=>{const{viewBoxWidth:i,strokeWidth:a,circleGap:l,showIndicator:s,fillColor:u,railColor:c,railStyle:d,percentage:h,clsPrefix:C}=e;return t("div",{class:`${C}-progress-content`,role:"none"},t("div",{class:`${C}-progress-graph`,"aria-hidden":!0},t("div",{class:`${C}-progress-graph-circle`},t("svg",{viewBox:`0 0 ${i} ${i}`},t("defs",null,h.map(($,m)=>n($,m))),h.map(($,m)=>t("g",{key:m},t("path",{class:`${C}-progress-graph-circle-rail`,d:ct(i/2-a/2*(1+2*m)-l*m,a,i),"stroke-width":a,"stroke-linecap":"round",fill:"none",style:[{strokeDashoffset:0,stroke:c[m]},d[m]]}),t("path",{class:[`${C}-progress-graph-circle-fill`,$===0&&`${C}-progress-graph-circle-fill--empty`],d:ct(i/2-a/2*(1+2*m)-l*m,a,i),"stroke-width":a,"stroke-linecap":"round",fill:"none",style:{strokeDasharray:o.value[m],strokeDashoffset:0,stroke:typeof u[m]=="object"?`url(#gradient-${m})`:u[m]}})))))),s&&r.default?t("div",null,t("div",{class:`${C}-progress-text`},r.default())):null)}}}),en=W([x("progress",{display:"inline-block"},[x("progress-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `),j("line",`
 width: 100%;
 display: block;
 `,[x("progress-content",`
 display: flex;
 align-items: center;
 `,[x("progress-graph",{flex:1})]),x("progress-custom-content",{marginLeft:"14px"}),x("progress-icon",`
 width: 30px;
 padding-left: 14px;
 height: var(--n-icon-size-line);
 line-height: var(--n-icon-size-line);
 font-size: var(--n-icon-size-line);
 `,[j("as-text",`
 color: var(--n-text-color-line-outer);
 text-align: center;
 width: 40px;
 font-size: var(--n-font-size);
 padding-left: 4px;
 transition: color .3s var(--n-bezier);
 `)])]),j("circle, dashboard",{width:"120px"},[x("progress-custom-content",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `),x("progress-text",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: inherit;
 font-size: var(--n-font-size-circle);
 color: var(--n-text-color-circle);
 font-weight: var(--n-font-weight-circle);
 transition: color .3s var(--n-bezier);
 white-space: nowrap;
 `),x("progress-icon",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: var(--n-icon-color);
 font-size: var(--n-icon-size-circle);
 `)]),j("multiple-circle",`
 width: 200px;
 color: inherit;
 `,[x("progress-text",`
 font-weight: var(--n-font-weight-circle);
 color: var(--n-text-color-circle);
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 transition: color .3s var(--n-bezier);
 `)]),x("progress-content",{position:"relative"}),x("progress-graph",{position:"relative"},[x("progress-graph-circle",[W("svg",{verticalAlign:"bottom"}),x("progress-graph-circle-fill",`
 stroke: var(--n-fill-color);
 transition:
 opacity .3s var(--n-bezier),
 stroke .3s var(--n-bezier),
 stroke-dasharray .3s var(--n-bezier);
 `,[j("empty",{opacity:0})]),x("progress-graph-circle-rail",`
 transition: stroke .3s var(--n-bezier);
 overflow: hidden;
 stroke: var(--n-rail-color);
 `)]),x("progress-graph-line",[j("indicator-inside",[x("progress-graph-line-rail",`
 height: 16px;
 line-height: 16px;
 border-radius: 10px;
 `,[x("progress-graph-line-fill",`
 height: inherit;
 border-radius: 10px;
 `),x("progress-graph-line-indicator",`
 background: #0000;
 white-space: nowrap;
 text-align: right;
 margin-left: 14px;
 margin-right: 14px;
 height: inherit;
 font-size: 12px;
 color: var(--n-text-color-line-inner);
 transition: color .3s var(--n-bezier);
 `)])]),j("indicator-inside-label",`
 height: 16px;
 display: flex;
 align-items: center;
 `,[x("progress-graph-line-rail",`
 flex: 1;
 transition: background-color .3s var(--n-bezier);
 `),x("progress-graph-line-indicator",`
 background: var(--n-fill-color);
 font-size: 12px;
 transform: translateZ(0);
 display: flex;
 vertical-align: middle;
 height: 16px;
 line-height: 16px;
 padding: 0 10px;
 border-radius: 10px;
 position: absolute;
 white-space: nowrap;
 color: var(--n-text-color-line-inner);
 transition:
 right .2s var(--n-bezier),
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 `)]),x("progress-graph-line-rail",`
 position: relative;
 overflow: hidden;
 height: var(--n-rail-height);
 border-radius: 5px;
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 `,[x("progress-graph-line-fill",`
 background: var(--n-fill-color);
 position: relative;
 border-radius: 5px;
 height: inherit;
 width: 100%;
 max-width: 0%;
 transition:
 background-color .3s var(--n-bezier),
 max-width .2s var(--n-bezier);
 `,[j("processing",[W("&::after",`
 content: "";
 background-image: var(--n-line-bg-processing);
 animation: progress-processing-animation 2s var(--n-bezier) infinite;
 `)])])])])])]),W("@keyframes progress-processing-animation",`
 0% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 100%;
 opacity: 1;
 }
 66% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 100% {
 position: absolute;
 left: 0;
 top: 0;
 bottom: 0;
 right: 0;
 opacity: 0;
 }
 `)]),tn=Object.assign(Object.assign({},Se.props),{processing:Boolean,type:{type:String,default:"line"},gapDegree:Number,gapOffsetDegree:Number,status:{type:String,default:"default"},railColor:[String,Array],railStyle:[String,Array],color:[String,Array,Object],viewBoxWidth:{type:Number,default:100},strokeWidth:{type:Number,default:7},percentage:[Number,Array],unit:{type:String,default:"%"},showIndicator:{type:Boolean,default:!0},indicatorPosition:{type:String,default:"outside"},indicatorPlacement:{type:String,default:"outside"},indicatorTextColor:String,circleGap:{type:Number,default:1},height:Number,borderRadius:[String,Number],fillBorderRadius:[String,Number],offsetDegree:Number}),rn=G({name:"Progress",props:tn,setup(e){const r=B(()=>e.indicatorPlacement||e.indicatorPosition),o=B(()=>{if(e.gapDegree||e.gapDegree===0)return e.gapDegree;if(e.type==="dashboard")return 75}),{mergedClsPrefixRef:n,inlineThemeDisabled:i}=Re(e),a=Se("Progress","-progress",en,jt,e,n),l=B(()=>{const{status:u}=e,{common:{cubicBezierEaseInOut:c},self:{fontSize:d,fontSizeCircle:h,railColor:C,railHeight:$,iconSizeCircle:m,iconSizeLine:f,textColorCircle:k,textColorLineInner:R,textColorLineOuter:I,lineBgProcessing:y,fontWeightCircle:v,[ot("iconColor",u)]:p,[ot("fillColor",u)]:T}}=a.value;return{"--n-bezier":c,"--n-fill-color":T,"--n-font-size":d,"--n-font-size-circle":h,"--n-font-weight-circle":v,"--n-icon-color":p,"--n-icon-size-circle":m,"--n-icon-size-line":f,"--n-line-bg-processing":y,"--n-rail-color":C,"--n-rail-height":$,"--n-text-color-circle":k,"--n-text-color-line-inner":R,"--n-text-color-line-outer":I}}),s=i?Xe("progress",B(()=>e.status[0]),l,e):void 0;return{mergedClsPrefix:n,mergedIndicatorPlacement:r,gapDeg:o,cssVars:i?void 0:l,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){const{type:e,cssVars:r,indicatorTextColor:o,showIndicator:n,status:i,railColor:a,railStyle:l,color:s,percentage:u,viewBoxWidth:c,strokeWidth:d,mergedIndicatorPlacement:h,unit:C,borderRadius:$,fillBorderRadius:m,height:f,processing:k,circleGap:R,mergedClsPrefix:I,gapDeg:y,gapOffsetDegree:v,themeClass:p,$slots:T,onRender:z}=this;return z==null||z(),t("div",{class:[p,`${I}-progress`,`${I}-progress--${e}`,`${I}-progress--${i}`],style:r,"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":u,role:e==="circle"||e==="line"||e==="dashboard"?"progressbar":"none"},e==="circle"||e==="dashboard"?t(Yo,{clsPrefix:I,status:i,showIndicator:n,indicatorTextColor:o,railColor:a,fillColor:s,railStyle:l,offsetDegree:this.offsetDegree,percentage:u,viewBoxWidth:c,strokeWidth:d,gapDegree:y===void 0?e==="dashboard"?75:0:y,gapOffsetDegree:v,unit:C},T):e==="line"?t(Jo,{clsPrefix:I,status:i,showIndicator:n,indicatorTextColor:o,railColor:a,fillColor:s,railStyle:l,percentage:u,processing:k,indicatorPlacement:h,unit:C,fillBorderRadius:m,railBorderRadius:$,height:f},T):e==="multiple-circle"?t(Qo,{clsPrefix:I,strokeWidth:d,railColor:a,fillColor:s,railStyle:l,viewBoxWidth:c,percentage:u,showIndicator:n,circleGap:R},T):null)}}),ke=Ze("n-upload"),on=W([x("upload","width: 100%;",[j("dragger-inside",[x("upload-trigger",`
 display: block;
 `)]),j("drag-over",[x("upload-dragger",`
 border: var(--n-dragger-border-hover);
 `)])]),x("upload-dragger",`
 cursor: pointer;
 box-sizing: border-box;
 width: 100%;
 text-align: center;
 border-radius: var(--n-border-radius);
 padding: 24px;
 opacity: 1;
 transition:
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier),
 background-color .3s var(--n-bezier);
 background-color: var(--n-dragger-color);
 border: var(--n-dragger-border);
 `,[W("&:hover",`
 border: var(--n-dragger-border-hover);
 `),j("disabled",`
 cursor: not-allowed;
 `)]),x("upload-trigger",`
 display: inline-block;
 box-sizing: border-box;
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `,[W("+",[x("upload-file-list","margin-top: 8px;")]),j("disabled",`
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `),j("image-card",`
 width: 96px;
 height: 96px;
 `,[x("base-icon",`
 font-size: 24px;
 `),x("upload-dragger",`
 padding: 0;
 height: 100%;
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `)])]),x("upload-file-list",`
 line-height: var(--n-line-height);
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `,[W("a, img","outline: none;"),j("disabled",`
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `,[x("upload-file","cursor: not-allowed;")]),j("grid",`
 display: grid;
 grid-template-columns: repeat(auto-fill, 96px);
 grid-gap: 8px;
 margin-top: 0;
 `),x("upload-file",`
 display: block;
 box-sizing: border-box;
 cursor: default;
 padding: 0px 12px 0 6px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `,[nt(),x("progress",[nt({foldPadding:!0})]),W("&:hover",`
 background-color: var(--n-item-color-hover);
 `,[x("upload-file-info",[le("action",`
 opacity: 1;
 `)])]),j("image-type",`
 border-radius: var(--n-border-radius);
 text-decoration: underline;
 text-decoration-color: #0000;
 `,[x("upload-file-info",`
 padding-top: 0px;
 padding-bottom: 0px;
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 6px 0;
 `,[x("progress",`
 padding: 2px 0;
 margin-bottom: 0;
 `),le("name",`
 padding: 0 8px;
 `),le("thumbnail",`
 width: 32px;
 height: 32px;
 font-size: 28px;
 display: flex;
 justify-content: center;
 align-items: center;
 `,[W("img",`
 width: 100%;
 `)])])]),j("text-type",[x("progress",`
 box-sizing: border-box;
 padding-bottom: 6px;
 margin-bottom: 6px;
 `)]),j("image-card-type",`
 position: relative;
 width: 96px;
 height: 96px;
 border: var(--n-item-border-image-card);
 border-radius: var(--n-border-radius);
 padding: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 transition: border-color .3s var(--n-bezier), background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 overflow: hidden;
 `,[x("progress",`
 position: absolute;
 left: 8px;
 bottom: 8px;
 right: 8px;
 width: unset;
 `),x("upload-file-info",`
 padding: 0;
 width: 100%;
 height: 100%;
 `,[le("thumbnail",`
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 font-size: 36px;
 `,[W("img",`
 width: 100%;
 `)])]),W("&::before",`
 position: absolute;
 z-index: 1;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
 opacity: 0;
 transition: opacity .2s var(--n-bezier);
 content: "";
 `),W("&:hover",[W("&::before","opacity: 1;"),x("upload-file-info",[le("thumbnail","opacity: .12;")])])]),j("error-status",[W("&:hover",`
 background-color: var(--n-item-color-hover-error);
 `),x("upload-file-info",[le("name","color: var(--n-item-text-color-error);"),le("thumbnail","color: var(--n-item-text-color-error);")]),j("image-card-type",`
 border: var(--n-item-border-image-card-error);
 `)]),j("with-url",`
 cursor: pointer;
 `,[x("upload-file-info",[le("name",`
 color: var(--n-item-text-color-success);
 text-decoration-color: var(--n-item-text-color-success);
 `,[W("a",`
 text-decoration: underline;
 `)])])]),x("upload-file-info",`
 position: relative;
 padding-top: 6px;
 padding-bottom: 6px;
 display: flex;
 flex-wrap: nowrap;
 `,[le("thumbnail",`
 font-size: 18px;
 opacity: 1;
 transition: opacity .2s var(--n-bezier);
 color: var(--n-item-icon-color);
 `,[x("base-icon",`
 margin-right: 2px;
 vertical-align: middle;
 transition: color .3s var(--n-bezier);
 `)]),le("action",`
 padding-top: inherit;
 padding-bottom: inherit;
 position: absolute;
 right: 0;
 top: 0;
 bottom: 0;
 width: 80px;
 display: flex;
 align-items: center;
 transition: opacity .2s var(--n-bezier);
 justify-content: flex-end;
 opacity: 0;
 `,[x("button",[W("&:not(:last-child)",{marginRight:"4px"}),x("base-icon",[W("svg",[fr()])])]),j("image-type",`
 position: relative;
 max-width: 80px;
 width: auto;
 `),j("image-card-type",`
 z-index: 2;
 position: absolute;
 width: 100%;
 height: 100%;
 left: 0;
 right: 0;
 bottom: 0;
 top: 0;
 display: flex;
 justify-content: center;
 align-items: center;
 `)]),le("name",`
 color: var(--n-item-text-color);
 flex: 1;
 display: flex;
 justify-content: center;
 text-overflow: ellipsis;
 overflow: hidden;
 flex-direction: column;
 text-decoration-color: #0000;
 font-size: var(--n-font-size);
 transition:
 color .3s var(--n-bezier),
 text-decoration-color .3s var(--n-bezier); 
 `,[W("a",`
 color: inherit;
 text-decoration: underline;
 `)])])])]),x("upload-file-input",`
 display: none;
 width: 0;
 height: 0;
 opacity: 0;
 `)]),Wt="__UPLOAD_DRAGGER__",nn=G({name:"UploadDragger",[Wt]:!0,setup(e,{slots:r}){const o=ve(ke,null);return o||Le("upload-dragger","`n-upload-dragger` must be placed inside `n-upload`."),()=>{const{mergedClsPrefixRef:{value:n},mergedDisabledRef:{value:i},maxReachedRef:{value:a}}=o;return t("div",{class:[`${n}-upload-dragger`,(i||a)&&`${n}-upload-dragger--disabled`]},r)}}});function an(){return t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 28 28"},t("g",{fill:"none"},t("path",{d:"M21.75 3A3.25 3.25 0 0 1 25 6.25v15.5A3.25 3.25 0 0 1 21.75 25H6.25A3.25 3.25 0 0 1 3 21.75V6.25A3.25 3.25 0 0 1 6.25 3h15.5zm.583 20.4l-7.807-7.68a.75.75 0 0 0-.968-.07l-.084.07l-7.808 7.68c.183.065.38.1.584.1h15.5c.204 0 .4-.035.583-.1l-7.807-7.68l7.807 7.68zM21.75 4.5H6.25A1.75 1.75 0 0 0 4.5 6.25v15.5c0 .208.036.408.103.593l7.82-7.692a2.25 2.25 0 0 1 3.026-.117l.129.117l7.82 7.692c.066-.185.102-.385.102-.593V6.25a1.75 1.75 0 0 0-1.75-1.75zm-3.25 3a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zm0 1.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2z",fill:"currentColor"})))}function ln(){return t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 28 28"},t("g",{fill:"none"},t("path",{d:"M6.4 2A2.4 2.4 0 0 0 4 4.4v19.2A2.4 2.4 0 0 0 6.4 26h15.2a2.4 2.4 0 0 0 2.4-2.4V11.578c0-.729-.29-1.428-.805-1.944l-6.931-6.931A2.4 2.4 0 0 0 14.567 2H6.4zm-.9 2.4a.9.9 0 0 1 .9-.9H14V10a2 2 0 0 0 2 2h6.5v11.6a.9.9 0 0 1-.9.9H6.4a.9.9 0 0 1-.9-.9V4.4zm16.44 6.1H16a.5.5 0 0 1-.5-.5V4.06l6.44 6.44z",fill:"currentColor"})))}const sn=G({name:"UploadProgress",props:{show:Boolean,percentage:{type:Number,required:!0},status:{type:String,required:!0}},setup(){return{mergedTheme:ve(ke).mergedThemeRef}},render(){return t(St,null,{default:()=>this.show?t(rn,{type:"line",showIndicator:!1,percentage:this.percentage,status:this.status,height:2,theme:this.mergedTheme.peers.Progress,themeOverrides:this.mergedTheme.peerOverrides.Progress}):null})}});var Ve=function(e,r,o,n){function i(a){return a instanceof o?a:new o(function(l){l(a)})}return new(o||(o=Promise))(function(a,l){function s(d){try{c(n.next(d))}catch(h){l(h)}}function u(d){try{c(n.throw(d))}catch(h){l(h)}}function c(d){d.done?a(d.value):i(d.value).then(s,u)}c((n=n.apply(e,r||[])).next())})};function Vt(e){return e.includes("image/")}function ft(e=""){const r=e.split("/"),n=r[r.length-1].split(/#|\?/)[0];return(/\.[^./\\]*$/.exec(n)||[""])[0]}const gt=/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i,qt=e=>{if(e.type)return Vt(e.type);const r=ft(e.name||"");if(gt.test(r))return!0;const o=e.thumbnailUrl||e.url||"",n=ft(o);return!!(/^data:image\//.test(o)||gt.test(n))};function un(e){return Ve(this,void 0,void 0,function*(){return yield new Promise(r=>{if(!e.type||!Vt(e.type)){r("");return}r(window.URL.createObjectURL(e))})})}const dn=gr&&window.FileReader&&window.File;function cn(e){return e.isDirectory}function fn(e){return e.isFile}function gn(e,r){return Ve(this,void 0,void 0,function*(){const o=[];function n(i){return Ve(this,void 0,void 0,function*(){for(const a of i)if(a){if(r&&cn(a)){const l=a.createReader();let s=[],u;try{do u=yield new Promise((c,d)=>{l.readEntries(c,d)}),s=s.concat(u);while(u.length>0)}catch(c){it("upload","error happens when handling directory upload",c)}yield n(s)}else if(fn(a))try{const l=yield new Promise((s,u)=>{a.file(s,u)});o.push({file:l,entry:a,source:"dnd"})}catch(l){it("upload","error happens when handling file upload",l)}}})}return yield n(e),o})}function Pe(e){const{id:r,name:o,percentage:n,status:i,url:a,file:l,thumbnailUrl:s,type:u,fullPath:c,batchId:d}=e;return{id:r,name:o,percentage:n??null,status:i,url:a??null,file:l??null,thumbnailUrl:s??null,type:u??null,fullPath:c??null,batchId:d??null}}function hn(e,r,o){return e=e.toLowerCase(),r=r.toLocaleLowerCase(),o=o.toLocaleLowerCase(),o.split(",").map(i=>i.trim()).filter(Boolean).some(i=>{if(i.startsWith(".")){if(e.endsWith(i))return!0}else if(i.includes("/")){const[a,l]=r.split("/"),[s,u]=i.split("/");if((s==="*"||a&&s&&s===a)&&(u==="*"||l&&u&&u===l))return!0}else return!0;return!1})}var ht=function(e,r,o,n){function i(a){return a instanceof o?a:new o(function(l){l(a)})}return new(o||(o=Promise))(function(a,l){function s(d){try{c(n.next(d))}catch(h){l(h)}}function u(d){try{c(n.throw(d))}catch(h){l(h)}}function c(d){d.done?a(d.value):i(d.value).then(s,u)}c((n=n.apply(e,r||[])).next())})};const ze={paddingMedium:"0 3px",heightMedium:"24px",iconSizeMedium:"18px"},pn=G({name:"UploadFile",props:{clsPrefix:{type:String,required:!0},file:{type:Object,required:!0},listType:{type:String,required:!0},index:{type:Number,required:!0}},setup(e){const r=ve(ke),o=_(null),n=_(""),i=B(()=>{const{file:p}=e;return p.status==="finished"?"success":p.status==="error"?"error":"info"}),a=B(()=>{const{file:p}=e;if(p.status==="error")return"error"}),l=B(()=>{const{file:p}=e;return p.status==="uploading"}),s=B(()=>{if(!r.showCancelButtonRef.value)return!1;const{file:p}=e;return["uploading","pending","error"].includes(p.status)}),u=B(()=>{if(!r.showRemoveButtonRef.value)return!1;const{file:p}=e;return["finished"].includes(p.status)}),c=B(()=>{if(!r.showDownloadButtonRef.value)return!1;const{file:p}=e;return["finished"].includes(p.status)}),d=B(()=>{if(!r.showRetryButtonRef.value)return!1;const{file:p}=e;return["error"].includes(p.status)}),h=pr(()=>n.value||e.file.thumbnailUrl||e.file.url),C=B(()=>{if(!r.showPreviewButtonRef.value)return!1;const{file:{status:p},listType:T}=e;return["finished"].includes(p)&&h.value&&T==="image-card"});function $(){return ht(this,void 0,void 0,function*(){const p=r.onRetryRef.value;p&&(yield p({file:e.file}))===!1||r.submit({fileId:e.file.id})})}function m(p){p.preventDefault();const{file:T}=e;["finished","pending","error"].includes(T.status)?k(T):["uploading"].includes(T.status)?I(T):vr("upload","The button clicked type is unknown.")}function f(p){p.preventDefault(),R(e.file)}function k(p){const{xhrMap:T,doChange:z,onRemoveRef:{value:O},mergedFileListRef:{value:L}}=r;Promise.resolve(O?O({file:Object.assign({},p),fileList:L,index:e.index}):!0).then(U=>{if(U===!1)return;const b=Object.assign({},p,{status:"removed"});T.delete(p.id),z(b,void 0,{remove:!0})})}function R(p){const{onDownloadRef:{value:T},customDownloadRef:{value:z}}=r;Promise.resolve(T?T(Object.assign({},p)):!0).then(O=>{O!==!1&&(z?z(Object.assign({},p)):kt(p.url,p.name))})}function I(p){const{xhrMap:T}=r,z=T.get(p.id);z==null||z.abort(),k(Object.assign({},p))}function y(p){const{onPreviewRef:{value:T}}=r;if(T)T(e.file,{event:p});else if(e.listType==="image-card"){const{value:z}=o;if(!z)return;z.showPreview()}}const v=()=>ht(this,void 0,void 0,function*(){const{listType:p}=e;p!=="image"&&p!=="image-card"||r.shouldUseThumbnailUrlRef.value(e.file)&&(n.value=yield r.getFileThumbnailUrlResolver(e.file))});return Ue(()=>{v()}),{mergedTheme:r.mergedThemeRef,progressStatus:i,buttonType:a,showProgress:l,disabled:r.mergedDisabledRef,showCancelButton:s,showRemoveButton:u,showDownloadButton:c,showRetryButton:d,showPreviewButton:C,mergedThumbnailUrl:h,shouldUseThumbnailUrl:r.shouldUseThumbnailUrlRef,renderIcon:r.renderIconRef,imageRef:o,handleRemoveOrCancelClick:m,handleDownloadClick:f,handleRetryClick:$,handlePreviewClick:y}},render(){const{clsPrefix:e,mergedTheme:r,listType:o,file:n,renderIcon:i}=this;let a;const l=o==="image";l||o==="image-card"?a=!this.shouldUseThumbnailUrl(n)||!this.mergedThumbnailUrl?t("span",{class:`${e}-upload-file-info__thumbnail`},i?i(n):qt(n)?t(V,{clsPrefix:e},{default:an}):t(V,{clsPrefix:e},{default:ln})):t("a",{rel:"noopener noreferer",target:"_blank",href:n.url||void 0,class:`${e}-upload-file-info__thumbnail`,onClick:this.handlePreviewClick},o==="image-card"?t(Xo,{src:this.mergedThumbnailUrl||void 0,previewSrc:n.url||void 0,alt:n.name,ref:"imageRef"}):t("img",{src:this.mergedThumbnailUrl||void 0,alt:n.name})):a=t("span",{class:`${e}-upload-file-info__thumbnail`},i?i(n):t(V,{clsPrefix:e},{default:()=>t(ko,null)}));const u=t(sn,{show:this.showProgress,percentage:n.percentage||0,status:this.progressStatus}),c=o==="text"||o==="image";return t("div",{class:[`${e}-upload-file`,`${e}-upload-file--${this.progressStatus}-status`,n.url&&n.status!=="error"&&o!=="image-card"&&`${e}-upload-file--with-url`,`${e}-upload-file--${o}-type`]},t("div",{class:`${e}-upload-file-info`},a,t("div",{class:`${e}-upload-file-info__name`},c&&(n.url&&n.status!=="error"?t("a",{rel:"noopener noreferer",target:"_blank",href:n.url||void 0,onClick:this.handlePreviewClick},n.name):t("span",{onClick:this.handlePreviewClick},n.name)),l&&u),t("div",{class:[`${e}-upload-file-info__action`,`${e}-upload-file-info__action--${o}-type`]},this.showPreviewButton?t(pe,{key:"preview",quaternary:!0,type:this.buttonType,onClick:this.handlePreviewClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:ze},{icon:()=>t(V,{clsPrefix:e},{default:()=>t(Ir,null)})}):null,(this.showRemoveButton||this.showCancelButton)&&!this.disabled&&t(pe,{key:"cancelOrTrash",theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,quaternary:!0,builtinThemeOverrides:ze,type:this.buttonType,onClick:this.handleRemoveOrCancelClick},{icon:()=>t(hr,null,{default:()=>this.showRemoveButton?t(V,{clsPrefix:e,key:"trash"},{default:()=>t($o,null)}):t(V,{clsPrefix:e,key:"cancel"},{default:()=>t(Po,null)})})}),this.showRetryButton&&!this.disabled&&t(pe,{key:"retry",quaternary:!0,type:this.buttonType,onClick:this.handleRetryClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:ze},{icon:()=>t(V,{clsPrefix:e},{default:()=>t(Oo,null)})}),this.showDownloadButton?t(pe,{key:"download",quaternary:!0,type:this.buttonType,onClick:this.handleDownloadClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:ze},{icon:()=>t(V,{clsPrefix:e},{default:()=>t(Ft,null)})}):null)),!l&&u)}}),Zt=G({name:"UploadTrigger",props:{abstract:Boolean},slots:Object,setup(e,{slots:r}){const o=ve(ke,null);o||Le("upload-trigger","`n-upload-trigger` must be placed inside `n-upload`.");const{mergedClsPrefixRef:n,mergedDisabledRef:i,maxReachedRef:a,listTypeRef:l,dragOverRef:s,openOpenFileDialog:u,draggerInsideRef:c,handleFileAddition:d,mergedDirectoryDndRef:h,triggerClassRef:C,triggerStyleRef:$}=o,m=B(()=>l.value==="image-card");function f(){i.value||a.value||u()}function k(v){v.preventDefault(),s.value=!0}function R(v){v.preventDefault(),s.value=!0}function I(v){v.preventDefault(),s.value=!1}function y(v){var p;if(v.preventDefault(),!c.value||i.value||a.value){s.value=!1;return}const T=(p=v.dataTransfer)===null||p===void 0?void 0:p.items;T!=null&&T.length?gn(Array.from(T).map(z=>z.webkitGetAsEntry()),h.value).then(z=>{d(z)}).finally(()=>{s.value=!1}):s.value=!1}return()=>{var v;const{value:p}=n;return e.abstract?(v=r.default)===null||v===void 0?void 0:v.call(r,{handleClick:f,handleDrop:y,handleDragOver:k,handleDragEnter:R,handleDragLeave:I}):t("div",{class:[`${p}-upload-trigger`,(i.value||a.value)&&`${p}-upload-trigger--disabled`,m.value&&`${p}-upload-trigger--image-card`,C.value],style:$.value,onClick:f,onDrop:y,onDragover:k,onDragenter:R,onDragleave:I},m.value?t(nn,null,{default:()=>bt(r.default,()=>[t(V,{clsPrefix:p},{default:()=>t($r,null)})])}):r)}}}),vn=G({name:"UploadFileList",setup(e,{slots:r}){const o=ve(ke,null);o||Le("upload-file-list","`n-upload-file-list` must be placed inside `n-upload`.");const{abstractRef:n,mergedClsPrefixRef:i,listTypeRef:a,mergedFileListRef:l,fileListClassRef:s,fileListStyleRef:u,cssVarsRef:c,themeClassRef:d,maxReachedRef:h,showTriggerRef:C,imageGroupPropsRef:$}=o,m=B(()=>a.value==="image-card"),f=()=>l.value.map((R,I)=>t(pn,{clsPrefix:i.value,key:R.id,file:R,index:I,listType:a.value})),k=()=>m.value?t(Vo,Object.assign({},$.value),{default:f}):t(St,{group:!0},{default:f});return()=>{const{value:R}=i,{value:I}=n;return t("div",{class:[`${R}-upload-file-list`,m.value&&`${R}-upload-file-list--grid`,I?d==null?void 0:d.value:void 0,s.value],style:[I&&c?c.value:"",u.value]},k(),C.value&&!h.value&&m.value&&t(Zt,null,r))}}});var pt=function(e,r,o,n){function i(a){return a instanceof o?a:new o(function(l){l(a)})}return new(o||(o=Promise))(function(a,l){function s(d){try{c(n.next(d))}catch(h){l(h)}}function u(d){try{c(n.throw(d))}catch(h){l(h)}}function c(d){d.done?a(d.value):i(d.value).then(s,u)}c((n=n.apply(e,r||[])).next())})};function mn(e,r,o){const{doChange:n,xhrMap:i}=e;let a=0;function l(u){var c;let d=Object.assign({},r,{status:"error",percentage:a});i.delete(r.id),d=Pe(((c=e.onError)===null||c===void 0?void 0:c.call(e,{file:d,event:u}))||d),n(d,u)}function s(u){var c;if(e.isErrorState){if(e.isErrorState(o)){l(u);return}}else if(o.status<200||o.status>=300){l(u);return}let d=Object.assign({},r,{status:"finished",percentage:a});i.delete(r.id),d=Pe(((c=e.onFinish)===null||c===void 0?void 0:c.call(e,{file:d,event:u}))||d),n(d,u)}return{handleXHRLoad:s,handleXHRError:l,handleXHRAbort(u){const c=Object.assign({},r,{status:"removed",file:null,percentage:a});i.delete(r.id),n(c,u)},handleXHRProgress(u){const c=Object.assign({},r,{status:"uploading"});if(u.lengthComputable){const d=Math.ceil(u.loaded/u.total*100);c.percentage=d,a=d}n(c,u)}}}function wn(e){const{inst:r,file:o,data:n,headers:i,withCredentials:a,action:l,customRequest:s}=e,{doChange:u}=e.inst;let c=0;s({file:o,data:n,headers:i,withCredentials:a,action:l,onProgress(d){const h=Object.assign({},o,{status:"uploading"}),C=d.percent;h.percentage=C,c=C,u(h)},onFinish(){var d;let h=Object.assign({},o,{status:"finished",percentage:c});h=Pe(((d=r.onFinish)===null||d===void 0?void 0:d.call(r,{file:h}))||h),u(h)},onError(){var d;let h=Object.assign({},o,{status:"error",percentage:c});h=Pe(((d=r.onError)===null||d===void 0?void 0:d.call(r,{file:h}))||h),u(h)}})}function bn(e,r,o){const n=mn(e,r,o);o.onabort=n.handleXHRAbort,o.onerror=n.handleXHRError,o.onload=n.handleXHRLoad,o.upload&&(o.upload.onprogress=n.handleXHRProgress)}function Xt(e,r){return typeof e=="function"?e({file:r}):e||{}}function xn(e,r,o){const n=Xt(r,o);n&&Object.keys(n).forEach(i=>{e.setRequestHeader(i,n[i])})}function yn(e,r,o){const n=Xt(r,o);n&&Object.keys(n).forEach(i=>{e.append(i,n[i])})}function Cn(e,r,o,{method:n,action:i,withCredentials:a,responseType:l,headers:s,data:u}){const c=new XMLHttpRequest;c.responseType=l,e.xhrMap.set(o.id,c),c.withCredentials=a;const d=new FormData;if(yn(d,u,o),o.file!==null&&d.append(r,o.file),bn(e,o,c),i!==void 0){c.open(n.toUpperCase(),i),xn(c,s,o),c.send(d);const h=Object.assign({},o,{status:"uploading"});e.doChange(h)}}const Rn=Object.assign(Object.assign({},Se.props),{name:{type:String,default:"file"},accept:String,action:String,customRequest:Function,directory:Boolean,directoryDnd:{type:Boolean,default:void 0},method:{type:String,default:"POST"},multiple:Boolean,showFileList:{type:Boolean,default:!0},data:[Object,Function],headers:[Object,Function],withCredentials:Boolean,responseType:{type:String,default:""},disabled:{type:Boolean,default:void 0},onChange:Function,onRemove:Function,onFinish:Function,onError:Function,onRetry:Function,onBeforeUpload:Function,isErrorState:Function,onDownload:Function,customDownload:Function,defaultUpload:{type:Boolean,default:!0},fileList:Array,"onUpdate:fileList":[Function,Array],onUpdateFileList:[Function,Array],fileListClass:String,fileListStyle:[String,Object],defaultFileList:{type:Array,default:()=>[]},showCancelButton:{type:Boolean,default:!0},showRemoveButton:{type:Boolean,default:!0},showDownloadButton:Boolean,showRetryButton:{type:Boolean,default:!0},showPreviewButton:{type:Boolean,default:!0},listType:{type:String,default:"text"},onPreview:Function,shouldUseThumbnailUrl:{type:Function,default:e=>dn?qt(e):!1},createThumbnailUrl:Function,abstract:Boolean,max:Number,showTrigger:{type:Boolean,default:!0},imageGroupProps:Object,inputProps:Object,triggerClass:String,triggerStyle:[String,Object],renderIcon:Function}),Sn=G({name:"Upload",props:Rn,setup(e){e.abstract&&e.listType==="image-card"&&Le("upload","when the list-type is image-card, abstract is not supported.");const{mergedClsPrefixRef:r,inlineThemeDisabled:o,mergedRtlRef:n}=Re(e),i=Se("Upload","-upload",on,No,e,r),a=wr("Upload",n,r),l=br(e),s=_(e.defaultFileList),u=N(e,"fileList"),c=_(null),d={value:!1},h=_(!1),C=new Map,$=Ne(u,s),m=B(()=>$.value.map(Pe)),f=B(()=>{const{max:b}=e;return b!==void 0?m.value.length>=b:!1});function k(){var b;(b=c.value)===null||b===void 0||b.click()}function R(b){const P=b.target;p(P.files?Array.from(P.files).map(A=>({file:A,entry:null,source:"input"})):null,b),P.value=""}function I(b){const{"onUpdate:fileList":P,onUpdateFileList:A}=e;P&&fe(P,b),A&&fe(A,b),s.value=b}const y=B(()=>e.multiple||e.directory),v=(b,P,A={append:!1,remove:!1})=>{const{append:Y,remove:q}=A,D=Array.from(m.value),E=D.findIndex(H=>H.id===b.id);if(Y||q||~E){Y?D.push(b):q?D.splice(E,1):D.splice(E,1,b);const{onChange:H}=e;H&&H({file:b,fileList:D,event:P}),I(D)}};function p(b,P){if(!b||b.length===0)return;const{onBeforeUpload:A}=e;b=y.value?b:[b[0]];const{max:Y,accept:q}=e;b=b.filter(({file:E,source:H})=>H==="dnd"&&(q!=null&&q.trim())?hn(E.name,E.type,q):!0),Y&&(b=b.slice(0,Y-m.value.length));const D=He();Promise.all(b.map(E=>pt(this,[E],void 0,function*({file:H,entry:K}){var ue;const te={id:He(),batchId:D,name:H.name,status:"pending",percentage:0,file:H,url:null,type:H.type,thumbnailUrl:null,fullPath:(ue=K==null?void 0:K.fullPath)!==null&&ue!==void 0?ue:`/${H.webkitRelativePath||H.name}`};return!A||(yield A({file:te,fileList:m.value}))!==!1?te:null}))).then(E=>pt(this,void 0,void 0,function*(){let H=Promise.resolve();E.forEach(K=>{H=H.then(xr).then(()=>{K&&v(K,P,{append:!0})})}),yield H})).then(()=>{e.defaultUpload&&T()})}function T({fileId:b,retry:P=!1}={}){const{method:A,action:Y,withCredentials:q,headers:D,data:E,name:H}=e,K=b!==void 0?m.value.filter(te=>te.id===b):m.value,ue=P||b!==void 0;K.forEach(te=>{const{status:me}=te;(me==="pending"||me==="error"&&ue)&&(e.customRequest?wn({inst:{doChange:v,xhrMap:C,onFinish:e.onFinish,onError:e.onError},file:te,action:Y,withCredentials:q,headers:D,data:E,customRequest:e.customRequest}):Cn({doChange:v,xhrMap:C,onFinish:e.onFinish,onError:e.onError,isErrorState:e.isErrorState},H,te,{method:A,action:Y,withCredentials:q,responseType:e.responseType,headers:D,data:E}))})}function z(b){var P;if(b.thumbnailUrl)return b.thumbnailUrl;const{createThumbnailUrl:A}=e;return A?(P=A(b.file,b))!==null&&P!==void 0?P:b.url||"":b.url?b.url:b.file?un(b.file):""}const O=B(()=>{const{common:{cubicBezierEaseInOut:b},self:{draggerColor:P,draggerBorder:A,draggerBorderHover:Y,itemColorHover:q,itemColorHoverError:D,itemTextColorError:E,itemTextColorSuccess:H,itemTextColor:K,itemIconColor:ue,itemDisabledOpacity:te,lineHeight:me,borderRadius:_e,fontSize:Me,itemBorderImageCardError:Oe,itemBorderImageCard:Te}}=i.value;return{"--n-bezier":b,"--n-border-radius":_e,"--n-dragger-border":A,"--n-dragger-border-hover":Y,"--n-dragger-color":P,"--n-font-size":Me,"--n-item-color-hover":q,"--n-item-color-hover-error":D,"--n-item-disabled-opacity":te,"--n-item-icon-color":ue,"--n-item-text-color":K,"--n-item-text-color-error":E,"--n-item-text-color-success":H,"--n-line-height":me,"--n-item-border-image-card-error":Oe,"--n-item-border-image-card":Te}}),L=o?Xe("upload",void 0,O,e):void 0;Ge(ke,{mergedClsPrefixRef:r,mergedThemeRef:i,showCancelButtonRef:N(e,"showCancelButton"),showDownloadButtonRef:N(e,"showDownloadButton"),showRemoveButtonRef:N(e,"showRemoveButton"),showRetryButtonRef:N(e,"showRetryButton"),onRemoveRef:N(e,"onRemove"),onDownloadRef:N(e,"onDownload"),customDownloadRef:N(e,"customDownload"),mergedFileListRef:m,triggerClassRef:N(e,"triggerClass"),triggerStyleRef:N(e,"triggerStyle"),shouldUseThumbnailUrlRef:N(e,"shouldUseThumbnailUrl"),renderIconRef:N(e,"renderIcon"),xhrMap:C,submit:T,doChange:v,showPreviewButtonRef:N(e,"showPreviewButton"),onPreviewRef:N(e,"onPreview"),getFileThumbnailUrlResolver:z,listTypeRef:N(e,"listType"),dragOverRef:h,openOpenFileDialog:k,draggerInsideRef:d,handleFileAddition:p,mergedDisabledRef:l.mergedDisabledRef,maxReachedRef:f,fileListClassRef:N(e,"fileListClass"),fileListStyleRef:N(e,"fileListStyle"),abstractRef:N(e,"abstract"),acceptRef:N(e,"accept"),cssVarsRef:o?void 0:O,themeClassRef:L==null?void 0:L.themeClass,onRender:L==null?void 0:L.onRender,showTriggerRef:N(e,"showTrigger"),imageGroupPropsRef:N(e,"imageGroupProps"),mergedDirectoryDndRef:B(()=>{var b;return(b=e.directoryDnd)!==null&&b!==void 0?b:e.directory}),onRetryRef:N(e,"onRetry")});const U={clear:()=>{s.value=[]},submit:T,openOpenFileDialog:k};return Object.assign({mergedClsPrefix:r,draggerInsideRef:d,rtlEnabled:a,inputElRef:c,mergedTheme:i,dragOver:h,mergedMultiple:y,cssVars:o?void 0:O,themeClass:L==null?void 0:L.themeClass,onRender:L==null?void 0:L.onRender,handleFileInputChange:R},U)},render(){var e,r;const{draggerInsideRef:o,mergedClsPrefix:n,$slots:i,directory:a,onRender:l}=this;if(i.default&&!this.abstract){const u=i.default()[0];!((e=u==null?void 0:u.type)===null||e===void 0)&&e[Wt]&&(o.value=!0)}const s=t("input",Object.assign({},this.inputProps,{ref:"inputElRef",type:"file",class:`${n}-upload-file-input`,accept:this.accept,multiple:this.mergedMultiple,onChange:this.handleFileInputChange,webkitdirectory:a||void 0,directory:a||void 0}));return this.abstract?t(De,null,(r=i.default)===null||r===void 0?void 0:r.call(i),t(mr,{to:"body"},s)):(l==null||l(),t("div",{class:[`${n}-upload`,this.rtlEnabled&&`${n}-upload--rtl`,o.value&&`${n}-upload--dragger-inside`,this.dragOver&&`${n}-upload--drag-over`,this.themeClass],style:this.cssVars},s,this.showTrigger&&this.listType!=="image-card"&&t(Zt,null,i),this.showFileList&&t(vn,null,i)))}}),kn={class:"t-grid-2"},Pn={key:0},Ln={style:{margin:"0"}},On={class:"t-table-wrap"},Tn={key:1,class:"t-table-wrap"},In={key:2,style:{color:"var(--brand-text-muted)"}},$n={key:2},Bn={style:{margin:"0"}},zn={key:0,style:{color:"var(--brand-text-muted)",margin:"4px 0 0"}},Dn={key:3},Un={class:"t-table-wrap"},Nn=G({__name:"PurchaseRequestDetailView",setup(e){const r=Cr(),o=Br(),n=_(null),i=_([]),a=_([]),l=_(null),s=_(""),u=_(""),c=_(!0),d=[{title:"#",key:"lineNo",width:50},{title:"Наименование",key:"name"},{title:"Кат. №",key:"catalogNumber",render:y=>y.catalogNumber??"—"},{title:"Кол-во",key:"quantity"},{title:"Ед.",key:"unit",render:y=>y.unit??"—"}],h=[{title:"Файл",key:"fileName",render:y=>t("a",{href:`/api/attachments/${y.id}`,target:"_blank"},y.fileName)},{title:"Размер",key:"sizeBytes",render:y=>m(y.sizeBytes)},{title:"SharePoint",key:"sharePointUrl",render:y=>y.sharePointUrl?t("a",{href:y.sharePointUrl,target:"_blank"},"Открыть"):"локально"}],C=[{title:"Шаг",key:"orderNo",width:60},{title:"Роль",key:"approverRoleLabel"},{title:"ФИО",key:"approverFullName"},{title:"Статус",key:"status"},{title:"Комментарий",key:"comment",render:y=>y.comment??"—"}];We($);async function $(){c.value=!0,s.value="";try{const y=r.params.id;n.value=await ce.getPurchaseRequest(y),i.value=await ce.getPurchaseApprovals(y),a.value=await ce.listAttachments(y),l.value=await ce.getSupplierOrder(y)}catch(y){s.value=$e(y).detail}finally{c.value=!1}}function m(y){return y<1024?`${y} B`:`${(y/1024).toFixed(1)} KB`}async function f(y){const v=y.file.file;if(v)try{await ce.uploadAttachment(r.params.id,v,"general"),await $(),u.value="Файл загружен",o.success("Файл загружен")}catch(p){s.value=$e(p).detail,o.error(s.value)}}async function k(){try{n.value=await ce.submitPurchaseRequest(r.params.id),i.value=await ce.getPurchaseApprovals(r.params.id),u.value="Заявка отправлена на согласование",o.success(u.value)}catch(y){s.value=$e(y).detail,o.error(s.value)}}async function R(){try{l.value=await ce.createSupplierOrder(r.params.id),u.value="Заказ поставщику создан",o.success(u.value)}catch(y){s.value=$e(y).detail,o.error(s.value)}}function I(){ce.printPurchaseRequest(r.params.id)}return(y,v)=>n.value?(ne(),be(X(yr),{key:0,title:`Заявка ${n.value.number}`},{default:oe(()=>[de(X(Ee),{vertical:"",size:16},{default:oe(()=>[de(X(Or),{type:"info"},{default:oe(()=>[Q(ee(n.value.statusLabel),1)]),_:1}),s.value?(ne(),be(X(at),{key:0,type:"error"},{default:oe(()=>[Q(ee(s.value),1)]),_:1})):se("",!0),u.value?(ne(),be(X(at),{key:1,type:"success"},{default:oe(()=>[Q(ee(u.value),1)]),_:1})):se("",!0),Z("div",kn,[Z("div",null,[v[0]||(v[0]=Z("strong",null,"Проект:",-1)),Q(" "+ee(n.value.projectName),1)]),Z("div",null,[v[1]||(v[1]=Z("strong",null,"Техника:",-1)),Q(" "+ee(n.value.vehicleName)+" ("+ee(n.value.stateNumber)+")",1)]),Z("div",null,[v[2]||(v[2]=Z("strong",null,"VIN:",-1)),Q(" "+ee(n.value.vinCode||"—"),1)]),n.value.defectActNumber?(ne(),xe("div",Pn,[v[3]||(v[3]=Z("strong",null,"Дефектный акт:",-1)),Q(" "+ee(n.value.defectActNumber),1)])):se("",!0),Z("div",null,[v[4]||(v[4]=Z("strong",null,"Инициатор:",-1)),Q(" "+ee(n.value.createdByFullName),1)])]),Z("p",Ln,ee(n.value.description),1),Z("div",On,[de(X(Ae),{columns:d,data:n.value.lines,size:"small",bordered:!1},null,8,["data"])]),Z("div",null,[v[6]||(v[6]=Z("h3",{style:{margin:"0 0 12px"}},"Вложения",-1)),n.value.canEdit?(ne(),be(X(Ee),{key:0,style:{"margin-bottom":"12px"}},{default:oe(()=>[de(X(Sn),{"show-file-list":!1,onChange:f},{default:oe(()=>[de(X(pe),{secondary:""},{default:oe(()=>[...v[5]||(v[5]=[Q("Добавить вложение",-1)])]),_:1})]),_:1})]),_:1})):se("",!0),a.value.length?(ne(),xe("div",Tn,[de(X(Ae),{columns:h,data:a.value,size:"small",bordered:!1},null,8,["data"])])):(ne(),xe("p",In,"Вложений нет"))]),de(X(Ee),null,{default:oe(()=>[n.value.canSubmit?(ne(),be(X(pe),{key:0,type:"primary",onClick:k},{default:oe(()=>[...v[7]||(v[7]=[Q("Отправить на согласование",-1)])]),_:1})):se("",!0),de(X(pe),{secondary:"",onClick:I},{default:oe(()=>[...v[8]||(v[8]=[Q("Печать",-1)])]),_:1}),n.value.status==="in_progress"?(ne(),be(X(pe),{key:1,type:"primary",onClick:R},{default:oe(()=>[...v[9]||(v[9]=[Q(" Сформировать заказ поставщику ",-1)])]),_:1})):se("",!0)]),_:1}),l.value?(ne(),xe("div",$n,[v[10]||(v[10]=Z("h3",{style:{margin:"0 0 8px"}},"Заказ поставщику",-1)),Z("p",Bn,[Z("strong",null,ee(l.value.number),1),Q(" — "+ee(l.value.status),1)]),l.value.externalSystemRef?(ne(),xe("p",zn," Внешний ID: "+ee(l.value.externalSystemRef),1)):se("",!0)])):se("",!0),i.value.length?(ne(),xe("div",Dn,[v[11]||(v[11]=Z("h3",{style:{margin:"0 0 12px"}},"Согласование",-1)),Z("div",Un,[de(X(Ae),{columns:C,data:i.value,size:"small",bordered:!1},null,8,["data"])])])):se("",!0)]),_:1})]),_:1},8,["title"])):se("",!0)}}),Zn=zr(Nn,[["__scopeId","data-v-159b5a8c"]]);export{Zn as default};
