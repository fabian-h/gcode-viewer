(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{177:function(e,t,n){e.exports=n(325)},325:function(e,t,n){"use strict";n.r(t);var r,i,a,s,o,c,l,u,d,h=n(0),f=n.n(h),p=n(29),m=n(20),b=n(339),v=(n(182),n(183),n(338)),_=n(49),y=n(330),g=n(21),O=n(336),E=n(23),x=n(33),w=n(37),j=n(38),k=n(22),C=(n(84),n(10)),S=new(r=C.b.bound,i=C.b.bound,a=C.f.ref,s=function(){function e(){Object(w.a)(this,e),Object(x.a)(this,"transform",o,this),Object(x.a)(this,"activeLayer",c,this),Object(x.a)(this,"trackProgress",l,this),Object(x.a)(this,"drawSettings",u,this),Object(x.a)(this,"activeGCode",d,this)}return Object(j.a)(e,[{key:"setDrawSetting",value:function(e,t){}},{key:"setActiveLayer",value:function(e){this.activeLayer=e}},{key:"setTransform",value:function(e){this.transform=e}},{key:"setActiveGCode",value:function(e){this.activeGCode=e,this.activeLayer=1}},{key:"numberOfLayers",get:function(){return null===this.activeGCode?0:this.activeGCode.numberOfLayers}}]),e}(),o=Object(k.a)(s.prototype,"transform",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return{k:1,x:0,y:0}}}),c=Object(k.a)(s.prototype,"activeLayer",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),l=Object(k.a)(s.prototype,"trackProgress",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return!1}}),u=Object(k.a)(s.prototype,"drawSettings",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return{lineWidth:8,coloringMode:"feed_rate",toolColors:["blue","green","red","orange","black"],scaleLinewidth:!0,drawPreviousLayers:2}}}),Object(k.a)(s.prototype,"setDrawSetting",[r],Object.getOwnPropertyDescriptor(s.prototype,"setDrawSetting"),s.prototype),Object(k.a)(s.prototype,"numberOfLayers",[C.d],Object.getOwnPropertyDescriptor(s.prototype,"numberOfLayers"),s.prototype),Object(k.a)(s.prototype,"setActiveLayer",[C.b],Object.getOwnPropertyDescriptor(s.prototype,"setActiveLayer"),s.prototype),Object(k.a)(s.prototype,"setTransform",[i],Object.getOwnPropertyDescriptor(s.prototype,"setTransform"),s.prototype),Object(k.a)(s.prototype,"setActiveGCode",[C.b],Object.getOwnPropertyDescriptor(s.prototype,"setActiveGCode"),s.prototype),d=Object(k.a)(s.prototype,"activeGCode",[a],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),s),I=n(31),T=0,N="0".charCodeAt(0),A="9".charCodeAt(0),F=".".charCodeAt(0),L="-".charCodeAt(0),R=" ".charCodeAt(0),D="\t".charCodeAt(0),z="A".charCodeAt(0),P="Z".charCodeAt(0),G="\n".charCodeAt(0),U="\r".charCodeAt(0),M=";".charCodeAt(0),H={MOVE_WITH_EXTRUSION:1,MOVE_WITHOUT_EXTRUSION:2,SET_FEED_RATE:3,RETRACTION:4,LAYER_CHANGE:5,TOOL_CHANGE:6},W=32768,B=[1,10,100,1e3,1e4,1e5,1e6],q=[.1,.01,.001,1e-4,1e-5,1e-6],V=function(){function e(){Object(w.a)(this,e),this.state=T,this.field=0,this.value_start=void 0,this.dot_position=void 0,this.prev_character=void 0,this.field_values=new Float32Array(27),this.axis_coordinates_absolute=!0,this.extruder_coordinates_absolute=!1,this.feed_rate=0,this.current_tool=0,this.prev_z=0,this.last_z_with_extrusion=void 0,this.last_feed_rate_with_extrusion=void 0,this.current_layer_index=0,this.layer_positions=[],this.layer_heights=[],this.layer_byte_positions=[],this.prev_x=0,this.prev_y=0,this.prev_e=0,this.instructions=new X(W),this.byte_index=0,this.last_block=void 0,this.statistics={x:{min:1/0,max:-1/0},y:{min:1/0,max:-1/0},z:{min:0,max:-1/0},feed_rate:{min:1/0,max:-1/0},extruded_feed_rate:{min:1/0,max:-1/0},tools:[{extrusion:0}]},this.field_values.fill(NaN)}return Object(j.a)(e,[{key:"parse",value:function(e){for(var t,n=new Uint8Array(e),r=0;r<n.length;++r){if((t=n[r])>=N&&t<=A||t===F||t===L)t===F&&(this.dot_position=r);else if(t===R||t===D){if(1===this.state&&this.value_start){if(void 0!==this.last_block){for(var i=new Uint8Array(Array.from(this.last_block).concat(Array.from(n.slice(0,r)))),a=i.length,s=0;s<i.length;++s)i[s]===F&&(a=s);this.field_values[this.field-65]=this.pFloat(i,0,i.length,a),this.last_block=void 0}else this.field_values[this.field-65]=this.pFloat(n,this.value_start,r,this.dot_position?this.dot_position:r);this.value_start=void 0,this.dot_position=void 0,this.state=T}}else if(t>=z&&t<=P)this.state===T&&(this.field=n[r],this.state=1,this.value_start=r+1);else if(t!==U&&t!==G||this.prev_character===U||this.prev_character===G)t===M&&(this.state=2);else{if(this.value_start&&(this.field_values[this.field-65]=this.pFloat(n,this.value_start,r,this.dot_position?this.dot_position:r)),this.state=T,this.value_start=void 0,this.dot_position=void 0,isNaN(this.field_values[6]))if(isNaN(this.field_values[12]))isNaN(this.field_values[19])||(this.instructions.addInstruction(this.byte_index,H.TOOL_CHANGE,this.field_values[19]),this.current_tool=this.field_values[19],void 0==this.statistics.tools[this.current_tool]&&(this.statistics.tools[this.current_tool]={extrusion:0}));else switch(this.field_values[12]){case 82:this.extruder_coordinates_absolute=!0;break;case 83:this.extruder_coordinates_absolute=!1}else switch(this.field_values[6]){case 0:case 1:var o,c,l;if(!isNaN(this.field_values[23])||!isNaN(this.field_values[24]))!isNaN(this.field_values[4])&&(this.extruder_coordinates_absolute&&this.field_values[4]>this.prev_e||!this.extruder_coordinates_absolute&&this.field_values[4]>0)?(this.prev_z!==this.last_z_with_extrusion&&(this.instructions.addInstruction(this.byte_index,H.LAYER_CHANGE,this.prev_z),this.layer_positions.push(this.instructions.totalInstructions),this.layer_heights.push(this.prev_z),this.layer_byte_positions.push(this.byte_index),this.current_layer_index+=1,this.prev_z>this.statistics.z.max&&(this.statistics.z.max=this.prev_z),this.instructions.addInstruction(this.byte_index,H.MOVE_WITHOUT_EXTRUSION,this.prev_x,this.prev_y),this.instructions.addInstruction(this.byte_index,H.SET_FEED_RATE,this.feed_rate),this.instructions.addInstruction(this.byte_index,H.TOOL_CHANGE,this.current_tool)),o=H.MOVE_WITH_EXTRUSION,this.last_z_with_extrusion=this.prev_z,this.feed_rate!==this.last_feed_rate_with_extrusion&&(this.feed_rate>this.statistics.extruded_feed_rate.max&&(this.statistics.extruded_feed_rate.max=this.feed_rate),this.feed_rate<this.statistics.extruded_feed_rate.min&&(this.statistics.extruded_feed_rate.min=this.feed_rate)),this.last_feed_rate_with_extrusion=this.feed_rate,this.statistics.tools[this.current_tool].extrusion+=this.field_values[4]):o=H.MOVE_WITHOUT_EXTRUSION,isNaN(this.field_values[23])?c=this.prev_x:((c=this.axis_coordinates_absolute?this.field_values[23]:this.prev_x+this.field_values[23])>this.statistics.x.max&&(this.statistics.x.max=c),c<this.statistics.x.min&&(this.statistics.x.min=c)),isNaN(this.field_values[24])?l=this.prev_y:((l=this.axis_coordinates_absolute?this.field_values[24]:this.prev_y+this.field_values[24])>this.statistics.y.max&&(this.statistics.y.max=l),l<this.statistics.y.min&&(this.statistics.y.min=l)),this.instructions.addInstruction(this.byte_index,o,c,l),this.prev_x=c,this.prev_y=l;isNaN(this.field_values[5])||(this.feed_rate=this.field_values[5],this.instructions.addInstruction(this.byte_index,H.SET_FEED_RATE,this.field_values[5]),this.feed_rate>this.statistics.feed_rate.max&&(this.statistics.feed_rate.max=this.feed_rate),this.feed_rate<this.statistics.feed_rate.min&&(this.statistics.feed_rate.min=this.feed_rate)),isNaN(this.field_values[25])||(this.field_values[25]>this.prev_z&&this.instructions.addInstruction(this.byte_index,H.RETRACTION),this.prev_z=this.field_values[25]);break;case 90:this.axis_coordinates_absolute=!0;break;case 91:this.axis_coordinates_absolute=!1}for(var u=0;u<27;u++)this.field_values[u]=NaN}this.prev_character=t,this.byte_index+=1}1===this.state&&(this.last_block=n.slice(this.value_start))}},{key:"pFloat",value:function(e,t,n,r){for(var i=0,a=!1,s=t;s<n;++s){var o=e[s]-48;s===t&&e[s]===L?a=!0:s<r?i+=o*B[r-s-1]:s>r&&(i+=o*q[s-r-1])}return a?-i:i}},{key:"getParsingResult",value:function(){return{instructions:this.instructions,layerPositions:this.layer_positions,layerHeights:this.layer_heights,layerBytePositions:this.layer_byte_positions,statistics:this.statistics,lineIndex:[]}}}]),e}(),X=function(){function e(t){Object(w.a)(this,e),this.blockSizeInInstructions=void 0,this.buffers=[],this.currentBuffer=0,this.currentInstruction=0,this.currentFloat32Array=void 0,this.totalInstructions=0,this.lastByteIndex=0,this.blockSizeInInstructions=t,this.buffers.push(new ArrayBuffer(3*this.blockSizeInInstructions*4)),this.currentFloat32Array=new Float32Array(this.buffers[this.currentBuffer])}return Object(j.a)(e,[{key:"addInstruction",value:function(e,t,n,r){var i=t|e-this.lastByteIndex<<8;this.lastByteIndex=e,this.currentFloat32Array[3*this.currentInstruction]=i,void 0!==n&&(this.currentFloat32Array[3*this.currentInstruction+1]=n),void 0!==r&&(this.currentFloat32Array[3*this.currentInstruction+2]=r),this.currentInstruction+=1,this.totalInstructions+=1,this.currentInstruction>=this.blockSizeInInstructions&&(this.buffers.push(new ArrayBuffer(3*this.blockSizeInInstructions*4)),this.currentBuffer+=1,this.currentInstruction=0,this.currentFloat32Array=new Float32Array(this.buffers[this.currentBuffer]))}}]),e}(),J=n(168),Y=n(4),Q=n(167),K=n(169),Z=n(328);function $(){var e=Object(m.a)(["\n  position: absolute;\n  padding: 5px;\n  background-color: transparent;\n"]);return $=function(){return e},e}function ee(){var e=Object(m.a)(["\n  flex: 1;\n"]);return ee=function(){return e},e}var te=g.a.canvas(ee()),ne=g.a.div($()),re=Object(E.a)(function(e){var t=e.currentLayer,n=e.bytesToDraw,r=e.activeGCode,i=e.transform,a=e.setTransform,s=e.drawSettings,o=Object(h.useState)(null),c=Object(I.a)(o,2),l=c[0],u=c[1],d=Object(h.useRef)(null),f=Object(C.b)("update transform",function(){a(Y.b.transform)});function p(){null!==d.current&&null!==l&&null!==r&&(function(e,t){t.save(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,e.width,e.height),t.restore()}(d.current,l),function(e,t,n,r,i,a,s,o){var c=r.instructions;e.setTransform(i.k*a,0,0,i.k*a,i.x*a,i.y*a),s.scaleLinewidth?e.lineWidth=s.lineWidth/50:e.lineWidth=s.lineWidth/i.k;e.lineCap="round",function(e,t,n,r,i,a,s,o){var c=0,l=0,u=Object(Q.a)().domain([a.extruded_feed_rate.min,a.extruded_feed_rate.max]).range([0,.8]);e.beginPath();for(var d,h,f,p,m=Math.floor(n/t.blockSizeInInstructions),b=Math.floor(r/t.blockSizeInInstructions),v=0,_=m;_<=b;++_){d=new Float32Array(t.buffers[_]);for(var y=n-_*t.blockSizeInInstructions,g=r-_*t.blockSizeInInstructions,O=3*y;O<3*g;O+=3)switch(h=255&d[O],void 0!==o&&(v+=(4294967041&d[O])>>8)>o&&!s&&(e.stroke(),e.beginPath(),e.moveTo(c,l),s="#ddd",e.lineWidth=e.lineWidth/2,e.strokeStyle=s),f=d[O+1],p=d[O+2],h){case H.MOVE_WITHOUT_EXTRUSION:e.moveTo(f,p),c=f,l=p;break;case H.MOVE_WITH_EXTRUSION:e.lineTo(f,p),c=f,l=p;break;case H.SET_FEED_RATE:"feed_rate"!==i.coloringMode||s||(e.stroke(),e.beginPath(),e.moveTo(c,l),e.strokeStyle=Object(K.a)(u(f)));break;case H.TOOL_CHANGE:if("tool"===i.coloringMode&&!s){e.stroke(),e.beginPath(),e.moveTo(c,l);var E=i.toolColors[f];e.strokeStyle=E||"grey"}}}e.stroke()}(e,c,r.layerPositions[t],r.layerPositions[t+1],s,o,void 0,n)}(l,t,n||void 0,r,i,devicePixelRatio,s,r.statistics))}Object(h.useEffect)(function(){if(l)p();else{d.current&&u(d.current.getContext("2d"));var e=Object(J.a)().on("zoom",f).scaleExtent([1,128]);null!==d.current&&e(Object(Y.f)(d.current))}});s.lineWidth,s.coloringMode,s.scaleLinewidth;return h.createElement(Z.a,{onResize:function(){if(null!==d.current){var e=d.current.clientHeight,t=d.current.clientWidth,n=window.devicePixelRatio||1;d.current.width===t*n&&d.current.height===e*n||(d.current.width=t*n,d.current.height=e*n),p()}}},h.createElement(h.Fragment,null,h.createElement(ne,null,"Layer ",t,h.createElement("br",null),"Layer height: ",r.layerHeights[t].toFixed(2)),h.createElement(te,{ref:d})))});var ie=Object(E.a)(function(e){var t=e.UIStore,n=t.activeGCode,r=t.transform,i=t.setTransform,a=t.drawSettings;if(n&&n.connection&&n.connection.progress){var s=function(e,t){for(var n=0,r=0;r<t.length;++r)e>=t[r]&&(n=r);return n}(n.connection.progress.filepos,n.layerBytePositions);return h.createElement(re,{currentLayer:s,bytesToDraw:n.connection.progress.filepos-n.layerBytePositions[s],activeGCode:n,transform:r,setTransform:i,drawSettings:a})}return h.createElement("div",null,"No GCode")});var ae=n(30),se=n.n(ae),oe=n(43),ce=n(170),le=n(59);function ue(e){return new Promise(function(t,n){var r=e[0],i=new FileReader,a=0,s=new V,o=performance.now();function c(){var e=r.slice(a,a+1048576);i.readAsArrayBuffer(e)}i.onload=function(){if(s.parse(i.result),(a+=1048576)<r.size)c();else{var e=performance.now()-o,n=r.size/1024/1024;console.log("Read ".concat(n.toFixed(2)," megabytes in ").concat(e.toFixed(0)," ms. ").concat((e/n).toFixed(0)," ms/megabyte ").concat((1e3/(e/n)).toFixed(1)," megabyte/s"));var l=s.getParsingResult();t(Object(le.a)({name:r.name,numberOfLayers:l.layerPositions.length},l))}},c()})}function de(){var e=Object(m.a)(["\n  text-align: center;\n"]);return de=function(){return e},e}function he(){var e=Object(m.a)(["\n  flex: 1;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  padding: 20px;\n  margin: 10px;\n  border-width: 4px;\n  border-radius: 2px;\n  border-color: #bbb;\n  border-style: dashed;\n  background-color: #fafafa;\n  color: #666;\n  font-size: 300%;\n  font-weight: bold;\n"]);return he=function(){return e},e}var fe=g.a.div(he()),pe=g.a.p(de());function me(e){var t=e.onFileLoad,n=Object(h.useCallback)(function(){var e=Object(oe.a)(se.a.mark(function e(n){var r;return se.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return S.setActiveGCode(null),e.next=3,ue(n);case 3:r=e.sent,S.setActiveGCode(r),t&&t();case 6:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),[]),r=Object(ce.a)({onDrop:n}),i=r.getRootProps,a=r.getInputProps,s=r.isDragActive;return f.a.createElement(fe,i(),f.a.createElement("input",a()),s?f.a.createElement("p",null,"Drop the files here ..."):f.a.createElement(pe,null,"Drag a G-Code file here",f.a.createElement("br",null)," or ",f.a.createElement("br",null)," click to select a file"))}function be(){var e=Object(m.a)(["\n  flex: 1;\n  display: flex;\n"]);return be=function(){return e},e}var ve,_e,ye,ge=g.a.div(be()),Oe=Object(E.a)(function(e){var t=e.UIStore,n=t.activeGCode,r=t.activeLayer,i=t.transform,a=t.setTransform,s=t.drawSettings,o=Object(h.useState)(!1),c=Object(I.a)(o,2),l=c[0],u=c[1];return n&&!l?h.createElement(ge,{onDragOver:function(e){u(!0)},onDragLeave:function(e){u(!1)}},h.createElement(re,{currentLayer:r,activeGCode:n,transform:i,setTransform:a,drawSettings:s})):h.createElement(me,{onFileLoad:function(){return u(!1)}})}),Ee=n(173),xe=n(50),we=n(329),je=n(11),ke=n(337),Ce=n(105),Se=n(331),Ie=Object(E.a)(function(e){var t=Object(h.useState)(!1),n=Object(I.a)(t,2),r=n[0],i=n[1];return h.createElement(h.Fragment,null,h.createElement(xe.a,{className:"bp3-minimal",icon:"cog",text:"Draw settings",onClick:function(){return i(!0)}}),h.createElement(Te,Object.assign({isOpen:r,handleClose:function(){return i(!1)}},e)))}),Te=Object(E.a)(function(e){var t=e.isOpen,n=e.handleClose,r=Object(Ee.a)(e,["isOpen","handleClose"]);return h.createElement(we.a,{isOpen:t,icon:"cog",size:"20%",hasBackdrop:!1,onClose:n,title:"Draw Settings"},h.createElement("div",{className:je.a.DRAWER_BODY},h.createElement("div",{className:je.a.DIALOG_BODY},h.createElement(Ne,r))))}),Ne=Object(E.a)(function(e){var t=e.drawSettings;return h.createElement("div",null,h.createElement(y.a,{label:"Linewidth",labelFor:"linewidth-input"},h.createElement(ke.a,{value:t.lineWidth,id:"linewidth-input",onValueChange:Object(C.b)("set line width",function(e){return t.lineWidth=e})})),h.createElement(Ce.a,{checked:t.scaleLinewidth,label:"Scale linewidth with zoom",onChange:Object(C.b)("set line width scaling",function(e){return t.scaleLinewidth=e.target.checked})}),h.createElement(Se.a,{label:"Coloring mode",selectedValue:t.coloringMode,onChange:Object(C.b)("set coloring mode",function(e){t.coloringMode=e.target.value})},h.createElement(Ce.b,{label:"by feed rate",value:"feed_rate"}),h.createElement(Ce.b,{label:"by tool",value:"tool"})))}),Ae=n(332),Fe=n(333),Le=Object(E.a)(function(e){var t=e.statistics,n=Object(h.useState)(!1),r=Object(I.a)(n,2),i=r[0],a=r[1];return h.createElement(h.Fragment,null,h.createElement(xe.a,{className:"bp3-minimal",text:"Statistics",icon:"timeline-bar-chart",onClick:function(){return a(!0)}}),h.createElement(Ae.a,{isOpen:i,icon:"timeline-bar-chart",title:"Statistics",onClose:function(){return a(!1)}},h.createElement("div",{className:je.a.DIALOG_BODY},h.createElement("h2",null,"Dimensions"),h.createElement("p",null,(t.x.max-t.x.min).toFixed(2),"\xa0x\xa0",(t.y.max-t.y.min).toFixed(2),"\xa0x\xa0",(t.z.max-t.z.min).toFixed(2),"\xa0mm"),h.createElement("h2",null,"Feed rate"),h.createElement("p",null,t.feed_rate.min.toFixed(0)," -"," ",t.feed_rate.max.toFixed(0)," feed rate"),h.createElement("p",null,t.extruded_feed_rate.min.toFixed(0)," -"," ",t.extruded_feed_rate.max.toFixed(0)," feed rate while extruding"),h.createElement("h2",null,"Tool overview"),h.createElement(Re,{statistics:t}))))});function Re(e){var t=e.statistics;return h.createElement(Fe.a,{bordered:!0,condensed:!0},h.createElement("thead",null,h.createElement("tr",null,h.createElement("th",null,"tool"),h.createElement("th",null,"extrusion"))),h.createElement("tbody",null,t.tools.map(function(e,t){return h.createElement("tr",null,h.createElement("td",null,t),h.createElement("td",null,e.extrusion.toFixed(2)," mm"))})))}var De,ze,Pe=(ve=function(){function e(t,n,r,i){var a=this;Object(w.a)(this,e),this.url=void 0,this.socket=void 0,this.domain=void 0,this.port=void 0,this.apikey=void 0,Object(x.a)(this,"status",_e,this),Object(x.a)(this,"progress",ye,this);var s=Math.floor(999*Math.random()+1),o=this.generateSessionId();this.domain=t,this.port=n,this.url="wss://".concat(t,":").concat(n,"/sockjs/").concat(s,"/").concat(o,"/websocket"),this.apikey=i,console.log("Open websocket at "+this.url),this.socket=new WebSocket(this.url),this.socket.onmessage=function(e){return a.handleMessage(e)},this.socket.onopen=function(){a.socket.send('["{\\"auth\\":\\"'.concat(r,":").concat(i,'\\"}"]'))}}return Object(j.a)(e,[{key:"getCurrentFile",value:function(){return this.progress&&this.progress.path?fetch("https://".concat(this.domain,":").concat(this.port,"/downloads/files/local/").concat(this.progress.path),{headers:{"X-Api-Key":this.apikey}}):null}},{key:"generateSessionId",value:function(){for(var e="",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=0;n<16;n++)e+=t.charAt(Math.floor(Math.random()*t.length));return e}},{key:"updateStatus",value:function(e){this.status=e}},{key:"updateProgress",value:function(e,t){null!==e.filepos?this.progress={completion:e.completion,filepos:e.filepos,filename:t.file.name,path:"local"===t.file.origin?t.file.path:null}:this.progress=null}},{key:"handleMessage",value:function(e){if(e.data.startsWith("a")){var t=JSON.parse(e.data.slice(1));if(1===t.length&&t[0].current){var n=t[0].current;this.updateStatus(n.state.text),this.updateProgress(n.progress,n.job)}}}}]),e}(),_e=Object(k.a)(ve.prototype,"status",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return""}}),ye=Object(k.a)(ve.prototype,"progress",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),Object(k.a)(ve.prototype,"updateStatus",[C.b],Object.getOwnPropertyDescriptor(ve.prototype,"updateStatus"),ve.prototype),Object(k.a)(ve.prototype,"updateProgress",[C.b],Object.getOwnPropertyDescriptor(ve.prototype,"updateProgress"),ve.prototype),ve),Ge=new(De=function(){function e(){var t=this;Object(w.a)(this,e),Object(x.a)(this,"servers",ze,this),this.servers=this.restore("octoprint_servers",[]).map(function(e){return{config:e}}),Object(C.c)(function(e){t.servers=t.servers.map(function(e){var t=e.config;return{config:t,connection:new Pe(t.hostname,t.port,t.user,t.apikey)}})})}return Object(j.a)(e,[{key:"addServer",value:function(e){this.servers.push({config:e,connection:null}),this.save()}},{key:"save",value:function(){window.localStorage.setItem("octoprint_servers",JSON.stringify(this.servers.map(function(e){return e.config})))}},{key:"restore",value:function(e,t){var n=window.localStorage.getItem(e);return null!==n?JSON.parse(n):t}}]),e}(),ze=Object(k.a)(De.prototype,"servers",[C.f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[]}}),Object(k.a)(De.prototype,"addServer",[C.b],Object.getOwnPropertyDescriptor(De.prototype,"addServer"),De.prototype),De),Ue=n(64),Me=n(334),He=n(161),We=n(60),Be=n(155),qe=n(165);function Ve(){var e=Object(m.a)(["\n  margin-top: 5px;\n"]);return Ve=function(){return e},e}function Xe(){var e=Object(m.a)(["\n  margin-bottom: 15px;\n"]);return Xe=function(){return e},e}var Je=Object(g.a)(Me.a)(Xe()),Ye=We.object().shape({name:We.string().max(40,"Too Long!").required("Required"),hostname:We.string().required("Required"),port:We.number().integer("Invalid port number").required("Required"),user:We.string().required("Required")}),Qe=Object(Be.a)({id:"octoprint-add",initial:"idle",states:{idle:{on:{CONNECT:"connecting"}},connecting:{on:{CONNECTION_SUCCESS:"polling_for_auth",CONNECTION_FAILURE:"connection_failed"}},polling_for_auth:{on:{AUTH_REQUEST_ACCEPTED:"auth_successful",AUTH_REQUEST_DENIED:"auth_failed"}},connection_failed:{on:{CONNECT:"connecting"}},auth_successful:{on:{RESET:"idle"}},auth_failed:{on:{CONNECT:"connecting"}}}});function Ke(e,t){return Ze.apply(this,arguments)}function Ze(){return(Ze=Object(oe.a)(se.a.mark(function e(t,n){var r;return se.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("https://".concat(t,":").concat(n,"/plugin/appkeys/probe"));case 3:return r=e.sent,e.abrupt("return",204===r.status);case 7:return e.prev=7,e.t0=e.catch(0),e.abrupt("return",!1);case 10:case"end":return e.stop()}},e,null,[[0,7]])}))).apply(this,arguments)}function $e(e,t){return et.apply(this,arguments)}function et(){return(et=Object(oe.a)(se.a.mark(function e(t,n){var r,i,a,s;return se.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("https://".concat(t,":").concat(n,"/plugin/appkeys/request"),{mode:"cors",method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({app:"G-Code viewer"})});case 2:return r=e.sent,e.next=5,r.json();case 5:i=e.sent.app_token;case 6:return e.next=9,fetch("https://".concat(t,":").concat(n,"/plugin/appkeys/request/")+i);case 9:if(200!==(a=e.sent).status){e.next=15;break}return e.next=13,a.json();case 13:return s=e.sent,e.abrupt("return",s.api_key);case 15:if(404!==a.status){e.next=17;break}return e.abrupt("return",null);case 17:return e.next=19,new Promise(function(e){return setTimeout(e,1e3)});case 19:e.next=6;break;case 21:case"end":return e.stop()}},e)}))).apply(this,arguments)}var tt=Object(E.a)(function(){var e=Object(h.useState)(!1),t=Object(I.a)(e,2),n=t[0],r=t[1],i=Object(qe.useMachine)(Qe),a=Object(I.a)(i,2),s=a[0],o=a[1];return h.createElement(h.Fragment,null,h.createElement(xe.a,{className:"bp3-minimal",icon:"cloud-download",text:"Octoprint",onClick:function(){return r(!0)}}),h.createElement(Ae.a,{isOpen:n,icon:"cloud-download",title:"Add Octoprint server",onClose:function(){r(!1),o("RESET")}},h.createElement(Ue.d,{initialValues:{name:"Test",hostname:"localhost",port:"5000",user:""},onSubmit:function(){var e=Object(oe.a)(se.a.mark(function e(t){var n,r;return se.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o("CONNECT"),e.next=3,Ke(t.hostname,t.port);case 3:if(!e.sent){e.next=12;break}return o("CONNECTION_SUCCESS"),e.next=8,$e(t.hostname,t.port);case 8:(n=e.sent)?(r=Object(le.a)({apikey:n},t),Ge.addServer(r),o("AUTH_REQUEST_ACCEPTED")):o("AUTH_REQUEST_DENIED"),e.next=13;break;case 12:o("CONNECTION_FAILURE");case 13:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),validationSchema:Ye,render:function(){return h.createElement(Ue.c,null,h.createElement("div",{className:je.a.DIALOG_BODY},h.createElement(Je,null,h.createElement("p",null,"Add an Octoprint server to monitor print progress. The Octoprint server must have the CORS setting disabled and must be reachable from the client runnig this web application in the browser.")),h.createElement(it,{label:"Name",name:"name",disabled:!s.matches("idle")}),h.createElement(it,{label:"Hostname or IP address",name:"hostname",disabled:!s.matches("idle")}),h.createElement(it,{label:"Port",name:"port",disabled:!s.matches("idle")}),h.createElement(it,{label:"Username",name:"user",disabled:!s.matches("idle")})),h.createElement("div",{className:je.a.DIALOG_FOOTER},h.createElement("div",{className:je.a.DIALOG_FOOTER_ACTIONS},s.matches("idle")&&h.createElement(h.Fragment,null,h.createElement(xe.a,{type:"submit",intent:"success"},"Requestion authentication from Octoprint"),h.createElement(xe.a,{onClick:function(){return r(!1)}},"Cancel")),s.matches("connecting")&&h.createElement(Me.a,{intent:"primary"},"Connecting to Octoprint server"),s.matches("polling_for_auth")&&h.createElement(Me.a,{intent:"primary"},"Waiting for authorization. Open Octoprint and approve the authorization request to continue."),s.matches("auth_successful")&&h.createElement(Me.a,{intent:"success"},"Successfully added Octoprint server."),s.matches("auth_failed")&&h.createElement(Me.a,{intent:"danger"},"Authorization was denied."),s.matches("connection_failed")&&h.createElement(h.Fragment,null,h.createElement(Me.a,{intent:"danger"},"Error connecting to Octoprint. Make sure the hostname and port are correct and that CORS is disabled."),h.createElement(xe.a,{type:"submit",intent:"success"},"Retry")))))}})))}),nt=Object(g.a)(Me.a)(Ve()),rt=function(e){var t=e.field;return h.createElement(h.Fragment,null,h.createElement(He.a,Object.assign({type:"text"},t)),h.createElement(Ue.a,{name:t.name},function(e){return h.createElement(nt,{intent:"danger",className:"error"},e)}))},it=function(e){var t=e.label,n=e.name,r=e.disabled;return h.createElement(y.a,{label:t,labelFor:"".concat(n,"-input")},h.createElement(Ue.b,{id:"".concat(n,"-input"),name:n,component:rt,disabled:r}))},at=n(335);function st(){var e=Object(m.a)(["\n  position: absolute;\n  right: 15px;\n  top: 65px;\n"]);return st=function(){return e},e}function ot(){var e=Object(m.a)(["\n  padding: 5px;\n"]);return ot=function(){return e},e}var ct=Object(g.a)(at.a)(ot()),lt=g.a.div(st());function ut(){return(ut=Object(oe.a)(se.a.mark(function e(t){var n,r,i,a,s,o,c,l,u;return se.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=performance.now(),e.next=3,t.getCurrentFile();case 3:if(!(r=e.sent)||!r.body||200!==r.status){e.next=23;break}i=new V,a=0,s=r.body.getReader();case 8:return e.next=11,s.read();case 11:if(!(o=e.sent).done){e.next=14;break}return e.abrupt("break",18);case 14:i.parse(o.value),a+=o.value.length,e.next=8;break;case 18:c=performance.now()-n,l=a/1024/1024,console.log("Read ".concat(l.toFixed(2)," megabytes in ").concat(c.toFixed(0)," ms. ").concat((c/l).toFixed(0)," ms/megabyte")),u=i.getParsingResult(),S.setActiveGCode(Object(le.a)({name:"test",numberOfLayers:u.layerPositions.length,connection:t,live:!0},u));case 23:case"end":return e.stop()}},e)}))).apply(this,arguments)}var dt=Object(E.a)(function(){return f.a.createElement(lt,null,Ge.servers.map(function(e,t){var n=e.config,r=e.connection;return f.a.createElement(ct,{key:t},f.a.createElement("p",null,n.name),r?f.a.createElement("p",null,r.status):f.a.createElement("p",null,"unknown"),r&&r.progress?f.a.createElement(f.a.Fragment,null,f.a.createElement("p",null,"Completion: ",r.progress.completion.toFixed(0)),f.a.createElement(xe.a,{intent:"success",onClick:function(){return function(e){return ut.apply(this,arguments)}(r)}},"Live preview")):null)}))});function ht(){var e=Object(m.a)(["\n  grid-column: 1/3;\n  grid-row: 3;\n  padding: 0 20px 0 20px;\n"]);return ht=function(){return e},e}function ft(){var e=Object(m.a)(["\n  grid-column: 1/3;\n  grid-row: 2;\n  background: white;\n  display: flex;\n"]);return ft=function(){return e},e}function pt(){var e=Object(m.a)(["\n  grid-column: 1/3;\n  grid-row: 1;\n  gap: 0;\n"]);return pt=function(){return e},e}function mt(){var e=Object(m.a)(["\n  background: #eee;\n  display: grid;\n  grid-template-columns: 200px minmax(0, 1fr);\n  grid-template-rows: auto minmax(0, 1fr) auto;\n  width: 100vw;\n  height: 100vh;\n  align-self: stretch;\n  overflow: hidden;\n"]);return mt=function(){return e},e}b.a.onlyShowFocusOnTabs();var bt=g.a.div(mt()),vt=g.a.div(pt()),_t=g.a.div(ft()),yt=g.a.div(ht()),gt=Object(E.a)(function(e){return h.createElement(bt,null,h.createElement(vt,null,h.createElement(v.a,{className:"bp3-dark"},h.createElement(v.a.Group,{align:_.a.LEFT},h.createElement(v.a.Heading,null,"G-Code viewer for 3D printing"),h.createElement(v.a.Divider,null),h.createElement(Ie,{drawSettings:S.drawSettings,setDrawSetting:S.setDrawSetting}),h.createElement(tt,null),S.activeGCode&&h.createElement(Le,{statistics:S.activeGCode.statistics})))),h.createElement(_t,null,S.activeGCode&&S.activeGCode.live?h.createElement(ie,{UIStore:S}):h.createElement(Oe,{UIStore:S}),h.createElement(dt,null)),S.activeGCode&&!S.activeGCode.live?h.createElement(yt,null,h.createElement(y.a,{label:"Current layer"},h.createElement(O.a,{value:S.activeLayer,min:0,max:0!==S.numberOfLayers?S.numberOfLayers-2:100,disabled:0===S.numberOfLayers,labelStepSize:10*Math.ceil(1+S.numberOfLayers/200),onChange:function(e){return S.setActiveLayer(e)}}))):null)});p.render(h.createElement(gt,null),document.getElementById("main"))}},[[177,1,2]]]);
//# sourceMappingURL=main.aee2526a.chunk.js.map