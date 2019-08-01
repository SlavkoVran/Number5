
const numbersForSelections = document.querySelector('#numbersForSelections')
let pom = 0;
let counter = 0;
let arrayDrawnNumbers = [];
let arrayWinTickets = [];
let allTickets = [];
let arrayTicket = [];
let bet = [];

// objekat numbers
const UI = {
    numbers: [],
    createObj() {
        let obj = { number: '' };
        for (let i = 1; i <= 30; i++) {
            let number = i;
            let obj1 = Object.create(obj, {
                number: { value: number }
            })
            this.numbers.push(obj1)
        }
    },
    // Dinamičko kreiranje elemenata
    createDiv() {
        this.numbers.forEach(num => {
            numbersForSelections.innerHTML += `<div class='number-background'> ${num.number} </div>`
        })
    },
   
}
UI.createObj();
UI.createDiv();

$('.number-background').on('click', selectNumber)
let pom1 = 0;

function selectNumber() {
    $(this).toggleClass('number-background-update');
    if ($(this).is('.number-background-update')) {
        pom1++;
    } else {
        pom1--;
    }
    if (pom1 > 5) {
        $(this).removeClass('number-background-update');
        pom1 = 5;
    }
}

addTicket = () => {
    let numbers = $('.number-background')
    for (let i = 0; i < numbers.length; i++) {
        if ($('.number-background:eq(' + i + ')').is('.number-background-update'))
            arrayTicket.push(i + 1)
    }
    if (arrayTicket.length < 1) {
        Swal.fire({
            position: 'bottom-right',
            title: 'Select at least one number.',
            customClass: 'swal-custom',
            showConfirmButton: false,
            timer: 2000
        })
    }
    if ($('#btnAddTicket').not('btn-play') && arrayTicket.length != 0) {
        let wrapper = $('<div class="wrapper-number"></div>')
        for (let i = 0; i < arrayTicket.length; i++) {
            let div = $('<div class="number-background "></div>').text(arrayTicket[i])
            wrapper.append(div)
            $('#ticketDisplay').append(wrapper);
        }
        allTickets.push(arrayTicket);
        bet.push($('#betValue').text())
        arrayTicket = [];
        pom1 = 0;
        $('.number-background').removeClass('number-background-update');
        counter++;

        if (counter == 5) {
            $('#btnAddTicket').text('PLAY');
            $('#btnAddTicket').addClass('btn-play');
            $('.number-background').off('click', selectNumber);
            $('#btnAddTicket').off('click', addTicket).one('click', drawnOut);
        }
    }
    $("#betValue").text('10')
}

$('#btnAddTicket').on('click', addTicket);

randomNumber = () => {
    while (arrayDrawnNumbers.length < 12) {
        let selectedNumbers = Math.ceil(Math.random() * 30);
        if (arrayDrawnNumbers.indexOf(selectedNumbers) == -1) {
            arrayDrawnNumbers.push(selectedNumbers);  
        }
    }
}

drawnOut = () => {
    randomNumber();
    console.log(arrayDrawnNumbers)
    for(let i=0;i<12;i++){
        $('#drawnNumbers').append($(`<div id="drawnNumber${i}" > </div>`))
        } 
    interval = setInterval(function () {
        $('#drawnNumber' + pom).text(arrayDrawnNumbers[pom]);
        $('#drawnNumber' + pom).addClass('drawn-number');
        $('#btnAddTicket').addClass('btn-disabled')
        
        pom++;
        if (pom == 12) {
            stopInterval()
            setTimeout(winTickets, 2000)
        }
    }, 2000)
}

stopInterval = () => clearInterval(interval);
let gain = 0;
let won = 0;
let betValueText = 0;

winTickets = () => {
    for (let i = 0; i < allTickets.length; i++) {
        let found = allTickets[i].every(r => arrayDrawnNumbers.indexOf(r) >= 0);
        arrayWinTickets.push(found);
        betValueText += +bet[i]
        $("#betValueText").text(betValueText)
    
        if (found === true) {
            $('#ticketDisplay').find(".wrapper-number").eq(`${i}`).addClass('win-ticket')
            $('.wrapper-number').find(".numbre-beckground-update").eq(`${i}`).addClass('win-ticket')
            let sum = allTickets[i].length;
            switch (sum) {
                case 1: gain = bet[i] * 2;
                    break;
                case 2: gain = bet[i] * 4;
                    break;
                case 3: gain = bet[i] * 6;
                    break;
                case 4: gain = bet[i] * 8;
                    break;
                case 5: gain = bet[i] * 10;
                    break;
            }
            won += gain;
            $('#winBet').text(won)
        } else {
            $('#ticketDisplay').find(".wrapper-number").eq(`${i}`).addClass('lose-ticket')
        }
        $("#betValueText").text(betValueText)
    }
    $('.number-background').each(function(){
        if(arrayDrawnNumbers.indexOf(+$(this).text())<0){
        $(this).css('background','red')
        } else {
        $(this).css('background','green')
        }
        })
    
    setTimeout(reset, 5000);
}


$('.set-bet').on('click', setBetValue)

function setBetValue() {
    let betValue = $("#betValue").text()
    const betPlus = $(this).attr('src');

    switch (betPlus) {
        case "./assets/add.svg":
            betValue = +betValue + 10
            break;
        default:
            if (betValue > 10) {
                betValue = +betValue - 10
            } else {
                betValue = 10
            }
            break;
    }
    $("#betValue").text(betValue)
    
}



reset = () => {
    $('#drawnNumbers').empty();
    $('#btnAddTicket').removeClass('btn-play').removeClass('btn-disabled');
    $('#btnAddTicket').text('ADD TICKET');
    $('.number-background').on('click', selectNumber);
    $('#btnAddTicket').off('click', drawnOut).on('click', addTicket);
    $('#ticketDisplay').empty();
    $('#winBet').text('0')
    $("#betValue").text('10')
    $("#betValueText").text('0')
    pom = 0;
    arrayDrawnNumbers = [];
    counter = 0;
    allTickets = [];
    arrayWinTickets = [];
}

$('#rules').on('click', function showRules () {
    Swal.fire({
        position: 'center',
        type: 'question',
        title: 'Rules',
        text: 'Make 5 tickets with a maximum of 5 and a minimum of 1 number. When making a ticket, select the amount you want to bet on. Default value is 10. Then click on the ADD TICKET button to create a ticket. You have to play all five tickets in one round. After selecting 5 tickets, a PLAY button will appear. Clicking the PLAY button will start the draw. GOOD LUCK!!!',
        customClass: 'swal-custom',
    })
})


