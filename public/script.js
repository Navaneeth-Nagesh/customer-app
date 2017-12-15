$(document).ready(function () {
    $('.deleteuser').on('click', deleteUser);
});

function deleteUser() {
    var confirmation = confirm('are you sure?');
    if (confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/employee_data/delete/' + $(this).data('id')
        }).done(function (response) {
            window.location.replace('/home');
        });
        window.location.replace('/home');
    } else {
        return false;
    }
}

