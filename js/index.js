import Controller from './mvc/controller';

const customItemContentLayoutHTML =  
    '<div class="mapReviewWrapper">' +
        '{% if !properties.review %}' +
            '<div class="mapReviewHeader">'+
                '{{ address }} '+
            '</div>' +
            '<div class="mapReviewEmpty">Отзывов пока нет...</div>' +
        '{% else %}'+
            '<div class="mapReviewHeader">'+
            '{{ properties.balloonContentHeader|raw }}'+
            '</div>' +
        '{% endif %}'+
        '<div class="mapReviewItems">' +
            '<div class="mapReviewItem">' +
                '<div>' +
                    '<span class="userName">{{ properties.review.userName|raw }}</span>' +
                    '<span class="orgName">{{ properties.review.orgName|raw }}</span>' +
                    '<span class="time">{{ properties.review.time|raw }}</span>' +
                '</div>' +
                '<div>' +
                    '{{ properties.review.reviewText|raw }}' +
                '</div>' +
            '</div>' +
        '</div>' +    
        '<div id="mapReviewFormWrapper"  class="mapReview mapReview_formWrapper">'+
            '<div class="mapReviewH1">Ваш отзыв</div>'+
            '<form id="mapReviewForm" class="mapReviewForm">' +
                '<div class="form-row">' +
                    '<input type="text" name="userName" placeholder="Ваше имя" />' +
                '</div>' +
                '<div class="form-row">' +
                    '<input type="text" name="orgName" placeholder="Укажите место"  />' +
                '</div>' +
                '<div class="form-row">' +
                    '<textarea name="reviewText" placeholder="Поделитесь впечатлениями" rows="5"></textarea>' +
                '</div>' +
                '<div class="form-row">' +
                    '<button type="submit" class="mapReviewFormSubmit">Добавить</button>' +
                '</div>' +
            '</form>'+
        '</div>' +
    '</div>' ;
const customClusterContentLayoutHTML = 
    '<div class="mapReview">'+
        '<div class="mapReviewClusterItem">' +
            '<div class="orgName">' +
                '{{ properties.review.orgName|raw }}' +
            '</div>' +
            '<div class="address">' +
                '<a href="#" class="linkAddress">' +
                    '{{ properties.review.address|raw }}' +
                '</a>' +
            '</div>' +
            '<div class="reviewText">' +
                '{{ properties.review.reviewText|raw }}' +
            '</div>' +
            '<div class="time">' +
                '{{ properties.review.time|raw }}' +
            '</div>' +
        '</div>' +
    '</div>';

const controller = new Controller(customItemContentLayoutHTML, customClusterContentLayoutHTML);