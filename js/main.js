;(function () {
    var exampleEvent = [
        {
            "id": "25-03-2017",
            "title": "Митинг",
            "users": "",
            "description": "Митинг о митинге"
        },
        {
            "id": "27-03-2017",
            "title": "Встреча",
            "users": "Вася, Дима",
            "description": "Встреча с друзьями"
        }
    ];

    createDataToLocalStorage('data', exampleEvent);

    function createDataToLocalStorage(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
    }

    function saveDataToLocalStorage(name, data) {
        var arr = getDataToLocalStorage(name),
            buff = [];

        for(var i = 0; i < arr.length; i++) {
            if(arr[i].id === data.id) {
                arr[i] = data;
                buff.push(arr[i]);
            } else {
                buff.push(arr[i]);
                if(i === arr.length - 1) {
                    buff.push(data);
                }
            }
        }

        createDataToLocalStorage(name, buff);
        updateCurrentData(data.id, data.title, data.users);
    }

    function getDataToLocalStorage(name) {
        var arr = JSON.parse(localStorage.getItem(name));
        return arr;
    }

    $('form[name=addEvent]').submit(function (event) {
        event.preventDefault();
        if ($(this).find('#event').val().length >= 3) {
            var itemEvent = {
                'id': $(this).find('#date').val(),
                'title': $(this).find('#event').val(),
                'users': $(this).find('#names').val(),
                'description': $(this).find('#description').val()
            };
            saveDataToLocalStorage('data', itemEvent);
            $('.s-event__close').trigger('click');
            $(this).trigger('reset');
        }
    });

    function appendData() {
        var eventData = getDataToLocalStorage('data');
        for (var i = 0; i < eventData.length; i++) {
            updateCurrentData(eventData[i].id, eventData[i].title, eventData[i].users);
        }
    }

    function updateCurrentData(id, title, users) {
        var currentEl = $('[data-date = ' + id + ']');
        currentEl.find('.s-week__item-week-data').html('');
        currentEl.append('<div class="s-week__item-week-data"><div>' + title + '</div><div>' + users + '</div></div>');
    }


    $('.s-week__item').on('click', function (e) {
        $('form[name=addEvent]').trigger('reset');
        var self = $(this);
        showPopoverEvent(self);
    });

    $('.s-event__close').on('click', function () {
        $('.s-event').css({
            'top': 0,
            'left': 0
        }).removeClass('s-event__active');
    });

    function showPopoverEvent(item) {
        $('.s-event')
            .css({
                'top': item.offset().top,
                'left': function () {
                    if (($(window).outerWidth() - $(this).outerWidth() - 30) >= item.offset().left) {
                        return item.offset().left;
                    } else {
                        return $(window).outerWidth() - $(this).outerWidth() - 30;
                    }
                }
            })
            .addClass('s-event__active')
            .valueEvent(item);
    }

    $.fn.valueEvent = function (item) {
        var eventData = getDataToLocalStorage('data'),
            eventDataLength = eventData.length,
            form = $(this),
            date = form.find('#date'),
            event = form.find('#event'),
            names = form.find('#names'),
            description = form.find('#description');

        date.val(item.data('date'));

        for (var i = 0; i < eventDataLength; i++) {
            if (item.data('date') === eventData[i].id) {
                event.val(eventData[i].title);
                names.val(eventData[i].users);
                description.val(eventData[i].description);
            }
        }
    };

    $('#search').on('keyup', function () {
        if ($(this).val().length > 0) {
            $('.s-search__close').addClass('s-search__close-active');

            var valueText = $(this).val().toLowerCase(),
                eventData = getDataToLocalStorage('data'),
                eventDataLength = eventData.length,
                str = '';

            for(var i = 0; i < eventDataLength; i++) {
                if(eventData[i].title.toLowerCase().indexOf(valueText) !== -1) {
                    $('.s-search-result').addClass(('s-search-result-active'));
                    str += '<li class="s-search-result__list"><div class="s-search-result__list-name">' + eventData[i].title + '</div><div class="s-search-result__list-date">' + eventData[i].id + '</div></li>'
                } else {
                    $('.s-search-result').removeClass(('s-search-result-active'));
                }

                // 2 вариант поиск по всем значениям в событии
                // var searchStr = '';
                // for(var key in eventData[i]) {
                //     searchStr += eventData[i][key];
                // }
                // if(searchStr.toLowerCase().indexOf(valueText) !== -1) {
                //     $('.s-search-result').addClass(('s-search-result-active'));
                //     str += '<li class="s-search-result__list"><div class="s-search-result__list-name">' + eventData[i].title + '</div><div class="s-search-result__list-date">' + eventData[i].id + '</div></li>'
                // }
            }
            $('.s-search-result__inner').html(str);

        } else {
            $('.s-search-result').removeClass(('s-search-result-active'));
        }
    });

    $('.s-search__close').on('click', function () {
        $('.s-search-result').removeClass(('s-search-result-active'));
        $('#search').val('');
    });

    appendData();
})();
