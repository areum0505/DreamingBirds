const OTHER = 'otherMonth';
const PREV = 'prev-date';
const NEXT = 'next-date;'
const CHECK_DATE = 'userCheck';
const CURRENT_DATES = 'current_dates';
const userName = '김이름';
const CHECK_FILTER = 'userClickFilter';


function MakeCalendar(year,month,date){

    viewYear = year;
    viewMonth = month;
    viewDate = date;
  
    document.querySelector('.year-month').textContent = `${viewYear}년 ${viewMonth}월`;

    //0을 전달하면, 지난달의 마지막 날의 Date객체가 생성된다.
    const prevLast = new Date(viewYear,viewMonth-1,0);
    const thisLast = new Date(viewYear, viewMonth,0);
    
    const PLDate = prevLast.getDate();
    const PLDay = prevLast.getDay();

    const TLDate = thisLast.getDate();
    const TLDay = thisLast.getDay();

    const prevDates = [];
    //key()메서드는 배열의 각 인덱스를 키 값으로 가지는 새로운 Array Iteraot 객체를 반환
    //
    const thisDates = [...Array(TLDate+1).keys()].slice(1);
    const nextDates = [];

    if(PLDate !== 6){//토요일이 아니라면
        for(let i=0; i<PLDay+1; i++){
            prevDates.unshift(PLDate-i);
        }
    }
    for(let i=1; i<7-TLDay; i++){
        nextDates.push(i);
    }

    const dates = prevDates.concat(thisDates,nextDates);//배열 붙이기
    const firstDateIndex = dates.indexOf(1); //1이 시작 index
    const lastDateIndex = dates.lastIndexOf(TLDate); //마지막날의 index
    //const todayIndex = dates.indexOf(today);

    dates.forEach((date,i)=>{
        const condition = i>=firstDateIndex && i<=lastDateIndex ? 'thisMonth':OTHER;
        let state = CURRENT_DATES;
        if(i<firstDateIndex){
            state = PREV;
        }else if(i>lastDateIndex){
            state = NEXT;
        }
        dates[i] = `<div class = "date  ${state}"><span class=${condition}>${date}</span></div>`;
    })

    document.querySelector('.dates').innerHTML = dates.join('');

    ChangekDate(viewYear,viewMonth,viewDate);
    paintCalendar();
    
}

function ChangekDate(year,month,date){
    if(date<10){
        date = '0'+date;
    }
    let userClickDate = `<span>${year}.${month}.${date} ${userName}님의 학습 통계 입니다.</span>`
    document.querySelector('.write-date').innerHTML = userClickDate;
}

function checkCorrectkDate(){

    viewDate = 1;
    if(viewMonth<1){
        viewYear-=1;
        viewMonth = 12;
        viewDate = 1;
    }else if(viewMonth>12){
        viewYear+=1;
        viewMonth = 1;
        viewDate = 1;
    }

    MakeCalendar(viewYear,viewMonth,viewDate);
     
}


function paintDate(){
    const dates = document.querySelectorAll('.date');

    dates.forEach((date,i)=>{
        if(date == target || date.firstChild == target){
            date.classList.add(CHECK_DATE);
        }
    });
}

function clickDate(event){

    let prev_target = document.querySelector(`.${CHECK_DATE}`);
    let isPrev = !prev_target.classList.contains(CURRENT_DATES);
    prev_target.classList.remove(CHECK_DATE);
    
    
    
    target = event.target;
    viewDate = target.innerText;
    paintDate();



    if(target.classList.contains(CURRENT_DATES) === isPrev){ //이전 선택과 지금 선택의 class가 다른 경우
        if(target.classList.contains(PREV) && prev_target.classList.contains(CURRENT_DATES)){
            viewMonth-=1;
        }else if(target.classList.contains(CURRENT_DATES) && prev_target.classList.contains(NEXT)){
            viewMonth-=1;
        }else if(target.classList.contains(CURRENT_DATES) && prev_target.classList.contains(PREV)){
            viewMonth+=1;
        }else if(target.classList.contains(NEXT) && prev_target.classList.contains(CURRENT_DATES)){
            viewMonth+=1;
        } 
    }else if(target.classList.contains(NEXT) && prev_target.classList.contains(PREV)){
        viewMonth+=2;
    }else if(target.classList.contains(PREV) && prev_target.classList.contains(NEXT)){
        viewMonth-=2;
    }
   
   
    ChangekDate(viewYear,viewMonth,viewDate);

}

function clickLeftBtn(event){
    viewMonth-=1;
    checkCorrectkDate();
    initDate(viewDate);
    paintDate();
}

function clickRightBtn(event){
    viewMonth+=1;
    checkCorrectkDate();
    initDate(viewDate);
    paintDate();
}


function paintCalendar(){
    const SUNDAY = 'sunday';
    const SATURDAY = 'saturday';
    const dates = document.querySelectorAll('.date');

    dates.forEach((date,i)=>{
        dates[i].addEventListener('click',clickDate);
        
        if(i%7===0){
            dates[i].classList.add(SUNDAY);
        }else if(i%7===6){
            dates[i].classList.add(SATURDAY);
        }
    });
}

function initDate(number){
    let initdates = document.querySelectorAll(`.${CURRENT_DATES}`);
    initdates.forEach((d,i)=>{
        if(i+1 == number){
            d.classList.add(CHECK_DATE);
        }
    });
}

function clickToday(event){
     
    MakeCalendar(currentYear,currentMonth,currentDate);
    initDate(currentDate);
}
function clickFilter(event){
    document.querySelector(`.${CHECK_FILTER}`).classList.remove(CHECK_FILTER);
    event.target.classList.add(CHECK_FILTER);
}

function home_init(){
    const date = new Date();   
    currentYear = date.getFullYear();
    currentMonth = date.getMonth()+1;
    currentDate = date.getDate();
    MakeCalendar(currentYear,currentMonth,currentDate);
    initDate(currentDate);

    document.querySelector('.left-btn').addEventListener('click',clickLeftBtn);
    document.querySelector('.right-btn').addEventListener('click',clickRightBtn);
    document.querySelector('.today-btn').addEventListener('click',clickToday);

    document.querySelectorAll('.filter-btn').forEach((d,i)=>{
        d.addEventListener('click',clickFilter);
    })
}

window.addEventListener('load',home_init);