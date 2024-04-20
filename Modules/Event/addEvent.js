let ajaxUrl = '/ajax.php'
let trackSelect
let classSelect
let responseSpan

$(document).ready(function () {
    trackSelect = $('select[name="track"]')
    classSelect = $('select[name="class"]')
    responseSpan = $('#response')

    let title = $('input[name="title"]')
    let slots = $('input[name="slots"]')
    let duration = $('input[name="duration"]')
    let start = $('input[name="start"]')
    let button = $('.submit')

    getTracks()
    getClasses()

    button.click(function () {
        let titleText = title.val()
        let slotsText = slots.val()
        let durationText = duration.val()
        let startText = start.val()
        let trackId = trackSelect.val()
        let classId = classSelect.val()

        if (titleText && slotsText && durationText && startText) {
            createEvent(titleText, trackId, classId, slotsText, durationText, startText)
        } else {
            alert("Fill in all the fields")
        }
    })
})

function getTracks() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getTracks: true},
        success: function (tracks) {
            trackSelect.html("")
            tracks.forEach((track) => {
                trackSelect.append(
                    $('<option>')
                        .val(track['id'])
                        .html(track['track'])
                )
            })
        }
    })
}

function getClasses() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getClass: true},
        success: function (classes) {
            classes.forEach((classObject) => {
                classSelect.append(
                    $('<option>')
                        .val(classObject['id'])
                        .html(classObject['class'])
                )
            })
        }
    })
}

function handleResult(result) {
    switch (result) {
        case 'success':
            responseSpan.html('Event Created');
            break;
        case 'error':
            responseSpan.html('Error');
            break;
        case 'wrong_data':
            responseSpan.html('Incorrect data')
            break;
    }
}

function createEvent(title, trackId, classId, slots, duration, start) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            title: title,
            trackId: trackId,
            classId: classId,
            slots: slots,
            duration: duration,
            start: start
        },
        success: function (response) {
            console.log(response)
            handleResult(response['result'])
        },
        error: function (error) {
            console.log(error)
        }
    })
}
