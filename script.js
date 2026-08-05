const query = document.getElementById("query");
const context = document.getElementById("context");
const responseBox = document.getElementById("response");

const verifyBtn = document.getElementById("verifyBtn");

const loader = document.getElementById("loader");

const resultCard = document.getElementById("resultCard");

const statusBadge = document.getElementById("statusBadge");

const confidence = document.getElementById("confidence");

const probability = document.getElementById("probability");

const threshold = document.getElementById("threshold");

const progressBar = document.getElementById("progressBar");

const groundedBtn = document.getElementById("groundedBtn");

const hallucinatedBtn = document.getElementById("hallucinatedBtn");



groundedBtn.onclick = () => {

query.value =
"What is the capital of India?";

context.value =
"India's capital city is New Delhi.";

responseBox.value =
"New Delhi ";

};



hallucinatedBtn.onclick = () => {

query.value =
"What is the nationality of the filmmaker that wrote and directed The Sinister Urge?";

context.value =
"The Sinister Urge is a 1960 crime drama film that was written and directed by Ed Wood. Edward Davis Wood Jr. was an American filmmaker.";

responseBox.value =
"The filmmaker of The Sinister Urge was Asian.";

};



verifyBtn.onclick = async () => {

loader.classList.remove("hidden");

resultCard.classList.add("hidden");

try{

const res = await fetch(
"http://127.0.0.1:8000/verify",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

query:query.value,

context:context.value,

response:responseBox.value

})

}
);

const data = await res.json();

loader.classList.add("hidden");

resultCard.classList.remove("hidden");

statusBadge.innerText=data.label;

confidence.innerText=
(data.confidence*100).toFixed(2)+"%";

probability.innerText=
(data.hallucination_probability*100).toFixed(2)+"%";

threshold.innerText=data.threshold;

progressBar.style.width=
(data.hallucination_probability*100)+"%";



if(data.label==="grounded"){

statusBadge.style.background="#dcfce7";
statusBadge.style.color="#166534";

progressBar.style.background="#22c55e";

}
else{

statusBadge.style.background="#fee2e2";
statusBadge.style.color="#991b1b";

progressBar.style.background="#ef4444";

}

}catch(error){

loader.classList.add("hidden");

alert("Unable to connect to FastAPI backend.");

console.error(error);

}

};