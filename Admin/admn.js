let ajaxUrl = '/ajax.php'

let adminPanel
let loginPanel
let classesBody
let tracksBody
let pressureBody
let pressurePicker
let admins
let deletedBody

$(document).ready(function () {
    adminPanel = $('.adminPanel')
    loginPanel = $('#login')
    classesBody = $('#classesBody')
    tracksBody = $('#tracksBody')
    pressureBody = $('#pressureBody')
    pressurePicker = $('#pressurePicker')
    admins = $('#admins')
    deletedBody = $('#deletedBody')

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

    let deleteClassesButton = $('#deleteClassesButton')
    let deleteTracksButton = $('#deleteTracksButton')
    let deletePressureButton = $('#deletePressureButton')
    let deleteAdminButton = $('#deleteAdminButton')

    let updatePressureButton = $('#updatePressureButton')
    let updatePressureForm = $('#updatePressureForm')

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

    deleteClassesButton.click(function () {
        let deleteClassesRows = $('input[name=classToDelete]:checked')
        let classesToDelete = []
        deleteClassesRows.each(function (index, row) {
            classesToDelete.push($(row).val())
        })
        deleteClasses(classesToDelete)
    })

    deleteTracksButton.click(function () {
        let deleteTracksRows = $('input[name=trackToDelete]:checked')
        let tracksToDelete = []
        deleteTracksRows.each(function (index, row) {
            tracksToDelete.push($(row).val())
        })
        deleteTracks(tracksToDelete)
    })

    deletePressureButton.click(function () {
        let deletePressureRows = $('input[name=tireToDelete]:checked')
        let pressureToDelete = []
        deletePressureRows.each(function (index, row) {
            pressureToDelete.push($(row).val())
        })
        deletePressure(pressureToDelete)
    })

    deleteAdminButton.click(function () {
        deleteAdmin(admins.val())
    })

    updatePressureButton.click(function () {
        let data = updatePressureForm.serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value
            return obj
        }, {})
        updatePressure(data)
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

function getPressureData(update) {
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
                if (update) {
                    update()
                }
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
                alert(`New class has added (${response['class']})`)
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
                alert(`New track has added (${response['track']})`)
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
                alert(`New pressure has added (${response['class']}, ${response['fmi']}, ${response['fma']}, ${response['rmi']}, ${response['rma']})`)
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

function deleteClasses(classesToDelete) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            classesToDelete: classesToDelete
        },
        success: function (response) {
            if (response['success']) {
                getClassData()
                response['titles'].forEach((title) => {
                    deletedBody.append(
                        $('<tr>')
                            .append(
                                $('<td>')
                                    .html('Class')
                            )
                            .append(
                                $('<td>')
                                    .html(title)
                            )
                    )
                })
            }
        }
    })
}

function deleteTracks(tracksToDelete) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            tracksToDelete: tracksToDelete
        },
        success: function (response) {
            if (response['success']) {
                getTrackData()
                response['titles'].forEach((title) => {
                    deletedBody.append(
                        $('<tr>')
                            .append(
                                $('<td>')
                                    .html('Track')
                            )
                            .append(
                                $('<td>')
                                    .html(title)
                            )
                    )
                })
            }
        }
    })
}

function deletePressure(pressureToDelete) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            tireToDelete: pressureToDelete
        },
        success: function (response) {
            if (response['success']) {
                getPressureData()
                response['titles'].forEach((title) => {
                    deletedBody.append(
                        $('<tr>')
                            .append(
                                $('<td>')
                                    .html('Pressure')
                            )
                            .append(
                                $('<td>')
                                    .html(title)
                            )
                    )
                })
            }
        }
    })
}

function deleteAdmin(adminId) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: {
            admin: adminId
        },
        success: function (response) {
            if (response['success']) {
                getAdminData()
            }
        }
    })
}

function updatePressure(data) {
    $.ajax({
        url: ajaxUrl,
        method: 'POST',
        dataType: 'json',
        data: data,
        success: function (response) {
            if (response['success']) {
                getPressureData(() => {
                    let newTire = response['newTire']
                    let previousTire = response['previousTire']

                    let data = {
                        id: newTire['id'],
                        class: `${newTire['class']} (${previousTire['class']})`,
                        frontMin: `${newTire['frontMin']} (${previousTire['frontMin']})`,
                        frontMax: `${newTire['frontMax']} (${previousTire['frontMax']})`,
                        rearMin: `${newTire['rearMin']} (${previousTire['rearMin']})`,
                        rearMax: `${newTire['rearMax']} (${previousTire['rearMax']})`
                    }

                    $(`.tire_${newTire['id']}`)
                        .html(buildPressureRow(data).html())
                })
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
                                .attr('name', `${type}ToDelete`)
                                .val(data['id'])
                        )
                )
        )
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem tableItemId')
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
        .addClass(`tire_${pressureData['id']}`)
        .append(
            $('<td>')
                .append(
                    $('<div>')
                        .addClass('tableItem')
                        .append(
                            $('<input>')
                                .attr('type', 'checkbox')
                                .attr('name', `tireToDelete`)
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
