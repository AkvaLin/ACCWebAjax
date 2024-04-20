let ajaxUrl = '/ajax.php'

let adminPanel
let loginPanel
let classesBody
let tracksBody
let pressureBody
let pressurePicker
let admins

$(document).ready(function () {
    adminPanel = $('.adminPanel')
    loginPanel = $('#login')
    classesBody = $('#classesBody')
    tracksBody = $('#tracksBody')
    pressureBody = $('#pressureBody')
    pressurePicker = $('#pressurePicker')
    admins = $('#admins')

    let signInButton = $('#signIn')
    let loginTextField = $('input[name="lgn"]')
    let passwordTextField = $('input[name="pswd"]')
    let exitButton = $('#exit')

    let addClassTextField = $('#addClassTextField')
    let addClassButton = $('#addClassButton')

    let addTrackTextField = $('#addTrackTextField')
    let addTrackButton = $('#addTrackButton')

    let addPressureClassTextField = $('#addPressureClassTextField')
    let addPressureFmiTextField = $('#addPressureFmiTextField')
    let addPressureFmaTextField = $('#addPressureFmaTextField')
    let addPressureRmiTextField = $('#addPressureRmiTextField')
    let addPressureRmaTextField = $('#addPressureRmaTextField')
    let addPressureButton = $('#addPressureButton')

    let addAdminLoginTextField = $('#addAdminLoginTextField')
    let addAdminPasswordTextField = $('#addAdminPasswordTextField')
    let addAdminButton  = $('#addAdminButton')

    signInButton.click(function () {
        let login = loginTextField.val()
        let password = passwordTextField.val()

        signIn(login, password)

        loginTextField.val("")
        passwordTextField.val("")
    })

    exitButton.click(exit)

    addClassButton.click(function () {
        let text = addClassTextField.val()
        if (text) {
            addClass(text)
        } else {
            alert('Enter new class name')
        }
    })

    addTrackButton.click(function () {
        let text = addTrackTextField.val()
        if (text) {
            addTrack(text)
        } else {
            alert('Enter new track name')
        }
    })

    addPressureButton.click(function () {
        let pressureClass = addPressureClassTextField.val()
        let fmi = addPressureFmiTextField.val().replace(',', '.')
        let fma = addPressureFmaTextField.val().replace(',', '.')
        let rmi = addPressureRmiTextField.val().replace(',', '.')
        let rma = addPressureRmaTextField.val().replace(',', '.')
        if (
            pressureClass &&
            $.isNumeric(fmi) &&
            $.isNumeric(fma) &&
            $.isNumeric(rmi) &&
            $.isNumeric(rma)) {
            addPressure(pressureClass, fmi, fma, rmi, rma)
        } else {
            alert('Fill in all fields with correct data')
        }
    })

    addAdminButton.click(function () {
        let login = addAdminLoginTextField.val()
        let password = addAdminPasswordTextField.val()

        if (login && password) {
            addAdmins(login, password)
        } else {
            alert('Fill in all fields')
        }
    })

    adminPanel.hide()
    loginPanel.hide()

    isSignedIn()
})

// USER

function isSignedIn() {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {isAdminSignedIn: true},
        success: function (response) {
            if (response['success']) {
                onSignIn()
            } else {
                onSignOut()
            }
        }
    })
}

function signIn(login, password) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {lgn: login, pswd: password},
        success: function (response) {
            if (response['success']) {
                onSignIn()
            }
        }
    })
}

function onSignIn() {
    loginPanel.hide()
    adminPanel.show()
    getData()
}

function onSignOut() {
    loginPanel.show()
    adminPanel.hide()
}

function exit() {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {exit: true},
        success: function (response) {
            if (response['result'] === 'success') {
                onSignOut()
            }
        }
    })
}

// DATA

function getData() {
    getClassData()
    getTrackData()
    getPressureData()
    getAdminData()
}

function getClassData() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getClass: true},
        success: function (classes) {
            classesBody.html("")
            classes.forEach((classObject) => {
                classesBody.append(buildRow(classObject, 'class'))
            })
        }
    })
}

function getTrackData() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getTracks: true},
        success: function (tracks) {
            tracksBody.html("")
            tracks.forEach((track) => {
                tracksBody.append(buildRow(track, 'track'))
            })
        }
    })
}

function getPressureData() {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {getPressure: true},
        success: function (response) {
            pressureBody.html("")
            pressurePicker.html("")
            if (response['success']) {
                let pressures = response['data']
                pressures.forEach((pressure) => {
                    pressureBody.append(buildPressureRow(pressure))
                    pressurePicker.append(
                        $('<option>')
                            .val(pressure['id'])
                            .html(pressure['class'])
                    )
                })
            } else {
                alert('Cannot fetch pressure data')
            }
        }
    })
}

function getAdminData() {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {getAdmins: true},
        success: function (response) {
            admins.html("")
            if (response['success']) {
                response['data'].forEach((admin) => {
                    admins.append(
                        $('<option>')
                            .val(admin['id'])
                            .html(admin['login'])
                    )
                })
            } else {
                alert('Cannot fetch admin data')
            }
        }
    })
}

function addClass(name) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {newClass: name},
        success: function (response) {
            if (response['success']) {
                alert('New class has added')
                getClassData()
            } else {
                alert('Failed to add new class')
            }
        }
    })
}

function addTrack(name) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {newTrack: name},
        success: function (response) {
            if (response['success']) {
                alert('New track has added')
                getTrackData()
            } else {
                alert('Failed to add new track')
            }
        }
    })
}

function addPressure(pressureClass, fmi, fma, rmi, rma) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            pressureClass: pressureClass,
            fmi: fmi,
            fma: fma,
            rmi: rmi,
            rma: rma
        },
        success: function (response) {
            if (response['success']) {
                alert('New pressure has added')
                getPressureData()
            } else {
                alert('Failed to add new pressure')
            }
        }
    })
}

function addAdmins(login, password) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            adminLogin: login,
            adminPassword: password
        },
        success: function (response) {
            if (response['success']) {
                alert('New admin has added')
                getAdminData()
            } else {
                alert('Failed to add new admin')
            }
        }
    })
}

function buildRow(data, type) {
    return $('<tr>')
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .append(
                            $('<input>')
                                .attr('type', 'checkbox')
                                .attr('name', `${type}ToDelete[]`)
                                .val(data['id'])
                        )
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(data['id'])
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(data[type])
                )
        )
}

function buildPressureRow(pressureData) {
    return $('<tr>')
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .append(
                            $('<input>')
                                .attr('type', 'checkbox')
                                .attr('name', `$tireToDelete[]`)
                                .val(pressureData['id'])
                        )
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(pressureData['id'])
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(pressureData['class'])
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(pressureData['frontMin'])
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(pressureData['frontMax'])
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(pressureData['rearMin'])
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .html(pressureData['rearMax'])
                )
        )
}
