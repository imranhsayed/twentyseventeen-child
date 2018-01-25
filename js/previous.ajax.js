/**
 * Ajax Js file
 */

(function( $ ) {
	var postId = postdata.post_id,
		themeUri = postdata.theme_uri,
		restUrl = postdata.rest_uri;

		$( '.load-previous a' ).attr( 'href', 'javascript:void(0)' );
	console.log( 'post_id: ' + postId + ' theme_uri: '+ themeUri + ' rest_uri: ' + restUrl );

	function previousPostTrigger() {
		var trigger = document.querySelector( '.load-previous a' );
		window.addEventListener( 'scroll', getPrevPostOnScroll );

		function getPrevPostOnScroll() {
			var triggerTopPos = trigger.getBoundingClientRect().top + 150,
				windowHeight = window.innerHeight;
			if ( triggerTopPos > windowHeight ) {
				return;
			}
			console.log( windowHeight );
			console.log( triggerTopPos );
			trigger = document.querySelector( '.load-previous a' );
			getPreviousPost();
			window.removeEventListener( 'scroll', getPrevPostOnScroll );
		}
	}

	previousPostTrigger();

	function getPreviousPost() {
		var previousPostId = $( '.load-previous a' ).attr( 'data-id' ),
			jsonUrl = restUrl + 'posts/' + previousPostId + '?_embed=true',
			ajaxRequest;

		ajaxRequest = $.ajax({
			dataType: 'json',
			url: jsonUrl
		});

		ajaxRequest.done( function( object ) {
			buildPost( object );
		});

		ajaxRequest.fail( function() {
			console.log( 'Error' );
		});

		ajaxRequest.always( function() {
			console.log( 'Ajax Request Complete' );
		});
	}

	function buildPost( object ) {
		console.log( object );
			var date = new Date( object.date ),
				featImg = getFeaturedImg( object ),
				previousPostContent;

			previousPostContent =
			'<div class="generated">' +
			'<div class="date-author">' + date + ' -By ' + object._embedded.author[0].name + '</div>' +
			'<h1>' + object.title.rendered + '</h1>' +
			 featImg +
			'<div class="post-content">' + object.content.rendered + '</div>' +
			'<nav class="navigation post-navigation load-previous" role="navigation">' +
			'<span class="nav-subtitle">Previous Post</span>' +
			'<div class="nav-links">' +
			'<div class="nav-previous">' +
			'<a href="javascript:void( 0 )" data-id="' + object.previous_post_ID + '">' + object.previous_post_title + '</a>' +
			'</div>' +
			'</div>' +
			'<div class="ajax-loader"><img src="' + themeUri + '/SVG-Loaders/svg-loaders/oval.svg" width="80" height="80" alt=""></div>' +
			'</nav>' +
			'</div>';

		$( '.post-navigation' ).replaceWith( previousPostContent );
		// Reinitialize previousPostTrigger on the new content . Means set the event listener on previous post link of the new content.
		previousPostTrigger();

	}

	function getFeaturedImg( object ) {
		var featuredImageID = object.featured_media,
			featuredObj, imgLarge, imgWidth, imgHeight, featImg;

		if ( featuredImageID === 0 ) {
			featImg = '';
		} else {
			featuredObj = object._embedded['wp:featuredmedia'][0];
			imgLarge = '';
			imgWidth = featuredObj.media_details.sizes.full.width;
			imgHeight = featuredObj.media_details.sizes.full.height;

			if ( featuredObj.media_details.sizes.hasOwnProperty( 'large' ) ) {
				imgLarge = featuredObj.media_details.sizes.large.source_url + ' 1024w, ';
			}

			featImg = '<div class="single-featured-image-header">' +
				'<img src="' + featuredObj.media_details.sizes.full.source_url + '" ' +
				'width="' + imgWidth + '" ' +
				'height="' + imgHeight + '" ' +
				'class="attachment-twentyseventeen-featured-image size-twentyseventeen-featured-image wp-post-image"' +
				'alt=""' +
				'srcset="' + featuredObj.media_details.sizes.full.source_url + ' ' + imgWidth + 'w, ' +
				imgLarge + featuredObj.media_details.sizes.medium.source_url + ' 300w ' +
				featuredObj.media_details.sizes.medium_large.source_url + ' 768w ' +
				featuredObj.media_details.sizes.thumbnail.source_url + ' 150w ' +
				'sizes="100vw" ' +
				'</div>';
		}
		return featImg;
	}

})( jQuery );
