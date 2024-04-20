let eventsContainer

$(document).ready(function () {
    eventsContainer = $('.eventsInfoContainer')

    getEvents()
})

function getEvents() {
    $.ajax({
        url: ajaxUrl,
        method: 'GET',
        dataType: 'json',
        data: {getEvents: 'all'},
        success: function (events) {
            eventsContainer.html("")
            $.ajax({
                url: ajaxUrl,
                method: 'GET',
                dataType: 'json',
                data: {userRequest: 'isSignedIn'},
                success: function (data) {
                    let isSignedIn = false
                    switch (data['result']) {
                        case 'success':
                            isSignedIn = true
                            break;
                        case 'error':
                            break;
                    }
                    events.forEach((eventData) => {
                        let event = buildEvent(
                            eventData,
                            false,
                            eventData['is_registered'] === '1',
                            isSignedIn,
                            getEvents,
                            getEvents
                        )
                        eventsContainer.append(event)
                    })
                },
            })
        }
    })
}
