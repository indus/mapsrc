var m=Object.getOwnPropertySymbols;var Be=Object.prototype.hasOwnProperty,Me=Object.prototype.propertyIsEnumerable;var z=(d,p)=>{var B={};for(var F in d)Be.call(d,F)&&p.indexOf(F)<0&&(B[F]=d[F]);if(d!=null&&m)for(var F of m(d))p.indexOf(F)<0&&Me.call(d,F)&&(B[F]=d[F]);return B};(function(d,p){typeof exports=="object"&&typeof module!="undefined"?p(exports):typeof define=="function"&&define.amd?define(["exports"],p):(d=typeof globalThis!="undefined"?globalThis:d||self,p(d.mapsrcGPBF={}))})(this,function(d){"use strict";let p={type:"FeatureCollection",features:[]};const B=e=>(e._GeoJSONSource||(e.style.addSource("$geojson",{type:"geojson",data:p}),e._GeoJSONSource=e.style.getSource("$geojson").constructor,e.style.removeSource("$geojson")),e._GeoJSONSource);var F=Q,P,v,c,D,T,K=["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon","GeometryCollection"];function Q(e){D=2,T=Math.pow(10,6),c=null,P=[],v=[];var t=e.readFields(W,{});return P=null,t}function W(e,t,i){e===1?P.push(i.readString()):e===2?D=i.readVarint():e===3?T=Math.pow(10,i.readVarint()):e===4?Y(i,t):e===5?L(i,t):e===6&&N(i,t)}function Y(e,t){return t.type="FeatureCollection",t.features=[],e.readMessage(Z,t)}function L(e,t){t.type="Feature";var i=e.readMessage(q,t);return"geometry"in i||(i.geometry=null),i}function N(e,t){return t.type="Point",e.readMessage(b,t)}function Z(e,t,i){e===1?t.features.push(L(i,{})):e===13?v.push(E(i)):e===15&&k(i,t)}function q(e,t,i){e===1?t.geometry=N(i,{}):e===11?t.id=i.readString():e===12?t.id=i.readSVarint():e===13?v.push(E(i)):e===14?t.properties=k(i,{}):e===15&&k(i,t)}function b(e,t,i){e===1?t.type=K[i.readVarint()]:e===2?c=i.readPackedVarint():e===3?ee(t,i,t.type):e===4?(t.geometries=t.geometries||[],t.geometries.push(N(i,{}))):e===13?v.push(E(i)):e===15&&k(i,t)}function ee(e,t,i){i==="Point"?e.coordinates=te(t):i==="MultiPoint"||i==="LineString"?e.coordinates=R(t):i==="MultiLineString"?e.coordinates=U(t):i==="Polygon"?e.coordinates=U(t,!0):i==="MultiPolygon"&&(e.coordinates=ie(t))}function E(e){for(var t=e.readVarint()+e.pos,i=null;e.pos<t;){var n=e.readVarint(),r=n>>3;r===1?i=e.readString():r===2?i=e.readDouble():r===3?i=e.readVarint():r===4?i=-e.readVarint():r===5?i=e.readBoolean():r===6&&(i=JSON.parse(e.readString()))}return i}function k(e,t){for(var i=e.readVarint()+e.pos;e.pos<i;)t[P[e.readVarint()]]=v[e.readVarint()];return v=[],t}function te(e){for(var t=e.readVarint()+e.pos,i=[];e.pos<t;)i.push(e.readSVarint()/T);return i}function M(e,t,i,n){var r=0,s=[],o,h,u=[];for(h=0;h<D;h++)u[h]=0;for(;i?r<i:e.pos<t;){for(o=[],h=0;h<D;h++)u[h]+=e.readSVarint(),o[h]=u[h]/T;s.push(o),r++}return n&&s.push(s[0]),s}function R(e){return M(e,e.readVarint()+e.pos)}function U(e,t){var i=e.readVarint()+e.pos;if(!c)return[M(e,i,null,t)];for(var n=[],r=0;r<c.length;r++)n.push(M(e,i,c[r],t));return c=null,n}function ie(e){var t=e.readVarint()+e.pos;if(!c)return[[M(e,t,null,!0)]];for(var i=[],n=1,r=0;r<c[0];r++){for(var s=[],o=0;o<c[n];o++)s.push(M(e,t,c[n+1+o],!0));n+=c[n]+1,i.push(s)}return c=null,i}var re=F,_={};/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */_.read=function(e,t,i,n,r){var s,o,h=r*8-n-1,u=(1<<h)-1,x=u>>1,f=-7,l=i?r-1:0,g=i?-1:1,w=e[t+l];for(l+=g,s=w&(1<<-f)-1,w>>=-f,f+=h;f>0;s=s*256+e[t+l],l+=g,f-=8);for(o=s&(1<<-f)-1,s>>=-f,f+=n;f>0;o=o*256+e[t+l],l+=g,f-=8);if(s===0)s=1-x;else{if(s===u)return o?NaN:(w?-1:1)*(1/0);o=o+Math.pow(2,n),s=s-x}return(w?-1:1)*o*Math.pow(2,s-n)},_.write=function(e,t,i,n,r,s){var o,h,u,x=s*8-r-1,f=(1<<x)-1,l=f>>1,g=r===23?Math.pow(2,-24)-Math.pow(2,-77):0,w=n?0:s-1,I=n?1:-1,ge=t<0||t===0&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(h=isNaN(t)?1:0,o=f):(o=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-o))<1&&(o--,u*=2),o+l>=1?t+=g/u:t+=g*Math.pow(2,1-l),t*u>=2&&(o++,u/=2),o+l>=f?(h=0,o=f):o+l>=1?(h=(t*u-1)*Math.pow(2,r),o=o+l):(h=t*Math.pow(2,l-1)*Math.pow(2,r),o=0));r>=8;e[i+w]=h&255,w+=I,h/=256,r-=8);for(o=o<<r|h,x+=r;x>0;e[i+w]=o&255,w+=I,o/=256,x-=8);e[i+w-I]|=ge*128};var ne=a,C=_;function a(e){this.buf=ArrayBuffer.isView&&ArrayBuffer.isView(e)?e:new Uint8Array(e||0),this.pos=0,this.type=0,this.length=this.buf.length}a.Varint=0,a.Fixed64=1,a.Bytes=2,a.Fixed32=5;var O=(1<<16)*(1<<16),J=1/O,se=12,A=typeof TextDecoder=="undefined"?null:new TextDecoder("utf8");a.prototype={destroy:function(){this.buf=null},readFields:function(e,t,i){for(i=i||this.length;this.pos<i;){var n=this.readVarint(),r=n>>3,s=this.pos;this.type=n&7,e(r,t,this),this.pos===s&&this.skip(n)}return t},readMessage:function(e,t){return this.readFields(e,t,this.readVarint()+this.pos)},readFixed32:function(){var e=G(this.buf,this.pos);return this.pos+=4,e},readSFixed32:function(){var e=j(this.buf,this.pos);return this.pos+=4,e},readFixed64:function(){var e=G(this.buf,this.pos)+G(this.buf,this.pos+4)*O;return this.pos+=8,e},readSFixed64:function(){var e=G(this.buf,this.pos)+j(this.buf,this.pos+4)*O;return this.pos+=8,e},readFloat:function(){var e=C.read(this.buf,this.pos,!0,23,4);return this.pos+=4,e},readDouble:function(){var e=C.read(this.buf,this.pos,!0,52,8);return this.pos+=8,e},readVarint:function(e){var t=this.buf,i,n;return n=t[this.pos++],i=n&127,n<128||(n=t[this.pos++],i|=(n&127)<<7,n<128)||(n=t[this.pos++],i|=(n&127)<<14,n<128)||(n=t[this.pos++],i|=(n&127)<<21,n<128)?i:(n=t[this.pos],i|=(n&15)<<28,oe(i,e,this))},readVarint64:function(){return this.readVarint(!0)},readSVarint:function(){var e=this.readVarint();return e%2==1?(e+1)/-2:e/2},readBoolean:function(){return Boolean(this.readVarint())},readString:function(){var e=this.readVarint()+this.pos,t=this.pos;return this.pos=e,e-t>=se&&A?Se(this.buf,t,e):ve(this.buf,t,e)},readBytes:function(){var e=this.readVarint()+this.pos,t=this.buf.subarray(this.pos,e);return this.pos=e,t},readPackedVarint:function(e,t){if(this.type!==a.Bytes)return e.push(this.readVarint(t));var i=y(this);for(e=e||[];this.pos<i;)e.push(this.readVarint(t));return e},readPackedSVarint:function(e){if(this.type!==a.Bytes)return e.push(this.readSVarint());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readSVarint());return e},readPackedBoolean:function(e){if(this.type!==a.Bytes)return e.push(this.readBoolean());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readBoolean());return e},readPackedFloat:function(e){if(this.type!==a.Bytes)return e.push(this.readFloat());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readFloat());return e},readPackedDouble:function(e){if(this.type!==a.Bytes)return e.push(this.readDouble());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readDouble());return e},readPackedFixed32:function(e){if(this.type!==a.Bytes)return e.push(this.readFixed32());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readFixed32());return e},readPackedSFixed32:function(e){if(this.type!==a.Bytes)return e.push(this.readSFixed32());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readSFixed32());return e},readPackedFixed64:function(e){if(this.type!==a.Bytes)return e.push(this.readFixed64());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readFixed64());return e},readPackedSFixed64:function(e){if(this.type!==a.Bytes)return e.push(this.readSFixed64());var t=y(this);for(e=e||[];this.pos<t;)e.push(this.readSFixed64());return e},skip:function(e){var t=e&7;if(t===a.Varint)for(;this.buf[this.pos++]>127;);else if(t===a.Bytes)this.pos=this.readVarint()+this.pos;else if(t===a.Fixed32)this.pos+=4;else if(t===a.Fixed64)this.pos+=8;else throw new Error("Unimplemented type: "+t)},writeTag:function(e,t){this.writeVarint(e<<3|t)},realloc:function(e){for(var t=this.length||16;t<this.pos+e;)t*=2;if(t!==this.length){var i=new Uint8Array(t);i.set(this.buf),this.buf=i,this.length=t}},finish:function(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)},writeFixed32:function(e){this.realloc(4),V(this.buf,e,this.pos),this.pos+=4},writeSFixed32:function(e){this.realloc(4),V(this.buf,e,this.pos),this.pos+=4},writeFixed64:function(e){this.realloc(8),V(this.buf,e&-1,this.pos),V(this.buf,Math.floor(e*J),this.pos+4),this.pos+=8},writeSFixed64:function(e){this.realloc(8),V(this.buf,e&-1,this.pos),V(this.buf,Math.floor(e*J),this.pos+4),this.pos+=8},writeVarint:function(e){if(e=+e||0,e>268435455||e<0){ae(e,this);return}this.realloc(4),this.buf[this.pos++]=e&127|(e>127?128:0),!(e<=127)&&(this.buf[this.pos++]=(e>>>=7)&127|(e>127?128:0),!(e<=127)&&(this.buf[this.pos++]=(e>>>=7)&127|(e>127?128:0),!(e<=127)&&(this.buf[this.pos++]=e>>>7&127)))},writeSVarint:function(e){this.writeVarint(e<0?-e*2-1:e*2)},writeBoolean:function(e){this.writeVarint(Boolean(e))},writeString:function(e){e=String(e),this.realloc(e.length*4),this.pos++;var t=this.pos;this.pos=Ve(this.buf,e,this.pos);var i=this.pos-t;i>=128&&H(t,i,this),this.pos=t-1,this.writeVarint(i),this.pos+=i},writeFloat:function(e){this.realloc(4),C.write(this.buf,e,this.pos,!0,23,4),this.pos+=4},writeDouble:function(e){this.realloc(8),C.write(this.buf,e,this.pos,!0,52,8),this.pos+=8},writeBytes:function(e){var t=e.length;this.writeVarint(t),this.realloc(t);for(var i=0;i<t;i++)this.buf[this.pos++]=e[i]},writeRawMessage:function(e,t){this.pos++;var i=this.pos;e(t,this);var n=this.pos-i;n>=128&&H(i,n,this),this.pos=i-1,this.writeVarint(n),this.pos+=n},writeMessage:function(e,t,i){this.writeTag(e,a.Bytes),this.writeRawMessage(t,i)},writePackedVarint:function(e,t){t.length&&this.writeMessage(e,fe,t)},writePackedSVarint:function(e,t){t.length&&this.writeMessage(e,de,t)},writePackedBoolean:function(e,t){t.length&&this.writeMessage(e,ce,t)},writePackedFloat:function(e,t){t.length&&this.writeMessage(e,xe,t)},writePackedDouble:function(e,t){t.length&&this.writeMessage(e,le,t)},writePackedFixed32:function(e,t){t.length&&this.writeMessage(e,Fe,t)},writePackedSFixed32:function(e,t){t.length&&this.writeMessage(e,we,t)},writePackedFixed64:function(e,t){t.length&&this.writeMessage(e,pe,t)},writePackedSFixed64:function(e,t){t.length&&this.writeMessage(e,ye,t)},writeBytesField:function(e,t){this.writeTag(e,a.Bytes),this.writeBytes(t)},writeFixed32Field:function(e,t){this.writeTag(e,a.Fixed32),this.writeFixed32(t)},writeSFixed32Field:function(e,t){this.writeTag(e,a.Fixed32),this.writeSFixed32(t)},writeFixed64Field:function(e,t){this.writeTag(e,a.Fixed64),this.writeFixed64(t)},writeSFixed64Field:function(e,t){this.writeTag(e,a.Fixed64),this.writeSFixed64(t)},writeVarintField:function(e,t){this.writeTag(e,a.Varint),this.writeVarint(t)},writeSVarintField:function(e,t){this.writeTag(e,a.Varint),this.writeSVarint(t)},writeStringField:function(e,t){this.writeTag(e,a.Bytes),this.writeString(t)},writeFloatField:function(e,t){this.writeTag(e,a.Fixed32),this.writeFloat(t)},writeDoubleField:function(e,t){this.writeTag(e,a.Fixed64),this.writeDouble(t)},writeBooleanField:function(e,t){this.writeVarintField(e,Boolean(t))}};function oe(e,t,i){var n=i.buf,r,s;if(s=n[i.pos++],r=(s&112)>>4,s<128||(s=n[i.pos++],r|=(s&127)<<3,s<128)||(s=n[i.pos++],r|=(s&127)<<10,s<128)||(s=n[i.pos++],r|=(s&127)<<17,s<128)||(s=n[i.pos++],r|=(s&127)<<24,s<128)||(s=n[i.pos++],r|=(s&1)<<31,s<128))return S(e,r,t);throw new Error("Expected varint not more than 10 bytes")}function y(e){return e.type===a.Bytes?e.readVarint()+e.pos:e.pos+1}function S(e,t,i){return i?t*4294967296+(e>>>0):(t>>>0)*4294967296+(e>>>0)}function ae(e,t){var i,n;if(e>=0?(i=e%4294967296|0,n=e/4294967296|0):(i=~(-e%4294967296),n=~(-e/4294967296),i^4294967295?i=i+1|0:(i=0,n=n+1|0)),e>=18446744073709552e3||e<-18446744073709552e3)throw new Error("Given varint doesn't fit into 10 bytes");t.realloc(10),he(i,n,t),ue(n,t)}function he(e,t,i){i.buf[i.pos++]=e&127|128,e>>>=7,i.buf[i.pos++]=e&127|128,e>>>=7,i.buf[i.pos++]=e&127|128,e>>>=7,i.buf[i.pos++]=e&127|128,e>>>=7,i.buf[i.pos]=e&127}function ue(e,t){var i=(e&7)<<4;t.buf[t.pos++]|=i|((e>>>=3)?128:0),!!e&&(t.buf[t.pos++]=e&127|((e>>>=7)?128:0),!!e&&(t.buf[t.pos++]=e&127|((e>>>=7)?128:0),!!e&&(t.buf[t.pos++]=e&127|((e>>>=7)?128:0),!!e&&(t.buf[t.pos++]=e&127|((e>>>=7)?128:0),!!e&&(t.buf[t.pos++]=e&127)))))}function H(e,t,i){var n=t<=16383?1:t<=2097151?2:t<=268435455?3:Math.floor(Math.log(t)/(Math.LN2*7));i.realloc(n);for(var r=i.pos-1;r>=e;r--)i.buf[r+n]=i.buf[r]}function fe(e,t){for(var i=0;i<e.length;i++)t.writeVarint(e[i])}function de(e,t){for(var i=0;i<e.length;i++)t.writeSVarint(e[i])}function xe(e,t){for(var i=0;i<e.length;i++)t.writeFloat(e[i])}function le(e,t){for(var i=0;i<e.length;i++)t.writeDouble(e[i])}function ce(e,t){for(var i=0;i<e.length;i++)t.writeBoolean(e[i])}function Fe(e,t){for(var i=0;i<e.length;i++)t.writeFixed32(e[i])}function we(e,t){for(var i=0;i<e.length;i++)t.writeSFixed32(e[i])}function pe(e,t){for(var i=0;i<e.length;i++)t.writeFixed64(e[i])}function ye(e,t){for(var i=0;i<e.length;i++)t.writeSFixed64(e[i])}function G(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16)+e[t+3]*16777216}function V(e,t,i){e[i]=t,e[i+1]=t>>>8,e[i+2]=t>>>16,e[i+3]=t>>>24}function j(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16)+(e[t+3]<<24)}function ve(e,t,i){for(var n="",r=t;r<i;){var s=e[r],o=null,h=s>239?4:s>223?3:s>191?2:1;if(r+h>i)break;var u,x,f;h===1?s<128&&(o=s):h===2?(u=e[r+1],(u&192)==128&&(o=(s&31)<<6|u&63,o<=127&&(o=null))):h===3?(u=e[r+1],x=e[r+2],(u&192)==128&&(x&192)==128&&(o=(s&15)<<12|(u&63)<<6|x&63,(o<=2047||o>=55296&&o<=57343)&&(o=null))):h===4&&(u=e[r+1],x=e[r+2],f=e[r+3],(u&192)==128&&(x&192)==128&&(f&192)==128&&(o=(s&15)<<18|(u&63)<<12|(x&63)<<6|f&63,(o<=65535||o>=1114112)&&(o=null))),o===null?(o=65533,h=1):o>65535&&(o-=65536,n+=String.fromCharCode(o>>>10&1023|55296),o=56320|o&1023),n+=String.fromCharCode(o),r+=h}return n}function Se(e,t,i){return A.decode(e.subarray(t,i))}function Ve(e,t,i){for(var n=0,r,s;n<t.length;n++){if(r=t.charCodeAt(n),r>55295&&r<57344)if(s)if(r<56320){e[i++]=239,e[i++]=191,e[i++]=189,s=r;continue}else r=s-55296<<10|r-56320|65536,s=null;else{r>56319||n+1===t.length?(e[i++]=239,e[i++]=191,e[i++]=189):s=r;continue}else s&&(e[i++]=239,e[i++]=191,e[i++]=189,s=null);r<128?e[i++]=r:(r<2048?e[i++]=r>>6|192:(r<65536?e[i++]=r>>12|224:(e[i++]=r>>18|240,e[i++]=r>>12&63|128),e[i++]=r>>6&63|128),e[i++]=r&63|128)}return i}const $=e=>class extends B(e){constructor(i,h,s,o){var u=h,{data:n}=u,r=z(u,["data"]);super(i,Object.assign(r,{data:p}),s,o);this.id=i,this.type="geojson",this._options.data=n,this.setData(n)}setData(i){if(typeof i=="string"||i instanceof String){var n=new XMLHttpRequest;n.open("GET",i),n.responseType="arraybuffer",n.addEventListener("load",()=>this.setData(n.response)),n.send()}else if(i.byteLength!=0){var r=re(new ne(i));super.setData(r)}else console.error("GeobufSource expects a URL or a ArrayBuffer as 'data'");return this}},X=function(e,t){e.addSourceType("geobuf",$(e),t)};d.addSourceTypeGPBF=X,d.default=X,d.getSourceTypeGPBF=$,Object.defineProperty(d,"__esModule",{value:!0}),d[Symbol.toStringTag]="Module"});