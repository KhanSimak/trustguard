const API_URL = "https://trustguard-cl8r.onrender.com/verify";

const query = document.getElementById("query");
const context = document.getElementById("context");
const responseBox = document.getElementById("response");
const latency = document.getElementById("latency");
const verifyBtn = document.getElementById("verifyBtn");

const resultCard = document.getElementById("resultCard");

const label = document.getElementById("label");
const confidence = document.getElementById("confidence");
const probability = document.getElementById("probability");
const threshold = document.getElementById("threshold");

const progressFill = document.getElementById("progressFill");

const examples = {

grounded1:{

query:"What is the capital of France?",

context:"France is a country in Western Europe. Its capital city is Paris.",

response:" Paris."

},

grounded2:{

query:"Who created Python?",

context:"Python is a programming language created by Guido van Rossum and first released in 1991.",

response:" Guido van Rossum."

},

grounded3:{

query:"How many chambers does the human heart have?",

context:"The human heart consists of four chambers: two atria and two ventricles.",

response:"The human heart has four chambers."

},

hallucinated1:{

query:"What is the capital of France?",

context:"France is a country in Western Europe. Its capital city is Paris.",

response:"The capital of France is Lyon."

},

hallucinated2:{

query:"Who created Python?",

context:"Python was created by Guido van Rossum and first released in 1991.",

response:"Python was created by James Gosling."

},

hallucinated3:{

query:"How many chambers does the human heart have?",

context:"The human heart has four chambers.",

response:"The human heart has five chambers."

}

};

function loadExample(example){

query.value = example.query;
context.value = example.context;
responseBox.value = example.response;

resultCard.classList.add("hidden");

}

document.getElementById("grounded1").onclick=()=>loadExample(examples.grounded1);
document.getElementById("grounded2").onclick=()=>loadExample(examples.grounded2);
document.getElementById("grounded3").onclick=()=>loadExample(examples.grounded3);

document.getElementById("hallucinated1").onclick=()=>loadExample(examples.hallucinated1);
document.getElementById("hallucinated2").onclick=()=>loadExample(examples.hallucinated2);
document.getElementById("hallucinated3").onclick=()=>loadExample(examples.hallucinated3);

document.getElementById("clearBtn").onclick=()=>{

query.value="";
context.value="";
responseBox.value="";

resultCard.classList.add("hidden");

};

verifyBtn.addEventListener("click",async()=>{

if(
!query.value.trim()||
!context.value.trim()||
!responseBox.value.trim()
){
alert("Please fill all fields.");
return;
}

verifyBtn.disabled=true;
verifyBtn.textContent="Verifying...";

try{

const res=await fetch(API_URL,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

query:query.value,

context:context.value,

response:responseBox.value

})

});

if(!res.ok){

throw new Error("Backend request failed.");

}

const data=await res.json();

resultCard.classList.remove("hidden");

label.textContent=data.label;

confidence.textContent=(data.confidence*100).toFixed(2)+"%";

probability.textContent=
(data.hallucination_probability*100).toFixed(2)+"%";

threshold.textContent=
(data.threshold*100).toFixed(0)+"%";
latency.textContent =
Number(data.latency_ms).toFixed(1)+" ms";

progressFill.style.width=
(data.confidence*100)+"%";

if(data.label==="grounded"){

label.style.color="#16A34A";

progressFill.style.background="#16A34A";

}
else{

label.style.color="#DC2626";

progressFill.style.background="#DC2626";

}

}
catch(err){

alert("Unable to connect to TrustGuard backend.");

console.error(err);

}
finally{

verifyBtn.disabled=false;

verifyBtn.textContent="Verify Response";

}

});