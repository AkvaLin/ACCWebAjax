let resultContainer

$(document).ready(function () {
    let raceLength = $('input[name="RaceLength"]')
    let minutes = $('input[name="Minutes"]')
    let seconds = $('input[name="Seconds"]')
    let consumption = $('input[name="Consumption"]')
    let submitButton = $('#submit')
    resultContainer = $('.results')

    resultContainer.hide()

    submitButton.click(function () {
        getCalculatedResult(raceLength.val(), minutes.val(), seconds.val(), consumption.val())
    })
})

function getCalculatedResult(raceLength, minutes, seconds, consumption) {
    $.ajax({
        url: '/ajax.php',
        method: 'GET',
        dataType: 'json',
        data: {RaceLength: raceLength, Minutes: minutes, Seconds: seconds, Consumption: consumption},
        success: function (data) {
            if (data['success']) {
                handleSuccess(data)
            } else {
                handleError()
            }
        }
    })
}

function handleSuccess(data) {
    resultContainer.show()
    resultContainer.html("")

    let totalLaps = data['totalLaps']
    let minimumFuel = data['minimumFuel']
    let safe = data['safe']
    let recommendedFuel = data['recommendedFuel']

    resultContainer
        .append(
        $('<label>')
            .html(`Total Laps: ${totalLaps}`)
        )
        .append(
            $('<label>')
                .html(`Minimum Fuel: ${minimumFuel}`)
        )
        .append(
            $('<label>')
                .html(`Safe (Full formation lap): ${safe}`)
        )
        .append(
            $('<label>')
                .html(`Recommended Fuel: ${recommendedFuel}`)
        )
}

function handleError() {
    resultContainer.hide()
    alert("Incorrect data")
}
