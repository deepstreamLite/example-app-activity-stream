$(function() {
    const ds = deepstream('wss://154.deepstreamhub.com?apiKey=97a397bd-ccd2-498f-a520-aacc9f67373c');

	//display the connection state at the top
	ds.on( 'connectionStateChanged', function( connectionState ){
		$( '#connection-state' ).text( connectionState );
	});

	//authenticate your connection. We haven't activated auth,
	//so this method can be called without arguments
	ds.login();

    const postsEvent = 'posts-event';
    const postContent = $('#post-content');
    let user = {};

    $.ajax({
        url: 'https://randomuser.me/api/',
        dataType: 'json',
        success: function(data) {
            user = data.results[0];
            $('#post-image').append(`<img src="${user.picture.medium}" />`)
            $('#username').text(user.login.username);
        }
    });

    
    ds.event.subscribe(postsEvent, data => {
        const html = `
            <div class="card new_card">
                <div class="card__header">
                    <div class="card__image">
                        <img src="${data.picture}" alt="" />
                    </div>
                    <div class="card__name-time">
                        <h4 class="card__name">${data.name}</h4>
                        <div class="card__time">${data.time}</div>
                    </div>
                </div>
                <div class="card__content">
                    ${data.content}
                </div>
            </div>
        `;
        $('#cards').prepend(html);
    })
    

    postContent.click(_ => {
        postContent.val('');
    })

    $('#post-button').click(_ => {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];

        if(user.name) {
            ds.event.emit(postsEvent, {
                content: postContent.val(),
                name: user.name.first + ' ' + user.name.last,
                picture: user.picture.medium,
                time: time
            });
        }
    })
    
})