// Select element allows choosing a language to translate to
let modelIdElement = document.querySelector('select')
    let modelId = ''
    modelIdElement.addEventListener('change', (event) => {
        modelId = event.target.value
        console.log('modelId:' + modelId)
    })

// function invoked on Click    
const translateIt = () => {
    document.getElementById("waiting").hidden = false;
    let textToTranslate = document.getElementById("textToTranslate").value;
    
    axios.get('../translate?textToTranslate='+textToTranslate + '&modelId='+modelId) //test
    .then(response =>{
        document.getElementById("waiting").hidden = true;
        document.getElementById("translated").innerText = response.data;
    })
    .catch(error => console.log('Error:\n' + error))
   textToTranslate = '' 
}

