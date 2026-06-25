import{ag as wt,ah as fe,h as t,d as K,E as qe,_ as bt,$ as rr,ai as or,e as Se,G as Ze,b as V,c as y,aj as tt,ak as nr,al as ir,a3 as q,U as De,am as lr,an as rt,ao as ar,ac as Ae,ap as sr,aq as ur,u as Re,r as _,Q as dr,P as xt,ar as $e,R as me,M as Xe,as as cr,a5 as ce,a7 as Fe,s as fr,y as B,a9 as N,ad as He,p as Ge,at as Le,K as yt,N as We,O as Ue,au as Ct,av as Rt,aw as St,ax as kt,ay as gr,a as F,S as ot,az as nt,J as ae,aA as hr,aB as Pt,aC as pr,aD as it,B as pe,aE as vr,a1 as mr,af as wr,aF as br,a2 as xr,a0 as yr,a6 as Cr,D as Ie,m as xe,w as te,j as X,Z as Rr,n as se,A as Sr,o as re,v as ue,C as G,t as Y,g as W,f as ve}from"./mechanization.js";import{d as Lt,i as he,N as je}from"./mechanization-inventory.js";import{u as Ne,f as ye}from"./mechanization-Icon.js";import{i as kr,o as Pr}from"./mechanization-utils.js";import{c as Lr,a as Or,d as Tr,b as lt}from"./mechanization-Dropdown.js";import{u as $r,E as Ir,N as at}from"./mechanization-Input.js";import{A as Br}from"./mechanization-Add.js";import{u as zr}from"./mechanization-use-message.js";import{N as Ee}from"./mechanization-Space.js";import{_ as Dr}from"./mechanization-_plugin-vue_export-helper.js";function Ur(e,r,o,n){for(var i=-1,l=e==null?0:e.length;++i<l;)o=r(o,e[i],i,e);return o}function Nr(e){return function(r){return e==null?void 0:e[r]}}var _r={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",Ç:"C",ç:"c",Ð:"D",ð:"d",È:"E",É:"E",Ê:"E",Ë:"E",è:"e",é:"e",ê:"e",ë:"e",Ì:"I",Í:"I",Î:"I",Ï:"I",ì:"i",í:"i",î:"i",ï:"i",Ñ:"N",ñ:"n",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",Ù:"U",Ú:"U",Û:"U",Ü:"U",ù:"u",ú:"u",û:"u",ü:"u",Ý:"Y",ý:"y",ÿ:"y",Æ:"Ae",æ:"ae",Þ:"Th",þ:"th",ß:"ss",Ā:"A",Ă:"A",Ą:"A",ā:"a",ă:"a",ą:"a",Ć:"C",Ĉ:"C",Ċ:"C",Č:"C",ć:"c",ĉ:"c",ċ:"c",č:"c",Ď:"D",Đ:"D",ď:"d",đ:"d",Ē:"E",Ĕ:"E",Ė:"E",Ę:"E",Ě:"E",ē:"e",ĕ:"e",ė:"e",ę:"e",ě:"e",Ĝ:"G",Ğ:"G",Ġ:"G",Ģ:"G",ĝ:"g",ğ:"g",ġ:"g",ģ:"g",Ĥ:"H",Ħ:"H",ĥ:"h",ħ:"h",Ĩ:"I",Ī:"I",Ĭ:"I",Į:"I",İ:"I",ĩ:"i",ī:"i",ĭ:"i",į:"i",ı:"i",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",ĸ:"k",Ĺ:"L",Ļ:"L",Ľ:"L",Ŀ:"L",Ł:"L",ĺ:"l",ļ:"l",ľ:"l",ŀ:"l",ł:"l",Ń:"N",Ņ:"N",Ň:"N",Ŋ:"N",ń:"n",ņ:"n",ň:"n",ŋ:"n",Ō:"O",Ŏ:"O",Ő:"O",ō:"o",ŏ:"o",ő:"o",Ŕ:"R",Ŗ:"R",Ř:"R",ŕ:"r",ŗ:"r",ř:"r",Ś:"S",Ŝ:"S",Ş:"S",Š:"S",ś:"s",ŝ:"s",ş:"s",š:"s",Ţ:"T",Ť:"T",Ŧ:"T",ţ:"t",ť:"t",ŧ:"t",Ũ:"U",Ū:"U",Ŭ:"U",Ů:"U",Ű:"U",Ų:"U",ũ:"u",ū:"u",ŭ:"u",ů:"u",ű:"u",ų:"u",Ŵ:"W",ŵ:"w",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Ź:"Z",Ż:"Z",Ž:"Z",ź:"z",ż:"z",ž:"z",Ĳ:"IJ",ĳ:"ij",Œ:"Oe",œ:"oe",ŉ:"'n",ſ:"s"},Mr=Nr(_r),Ar=/[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,Fr="\\u0300-\\u036f",jr="\\ufe20-\\ufe2f",Er="\\u20d0-\\u20ff",Hr=Fr+jr+Er,Wr="["+Hr+"]",Vr=RegExp(Wr,"g");function qr(e){return e=wt(e),e&&e.replace(Ar,Mr).replace(Vr,"")}var Zr=/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;function Xr(e){return e.match(Zr)||[]}var Gr=/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;function Yr(e){return Gr.test(e)}var Ot="\\ud800-\\udfff",Kr="\\u0300-\\u036f",Jr="\\ufe20-\\ufe2f",Qr="\\u20d0-\\u20ff",eo=Kr+Jr+Qr,Tt="\\u2700-\\u27bf",$t="a-z\\xdf-\\xf6\\xf8-\\xff",to="\\xac\\xb1\\xd7\\xf7",ro="\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf",oo="\\u2000-\\u206f",no=" \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",It="A-Z\\xc0-\\xd6\\xd8-\\xde",io="\\ufe0e\\ufe0f",Bt=to+ro+oo+no,zt="['’]",st="["+Bt+"]",lo="["+eo+"]",Dt="\\d+",ao="["+Tt+"]",Ut="["+$t+"]",Nt="[^"+Ot+Bt+Dt+Tt+$t+It+"]",so="\\ud83c[\\udffb-\\udfff]",uo="(?:"+lo+"|"+so+")",co="[^"+Ot+"]",_t="(?:\\ud83c[\\udde6-\\uddff]){2}",Mt="[\\ud800-\\udbff][\\udc00-\\udfff]",Ce="["+It+"]",fo="\\u200d",ut="(?:"+Ut+"|"+Nt+")",go="(?:"+Ce+"|"+Nt+")",dt="(?:"+zt+"(?:d|ll|m|re|s|t|ve))?",ct="(?:"+zt+"(?:D|LL|M|RE|S|T|VE))?",At=uo+"?",Ft="["+io+"]?",ho="(?:"+fo+"(?:"+[co,_t,Mt].join("|")+")"+Ft+At+")*",po="\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",vo="\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",mo=Ft+At+ho,wo="(?:"+[ao,_t,Mt].join("|")+")"+mo,bo=RegExp([Ce+"?"+Ut+"+"+dt+"(?="+[st,Ce,"$"].join("|")+")",go+"+"+ct+"(?="+[st,Ce+ut,"$"].join("|")+")",Ce+"?"+ut+"+"+dt,Ce+"+"+ct,vo,po,Dt,wo].join("|"),"g");function xo(e){return e.match(bo)||[]}function yo(e,r,o){return e=wt(e),r=r,r===void 0?Yr(e)?xo(e):Xr(e):e.match(r)||[]}var Co="['’]",Ro=RegExp(Co,"g");function So(e){return function(r){return Ur(yo(qr(r).replace(Ro,"")),e,"")}}var ko=So(function(e,r,o){return e+(o?"-":"")+r.toLowerCase()});const Po=fe("attach",()=>t("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},t("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},t("g",{fill:"currentColor","fill-rule":"nonzero"},t("path",{d:"M3.25735931,8.70710678 L7.85355339,4.1109127 C8.82986412,3.13460197 10.4127766,3.13460197 11.3890873,4.1109127 C12.365398,5.08722343 12.365398,6.67013588 11.3890873,7.64644661 L6.08578644,12.9497475 C5.69526215,13.3402718 5.06209717,13.3402718 4.67157288,12.9497475 C4.28104858,12.5592232 4.28104858,11.9260582 4.67157288,11.5355339 L9.97487373,6.23223305 C10.1701359,6.0369709 10.1701359,5.72038841 9.97487373,5.52512627 C9.77961159,5.32986412 9.4630291,5.32986412 9.26776695,5.52512627 L3.96446609,10.8284271 C3.18341751,11.6094757 3.18341751,12.8758057 3.96446609,13.6568542 C4.74551468,14.4379028 6.01184464,14.4379028 6.79289322,13.6568542 L12.0961941,8.35355339 C13.4630291,6.98671837 13.4630291,4.77064094 12.0961941,3.40380592 C10.7293591,2.0369709 8.51328163,2.0369709 7.14644661,3.40380592 L2.55025253,8 C2.35499039,8.19526215 2.35499039,8.51184464 2.55025253,8.70710678 C2.74551468,8.90236893 3.06209717,8.90236893 3.25735931,8.70710678 Z"}))))),Lo=fe("cancel",()=>t("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},t("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},t("g",{fill:"currentColor","fill-rule":"nonzero"},t("path",{d:"M2.58859116,2.7156945 L2.64644661,2.64644661 C2.82001296,2.47288026 3.08943736,2.45359511 3.2843055,2.58859116 L3.35355339,2.64644661 L8,7.293 L12.6464466,2.64644661 C12.8417088,2.45118446 13.1582912,2.45118446 13.3535534,2.64644661 C13.5488155,2.84170876 13.5488155,3.15829124 13.3535534,3.35355339 L8.707,8 L13.3535534,12.6464466 C13.5271197,12.820013 13.5464049,13.0894374 13.4114088,13.2843055 L13.3535534,13.3535534 C13.179987,13.5271197 12.9105626,13.5464049 12.7156945,13.4114088 L12.6464466,13.3535534 L8,8.707 L3.35355339,13.3535534 C3.15829124,13.5488155 2.84170876,13.5488155 2.64644661,13.3535534 C2.45118446,13.1582912 2.45118446,12.8417088 2.64644661,12.6464466 L7.293,8 L2.64644661,3.35355339 C2.47288026,3.17998704 2.45359511,2.91056264 2.58859116,2.7156945 L2.64644661,2.64644661 L2.58859116,2.7156945 Z"}))))),jt=fe("download",()=>t("svg",{viewBox:"0 0 16 16",version:"1.1",xmlns:"http://www.w3.org/2000/svg"},t("g",{stroke:"none","stroke-width":"1",fill:"none","fill-rule":"evenodd"},t("g",{fill:"currentColor","fill-rule":"nonzero"},t("path",{d:"M3.5,13 L12.5,13 C12.7761424,13 13,13.2238576 13,13.5 C13,13.7454599 12.8231248,13.9496084 12.5898756,13.9919443 L12.5,14 L3.5,14 C3.22385763,14 3,13.7761424 3,13.5 C3,13.2545401 3.17687516,13.0503916 3.41012437,13.0080557 L3.5,13 L12.5,13 L3.5,13 Z M7.91012437,1.00805567 L8,1 C8.24545989,1 8.44960837,1.17687516 8.49194433,1.41012437 L8.5,1.5 L8.5,10.292 L11.1819805,7.6109127 C11.3555469,7.43734635 11.6249713,7.4180612 11.8198394,7.55305725 L11.8890873,7.6109127 C12.0626536,7.78447906 12.0819388,8.05390346 11.9469427,8.2487716 L11.8890873,8.31801948 L8.35355339,11.8535534 C8.17998704,12.0271197 7.91056264,12.0464049 7.7156945,11.9114088 L7.64644661,11.8535534 L4.1109127,8.31801948 C3.91565056,8.12275734 3.91565056,7.80617485 4.1109127,7.6109127 C4.28447906,7.43734635 4.55390346,7.4180612 4.7487716,7.55305725 L4.81801948,7.6109127 L7.5,10.292 L7.5,1.5 C7.5,1.25454011 7.67687516,1.05039163 7.91012437,1.00805567 L8,1 L7.91012437,1.00805567 Z"}))))),Oo=K({name:"ResizeSmall",render(){return t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},t("g",{fill:"none"},t("path",{d:"M5.5 4A1.5 1.5 0 0 0 4 5.5v1a.5.5 0 0 1-1 0v-1A2.5 2.5 0 0 1 5.5 3h1a.5.5 0 0 1 0 1h-1zM16 5.5A1.5 1.5 0 0 0 14.5 4h-1a.5.5 0 0 1 0-1h1A2.5 2.5 0 0 1 17 5.5v1a.5.5 0 0 1-1 0v-1zm0 9a1.5 1.5 0 0 1-1.5 1.5h-1a.5.5 0 0 0 0 1h1a2.5 2.5 0 0 0 2.5-2.5v-1a.5.5 0 0 0-1 0v1zm-12 0A1.5 1.5 0 0 0 5.5 16h1.25a.5.5 0 0 1 0 1H5.5A2.5 2.5 0 0 1 3 14.5v-1.25a.5.5 0 0 1 1 0v1.25zM8.5 7A1.5 1.5 0 0 0 7 8.5v3A1.5 1.5 0 0 0 8.5 13h3a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 11.5 7h-3zM8 8.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3z",fill:"currentColor"})))}}),To=fe("retry",()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},t("path",{d:"M320,146s24.36-12-64-12A160,160,0,1,0,416,294",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-miterlimit: 10; stroke-width: 32px;"}),t("polyline",{points:"256 58 336 138 256 218",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}))),$o=fe("rotateClockwise",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 12.7916 15.3658 15.2026 13 16.3265V14.5C13 14.2239 12.7761 14 12.5 14C12.2239 14 12 14.2239 12 14.5V17.5C12 17.7761 12.2239 18 12.5 18H15.5C15.7761 18 16 17.7761 16 17.5C16 17.2239 15.7761 17 15.5 17H13.8758C16.3346 15.6357 18 13.0128 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 10.2761 2.22386 10.5 2.5 10.5C2.77614 10.5 3 10.2761 3 10Z",fill:"currentColor"}),t("path",{d:"M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12ZM10 11C9.44772 11 9 10.5523 9 10C9 9.44772 9.44772 9 10 9C10.5523 9 11 9.44772 11 10C11 10.5523 10.5523 11 10 11Z",fill:"currentColor"}))),Io=fe("rotateClockwise",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 12.7916 4.63419 15.2026 7 16.3265V14.5C7 14.2239 7.22386 14 7.5 14C7.77614 14 8 14.2239 8 14.5V17.5C8 17.7761 7.77614 18 7.5 18H4.5C4.22386 18 4 17.7761 4 17.5C4 17.2239 4.22386 17 4.5 17H6.12422C3.66539 15.6357 2 13.0128 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 10.2761 17.7761 10.5 17.5 10.5C17.2239 10.5 17 10.2761 17 10Z",fill:"currentColor"}),t("path",{d:"M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12ZM10 11C10.5523 11 11 10.5523 11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10C9 10.5523 9.44772 11 10 11Z",fill:"currentColor"}))),Bo=fe("trash",()=>t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512"},t("path",{d:"M432,144,403.33,419.74A32,32,0,0,1,371.55,448H140.46a32,32,0,0,1-31.78-28.26L80,144",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),t("rect",{x:"32",y:"64",width:"448",height:"80",rx:"16",ry:"16",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),t("line",{x1:"312",y1:"240",x2:"200",y2:"352",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}),t("line",{x1:"312",y1:"352",x2:"200",y2:"240",style:"fill: none; stroke: currentcolor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 32px;"}))),zo=fe("zoomIn",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M11.5 8.5C11.5 8.22386 11.2761 8 11 8H9V6C9 5.72386 8.77614 5.5 8.5 5.5C8.22386 5.5 8 5.72386 8 6V8H6C5.72386 8 5.5 8.22386 5.5 8.5C5.5 8.77614 5.72386 9 6 9H8V11C8 11.2761 8.22386 11.5 8.5 11.5C8.77614 11.5 9 11.2761 9 11V9H11C11.2761 9 11.5 8.77614 11.5 8.5Z",fill:"currentColor"}),t("path",{d:"M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z",fill:"currentColor"}))),Do=fe("zoomOut",()=>t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M11 8C11.2761 8 11.5 8.22386 11.5 8.5C11.5 8.77614 11.2761 9 11 9H6C5.72386 9 5.5 8.77614 5.5 8.5C5.5 8.22386 5.72386 8 6 8H11Z",fill:"currentColor"}),t("path",{d:"M14 8.5C14 5.46243 11.5376 3 8.5 3C5.46243 3 3 5.46243 3 8.5C3 11.5376 5.46243 14 8.5 14C9.83879 14 11.0659 13.5217 12.0196 12.7266L16.1464 16.8536L16.2157 16.9114C16.4106 17.0464 16.68 17.0271 16.8536 16.8536C17.0488 16.6583 17.0488 16.3417 16.8536 16.1464L12.7266 12.0196C13.5217 11.0659 14 9.83879 14 8.5ZM4 8.5C4 6.01472 6.01472 4 8.5 4C10.9853 4 13 6.01472 13 8.5C13 10.9853 10.9853 13 8.5 13C6.01472 13 4 10.9853 4 8.5Z",fill:"currentColor"})));function Uo(e){const{infoColor:r,successColor:o,warningColor:n,errorColor:i,textColor2:l,progressRailColor:a,fontSize:s,fontWeight:u}=e;return{fontSize:s,fontSizeCircle:"28px",fontWeightCircle:u,railColor:a,railHeight:"8px",iconSizeCircle:"36px",iconSizeLine:"18px",iconColor:r,iconColorInfo:r,iconColorSuccess:o,iconColorWarning:n,iconColorError:i,textColorCircle:l,textColorLineInner:"rgb(255, 255, 255)",textColorLineOuter:l,fillColor:r,fillColorInfo:r,fillColorSuccess:o,fillColorWarning:n,fillColorError:i,lineBgProcessing:"linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"}}const Et={name:"Progress",common:qe,self:Uo};function No(e){const{iconColor:r,primaryColor:o,errorColor:n,textColor2:i,successColor:l,opacityDisabled:a,actionColor:s,borderColor:u,hoverColor:c,lineHeight:d,borderRadius:h,fontSize:C}=e;return{fontSize:C,lineHeight:d,borderRadius:h,draggerColor:s,draggerBorder:`1px dashed ${u}`,draggerBorderHover:`1px dashed ${o}`,itemColorHover:c,itemColorHoverError:or(n,{alpha:.06}),itemTextColor:i,itemTextColorError:n,itemTextColorSuccess:l,itemIconColor:r,itemDisabledOpacity:a,itemBorderImageCardError:`1px solid ${n}`,itemBorderImageCard:`1px solid ${u}`}}const _o=bt({name:"Upload",common:qe,peers:{Button:rr,Progress:Et},self:No});function Mo(){return{toolbarIconColor:"rgba(255, 255, 255, .9)",toolbarColor:"rgba(0, 0, 0, .35)",toolbarBoxShadow:"none",toolbarBorderRadius:"24px"}}const Ao=bt({name:"Image",common:qe,peers:{Tooltip:Lr},self:Mo});function Fo(){return t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M6 5C5.75454 5 5.55039 5.17688 5.50806 5.41012L5.5 5.5V14.5C5.5 14.7761 5.72386 15 6 15C6.24546 15 6.44961 14.8231 6.49194 14.5899L6.5 14.5V5.5C6.5 5.22386 6.27614 5 6 5ZM13.8536 5.14645C13.68 4.97288 13.4106 4.9536 13.2157 5.08859L13.1464 5.14645L8.64645 9.64645C8.47288 9.82001 8.4536 10.0894 8.58859 10.2843L8.64645 10.3536L13.1464 14.8536C13.3417 15.0488 13.6583 15.0488 13.8536 14.8536C14.0271 14.68 14.0464 14.4106 13.9114 14.2157L13.8536 14.1464L9.70711 10L13.8536 5.85355C14.0488 5.65829 14.0488 5.34171 13.8536 5.14645Z",fill:"currentColor"}))}function jo(){return t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M13.5 5C13.7455 5 13.9496 5.17688 13.9919 5.41012L14 5.5V14.5C14 14.7761 13.7761 15 13.5 15C13.2545 15 13.0504 14.8231 13.0081 14.5899L13 14.5V5.5C13 5.22386 13.2239 5 13.5 5ZM5.64645 5.14645C5.82001 4.97288 6.08944 4.9536 6.28431 5.08859L6.35355 5.14645L10.8536 9.64645C11.0271 9.82001 11.0464 10.0894 10.9114 10.2843L10.8536 10.3536L6.35355 14.8536C6.15829 15.0488 5.84171 15.0488 5.64645 14.8536C5.47288 14.68 5.4536 14.4106 5.58859 14.2157L5.64645 14.1464L9.79289 10L5.64645 5.85355C5.45118 5.65829 5.45118 5.34171 5.64645 5.14645Z",fill:"currentColor"}))}function Eo(){return t("svg",{viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},t("path",{d:"M4.089 4.216l.057-.07a.5.5 0 0 1 .638-.057l.07.057L10 9.293l5.146-5.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 .057.638l-.057.07L10.707 10l5.147 5.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.638.057l-.07-.057L10 10.707l-5.146 5.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1-.057-.638l.057-.07L9.293 10L4.146 4.854a.5.5 0 0 1-.057-.638l.057-.07l-.057.07z",fill:"currentColor"}))}const Ye=Object.assign(Object.assign({},Se.props),{onPreviewPrev:Function,onPreviewNext:Function,showToolbar:{type:Boolean,default:!0},showToolbarTooltip:Boolean,renderToolbar:Function}),Ht=Ze("n-image"),Ho=V([V("body >",[y("image-container","position: fixed;")]),y("image-preview-container",`
 position: fixed;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 `),y("image-preview-overlay",`
 z-index: -1;
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 background: rgba(0, 0, 0, .3);
 `,[tt()]),y("image-preview-toolbar",`
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
 `,[y("base-icon",`
 padding: 0 8px;
 font-size: 28px;
 cursor: pointer;
 `),tt()]),y("image-preview-wrapper",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 display: flex;
 pointer-events: none;
 `,[nr()]),y("image-preview",`
 user-select: none;
 -webkit-user-select: none;
 pointer-events: all;
 margin: auto;
 max-height: calc(100vh - 32px);
 max-width: calc(100vw - 32px);
 transition: transform .3s var(--n-bezier);
 `),y("image",`
 display: inline-flex;
 max-height: 100%;
 max-width: 100%;
 `,[ir("preview-disabled",`
 cursor: pointer;
 `),V("img",`
 border-radius: inherit;
 `)])]),Be=32,Wo=Object.assign(Object.assign({},Ye),{src:String,show:{type:Boolean,default:void 0},defaultShow:Boolean,"onUpdate:show":[Function,Array],onUpdateShow:[Function,Array],onNext:Function,onPrev:Function,onClose:[Function,Array]}),Wt=K({name:"ImagePreview",props:Wo,setup(e){const{src:r}=ur(e),{mergedClsPrefixRef:o}=Re(e),n=Se("Image","-image",Ho,Ao,e,o);let i=null;const l=_(null),a=_(null),s=_(!1),{localeRef:u}=$r("Image"),c=_(e.defaultShow),d=N(e,"show"),h=Ne(d,c);function C(){const{value:g}=a;if(!i||!g)return;const{style:S}=g,b=i.getBoundingClientRect(),M=b.left+b.width/2,A=b.top+b.height/2;S.transformOrigin=`${M}px ${A}px`}function I(g){var S,b;switch(g.key){case" ":g.preventDefault();break;case"ArrowLeft":(S=e.onPrev)===null||S===void 0||S.call(e);break;case"ArrowRight":(b=e.onNext)===null||b===void 0||b.call(e);break;case"ArrowUp":g.preventDefault(),Te();break;case"ArrowDown":g.preventDefault(),Ke();break;case"Escape":Je();break}}function w(g){const{onUpdateShow:S,"onUpdate:show":b}=e;S&&ce(S,g),b&&ce(b,g),c.value=g,s.value=!0}dr(h,g=>{g?Fe("keydown",document,I):$e("keydown",document,I)}),xt(()=>{$e("keydown",document,I)});let f=0,k=0,R=0,p=0,v=0,O=0,m=0,$=0,z=!1;function T(g){const{clientX:S,clientY:b}=g;R=S-f,p=b-k,Tr(ie)}function L(g){const{mouseUpClientX:S,mouseUpClientY:b,mouseDownClientX:M,mouseDownClientY:A}=g,ee=M-S,ne=A-b,le=`vertical${ne>0?"Top":"Bottom"}`,ge=`horizontal${ee>0?"Left":"Right"}`;return{moveVerticalDirection:le,moveHorizontalDirection:ge,deltaHorizontal:ee,deltaVertical:ne}}function U(g){const{value:S}=l;if(!S)return{offsetX:0,offsetY:0};const b=S.getBoundingClientRect(),{moveVerticalDirection:M,moveHorizontalDirection:A,deltaHorizontal:ee,deltaVertical:ne}=g||{};let le=0,ge=0;return b.width<=window.innerWidth?le=0:b.left>0?le=(b.width-window.innerWidth)/2:b.right<window.innerWidth?le=-(b.width-window.innerWidth)/2:A==="horizontalRight"?le=Math.min((b.width-window.innerWidth)/2,v-(ee??0)):le=Math.max(-((b.width-window.innerWidth)/2),v-(ee??0)),b.height<=window.innerHeight?ge=0:b.top>0?ge=(b.height-window.innerHeight)/2:b.bottom<window.innerHeight?ge=-(b.height-window.innerHeight)/2:M==="verticalBottom"?ge=Math.min((b.height-window.innerHeight)/2,O-(ne??0)):ge=Math.max(-((b.height-window.innerHeight)/2),O-(ne??0)),{offsetX:le,offsetY:ge}}function x(g){$e("mousemove",document,T),$e("mouseup",document,x);const{clientX:S,clientY:b}=g;z=!1;const M=L({mouseUpClientX:S,mouseUpClientY:b,mouseDownClientX:m,mouseDownClientY:$}),A=U(M);R=A.offsetX,p=A.offsetY,ie()}const P=me(Ht,null);function j(g){var S,b;if((b=(S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.onMousedown)===null||b===void 0||b.call(S,g),g.button!==0)return;const{clientX:M,clientY:A}=g;z=!0,f=M-R,k=A-p,v=R,O=p,m=M,$=A,ie(),Fe("mousemove",document,T),Fe("mouseup",document,x)}const J=1.5;let Z=0,D=1,E=0;function H(g){var S,b;(b=(S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.onDblclick)===null||b===void 0||b.call(S,g);const M=Oe();D=D===M?1:M,ie()}function Q(){D=1,Z=0}function de(){var g;Q(),E=0,(g=e.onPrev)===null||g===void 0||g.call(e)}function oe(){var g;Q(),E=0,(g=e.onNext)===null||g===void 0||g.call(e)}function we(){E-=90,ie()}function _e(){E+=90,ie()}function Me(){const{value:g}=l;if(!g)return 1;const{innerWidth:S,innerHeight:b}=window,M=Math.max(1,g.naturalHeight/(b-Be)),A=Math.max(1,g.naturalWidth/(S-Be));return Math.max(3,M*2,A*2)}function Oe(){const{value:g}=l;if(!g)return 1;const{innerWidth:S,innerHeight:b}=window,M=g.naturalHeight/(b-Be),A=g.naturalWidth/(S-Be);return M<1&&A<1?1:Math.max(M,A)}function Te(){const g=Me();D<g&&(Z+=1,D=Math.min(g,Math.pow(J,Z)),ie())}function Ke(){if(D>.5){const g=D;Z-=1,D=Math.max(.5,Math.pow(J,Z));const S=g-D;ie(!1);const b=U();D+=S,ie(!1),D-=S,R=b.offsetX,p=b.offsetY,ie()}}function Kt(){const g=r.value;g&&Lt(g,void 0)}function ie(g=!0){var S;const{value:b}=l;if(!b)return;const{style:M}=b,A=fr((S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.style);let ee="";if(typeof A=="string")ee=`${A};`;else for(const le in A)ee+=`${ko(le)}: ${A[le]};`;const ne=`transform-origin: center; transform: translateX(${R}px) translateY(${p}px) rotate(${E}deg) scale(${D});`;z?M.cssText=`${ee}cursor: grabbing; transition: none;${ne}`:M.cssText=`${ee}cursor: grab;${ne}${g?"":"transition: none;"}`,g||b.offsetHeight}function Je(){if(h.value){const{onClose:g}=e;g&&ce(g),w(!1),c.value=!1}}function Jt(){D=Oe(),Z=Math.ceil(Math.log(D)/Math.log(J)),R=0,p=0,ie()}const Qt={setThumbnailEl:g=>{i=g}};function er(g,S){if(e.showToolbarTooltip){const{value:b}=n;return t(Or,{to:!1,theme:b.peers.Tooltip,themeOverrides:b.peerOverrides.Tooltip,keepAliveOnHover:!1},{default:()=>u.value[S],trigger:()=>g})}else return g}const Qe=B(()=>{const{common:{cubicBezierEaseInOut:g},self:{toolbarIconColor:S,toolbarBorderRadius:b,toolbarBoxShadow:M,toolbarColor:A}}=n.value;return{"--n-bezier":g,"--n-toolbar-icon-color":S,"--n-toolbar-color":A,"--n-toolbar-border-radius":b,"--n-toolbar-box-shadow":M}}),{inlineThemeDisabled:et}=Re(),be=et?Xe("image-preview",void 0,Qe,e):void 0;function tr(g){g.preventDefault()}return Object.assign({clsPrefix:o,previewRef:l,previewWrapperRef:a,previewSrc:r,mergedShow:h,appear:cr(),displayed:s,previewedImgProps:P==null?void 0:P.previewedImgPropsRef,handleWheel:tr,handlePreviewMousedown:j,handlePreviewDblclick:H,syncTransformOrigin:C,handleAfterLeave:()=>{Q(),E=0,s.value=!1},handleDragStart:g=>{var S,b;(b=(S=P==null?void 0:P.previewedImgPropsRef.value)===null||S===void 0?void 0:S.onDragstart)===null||b===void 0||b.call(S,g),g.preventDefault()},zoomIn:Te,zoomOut:Ke,handleDownloadClick:Kt,rotateCounterclockwise:we,rotateClockwise:_e,handleSwitchPrev:de,handleSwitchNext:oe,withTooltip:er,resizeToOrignalImageSize:Jt,cssVars:et?void 0:Qe,themeClass:be==null?void 0:be.themeClass,onRender:be==null?void 0:be.onRender,doUpdateShow:w,close:Je},Qt)},render(){var e,r;const{clsPrefix:o,renderToolbar:n,withTooltip:i}=this,l=i(t(q,{clsPrefix:o,onClick:this.handleSwitchPrev},{default:Fo}),"tipPrevious"),a=i(t(q,{clsPrefix:o,onClick:this.handleSwitchNext},{default:jo}),"tipNext"),s=i(t(q,{clsPrefix:o,onClick:this.rotateCounterclockwise},{default:()=>t(Io,null)}),"tipCounterclockwise"),u=i(t(q,{clsPrefix:o,onClick:this.rotateClockwise},{default:()=>t($o,null)}),"tipClockwise"),c=i(t(q,{clsPrefix:o,onClick:this.resizeToOrignalImageSize},{default:()=>t(Oo,null)}),"tipOriginalSize"),d=i(t(q,{clsPrefix:o,onClick:this.zoomOut},{default:()=>t(Do,null)}),"tipZoomOut"),h=i(t(q,{clsPrefix:o,onClick:this.handleDownloadClick},{default:()=>t(jt,null)}),"tipDownload"),C=i(t(q,{clsPrefix:o,onClick:()=>this.close()},{default:Eo}),"tipClose"),I=i(t(q,{clsPrefix:o,onClick:this.zoomIn},{default:()=>t(zo,null)}),"tipZoomIn");return t(De,null,(r=(e=this.$slots).default)===null||r===void 0?void 0:r.call(e),t(lr,{show:this.mergedShow},{default:()=>{var w;return this.mergedShow||this.displayed?((w=this.onRender)===null||w===void 0||w.call(this),rt(t("div",{ref:"containerRef",class:[`${o}-image-preview-container`,this.themeClass],style:this.cssVars,onWheel:this.handleWheel},t(Ae,{name:"fade-in-transition",appear:this.appear},{default:()=>this.mergedShow?t("div",{class:`${o}-image-preview-overlay`,onClick:()=>this.close()}):null}),this.showToolbar?t(Ae,{name:"fade-in-transition",appear:this.appear},{default:()=>this.mergedShow?t("div",{class:`${o}-image-preview-toolbar`},n?n({nodes:{prev:l,next:a,rotateCounterclockwise:s,rotateClockwise:u,resizeToOriginalSize:c,zoomOut:d,zoomIn:I,download:h,close:C}}):t(De,null,this.onPrev?t(De,null,l,a):null,s,u,c,d,I,h,C)):null}):null,t(Ae,{name:"fade-in-scale-up-transition",onAfterLeave:this.handleAfterLeave,appear:this.appear,onEnter:this.syncTransformOrigin,onBeforeLeave:this.syncTransformOrigin},{default:()=>{const{previewedImgProps:f={}}=this;return rt(t("div",{class:`${o}-image-preview-wrapper`,ref:"previewWrapperRef"},t("img",Object.assign({},f,{draggable:!1,onMousedown:this.handlePreviewMousedown,onDblclick:this.handlePreviewDblclick,class:[`${o}-image-preview`,f.class],key:this.previewSrc,src:this.previewSrc,ref:"previewRef",onDragstart:this.handleDragStart}))),[[sr,this.mergedShow]])}})),[[ar,{enabled:this.mergedShow}]])):null}}))}}),Vt=Ze("n-image-group"),Vo=Object.assign(Object.assign({},Ye),{srcList:Array,current:Number,defaultCurrent:{type:Number,default:0},show:{type:Boolean,default:void 0},defaultShow:Boolean,onUpdateShow:[Function,Array],"onUpdate:show":[Function,Array],onUpdateCurrent:[Function,Array],"onUpdate:current":[Function,Array]}),qo=K({name:"ImageGroup",props:Vo,setup(e){const{mergedClsPrefixRef:r}=Re(e),o=`c${He()}`,n=_(null),i=_(e.defaultShow),l=N(e,"show"),a=Ne(l,i),s=_(new Map),u=B(()=>{if(e.srcList){const T=new Map;return e.srcList.forEach((L,U)=>{T.set(`p${U}`,L)}),T}return s.value}),c=B(()=>Array.from(u.value.keys())),d=()=>c.value.length;function h(T,L){e.srcList&&Le("image-group","`n-image` can't be placed inside `n-image-group` when image group's `src-list` prop is set.");const U=`r${T}`;return s.value.has(`r${U}`)||s.value.set(U,L),function(){s.value.has(U)||s.value.delete(U)}}const C=_(e.defaultCurrent),I=N(e,"current"),w=Ne(I,C),f=T=>{if(T!==w.value){const{onUpdateCurrent:L,"onUpdate:current":U}=e;L&&ce(L,T),U&&ce(U,T),C.value=T}},k=B(()=>c.value[w.value]),R=T=>{const L=c.value.indexOf(T);L!==w.value&&f(L)},p=B(()=>u.value.get(k.value));function v(T){const{onUpdateShow:L,"onUpdate:show":U}=e;L&&ce(L,T),U&&ce(U,T),i.value=T}function O(){v(!1)}const m=B(()=>{const T=(U,x)=>{for(let P=U;P<=x;P++){const j=c.value[P];if(u.value.get(j))return P}},L=T(w.value+1,d()-1);return L===void 0?T(0,w.value-1):L}),$=B(()=>{const T=(U,x)=>{for(let P=U;P>=x;P--){const j=c.value[P];if(u.value.get(j))return P}},L=T(w.value-1,0);return L===void 0?T(d()-1,w.value+1):L});function z(T){var L,U;T===1?($.value!==void 0&&f(m.value),(L=e.onPreviewNext)===null||L===void 0||L.call(e)):(m.value!==void 0&&f($.value),(U=e.onPreviewPrev)===null||U===void 0||U.call(e))}return Ge(Vt,{mergedClsPrefixRef:r,registerImageUrl:h,setThumbnailEl:T=>{var L;(L=n.value)===null||L===void 0||L.setThumbnailEl(T)},toggleShow:T=>{v(!0),R(T)},groupId:o,renderToolbarRef:N(e,"renderToolbar")}),{mergedClsPrefix:r,previewInstRef:n,mergedShow:a,src:p,onClose:O,next:()=>{z(1)},prev:()=>{z(-1)}}},render(){return t(Wt,{theme:this.theme,themeOverrides:this.themeOverrides,ref:"previewInstRef",onPrev:this.prev,onNext:this.next,src:this.src,show:this.mergedShow,showToolbar:this.showToolbar,showToolbarTooltip:this.showToolbarTooltip,renderToolbar:this.renderToolbar,onClose:this.onClose},this.$slots)}}),Zo=Object.assign({alt:String,height:[String,Number],imgProps:Object,previewedImgProps:Object,lazy:Boolean,intersectionObserverOptions:Object,objectFit:{type:String,default:"fill"},previewSrc:String,fallbackSrc:String,width:[String,Number],src:String,previewDisabled:Boolean,loadDescription:String,onError:Function,onLoad:Function},Ye);let Xo=0;const Go=K({name:"Image",props:Zo,slots:Object,inheritAttrs:!1,setup(e){const r=_(null),o=_(!1),n=_(null),i=me(Vt,null),{mergedClsPrefixRef:l}=i||Re(e),a=B(()=>e.previewSrc||e.src),s=_(!1),u=Xo++,c=()=>{if(e.previewDisabled||o.value)return;if(i){i.setThumbnailEl(r.value),i.toggleShow(`r${u}`);return}const{value:f}=n;f&&(f.setThumbnailEl(r.value),s.value=!0)},d={click:()=>{c()},showPreview:c},h=_(!e.lazy);We(()=>{var f;(f=r.value)===null||f===void 0||f.setAttribute("data-group-id",(i==null?void 0:i.groupId)||"")}),We(()=>{if(e.lazy&&e.intersectionObserverOptions){let f;const k=Ue(()=>{f==null||f(),f=void 0,f=Pr(r.value,e.intersectionObserverOptions,h)});xt(()=>{k(),f==null||f()})}}),Ue(()=>{var f;e.src||((f=e.imgProps)===null||f===void 0||f.src),o.value=!1}),Ue(f=>{var k;const R=(k=i==null?void 0:i.registerImageUrl)===null||k===void 0?void 0:k.call(i,u,a.value||"");f(()=>{R==null||R()})});function C(f){var k,R;d.showPreview(),(R=(k=e.imgProps)===null||k===void 0?void 0:k.onClick)===null||R===void 0||R.call(k,f)}function I(){s.value=!1}const w=_(!1);return Ge(Ht,{previewedImgPropsRef:N(e,"previewedImgProps")}),Object.assign({mergedClsPrefix:l,groupId:i==null?void 0:i.groupId,previewInstRef:n,imageRef:r,mergedPreviewSrc:a,showError:o,shouldStartLoading:h,loaded:w,mergedOnClick:f=>{C(f)},onPreviewClose:I,mergedOnError:f=>{if(!h.value)return;o.value=!0;const{onError:k,imgProps:{onError:R}={}}=e;k==null||k(f),R==null||R(f)},mergedOnLoad:f=>{const{onLoad:k,imgProps:{onLoad:R}={}}=e;k==null||k(f),R==null||R(f),w.value=!0},previewShow:s},d)},render(){var e,r;const{mergedClsPrefix:o,imgProps:n={},loaded:i,$attrs:l,lazy:a}=this,s=yt(this.$slots.error,()=>[]),u=(r=(e=this.$slots).placeholder)===null||r===void 0?void 0:r.call(e),c=this.src||n.src,d=this.showError&&s.length?s:t("img",Object.assign(Object.assign({},n),{ref:"imageRef",width:this.width||n.width,height:this.height||n.height,src:this.showError?this.fallbackSrc:a&&this.intersectionObserverOptions?this.shouldStartLoading?c:void 0:c,alt:this.alt||n.alt,"aria-label":this.alt||n.alt,onClick:this.mergedOnClick,onError:this.mergedOnError,onLoad:this.mergedOnLoad,loading:kr&&a&&!this.intersectionObserverOptions?"lazy":"eager",style:[n.style||"",u&&!i?{height:"0",width:"0",visibility:"hidden"}:"",{objectFit:this.objectFit}],"data-error":this.showError,"data-preview-src":this.previewSrc||this.src}));return t("div",Object.assign({},l,{role:"none",class:[l.class,`${o}-image`,(this.previewDisabled||this.showError)&&`${o}-image--preview-disabled`]}),this.groupId?d:t(Wt,{theme:this.theme,themeOverrides:this.themeOverrides,ref:"previewInstRef",showToolbar:this.showToolbar,showToolbarTooltip:this.showToolbarTooltip,renderToolbar:this.renderToolbar,src:this.mergedPreviewSrc,show:!this.previewDisabled&&this.previewShow,onClose:this.onPreviewClose},{default:()=>d}),!i&&u)}}),Yo={success:t(kt,null),error:t(St,null),warning:t(Rt,null),info:t(Ct,null)},Ko=K({name:"ProgressCircle",props:{clsPrefix:{type:String,required:!0},status:{type:String,required:!0},strokeWidth:{type:Number,required:!0},fillColor:[String,Object],railColor:String,railStyle:[String,Object],percentage:{type:Number,default:0},offsetDegree:{type:Number,default:0},showIndicator:{type:Boolean,required:!0},indicatorTextColor:String,unit:String,viewBoxWidth:{type:Number,required:!0},gapDegree:{type:Number,required:!0},gapOffsetDegree:{type:Number,default:0}},setup(e,{slots:r}){const o=B(()=>{const l="gradient",{fillColor:a}=e;return typeof a=="object"?`${l}-${gr(JSON.stringify(a))}`:l});function n(l,a,s,u){const{gapDegree:c,viewBoxWidth:d,strokeWidth:h}=e,C=50,I=0,w=C,f=0,k=2*C,R=50+h/2,p=`M ${R},${R} m ${I},${w}
      a ${C},${C} 0 1 1 ${f},${-k}
      a ${C},${C} 0 1 1 ${-f},${k}`,v=Math.PI*2*C,O={stroke:u==="rail"?s:typeof e.fillColor=="object"?`url(#${o.value})`:s,strokeDasharray:`${Math.min(l,100)/100*(v-c)}px ${d*8}px`,strokeDashoffset:`-${c/2}px`,transformOrigin:a?"center":void 0,transform:a?`rotate(${a}deg)`:void 0};return{pathString:p,pathStyle:O}}const i=()=>{const l=typeof e.fillColor=="object",a=l?e.fillColor.stops[0]:"",s=l?e.fillColor.stops[1]:"";return l&&t("defs",null,t("linearGradient",{id:o.value,x1:"0%",y1:"100%",x2:"100%",y2:"0%"},t("stop",{offset:"0%","stop-color":a}),t("stop",{offset:"100%","stop-color":s})))};return()=>{const{fillColor:l,railColor:a,strokeWidth:s,offsetDegree:u,status:c,percentage:d,showIndicator:h,indicatorTextColor:C,unit:I,gapOffsetDegree:w,clsPrefix:f}=e,{pathString:k,pathStyle:R}=n(100,0,a,"rail"),{pathString:p,pathStyle:v}=n(d,u,l,"fill"),O=100+s;return t("div",{class:`${f}-progress-content`,role:"none"},t("div",{class:`${f}-progress-graph`,"aria-hidden":!0},t("div",{class:`${f}-progress-graph-circle`,style:{transform:w?`rotate(${w}deg)`:void 0}},t("svg",{viewBox:`0 0 ${O} ${O}`},i(),t("g",null,t("path",{class:`${f}-progress-graph-circle-rail`,d:k,"stroke-width":s,"stroke-linecap":"round",fill:"none",style:R})),t("g",null,t("path",{class:[`${f}-progress-graph-circle-fill`,d===0&&`${f}-progress-graph-circle-fill--empty`],d:p,"stroke-width":s,"stroke-linecap":"round",fill:"none",style:v}))))),h?t("div",null,r.default?t("div",{class:`${f}-progress-custom-content`,role:"none"},r.default()):c!=="default"?t("div",{class:`${f}-progress-icon`,"aria-hidden":!0},t(q,{clsPrefix:f},{default:()=>Yo[c]})):t("div",{class:`${f}-progress-text`,style:{color:C},role:"none"},t("span",{class:`${f}-progress-text__percentage`},d),t("span",{class:`${f}-progress-text__unit`},I))):null)}}}),Jo={success:t(kt,null),error:t(St,null),warning:t(Rt,null),info:t(Ct,null)},Qo=K({name:"ProgressLine",props:{clsPrefix:{type:String,required:!0},percentage:{type:Number,default:0},railColor:String,railStyle:[String,Object],fillColor:[String,Object],status:{type:String,required:!0},indicatorPlacement:{type:String,required:!0},indicatorTextColor:String,unit:{type:String,default:"%"},processing:{type:Boolean,required:!0},showIndicator:{type:Boolean,required:!0},height:[String,Number],railBorderRadius:[String,Number],fillBorderRadius:[String,Number]},setup(e,{slots:r}){const o=B(()=>ye(e.height)),n=B(()=>{var a,s;return typeof e.fillColor=="object"?`linear-gradient(to right, ${(a=e.fillColor)===null||a===void 0?void 0:a.stops[0]} , ${(s=e.fillColor)===null||s===void 0?void 0:s.stops[1]})`:e.fillColor}),i=B(()=>e.railBorderRadius!==void 0?ye(e.railBorderRadius):e.height!==void 0?ye(e.height,{c:.5}):""),l=B(()=>e.fillBorderRadius!==void 0?ye(e.fillBorderRadius):e.railBorderRadius!==void 0?ye(e.railBorderRadius):e.height!==void 0?ye(e.height,{c:.5}):"");return()=>{const{indicatorPlacement:a,railColor:s,railStyle:u,percentage:c,unit:d,indicatorTextColor:h,status:C,showIndicator:I,processing:w,clsPrefix:f}=e;return t("div",{class:`${f}-progress-content`,role:"none"},t("div",{class:`${f}-progress-graph`,"aria-hidden":!0},t("div",{class:[`${f}-progress-graph-line`,{[`${f}-progress-graph-line--indicator-${a}`]:!0}]},t("div",{class:`${f}-progress-graph-line-rail`,style:[{backgroundColor:s,height:o.value,borderRadius:i.value},u]},t("div",{class:[`${f}-progress-graph-line-fill`,w&&`${f}-progress-graph-line-fill--processing`],style:{maxWidth:`${e.percentage}%`,background:n.value,height:o.value,lineHeight:o.value,borderRadius:l.value}},a==="inside"?t("div",{class:`${f}-progress-graph-line-indicator`,style:{color:h}},r.default?r.default():`${c}${d}`):null)))),I&&a==="outside"?t("div",null,r.default?t("div",{class:`${f}-progress-custom-content`,style:{color:h},role:"none"},r.default()):C==="default"?t("div",{role:"none",class:`${f}-progress-icon ${f}-progress-icon--as-text`,style:{color:h}},c,d):t("div",{class:`${f}-progress-icon`,"aria-hidden":!0},t(q,{clsPrefix:f},{default:()=>Jo[C]}))):null)}}});function ft(e,r,o=100){return`m ${o/2} ${o/2-e} a ${e} ${e} 0 1 1 0 ${2*e} a ${e} ${e} 0 1 1 0 -${2*e}`}const en=K({name:"ProgressMultipleCircle",props:{clsPrefix:{type:String,required:!0},viewBoxWidth:{type:Number,required:!0},percentage:{type:Array,default:[0]},strokeWidth:{type:Number,required:!0},circleGap:{type:Number,required:!0},showIndicator:{type:Boolean,required:!0},fillColor:{type:Array,default:()=>[]},railColor:{type:Array,default:()=>[]},railStyle:{type:Array,default:()=>[]}},setup(e,{slots:r}){const o=B(()=>e.percentage.map((l,a)=>`${Math.PI*l/100*(e.viewBoxWidth/2-e.strokeWidth/2*(1+2*a)-e.circleGap*a)*2}, ${e.viewBoxWidth*8}`)),n=(i,l)=>{const a=e.fillColor[l],s=typeof a=="object"?a.stops[0]:"",u=typeof a=="object"?a.stops[1]:"";return typeof e.fillColor[l]=="object"&&t("linearGradient",{id:`gradient-${l}`,x1:"100%",y1:"0%",x2:"0%",y2:"100%"},t("stop",{offset:"0%","stop-color":s}),t("stop",{offset:"100%","stop-color":u}))};return()=>{const{viewBoxWidth:i,strokeWidth:l,circleGap:a,showIndicator:s,fillColor:u,railColor:c,railStyle:d,percentage:h,clsPrefix:C}=e;return t("div",{class:`${C}-progress-content`,role:"none"},t("div",{class:`${C}-progress-graph`,"aria-hidden":!0},t("div",{class:`${C}-progress-graph-circle`},t("svg",{viewBox:`0 0 ${i} ${i}`},t("defs",null,h.map((I,w)=>n(I,w))),h.map((I,w)=>t("g",{key:w},t("path",{class:`${C}-progress-graph-circle-rail`,d:ft(i/2-l/2*(1+2*w)-a*w,l,i),"stroke-width":l,"stroke-linecap":"round",fill:"none",style:[{strokeDashoffset:0,stroke:c[w]},d[w]]}),t("path",{class:[`${C}-progress-graph-circle-fill`,I===0&&`${C}-progress-graph-circle-fill--empty`],d:ft(i/2-l/2*(1+2*w)-a*w,l,i),"stroke-width":l,"stroke-linecap":"round",fill:"none",style:{strokeDasharray:o.value[w],strokeDashoffset:0,stroke:typeof u[w]=="object"?`url(#gradient-${w})`:u[w]}})))))),s&&r.default?t("div",null,t("div",{class:`${C}-progress-text`},r.default())):null)}}}),tn=V([y("progress",{display:"inline-block"},[y("progress-icon",`
 color: var(--n-icon-color);
 transition: color .3s var(--n-bezier);
 `),F("line",`
 width: 100%;
 display: block;
 `,[y("progress-content",`
 display: flex;
 align-items: center;
 `,[y("progress-graph",{flex:1})]),y("progress-custom-content",{marginLeft:"14px"}),y("progress-icon",`
 width: 30px;
 padding-left: 14px;
 height: var(--n-icon-size-line);
 line-height: var(--n-icon-size-line);
 font-size: var(--n-icon-size-line);
 `,[F("as-text",`
 color: var(--n-text-color-line-outer);
 text-align: center;
 width: 40px;
 font-size: var(--n-font-size);
 padding-left: 4px;
 transition: color .3s var(--n-bezier);
 `)])]),F("circle, dashboard",{width:"120px"},[y("progress-custom-content",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `),y("progress-text",`
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
 `),y("progress-icon",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 display: flex;
 align-items: center;
 color: var(--n-icon-color);
 font-size: var(--n-icon-size-circle);
 `)]),F("multiple-circle",`
 width: 200px;
 color: inherit;
 `,[y("progress-text",`
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
 `)]),y("progress-content",{position:"relative"}),y("progress-graph",{position:"relative"},[y("progress-graph-circle",[V("svg",{verticalAlign:"bottom"}),y("progress-graph-circle-fill",`
 stroke: var(--n-fill-color);
 transition:
 opacity .3s var(--n-bezier),
 stroke .3s var(--n-bezier),
 stroke-dasharray .3s var(--n-bezier);
 `,[F("empty",{opacity:0})]),y("progress-graph-circle-rail",`
 transition: stroke .3s var(--n-bezier);
 overflow: hidden;
 stroke: var(--n-rail-color);
 `)]),y("progress-graph-line",[F("indicator-inside",[y("progress-graph-line-rail",`
 height: 16px;
 line-height: 16px;
 border-radius: 10px;
 `,[y("progress-graph-line-fill",`
 height: inherit;
 border-radius: 10px;
 `),y("progress-graph-line-indicator",`
 background: #0000;
 white-space: nowrap;
 text-align: right;
 margin-left: 14px;
 margin-right: 14px;
 height: inherit;
 font-size: 12px;
 color: var(--n-text-color-line-inner);
 transition: color .3s var(--n-bezier);
 `)])]),F("indicator-inside-label",`
 height: 16px;
 display: flex;
 align-items: center;
 `,[y("progress-graph-line-rail",`
 flex: 1;
 transition: background-color .3s var(--n-bezier);
 `),y("progress-graph-line-indicator",`
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
 `)]),y("progress-graph-line-rail",`
 position: relative;
 overflow: hidden;
 height: var(--n-rail-height);
 border-radius: 5px;
 background-color: var(--n-rail-color);
 transition: background-color .3s var(--n-bezier);
 `,[y("progress-graph-line-fill",`
 background: var(--n-fill-color);
 position: relative;
 border-radius: 5px;
 height: inherit;
 width: 100%;
 max-width: 0%;
 transition:
 background-color .3s var(--n-bezier),
 max-width .2s var(--n-bezier);
 `,[F("processing",[V("&::after",`
 content: "";
 background-image: var(--n-line-bg-processing);
 animation: progress-processing-animation 2s var(--n-bezier) infinite;
 `)])])])])])]),V("@keyframes progress-processing-animation",`
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
 `)]),rn=Object.assign(Object.assign({},Se.props),{processing:Boolean,type:{type:String,default:"line"},gapDegree:Number,gapOffsetDegree:Number,status:{type:String,default:"default"},railColor:[String,Array],railStyle:[String,Array],color:[String,Array,Object],viewBoxWidth:{type:Number,default:100},strokeWidth:{type:Number,default:7},percentage:[Number,Array],unit:{type:String,default:"%"},showIndicator:{type:Boolean,default:!0},indicatorPosition:{type:String,default:"outside"},indicatorPlacement:{type:String,default:"outside"},indicatorTextColor:String,circleGap:{type:Number,default:1},height:Number,borderRadius:[String,Number],fillBorderRadius:[String,Number],offsetDegree:Number}),on=K({name:"Progress",props:rn,setup(e){const r=B(()=>e.indicatorPlacement||e.indicatorPosition),o=B(()=>{if(e.gapDegree||e.gapDegree===0)return e.gapDegree;if(e.type==="dashboard")return 75}),{mergedClsPrefixRef:n,inlineThemeDisabled:i}=Re(e),l=Se("Progress","-progress",tn,Et,e,n),a=B(()=>{const{status:u}=e,{common:{cubicBezierEaseInOut:c},self:{fontSize:d,fontSizeCircle:h,railColor:C,railHeight:I,iconSizeCircle:w,iconSizeLine:f,textColorCircle:k,textColorLineInner:R,textColorLineOuter:p,lineBgProcessing:v,fontWeightCircle:O,[ot("iconColor",u)]:m,[ot("fillColor",u)]:$}}=l.value;return{"--n-bezier":c,"--n-fill-color":$,"--n-font-size":d,"--n-font-size-circle":h,"--n-font-weight-circle":O,"--n-icon-color":m,"--n-icon-size-circle":w,"--n-icon-size-line":f,"--n-line-bg-processing":v,"--n-rail-color":C,"--n-rail-height":I,"--n-text-color-circle":k,"--n-text-color-line-inner":R,"--n-text-color-line-outer":p}}),s=i?Xe("progress",B(()=>e.status[0]),a,e):void 0;return{mergedClsPrefix:n,mergedIndicatorPlacement:r,gapDeg:o,cssVars:i?void 0:a,themeClass:s==null?void 0:s.themeClass,onRender:s==null?void 0:s.onRender}},render(){const{type:e,cssVars:r,indicatorTextColor:o,showIndicator:n,status:i,railColor:l,railStyle:a,color:s,percentage:u,viewBoxWidth:c,strokeWidth:d,mergedIndicatorPlacement:h,unit:C,borderRadius:I,fillBorderRadius:w,height:f,processing:k,circleGap:R,mergedClsPrefix:p,gapDeg:v,gapOffsetDegree:O,themeClass:m,$slots:$,onRender:z}=this;return z==null||z(),t("div",{class:[m,`${p}-progress`,`${p}-progress--${e}`,`${p}-progress--${i}`],style:r,"aria-valuemax":100,"aria-valuemin":0,"aria-valuenow":u,role:e==="circle"||e==="line"||e==="dashboard"?"progressbar":"none"},e==="circle"||e==="dashboard"?t(Ko,{clsPrefix:p,status:i,showIndicator:n,indicatorTextColor:o,railColor:l,fillColor:s,railStyle:a,offsetDegree:this.offsetDegree,percentage:u,viewBoxWidth:c,strokeWidth:d,gapDegree:v===void 0?e==="dashboard"?75:0:v,gapOffsetDegree:O,unit:C},$):e==="line"?t(Qo,{clsPrefix:p,status:i,showIndicator:n,indicatorTextColor:o,railColor:l,fillColor:s,railStyle:a,percentage:u,processing:k,indicatorPlacement:h,unit:C,fillBorderRadius:w,railBorderRadius:I,height:f},$):e==="multiple-circle"?t(en,{clsPrefix:p,strokeWidth:d,railColor:l,fillColor:s,railStyle:a,viewBoxWidth:c,percentage:u,showIndicator:n,circleGap:R},$):null)}}),ke=Ze("n-upload"),nn=V([y("upload","width: 100%;",[F("dragger-inside",[y("upload-trigger",`
 display: block;
 `)]),F("drag-over",[y("upload-dragger",`
 border: var(--n-dragger-border-hover);
 `)])]),y("upload-dragger",`
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
 `,[V("&:hover",`
 border: var(--n-dragger-border-hover);
 `),F("disabled",`
 cursor: not-allowed;
 `)]),y("upload-trigger",`
 display: inline-block;
 box-sizing: border-box;
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `,[V("+",[y("upload-file-list","margin-top: 8px;")]),F("disabled",`
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `),F("image-card",`
 width: 96px;
 height: 96px;
 `,[y("base-icon",`
 font-size: 24px;
 `),y("upload-dragger",`
 padding: 0;
 height: 100%;
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: center;
 `)])]),y("upload-file-list",`
 line-height: var(--n-line-height);
 opacity: 1;
 transition: opacity .3s var(--n-bezier);
 `,[V("a, img","outline: none;"),F("disabled",`
 opacity: var(--n-item-disabled-opacity);
 cursor: not-allowed;
 `,[y("upload-file","cursor: not-allowed;")]),F("grid",`
 display: grid;
 grid-template-columns: repeat(auto-fill, 96px);
 grid-gap: 8px;
 margin-top: 0;
 `),y("upload-file",`
 display: block;
 box-sizing: border-box;
 cursor: default;
 padding: 0px 12px 0 6px;
 transition: background-color .3s var(--n-bezier);
 border-radius: var(--n-border-radius);
 `,[nt(),y("progress",[nt({foldPadding:!0})]),V("&:hover",`
 background-color: var(--n-item-color-hover);
 `,[y("upload-file-info",[ae("action",`
 opacity: 1;
 `)])]),F("image-type",`
 border-radius: var(--n-border-radius);
 text-decoration: underline;
 text-decoration-color: #0000;
 `,[y("upload-file-info",`
 padding-top: 0px;
 padding-bottom: 0px;
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 6px 0;
 `,[y("progress",`
 padding: 2px 0;
 margin-bottom: 0;
 `),ae("name",`
 padding: 0 8px;
 `),ae("thumbnail",`
 width: 32px;
 height: 32px;
 font-size: 28px;
 display: flex;
 justify-content: center;
 align-items: center;
 `,[V("img",`
 width: 100%;
 `)])])]),F("text-type",[y("progress",`
 box-sizing: border-box;
 padding-bottom: 6px;
 margin-bottom: 6px;
 `)]),F("image-card-type",`
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
 `,[y("progress",`
 position: absolute;
 left: 8px;
 bottom: 8px;
 right: 8px;
 width: unset;
 `),y("upload-file-info",`
 padding: 0;
 width: 100%;
 height: 100%;
 `,[ae("thumbnail",`
 width: 100%;
 height: 100%;
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 font-size: 36px;
 `,[V("img",`
 width: 100%;
 `)])]),V("&::before",`
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
 `),V("&:hover",[V("&::before","opacity: 1;"),y("upload-file-info",[ae("thumbnail","opacity: .12;")])])]),F("error-status",[V("&:hover",`
 background-color: var(--n-item-color-hover-error);
 `),y("upload-file-info",[ae("name","color: var(--n-item-text-color-error);"),ae("thumbnail","color: var(--n-item-text-color-error);")]),F("image-card-type",`
 border: var(--n-item-border-image-card-error);
 `)]),F("with-url",`
 cursor: pointer;
 `,[y("upload-file-info",[ae("name",`
 color: var(--n-item-text-color-success);
 text-decoration-color: var(--n-item-text-color-success);
 `,[V("a",`
 text-decoration: underline;
 `)])])]),y("upload-file-info",`
 position: relative;
 padding-top: 6px;
 padding-bottom: 6px;
 display: flex;
 flex-wrap: nowrap;
 `,[ae("thumbnail",`
 font-size: 18px;
 opacity: 1;
 transition: opacity .2s var(--n-bezier);
 color: var(--n-item-icon-color);
 `,[y("base-icon",`
 margin-right: 2px;
 vertical-align: middle;
 transition: color .3s var(--n-bezier);
 `)]),ae("action",`
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
 `,[y("button",[V("&:not(:last-child)",{marginRight:"4px"}),y("base-icon",[V("svg",[hr()])])]),F("image-type",`
 position: relative;
 max-width: 80px;
 width: auto;
 `),F("image-card-type",`
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
 `)]),ae("name",`
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
 `,[V("a",`
 color: inherit;
 text-decoration: underline;
 `)])])])]),y("upload-file-input",`
 display: none;
 width: 0;
 height: 0;
 opacity: 0;
 `)]),qt="__UPLOAD_DRAGGER__",ln=K({name:"UploadDragger",[qt]:!0,setup(e,{slots:r}){const o=me(ke,null);return o||Le("upload-dragger","`n-upload-dragger` must be placed inside `n-upload`."),()=>{const{mergedClsPrefixRef:{value:n},mergedDisabledRef:{value:i},maxReachedRef:{value:l}}=o;return t("div",{class:[`${n}-upload-dragger`,(i||l)&&`${n}-upload-dragger--disabled`]},r)}}});function an(){return t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 28 28"},t("g",{fill:"none"},t("path",{d:"M21.75 3A3.25 3.25 0 0 1 25 6.25v15.5A3.25 3.25 0 0 1 21.75 25H6.25A3.25 3.25 0 0 1 3 21.75V6.25A3.25 3.25 0 0 1 6.25 3h15.5zm.583 20.4l-7.807-7.68a.75.75 0 0 0-.968-.07l-.084.07l-7.808 7.68c.183.065.38.1.584.1h15.5c.204 0 .4-.035.583-.1l-7.807-7.68l7.807 7.68zM21.75 4.5H6.25A1.75 1.75 0 0 0 4.5 6.25v15.5c0 .208.036.408.103.593l7.82-7.692a2.25 2.25 0 0 1 3.026-.117l.129.117l7.82 7.692c.066-.185.102-.385.102-.593V6.25a1.75 1.75 0 0 0-1.75-1.75zm-3.25 3a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zm0 1.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2z",fill:"currentColor"})))}function sn(){return t("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 28 28"},t("g",{fill:"none"},t("path",{d:"M6.4 2A2.4 2.4 0 0 0 4 4.4v19.2A2.4 2.4 0 0 0 6.4 26h15.2a2.4 2.4 0 0 0 2.4-2.4V11.578c0-.729-.29-1.428-.805-1.944l-6.931-6.931A2.4 2.4 0 0 0 14.567 2H6.4zm-.9 2.4a.9.9 0 0 1 .9-.9H14V10a2 2 0 0 0 2 2h6.5v11.6a.9.9 0 0 1-.9.9H6.4a.9.9 0 0 1-.9-.9V4.4zm16.44 6.1H16a.5.5 0 0 1-.5-.5V4.06l6.44 6.44z",fill:"currentColor"})))}const un=K({name:"UploadProgress",props:{show:Boolean,percentage:{type:Number,required:!0},status:{type:String,required:!0}},setup(){return{mergedTheme:me(ke).mergedThemeRef}},render(){return t(Pt,null,{default:()=>this.show?t(on,{type:"line",showIndicator:!1,percentage:this.percentage,status:this.status,height:2,theme:this.mergedTheme.peers.Progress,themeOverrides:this.mergedTheme.peerOverrides.Progress}):null})}});var Ve=function(e,r,o,n){function i(l){return l instanceof o?l:new o(function(a){a(l)})}return new(o||(o=Promise))(function(l,a){function s(d){try{c(n.next(d))}catch(h){a(h)}}function u(d){try{c(n.throw(d))}catch(h){a(h)}}function c(d){d.done?l(d.value):i(d.value).then(s,u)}c((n=n.apply(e,r||[])).next())})};function Zt(e){return e.includes("image/")}function gt(e=""){const r=e.split("/"),n=r[r.length-1].split(/#|\?/)[0];return(/\.[^./\\]*$/.exec(n)||[""])[0]}const ht=/(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i,Xt=e=>{if(e.type)return Zt(e.type);const r=gt(e.name||"");if(ht.test(r))return!0;const o=e.thumbnailUrl||e.url||"",n=gt(o);return!!(/^data:image\//.test(o)||ht.test(n))};function dn(e){return Ve(this,void 0,void 0,function*(){return yield new Promise(r=>{if(!e.type||!Zt(e.type)){r("");return}r(window.URL.createObjectURL(e))})})}const cn=pr&&window.FileReader&&window.File;function fn(e){return e.isDirectory}function gn(e){return e.isFile}function hn(e,r){return Ve(this,void 0,void 0,function*(){const o=[];function n(i){return Ve(this,void 0,void 0,function*(){for(const l of i)if(l){if(r&&fn(l)){const a=l.createReader();let s=[],u;try{do u=yield new Promise((c,d)=>{a.readEntries(c,d)}),s=s.concat(u);while(u.length>0)}catch(c){it("upload","error happens when handling directory upload",c)}yield n(s)}else if(gn(l))try{const a=yield new Promise((s,u)=>{l.file(s,u)});o.push({file:a,entry:l,source:"dnd"})}catch(a){it("upload","error happens when handling file upload",a)}}})}return yield n(e),o})}function Pe(e){const{id:r,name:o,percentage:n,status:i,url:l,file:a,thumbnailUrl:s,type:u,fullPath:c,batchId:d}=e;return{id:r,name:o,percentage:n??null,status:i,url:l??null,file:a??null,thumbnailUrl:s??null,type:u??null,fullPath:c??null,batchId:d??null}}function pn(e,r,o){return e=e.toLowerCase(),r=r.toLocaleLowerCase(),o=o.toLocaleLowerCase(),o.split(",").map(i=>i.trim()).filter(Boolean).some(i=>{if(i.startsWith(".")){if(e.endsWith(i))return!0}else if(i.includes("/")){const[l,a]=r.split("/"),[s,u]=i.split("/");if((s==="*"||l&&s&&s===l)&&(u==="*"||a&&u&&u===a))return!0}else return!0;return!1})}var pt=function(e,r,o,n){function i(l){return l instanceof o?l:new o(function(a){a(l)})}return new(o||(o=Promise))(function(l,a){function s(d){try{c(n.next(d))}catch(h){a(h)}}function u(d){try{c(n.throw(d))}catch(h){a(h)}}function c(d){d.done?l(d.value):i(d.value).then(s,u)}c((n=n.apply(e,r||[])).next())})};const ze={paddingMedium:"0 3px",heightMedium:"24px",iconSizeMedium:"18px"},vn=K({name:"UploadFile",props:{clsPrefix:{type:String,required:!0},file:{type:Object,required:!0},listType:{type:String,required:!0},index:{type:Number,required:!0}},setup(e){const r=me(ke),o=_(null),n=_(""),i=B(()=>{const{file:m}=e;return m.status==="finished"?"success":m.status==="error"?"error":"info"}),l=B(()=>{const{file:m}=e;if(m.status==="error")return"error"}),a=B(()=>{const{file:m}=e;return m.status==="uploading"}),s=B(()=>{if(!r.showCancelButtonRef.value)return!1;const{file:m}=e;return["uploading","pending","error"].includes(m.status)}),u=B(()=>{if(!r.showRemoveButtonRef.value)return!1;const{file:m}=e;return["finished"].includes(m.status)}),c=B(()=>{if(!r.showDownloadButtonRef.value)return!1;const{file:m}=e;return["finished"].includes(m.status)}),d=B(()=>{if(!r.showRetryButtonRef.value)return!1;const{file:m}=e;return["error"].includes(m.status)}),h=mr(()=>n.value||e.file.thumbnailUrl||e.file.url),C=B(()=>{if(!r.showPreviewButtonRef.value)return!1;const{file:{status:m},listType:$}=e;return["finished"].includes(m)&&h.value&&$==="image-card"});function I(){return pt(this,void 0,void 0,function*(){const m=r.onRetryRef.value;m&&(yield m({file:e.file}))===!1||r.submit({fileId:e.file.id})})}function w(m){m.preventDefault();const{file:$}=e;["finished","pending","error"].includes($.status)?k($):["uploading"].includes($.status)?p($):wr("upload","The button clicked type is unknown.")}function f(m){m.preventDefault(),R(e.file)}function k(m){const{xhrMap:$,doChange:z,onRemoveRef:{value:T},mergedFileListRef:{value:L}}=r;Promise.resolve(T?T({file:Object.assign({},m),fileList:L,index:e.index}):!0).then(U=>{if(U===!1)return;const x=Object.assign({},m,{status:"removed"});$.delete(m.id),z(x,void 0,{remove:!0})})}function R(m){const{onDownloadRef:{value:$},customDownloadRef:{value:z}}=r;Promise.resolve($?$(Object.assign({},m)):!0).then(T=>{T!==!1&&(z?z(Object.assign({},m)):Lt(m.url,m.name))})}function p(m){const{xhrMap:$}=r,z=$.get(m.id);z==null||z.abort(),k(Object.assign({},m))}function v(m){const{onPreviewRef:{value:$}}=r;if($)$(e.file,{event:m});else if(e.listType==="image-card"){const{value:z}=o;if(!z)return;z.showPreview()}}const O=()=>pt(this,void 0,void 0,function*(){const{listType:m}=e;m!=="image"&&m!=="image-card"||r.shouldUseThumbnailUrlRef.value(e.file)&&(n.value=yield r.getFileThumbnailUrlResolver(e.file))});return Ue(()=>{O()}),{mergedTheme:r.mergedThemeRef,progressStatus:i,buttonType:l,showProgress:a,disabled:r.mergedDisabledRef,showCancelButton:s,showRemoveButton:u,showDownloadButton:c,showRetryButton:d,showPreviewButton:C,mergedThumbnailUrl:h,shouldUseThumbnailUrl:r.shouldUseThumbnailUrlRef,renderIcon:r.renderIconRef,imageRef:o,handleRemoveOrCancelClick:w,handleDownloadClick:f,handleRetryClick:I,handlePreviewClick:v}},render(){const{clsPrefix:e,mergedTheme:r,listType:o,file:n,renderIcon:i}=this;let l;const a=o==="image";a||o==="image-card"?l=!this.shouldUseThumbnailUrl(n)||!this.mergedThumbnailUrl?t("span",{class:`${e}-upload-file-info__thumbnail`},i?i(n):Xt(n)?t(q,{clsPrefix:e},{default:an}):t(q,{clsPrefix:e},{default:sn})):t("a",{rel:"noopener noreferer",target:"_blank",href:n.url||void 0,class:`${e}-upload-file-info__thumbnail`,onClick:this.handlePreviewClick},o==="image-card"?t(Go,{src:this.mergedThumbnailUrl||void 0,previewSrc:n.url||void 0,alt:n.name,ref:"imageRef"}):t("img",{src:this.mergedThumbnailUrl||void 0,alt:n.name})):l=t("span",{class:`${e}-upload-file-info__thumbnail`},i?i(n):t(q,{clsPrefix:e},{default:()=>t(Po,null)}));const u=t(un,{show:this.showProgress,percentage:n.percentage||0,status:this.progressStatus}),c=o==="text"||o==="image";return t("div",{class:[`${e}-upload-file`,`${e}-upload-file--${this.progressStatus}-status`,n.url&&n.status!=="error"&&o!=="image-card"&&`${e}-upload-file--with-url`,`${e}-upload-file--${o}-type`]},t("div",{class:`${e}-upload-file-info`},l,t("div",{class:`${e}-upload-file-info__name`},c&&(n.url&&n.status!=="error"?t("a",{rel:"noopener noreferer",target:"_blank",href:n.url||void 0,onClick:this.handlePreviewClick},n.name):t("span",{onClick:this.handlePreviewClick},n.name)),a&&u),t("div",{class:[`${e}-upload-file-info__action`,`${e}-upload-file-info__action--${o}-type`]},this.showPreviewButton?t(pe,{key:"preview",quaternary:!0,type:this.buttonType,onClick:this.handlePreviewClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:ze},{icon:()=>t(q,{clsPrefix:e},{default:()=>t(Ir,null)})}):null,(this.showRemoveButton||this.showCancelButton)&&!this.disabled&&t(pe,{key:"cancelOrTrash",theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,quaternary:!0,builtinThemeOverrides:ze,type:this.buttonType,onClick:this.handleRemoveOrCancelClick},{icon:()=>t(vr,null,{default:()=>this.showRemoveButton?t(q,{clsPrefix:e,key:"trash"},{default:()=>t(Bo,null)}):t(q,{clsPrefix:e,key:"cancel"},{default:()=>t(Lo,null)})})}),this.showRetryButton&&!this.disabled&&t(pe,{key:"retry",quaternary:!0,type:this.buttonType,onClick:this.handleRetryClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:ze},{icon:()=>t(q,{clsPrefix:e},{default:()=>t(To,null)})}),this.showDownloadButton?t(pe,{key:"download",quaternary:!0,type:this.buttonType,onClick:this.handleDownloadClick,theme:r.peers.Button,themeOverrides:r.peerOverrides.Button,builtinThemeOverrides:ze},{icon:()=>t(q,{clsPrefix:e},{default:()=>t(jt,null)})}):null)),!a&&u)}}),Gt=K({name:"UploadTrigger",props:{abstract:Boolean},slots:Object,setup(e,{slots:r}){const o=me(ke,null);o||Le("upload-trigger","`n-upload-trigger` must be placed inside `n-upload`.");const{mergedClsPrefixRef:n,mergedDisabledRef:i,maxReachedRef:l,listTypeRef:a,dragOverRef:s,openOpenFileDialog:u,draggerInsideRef:c,handleFileAddition:d,mergedDirectoryDndRef:h,triggerClassRef:C,triggerStyleRef:I}=o,w=B(()=>a.value==="image-card");function f(){i.value||l.value||u()}function k(O){O.preventDefault(),s.value=!0}function R(O){O.preventDefault(),s.value=!0}function p(O){O.preventDefault(),s.value=!1}function v(O){var m;if(O.preventDefault(),!c.value||i.value||l.value){s.value=!1;return}const $=(m=O.dataTransfer)===null||m===void 0?void 0:m.items;$!=null&&$.length?hn(Array.from($).map(z=>z.webkitGetAsEntry()),h.value).then(z=>{d(z)}).finally(()=>{s.value=!1}):s.value=!1}return()=>{var O;const{value:m}=n;return e.abstract?(O=r.default)===null||O===void 0?void 0:O.call(r,{handleClick:f,handleDrop:v,handleDragOver:k,handleDragEnter:R,handleDragLeave:p}):t("div",{class:[`${m}-upload-trigger`,(i.value||l.value)&&`${m}-upload-trigger--disabled`,w.value&&`${m}-upload-trigger--image-card`,C.value],style:I.value,onClick:f,onDrop:v,onDragover:k,onDragenter:R,onDragleave:p},w.value?t(ln,null,{default:()=>yt(r.default,()=>[t(q,{clsPrefix:m},{default:()=>t(Br,null)})])}):r)}}}),mn=K({name:"UploadFileList",setup(e,{slots:r}){const o=me(ke,null);o||Le("upload-file-list","`n-upload-file-list` must be placed inside `n-upload`.");const{abstractRef:n,mergedClsPrefixRef:i,listTypeRef:l,mergedFileListRef:a,fileListClassRef:s,fileListStyleRef:u,cssVarsRef:c,themeClassRef:d,maxReachedRef:h,showTriggerRef:C,imageGroupPropsRef:I}=o,w=B(()=>l.value==="image-card"),f=()=>a.value.map((R,p)=>t(vn,{clsPrefix:i.value,key:R.id,file:R,index:p,listType:l.value})),k=()=>w.value?t(qo,Object.assign({},I.value),{default:f}):t(Pt,{group:!0},{default:f});return()=>{const{value:R}=i,{value:p}=n;return t("div",{class:[`${R}-upload-file-list`,w.value&&`${R}-upload-file-list--grid`,p?d==null?void 0:d.value:void 0,s.value],style:[p&&c?c.value:"",u.value]},k(),C.value&&!h.value&&w.value&&t(Gt,null,r))}}});var vt=function(e,r,o,n){function i(l){return l instanceof o?l:new o(function(a){a(l)})}return new(o||(o=Promise))(function(l,a){function s(d){try{c(n.next(d))}catch(h){a(h)}}function u(d){try{c(n.throw(d))}catch(h){a(h)}}function c(d){d.done?l(d.value):i(d.value).then(s,u)}c((n=n.apply(e,r||[])).next())})};function wn(e,r,o){const{doChange:n,xhrMap:i}=e;let l=0;function a(u){var c;let d=Object.assign({},r,{status:"error",percentage:l});i.delete(r.id),d=Pe(((c=e.onError)===null||c===void 0?void 0:c.call(e,{file:d,event:u}))||d),n(d,u)}function s(u){var c;if(e.isErrorState){if(e.isErrorState(o)){a(u);return}}else if(o.status<200||o.status>=300){a(u);return}let d=Object.assign({},r,{status:"finished",percentage:l});i.delete(r.id),d=Pe(((c=e.onFinish)===null||c===void 0?void 0:c.call(e,{file:d,event:u}))||d),n(d,u)}return{handleXHRLoad:s,handleXHRError:a,handleXHRAbort(u){const c=Object.assign({},r,{status:"removed",file:null,percentage:l});i.delete(r.id),n(c,u)},handleXHRProgress(u){const c=Object.assign({},r,{status:"uploading"});if(u.lengthComputable){const d=Math.ceil(u.loaded/u.total*100);c.percentage=d,l=d}n(c,u)}}}function bn(e){const{inst:r,file:o,data:n,headers:i,withCredentials:l,action:a,customRequest:s}=e,{doChange:u}=e.inst;let c=0;s({file:o,data:n,headers:i,withCredentials:l,action:a,onProgress(d){const h=Object.assign({},o,{status:"uploading"}),C=d.percent;h.percentage=C,c=C,u(h)},onFinish(){var d;let h=Object.assign({},o,{status:"finished",percentage:c});h=Pe(((d=r.onFinish)===null||d===void 0?void 0:d.call(r,{file:h}))||h),u(h)},onError(){var d;let h=Object.assign({},o,{status:"error",percentage:c});h=Pe(((d=r.onError)===null||d===void 0?void 0:d.call(r,{file:h}))||h),u(h)}})}function xn(e,r,o){const n=wn(e,r,o);o.onabort=n.handleXHRAbort,o.onerror=n.handleXHRError,o.onload=n.handleXHRLoad,o.upload&&(o.upload.onprogress=n.handleXHRProgress)}function Yt(e,r){return typeof e=="function"?e({file:r}):e||{}}function yn(e,r,o){const n=Yt(r,o);n&&Object.keys(n).forEach(i=>{e.setRequestHeader(i,n[i])})}function Cn(e,r,o){const n=Yt(r,o);n&&Object.keys(n).forEach(i=>{e.append(i,n[i])})}function Rn(e,r,o,{method:n,action:i,withCredentials:l,responseType:a,headers:s,data:u}){const c=new XMLHttpRequest;c.responseType=a,e.xhrMap.set(o.id,c),c.withCredentials=l;const d=new FormData;if(Cn(d,u,o),o.file!==null&&d.append(r,o.file),xn(e,o,c),i!==void 0){c.open(n.toUpperCase(),i),yn(c,s,o),c.send(d);const h=Object.assign({},o,{status:"uploading"});e.doChange(h)}}const Sn=Object.assign(Object.assign({},Se.props),{name:{type:String,default:"file"},accept:String,action:String,customRequest:Function,directory:Boolean,directoryDnd:{type:Boolean,default:void 0},method:{type:String,default:"POST"},multiple:Boolean,showFileList:{type:Boolean,default:!0},data:[Object,Function],headers:[Object,Function],withCredentials:Boolean,responseType:{type:String,default:""},disabled:{type:Boolean,default:void 0},onChange:Function,onRemove:Function,onFinish:Function,onError:Function,onRetry:Function,onBeforeUpload:Function,isErrorState:Function,onDownload:Function,customDownload:Function,defaultUpload:{type:Boolean,default:!0},fileList:Array,"onUpdate:fileList":[Function,Array],onUpdateFileList:[Function,Array],fileListClass:String,fileListStyle:[String,Object],defaultFileList:{type:Array,default:()=>[]},showCancelButton:{type:Boolean,default:!0},showRemoveButton:{type:Boolean,default:!0},showDownloadButton:Boolean,showRetryButton:{type:Boolean,default:!0},showPreviewButton:{type:Boolean,default:!0},listType:{type:String,default:"text"},onPreview:Function,shouldUseThumbnailUrl:{type:Function,default:e=>cn?Xt(e):!1},createThumbnailUrl:Function,abstract:Boolean,max:Number,showTrigger:{type:Boolean,default:!0},imageGroupProps:Object,inputProps:Object,triggerClass:String,triggerStyle:[String,Object],renderIcon:Function}),mt=K({name:"Upload",props:Sn,setup(e){e.abstract&&e.listType==="image-card"&&Le("upload","when the list-type is image-card, abstract is not supported.");const{mergedClsPrefixRef:r,inlineThemeDisabled:o,mergedRtlRef:n}=Re(e),i=Se("Upload","-upload",nn,_o,e,r),l=xr("Upload",n,r),a=yr(e),s=_(e.defaultFileList),u=N(e,"fileList"),c=_(null),d={value:!1},h=_(!1),C=new Map,I=Ne(u,s),w=B(()=>I.value.map(Pe)),f=B(()=>{const{max:x}=e;return x!==void 0?w.value.length>=x:!1});function k(){var x;(x=c.value)===null||x===void 0||x.click()}function R(x){const P=x.target;m(P.files?Array.from(P.files).map(j=>({file:j,entry:null,source:"input"})):null,x),P.value=""}function p(x){const{"onUpdate:fileList":P,onUpdateFileList:j}=e;P&&ce(P,x),j&&ce(j,x),s.value=x}const v=B(()=>e.multiple||e.directory),O=(x,P,j={append:!1,remove:!1})=>{const{append:J,remove:Z}=j,D=Array.from(w.value),E=D.findIndex(H=>H.id===x.id);if(J||Z||~E){J?D.push(x):Z?D.splice(E,1):D.splice(E,1,x);const{onChange:H}=e;H&&H({file:x,fileList:D,event:P}),p(D)}};function m(x,P){if(!x||x.length===0)return;const{onBeforeUpload:j}=e;x=v.value?x:[x[0]];const{max:J,accept:Z}=e;x=x.filter(({file:E,source:H})=>H==="dnd"&&(Z!=null&&Z.trim())?pn(E.name,E.type,Z):!0),J&&(x=x.slice(0,J-w.value.length));const D=He();Promise.all(x.map(E=>vt(this,[E],void 0,function*({file:H,entry:Q}){var de;const oe={id:He(),batchId:D,name:H.name,status:"pending",percentage:0,file:H,url:null,type:H.type,thumbnailUrl:null,fullPath:(de=Q==null?void 0:Q.fullPath)!==null&&de!==void 0?de:`/${H.webkitRelativePath||H.name}`};return!j||(yield j({file:oe,fileList:w.value}))!==!1?oe:null}))).then(E=>vt(this,void 0,void 0,function*(){let H=Promise.resolve();E.forEach(Q=>{H=H.then(Cr).then(()=>{Q&&O(Q,P,{append:!0})})}),yield H})).then(()=>{e.defaultUpload&&$()})}function $({fileId:x,retry:P=!1}={}){const{method:j,action:J,withCredentials:Z,headers:D,data:E,name:H}=e,Q=x!==void 0?w.value.filter(oe=>oe.id===x):w.value,de=P||x!==void 0;Q.forEach(oe=>{const{status:we}=oe;(we==="pending"||we==="error"&&de)&&(e.customRequest?bn({inst:{doChange:O,xhrMap:C,onFinish:e.onFinish,onError:e.onError},file:oe,action:J,withCredentials:Z,headers:D,data:E,customRequest:e.customRequest}):Rn({doChange:O,xhrMap:C,onFinish:e.onFinish,onError:e.onError,isErrorState:e.isErrorState},H,oe,{method:j,action:J,withCredentials:Z,responseType:e.responseType,headers:D,data:E}))})}function z(x){var P;if(x.thumbnailUrl)return x.thumbnailUrl;const{createThumbnailUrl:j}=e;return j?(P=j(x.file,x))!==null&&P!==void 0?P:x.url||"":x.url?x.url:x.file?dn(x.file):""}const T=B(()=>{const{common:{cubicBezierEaseInOut:x},self:{draggerColor:P,draggerBorder:j,draggerBorderHover:J,itemColorHover:Z,itemColorHoverError:D,itemTextColorError:E,itemTextColorSuccess:H,itemTextColor:Q,itemIconColor:de,itemDisabledOpacity:oe,lineHeight:we,borderRadius:_e,fontSize:Me,itemBorderImageCardError:Oe,itemBorderImageCard:Te}}=i.value;return{"--n-bezier":x,"--n-border-radius":_e,"--n-dragger-border":j,"--n-dragger-border-hover":J,"--n-dragger-color":P,"--n-font-size":Me,"--n-item-color-hover":Z,"--n-item-color-hover-error":D,"--n-item-disabled-opacity":oe,"--n-item-icon-color":de,"--n-item-text-color":Q,"--n-item-text-color-error":E,"--n-item-text-color-success":H,"--n-line-height":we,"--n-item-border-image-card-error":Oe,"--n-item-border-image-card":Te}}),L=o?Xe("upload",void 0,T,e):void 0;Ge(ke,{mergedClsPrefixRef:r,mergedThemeRef:i,showCancelButtonRef:N(e,"showCancelButton"),showDownloadButtonRef:N(e,"showDownloadButton"),showRemoveButtonRef:N(e,"showRemoveButton"),showRetryButtonRef:N(e,"showRetryButton"),onRemoveRef:N(e,"onRemove"),onDownloadRef:N(e,"onDownload"),customDownloadRef:N(e,"customDownload"),mergedFileListRef:w,triggerClassRef:N(e,"triggerClass"),triggerStyleRef:N(e,"triggerStyle"),shouldUseThumbnailUrlRef:N(e,"shouldUseThumbnailUrl"),renderIconRef:N(e,"renderIcon"),xhrMap:C,submit:$,doChange:O,showPreviewButtonRef:N(e,"showPreviewButton"),onPreviewRef:N(e,"onPreview"),getFileThumbnailUrlResolver:z,listTypeRef:N(e,"listType"),dragOverRef:h,openOpenFileDialog:k,draggerInsideRef:d,handleFileAddition:m,mergedDisabledRef:a.mergedDisabledRef,maxReachedRef:f,fileListClassRef:N(e,"fileListClass"),fileListStyleRef:N(e,"fileListStyle"),abstractRef:N(e,"abstract"),acceptRef:N(e,"accept"),cssVarsRef:o?void 0:T,themeClassRef:L==null?void 0:L.themeClass,onRender:L==null?void 0:L.onRender,showTriggerRef:N(e,"showTrigger"),imageGroupPropsRef:N(e,"imageGroupProps"),mergedDirectoryDndRef:B(()=>{var x;return(x=e.directoryDnd)!==null&&x!==void 0?x:e.directory}),onRetryRef:N(e,"onRetry")});const U={clear:()=>{s.value=[]},submit:$,openOpenFileDialog:k};return Object.assign({mergedClsPrefix:r,draggerInsideRef:d,rtlEnabled:l,inputElRef:c,mergedTheme:i,dragOver:h,mergedMultiple:v,cssVars:o?void 0:T,themeClass:L==null?void 0:L.themeClass,onRender:L==null?void 0:L.onRender,handleFileInputChange:R},U)},render(){var e,r;const{draggerInsideRef:o,mergedClsPrefix:n,$slots:i,directory:l,onRender:a}=this;if(i.default&&!this.abstract){const u=i.default()[0];!((e=u==null?void 0:u.type)===null||e===void 0)&&e[qt]&&(o.value=!0)}const s=t("input",Object.assign({},this.inputProps,{ref:"inputElRef",type:"file",class:`${n}-upload-file-input`,accept:this.accept,multiple:this.mergedMultiple,onChange:this.handleFileInputChange,webkitdirectory:l||void 0,directory:l||void 0}));return this.abstract?t(De,null,(r=i.default)===null||r===void 0?void 0:r.call(i),t(br,{to:"body"},s)):(a==null||a(),t("div",{class:[`${n}-upload`,this.rtlEnabled&&`${n}-upload--rtl`,o.value&&`${n}-upload--dragger-inside`,this.dragOver&&`${n}-upload--drag-over`,this.themeClass],style:this.cssVars},s,this.showTrigger&&this.listType!=="image-card"&&t(Gt,null,i),this.showFileList&&t(mn,null,i)))}}),kn={class:"t-grid-2"},Pn={key:0},Ln={key:1},On={style:{margin:"0"}},Tn={class:"t-table-wrap"},$n={key:1,class:"t-table-wrap"},In={key:2,style:{color:"var(--brand-text-muted)"}},Bn={key:2},zn={style:{margin:"0"}},Dn={key:0,style:{color:"var(--brand-text-muted)",margin:"4px 0 0"}},Un={key:3},Nn={class:"t-table-wrap"},_n=K({__name:"PurchaseRequestDetailView",setup(e){const r=Sr(),o=zr(),n=_(null),i=_([]),l=_([]),a=_(null),s=_(""),u=_(""),c=_(!0),d=[{title:"#",key:"lineNo",width:50},{title:"Наименование",key:"name"},{title:"Кол-во",key:"quantity"},{title:"Цена",key:"estimatedUnitPrice",render:p=>{var v;return((v=p.estimatedUnitPrice)==null?void 0:v.toLocaleString("ru-RU"))??"—"}},{title:"Сумма",key:"estimatedAmount",render:p=>{var v;return((v=p.estimatedAmount)==null?void 0:v.toLocaleString("ru-RU"))??"—"}}],h=[{title:"Файл",key:"fileName",render:p=>t("a",{href:`/api/attachments/${p.id}`,target:"_blank"},p.fileName)},{title:"Тип",key:"category",render:p=>p.category==="service_note"?"СТ":"Общее"},{title:"Размер",key:"sizeBytes",render:p=>w(p.sizeBytes)},{title:"SharePoint",key:"sharePointUrl",render:p=>p.sharePointUrl?t("a",{href:p.sharePointUrl,target:"_blank"},"Открыть"):"локально"}],C=[{title:"Шаг",key:"orderNo",width:60},{title:"Роль",key:"approverRoleLabel"},{title:"ФИО",key:"approverFullName"},{title:"Статус",key:"status"},{title:"Комментарий",key:"comment",render:p=>p.comment??"—"}];We(I);async function I(){c.value=!0,s.value="";try{const p=r.params.id;n.value=await he.getPurchaseRequest(p),i.value=await he.getPurchaseApprovals(p),l.value=await he.listAttachments(p),a.value=await he.getSupplierOrder(p)}catch(p){s.value=Ie(p).detail}finally{c.value=!1}}function w(p){return p<1024?`${p} B`:`${(p/1024).toFixed(1)} KB`}async function f(p,v){const O=p.file.file;if(O)try{await he.uploadAttachment(r.params.id,O,v),await I(),u.value="Файл загружен",o.success("Файл загружен")}catch(m){s.value=Ie(m).detail,o.error(s.value)}}async function k(){try{n.value=await he.submitPurchaseRequest(r.params.id),i.value=await he.getPurchaseApprovals(r.params.id),u.value="Заявка отправлена на согласование",o.success(u.value)}catch(p){s.value=Ie(p).detail,o.error(s.value)}}async function R(){try{a.value=await he.createSupplierOrder(r.params.id),u.value="Заказ поставщику создан",o.success(u.value)}catch(p){s.value=Ie(p).detail,o.error(s.value)}}return(p,v)=>n.value?(re(),xe(X(Rr),{key:0,title:`Заявка ${n.value.number}`},{default:te(()=>[ue(X(Ee),{vertical:"",size:16},{default:te(()=>[ue(X(lt),{type:"info"},{default:te(()=>[G(Y(n.value.statusLabel),1)]),_:1}),s.value?(re(),xe(X(at),{key:0,type:"error"},{default:te(()=>[G(Y(s.value),1)]),_:1})):se("",!0),u.value?(re(),xe(X(at),{key:1,type:"success"},{default:te(()=>[G(Y(u.value),1)]),_:1})):se("",!0),W("div",kn,[W("div",null,[v[2]||(v[2]=W("strong",null,"Проект:",-1)),G(" "+Y(n.value.projectName),1)]),W("div",null,[v[3]||(v[3]=W("strong",null,"Техника:",-1)),G(" "+Y(n.value.vehicleName)+" ("+Y(n.value.stateNumber)+")",1)]),W("div",null,[v[4]||(v[4]=W("strong",null,"VIN:",-1)),G(" "+Y(n.value.vinCode||"—"),1)]),W("div",null,[v[5]||(v[5]=W("strong",null,"Сумма:",-1)),G(" "+Y(n.value.estimatedAmount.toLocaleString("ru-RU"))+" ₸",1)]),n.value.defectActNumber?(re(),ve("div",Pn,[v[6]||(v[6]=W("strong",null,"Дефектный акт:",-1)),G(" "+Y(n.value.defectActNumber),1)])):se("",!0),W("div",null,[v[7]||(v[7]=W("strong",null,"Инициатор:",-1)),G(" "+Y(n.value.createdByFullName),1)]),n.value.estimatedAmount>5e5?(re(),ve("div",Ln,[v[8]||(v[8]=W("strong",null,"СТ:",-1)),ue(X(lt),{type:n.value.hasServiceNoteAttachment?"success":"error"},{default:te(()=>[G(Y(n.value.hasServiceNoteAttachment?"Прикреплена":"Требуется (сумма > 500 000 ₸)"),1)]),_:1},8,["type"])])):se("",!0)]),W("p",On,Y(n.value.description),1),W("div",Tn,[ue(X(je),{columns:d,data:n.value.lines,size:"small",bordered:!1},null,8,["data"])]),W("div",null,[v[11]||(v[11]=W("h3",{style:{margin:"0 0 12px"}},"Вложения",-1)),n.value.canEdit?(re(),xe(X(Ee),{key:0,style:{"margin-bottom":"12px"}},{default:te(()=>[ue(X(mt),{"show-file-list":!1,onChange:v[0]||(v[0]=O=>f(O,"service_note"))},{default:te(()=>[ue(X(pe),{secondary:""},{default:te(()=>[...v[9]||(v[9]=[G("Прикрепить СТ",-1)])]),_:1})]),_:1}),ue(X(mt),{"show-file-list":!1,onChange:v[1]||(v[1]=O=>f(O,"general"))},{default:te(()=>[ue(X(pe),{secondary:""},{default:te(()=>[...v[10]||(v[10]=[G("Другое вложение",-1)])]),_:1})]),_:1})]),_:1})):se("",!0),l.value.length?(re(),ve("div",$n,[ue(X(je),{columns:h,data:l.value,size:"small",bordered:!1},null,8,["data"])])):(re(),ve("p",In,"Вложений нет"))]),ue(X(Ee),null,{default:te(()=>[n.value.canSubmit?(re(),xe(X(pe),{key:0,type:"primary",onClick:k},{default:te(()=>[...v[12]||(v[12]=[G("Отправить на согласование",-1)])]),_:1})):se("",!0),n.value.status==="in_progress"?(re(),xe(X(pe),{key:1,type:"primary",onClick:R},{default:te(()=>[...v[13]||(v[13]=[G(" Сформировать заказ поставщику ",-1)])]),_:1})):se("",!0)]),_:1}),a.value?(re(),ve("div",Bn,[v[14]||(v[14]=W("h3",{style:{margin:"0 0 8px"}},"Заказ поставщику",-1)),W("p",zn,[W("strong",null,Y(a.value.number),1),G(" — "+Y(a.value.status),1)]),a.value.externalSystemRef?(re(),ve("p",Dn," Внешний ID: "+Y(a.value.externalSystemRef),1)):se("",!0)])):se("",!0),i.value.length?(re(),ve("div",Un,[v[15]||(v[15]=W("h3",{style:{margin:"0 0 12px"}},"Согласование",-1)),W("div",Nn,[ue(X(je),{columns:C,data:i.value,size:"small",bordered:!1},null,8,["data"])])])):se("",!0)]),_:1})]),_:1},8,["title"])):se("",!0)}}),Xn=Dr(_n,[["__scopeId","data-v-d6d3ba77"]]);export{Xn as default};
