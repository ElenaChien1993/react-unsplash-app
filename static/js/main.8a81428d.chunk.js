(this["webpackJsonpreact-unsplash-app"]=this["webpackJsonpreact-unsplash-app"]||[]).push([[0],{46:function(e,t,a){},47:function(e,t,a){"use strict";a.r(t);var n=a(2),r=a.n(n),s=a(18),c=a.n(s),i=a(9),u=a.n(i),o=a(19),l=a(3),h=a(4),p=a(6),m=a(5),j=a(20),b=a.n(j).a.create({baseURL:"https://api.unsplash.com",headers:{Authorization:"Client-ID fv2cTWNJs5qN8K0HG6cuT7nn9M4rTLi4XlehR3noS70"}}),f=a(0),d=function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(){var e;Object(l.a)(this,a);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(e=t.call.apply(t,[this].concat(r))).state={value:""},e.onFormSubmit=function(t){t.preventDefault(),e.props.searchSubmit(e.state.value)},e.onInputChange=function(t){e.setState({value:t.target.value})},e}return Object(h.a)(a,[{key:"render",value:function(){return Object(f.jsx)("div",{className:"ui segment",children:Object(f.jsx)("form",{onSubmit:this.onFormSubmit,className:"ui form",children:Object(f.jsxs)("div",{className:"field",children:[Object(f.jsx)("label",{children:"Image Search"}),Object(f.jsx)("input",{type:"search",placeholder:"type to search",value:this.state.value,onChange:this.onInputChange})]})})})}}]),a}(r.a.Component),v=(a(46),function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).setSpans=function(){var e=n.imageRef.current.clientHeight,t=Math.ceil(e/10);n.setState({spans:t})},n.state={spans:0},n.imageRef=r.a.createRef(),n}return Object(h.a)(a,[{key:"componentDidMount",value:function(){this.imageRef.current.addEventListener("load",this.setSpans)}},{key:"render",value:function(){var e=this.props.image,t=e.alt_description,a=e.urls;return Object(f.jsx)("div",{style:{gridRowEnd:"span ".concat(this.state.spans)},children:Object(f.jsx)("img",{ref:this.imageRef,alt:t,src:a.regular})})}}]),a}(r.a.Component)),g=function(e){var t=e.images.map((function(e){return Object(f.jsx)(v,{image:e},e.id)}));return Object(f.jsx)("div",{className:"image-list",children:t})},O=function(e){Object(p.a)(a,e);var t=Object(m.a)(a);function a(){var e;Object(l.a)(this,a);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(e=t.call.apply(t,[this].concat(r))).state={images:[]},e.onSearchSubmit=function(){var t=Object(o.a)(u.a.mark((function t(a){var n;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,b.get("/search/photos?per_page=30",{params:{query:a}});case 2:n=t.sent,e.setState({images:n.data.results});case 4:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),e}return Object(h.a)(a,[{key:"render",value:function(){return Object(f.jsxs)("div",{className:"ui container",style:{marginTop:"10px"},children:[Object(f.jsx)(d,{searchSubmit:this.onSearchSubmit}),Object(f.jsx)(g,{images:this.state.images})]})}}]),a}(r.a.Component);c.a.render(Object(f.jsx)(r.a.StrictMode,{children:Object(f.jsx)(O,{})}),document.getElementById("root"))}},[[47,1,2]]]);
//# sourceMappingURL=main.8a81428d.chunk.js.map