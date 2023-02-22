const action = document.getElementById("act").action;
console.log(action);

validate

document.getElementById("sendForm").addEventListener("submit", (e) => {
    console.log('there');
    const name = document.getElementById("name");
    const bpm = document.getElementById("bpm");
    const complexity = document.getElementById("complexity");
    const duration = document.getElementById("duration");
    const instrument = document.getElementById("instrument");
    const description = document.getElementById("description");
    
    const formData = new FormData();
    const file = document.getElementById("file").files[0];
    formData.append("file", file, 'qwe');
    formData.append("name", name);
    formData.append("bpm", bpm);
    formData.append("complexity", complexity);
    formData.append("duration", duration);
    formData.append("instrument", instrument);
    formData.append("description", description);
    
    fetch(action, {method: "POST", body: formData, headers: {'Content-Type': 'multipart/form-data'}});
    console.log("h");
});