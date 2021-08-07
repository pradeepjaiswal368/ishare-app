const dropZone = document.querySelector('.drop-zone');
const input = document.querySelector('#file-input');
const browseBtn = document.querySelector('.browseBtn');
const bgProgress = document.querySelector('.bg-progress');
const percentDiv = document.querySelector('#percent');
const progress = document.querySelector('.progress-bar');
// const progressBar = 
const host = "https://innshare.herokuapp.com/"
const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover" , (e)=> {
    e.preventDefault();
    if(!dropZone.classList.contains("dragged")){
        dropZone.classList.add("dragged");
    }

});

dropZone.addEventListener("dragleave" , ()=> {
        dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop" , (e)=> {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    console.log(files);
    if(File.length){
        input.files = files;
        uploadFile();
    }
});

browseBtn.addEventListener('click', ()=> {
    input.click();
})

input.addEventListener('change', () => {
   uploadFile();
})

const uploadFile = ()=> {
    const file = input.files[0];

    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE){
            console.log(xhr.response);
        }
    }

     xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);

}
const updateProgress = (e) => {
   const percent = Math.round((e.loaded/ e.total ) * 100);
   console.log(percent);
 
   percentDiv.innerText = percent;
   const scaleX = `scaleX(${percent / 100})`;
   progress.style.transform =  scaleX;
   bgProgress.style.transform = scaleX;
}