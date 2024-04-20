let ajaxUrl = '/ajax.php'

let background
let profileContainer
let signInContainer
let username
let createdEvents
let enteredEvents

$(document).ready(function () {
    // Containers
    background = $('#background')
    profileContainer = $('.profileContainer')
    signInContainer = $('.signInContainer')
    createdEvents = $('#createdEvents')
    enteredEvents = $('#enteredEvents')
    // UIElements
    username = $('#username')
    let signInButton = $('#signIn')
    let signUpButton = $('#signUp')
    let navSignIn = $('#navSignIn')
    let navSignUp = $('#navSignUp')
    let login = $('input[name="login"]')
    let password = $('input[name="password"]')
    let secondPassword = $('input[name="password2"]')
    let exitButton = $('#exit')
    let deleteAccountButton = $('#deleteAccount')

    signUpButton.hide()
    navSignIn.hide()
    secondPassword.hide()

    navSignIn.click(function () {
        secondPassword.hide()
        signInButton.show()
        signUpButton.hide()
        navSignUp.show()
        navSignIn.hide()
        clear()
    })

    navSignUp.click(function () {
        secondPassword.show()
        signInButton.hide()
        signUpButton.show()
        navSignIn.show()
        navSignUp.hide()
        clear()
    })

    signInButton.click(function () {
        if (login.val() !== "" && password.val() !== "") {
            signIn(login.val(), password.val())
        } else {
            alert("Fill in all the fields")
        }
        clear()
    })

    signUpButton.click(function () {
        if (login.val() !== "" && password.val() !== "" && secondPassword.val() !== "") {
            if (password.val() === secondPassword.val()) {
                signUp(login.val(), password.val())
            } else {
                alert("Passwords don't match")
            }
        } else {
            alert("Fill in all the fields")
        }
        clear()
    })

    exitButton.click(exit)

    deleteAccountButton.click(deleteUser)

    profileContainer.hide()
    signInContainer.hide()

    isSignedIn()

    function clear() {
        login.val("")
        password.val("")
        secondPassword.val("")
    }
})

function isSignedIn() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {userRequest: 'isSignedIn'},
        success: function (data) {
            switch (data['result']) {
                case 'success':
                    onLoginSuccess()
                    break;
                case 'error':
                    onLoginFailure()
                    break;
            }
        },
    })
}

function onLoginSuccess() {
    background.addClass('profileBackground')
    background.removeClass('background')
    profileContainer.show()
    signInContainer.hide()
    getName()
    getCreatedEvents()
    getEnteredEvents()
}

function onLoginFailure() {
    background.removeClass('profileBackground')
    background.addClass('background')
    profileContainer.hide()
    signInContainer.show()
}

function signIn(login, password) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {login: login, password: password, userRequest: 'GET'},
        success: function (data) {
            if (data['result'] === 'success') {
                isSignedIn()
            }
        }
    })
}

function signUp(login, password) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {login: login, password: password, userRequest: 'POST'},
        success: function (data) {
            if (data['result'] === 'success') {
                isSignedIn()
            }
        }
    })
}

function deleteUser() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {deleteUser: 'true'},
        success: function (data) {
            isSignedIn()
        }
    })
}

function getName() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getName: 'true'},
        success: function (data) {
            if (data['result'] !== 'error') {
                username.html(data['result'])
            }
        }
    })
}

function enterEvent(id, onSuccess) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {eventRequest: 'POST', eventId: id},
        success: function (data) {
            onSuccess()
        }
    })
}

function exitEvent(id, onSuccess) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {eventRequest: 'DELETE', eventId: id},
        success: function (data) {
            onSuccess()
        }
    })
}

function deleteEvent(id) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {deleteEvent: id},
        success: function (data) {
            getCreatedEvents()
            getEnteredEvents()
        }
    })
}

function onEventEnterExit() {
    getCreatedEvents()
    getEnteredEvents()
}

function getCreatedEvents() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getEvents: 'created'},
        success: function (events) {
            createdEvents.html("")
            events.forEach((eventData) => {
                let event = buildEvent(
                    eventData,
                    true,
                    eventData['is_registered'] === '1',
                    true,
                    onEventEnterExit,
                    onEventEnterExit
                )
                createdEvents.append(event)
            })
        }
    })
}

function getEnteredEvents() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getEvents: 'entered'},
        success: function (events) {
            enteredEvents.html("")
            events.forEach((eventData) => {
                let event = buildEvent(
                    eventData,
                    false,
                    eventData['is_registered'] === '1',
                    true,
                    onEventEnterExit,
                    onEventEnterExit
                )
                enteredEvents.append(event)
            })
        }
    })
}

function exit() {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {exit: 'true'},
        success: function (data) {
            if (data['result'] === 'success') {
                isSignedIn()
            }
        }
    })
}

function buildEvent(eventData,
                    isCreated,
                    isEntered,
                    isSignedIn,
                    onEventEnter,
                    onEventExit) {
    let event = $("<div>")
        .addClass('event')
        .append($('<h4>').html(eventData['title']))
        .append(
            $("<table>")
                .append(
                    $('<tr>')
                        .append(
                            $("<td>")
                                .html("Track")
                        )
                        .append(
                            $("<td>")
                                .html("Class")
                        )
                )
                .append(
                    $('<tr>')
                        .append(
                            $("<td>")
                                .html(eventData['track'])
                        )
                        .append(
                            $("<td>")
                                .html(eventData['class'])
                        )
                )
        )
        .append($("<span>").html(`Slots: ${eventData['slots']}`))
        .append($("<span>").html(`Duration: ${eventData['duration']} min`))
        .append($("<span>").html(`Race starts at ${eventData['start']}`))
    if (isSignedIn) {
        event
            .append(
                $('<form>')
                    .append(
                        $('<input>')
                            .attr('type', 'button')
                            .val(isEntered ? 'Exit event' : 'Enter event')
                            .addClass('submit')
                            .addClass(isEntered ? 'exit' : '')
                            .click(function () {
                                if (isEntered) {
                                    exitEvent(eventData['id'], onEventExit)
                                } else {
                                    enterEvent(eventData['id'], onEventEnter)
                                }
                            })
                    )
            )
    }
    if (isCreated) {
        event
            .append(
                $('<input>')
                    .attr('type', 'button')
                    .addClass('deleteEvent')
                    .val('Delete event')
                    .click(function () {
                        deleteEvent(eventData['id'])
                    })
            )
    }
    return event
}

// TODO: Error handling
