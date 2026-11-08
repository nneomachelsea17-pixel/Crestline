const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* Animations: fade in on scroll + count-up numbers */
function count(el){const t=+el.dataset.n,d=+el.dataset.d,p=el.dataset.p||"",s=el.dataset.s||"";let a=null;const f=ts=>{a=a||ts;const k=Math.min((ts-a)/1400,1);el.textContent=p+(t*(1-Math.pow(1-k,3))).toFixed(d)+s;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");e.target.querySelectorAll("[data-n]").forEach(count);io.unobserve(e.target)}}),{threshold:.15});
const watch=()=>$$(".up:not(.in)").forEach(e=>io.observe(e));watch();

/* DEMO ONLY: accounts are saved in this browser. On a real site, replace the
   code that uses users()/save() with fetch("/api/signup") and fetch("/api/login")
   calls to your own server. */
const ok=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const users=()=>{try{return JSON.parse(localStorage.getItem("crest_users")||"{}")}catch(e){return{}}};
const save=u=>{try{localStorage.setItem("crest_users",JSON.stringify(u))}catch(e){}};
async function hash(s){try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){return btoa(s)}}

let me=null;try{me=sessionStorage.getItem("crest_s")}catch(e){}
function toast(m){const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3200)}
function go(name,msg){try{sessionStorage.setItem("crest_s",name);sessionStorage.setItem("crest_m",msg)}catch(e){}location.href="index.html"}

/* Show or hide password */
$$(".eye").forEach(b=>b.onclick=()=>{const i=b.previousElementSibling,h=i.type==="password";i.type=h?"text":"password";b.textContent=h?"Hide":"Show"});

/* Log in and Create account pages: already logged in goes straight to the landing page */
if(($("#fl")||$("#fs"))&&me)location.replace("index.html");

/* Create account */
if($("#fs")){
 $("#sp").oninput=e=>{const p=e.target.value,s=(p.length>=8)+/[A-Z]/.test(p)+/\d/.test(p)+/[^A-Za-z0-9]/.test(p),m=$("#mi");m.style.width=(p?Math.max(s,1)*25:0)+"%";m.style.background=["#e5484d","#e5484d","#f5a524","#2fd4a1","#0a8f6a"][s];$("#ml").textContent=p?["Too weak","Weak","Okay","Good","Strong"][s]:"Use 8+ characters with numbers and symbols"};
 $("#fs").onsubmit=async e=>{e.preventDefault();
  const n=$("#sn").value.trim(),m=$("#se").value.trim().toLowerCase(),p=$("#sp").value;let er="";
  if(n.length<2)er="Enter your full name.";
  else if(!ok.test(m))er="Enter a valid email address.";
  else if(p.length<8)er="Password must be at least 8 characters.";
  else if(p!==$("#sc").value)er="Passwords do not match.";
  else if(!$("#st").checked)er="Accept the terms to continue.";
  else if(users()[m])er="This email already has an account. Log in instead.";
  $("#fse").textContent=er;if(er)return;
  const u=users();u[m]={n,h:await hash(m+":"+p)};save(u);
  go(n,"Account created. Welcome to Crestline!")};
}

/* Log in */
if($("#fl")){
 $("#fl").onsubmit=async e=>{e.preventDefault();
  const m=$("#le").value.trim().toLowerCase(),p=$("#lp").value,u=users()[m];let er="";
  if(!ok.test(m)||!p)er="Enter your email and password.";
  else if(!u||u.h!==await hash(m+":"+p))er="Incorrect email or password.";
  $("#fle").textContent=er;if(er)return;
  go(u.n,"Logged in. Welcome back!")};
}

/* Landing page: logged-in and logged-out views */
if($("#dash")){
 const first=me?me.split(" ")[0]:"";
 $("#hello").hidden=$("#out").hidden=!me;
 $("#in").hidden=$("#up").hidden=!!me;
 $("#dash").hidden=!me;
 if(me){$("#hello").textContent="Hi, "+first;$("#hi").textContent="Welcome back, "+first;watch()}
 $("#out").onclick=()=>{try{sessionStorage.removeItem("crest_s");sessionStorage.setItem("crest_m","You have been logged out.")}catch(e){}location.reload()};
 try{const m=sessionStorage.getItem("crest_m");if(m){sessionStorage.removeItem("crest_m");toast(m)}}catch(e){}
}