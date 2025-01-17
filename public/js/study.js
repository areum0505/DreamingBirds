// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const pose_URL = "https://teachablemachine.withgoogle.com/models/g1PdVKZIH/";
const sleep_URL = "https://teachablemachine.withgoogle.com/models/7GiCXf879/";
const subject_id = '';

let pose_model, webcam, labelContainer, pose_maxPredictions;
let sleep_model, sleep_maxPredictions;

let second = 0;

let pose_status = "basic";
let sleep_status = "open";
let basic = false, focus_out = false, phone = false, leave = false;
let current_status = "";

let warning_number = 0;

const toDoList = document.querySelector('.js-toDoList');


// Load the image model and setup the webcam
async function init() {
    const pose_modelURL = pose_URL + "model.json";
    const pose_metadataURL = pose_URL + "metadata.json";
    const sleep_modelURL = sleep_URL + "model.json";
    const sleep_metadataURL = sleep_URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    pose_model = await tmImage.load(pose_modelURL, pose_metadataURL);
    sleep_model = await tmImage.load(sleep_modelURL, sleep_metadataURL);
    pose_maxPredictions = pose_model.getTotalClasses();
    sleep_maxPredictions = sleep_model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    clearInterval(view_saying);
    document.getElementById("loader-wrapper").style.display = "none";
    window.requestAnimationFrame(loop);


    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < sleep_maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    loadToDos();
    timer();
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const pose_prediction = await pose_model.predict(webcam.canvas);
    const sleep_prediction = await sleep_model.predict(webcam.canvas);

    if (pose_prediction[0].probability >= 0.85) {
        pose_status = pose_prediction[0].className;
    } else if (pose_prediction[1].probability >= 0.85) {
        pose_status = pose_prediction[1].className;
    } else if (pose_prediction[2].probability >= 0.85) {
        pose_status = pose_prediction[2].className;
    } else if (pose_prediction[3].probability >= 0.85) {
        pose_status = pose_prediction[3].className;
    }

    if (sleep_prediction[0].probability >= 0.85) {
        sleep_status = sleep_prediction[0].className;
    } else if (sleep_prediction[1].probability >= 0.85) {
        sleep_status = sleep_prediction[1].className;
    } else if (sleep_prediction[2].probability >= 0.85) {
        sleep_status = sleep_prediction[2].className;
    } else if (sleep_prediction[3].probability >= 0.85) {
        sleep_status = sleep_prediction[3].className;
    }

    // console.log(pose_status + " - " + sleep_status);
    current_status = pose_status;
    if(current_status == "basic" && sleep_status != "open" && sleep_status != "close") {
        current_status = "sleep";
    }
}

function timer() {
    let time;
    let status;

    time = setInterval(function () {
        if(!isStudy) {
            return;
        }

        if ((pose_status == "focus_out" || pose_status == "phone" || pose_status == "leave") ||
            (sleep_status == "close" || sleep_status == "neck" || sleep_status == "top")) {
            second++;
        } else {
            second = 0;
        }

        // document.getElementById("stopwatch").innerHTML = "딴 짓을 한 시간 : " + (second % 5) + "초";
        // console.log(second);

        if ((second % 5) + 1 >= 5) {
            if (pose_status == "focus_out") {
                document.getElementsByClassName("group-name")[0].innerHTML = "한 눈 팔다 먹이가 도망가도 전 몰라요!";
                status = "focus_out";
            } else if (pose_status == "phone") {
                document.getElementsByClassName("group-name")[0].innerHTML = "짹짹!! 네? 못알아듣겠다고요? 지금 놀고있냐 물었어요!!";
                status = "phone";
            } else if (pose_status == "leave") {
                document.getElementsByClassName("group-name")[0].innerHTML = "제 눈에는 의자밖에 안보이는거같은데 기분탓인가요?";
                status = "leave";
            } else if (sleep_status == "close" || sleep_status == "neck" || sleep_status == "top") {
                document.getElementsByClassName("group-name")[0].innerHTML = "지금 자면 꿈을 꿀수있지만 꿈처럼 환상적인 먹이는 못먹어요!";
                status = "sleep";
            }

            warning_number++;
            //document.getElementById("warning").innerHTML = "경고 횟수 : " + warning_number;
            document.getElementsByClassName("group-now")[0].innerHTML = "누적 " + warning_number + "회";
            // console.log("경고 횟수 : " + warning_number + " - " + status);

            fetch('/study/warning?warning=' + status + '&sid=' + $("#subject-id").data("subject_id"), { method: 'POST' })
            .then(function (response) {
              if (response.ok) {
                return;
              }
              throw new Error('Request failed.');
            })
            .catch(function (error) {
              console.log(error);
            });


            beep();
        } else {
            //document.getElementById("time").innerHTML = "";
        }
    }, 1000);
}

function beep() {
    var audio = new Audio('../mp3/bird.mp3');
    audio.play();
}

function getDdata(){
    let subId = $("#subject-id").data("subject_id");
}

function checkToDo(event){
    const btn = event.target;
    const text = event.target.value;
    var todoIdx = 0;

    console.log(event);

    for(let i = 0; i<user.todos.length; i++){
        if(user.todos[i].content === text){
            todoIdx = i;
            break;
        }
    }
    console.log(`idx는 ${todoIdx}`);
    if(btn.style.background === "white"){
        btn.style.background = "#87A5BA";
        user.todos[todoIdx].checked = true;        
        console.log(`흰색 클릭`);

    }else{
        btn.style.background = "white";
        user.todos[todoIdx].checked = false;
    }

  
    fetch('/checked?idx=' + todoIdx + "&ischeck=" + user.todos[todoIdx].checked, { method: 'POST' })
        .then(function (response) {
            if (response.ok) {
                console.log('click was recorded');
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function (error) {
            console.log(error);
    });
}


function loadToDos() {
    if (user.todos != null) {
        $(".js-toDoList").children().remove();
        for (let i = 0; i < user.todos.length; i++) {
            if (user.todos[i].date === `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`) {
                const li = document.createElement("li");
                const statusBtn = document.createElement("button");
                const span = document.createElement("span");
                
                statusBtn.style.background = user.todos[i].checked === true ? "#87A5BA" : "white";
                statusBtn.value = user.todos[i].content.replace("&nbsp;", " ");
                span.innerText = user.todos[i].content.replace("&nbsp;", " ");
                statusBtn.addEventListener("click", checkToDo);
                
                li.appendChild(statusBtn);
                li.appendChild(span);
                toDoList.appendChild(li);
            }
        }
    }
}

init();

var cam = document.getElementById('webcam-container');
