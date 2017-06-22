'use strict';
if (!window.console)
    window.console = {};
if (!window.console.memory)
    window.console.memory = function() {};
if (!window.console.debug)
    window.console.debug = function() {};
if (!window.console.error)
    window.console.error = function() {};
if (!window.console.info)
    window.console.info = function() {};
if (!window.console.log)
    window.console.log = function() {};

// sticky footer
//-----------------------------------------------------------------------------
if (!Modernizr.flexbox) {
    (function() {
        var $pageWrapper = $('#page-wrapper'),
            $pageBody = $('#page-body'),
            noFlexboxStickyFooter = function() {
                $pageBody.height('auto');
                if ($pageBody.height() + $('#header').outerHeight() + $('#footer').outerHeight() < $(window).height()) {
                    $pageBody.height($(window).height() - $('#header').outerHeight() - $('#footer').outerHeight());
                } else {
                    $pageWrapper.height('auto');
                }
            };
        $(window).on('load resize', noFlexboxStickyFooter);
    })();
}
if (ieDetector.ieVersion == 10 || ieDetector.ieVersion == 11) {
    (function() {
        var $pageWrapper = $('#page-wrapper'),
            $pageBody = $('#page-body'),
            ieFlexboxFix = function() {
                if ($pageBody.addClass('flex-none').height() + $('#header').outerHeight() + $('#footer').outerHeight() < $(window).height()) {
                    $pageWrapper.height($(window).height());
                    $pageBody.removeClass('flex-none');
                } else {
                    $pageWrapper.height('auto');
                }
            };
        ieFlexboxFix();
        $(window).on('load resize', ieFlexboxFix);
    })();
}

$(function() {
    $('input[placeholder], textarea[placeholder]').placeholder();
    $('.js-select').niceSelect();
})

var slider = (function() {
    var $slider = $('.js-price-slider');
    var minVal = 0;
    var maxVal = 10000000;
    var minInput = $('.js-min');
    var maxInput = $('.js-max');
    var btn = $('.js-show-price');


    $slider.slider({
        range: true,
        min: 0,
        max: 1000000,
        values: [0, 1000000],
        slide: function(event, ui) {
            minInput.val(ui.values[0])
            maxInput.val(ui.values[1])
        },
        create: function(event, ui) {
            minInput.val(minVal)
            maxInput.val(maxVal)
        }
    });
    minInput.on('change', function() {
        $slider.slider("values", 0, $(this).val());
    })
    maxInput.on('change', function() {
        $slider.slider("values", 1, $(this).val());
    })
    btn.on('click', function() {
        application.getListForRender()
    })
})();

var filterOpen = (function() {
    var $btn = $('.js-open-filter');
    $btn.on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).next('.main__sidebar-wrapper-body').slideUp()
        } else {
            $(this).next('.main__sidebar-wrapper-body').slideDown()
        }
        $(this).toggleClass('active')
    })
})();

var mobileMenu = (function() {
    var $btn = $('.js-show-mobile-menu');
    var $menu = $('.header__menu');
    $btn.on('click', function() {
        if ($(this).hasClass('active')) {
            $menu.slideUp(200)
        } else {
            $menu.slideDown(200)
        }

        $(this).toggleClass('active')
    })
})();

var footerLang = (function(){
    var $btn = $('.js-show-lang');
    $btn.on('click',function(e){
        e.preventDefault();
        $(this).toggleClass('active')
        $(this).next('.footer__lang-list').slideToggle(200)
    })
})();

var mobileFilter = (function() {
    var $btn = $('.js-mobile-filter');
    var $filter = $('.main__sidebar');
    var $closeFilter = $('.main__sidebar-close-mobile');

    $btn.on('click', function() {
        $filter.addClass('active')
    })

    $closeFilter.on('click', function() {
        $filter.removeClass('active')
    })
})();

//main Application
// ниже вывод и фильтрация проектов на главной странице

var application = (function() {
    var renderList;
    var tempItem = $('.main__body-temp-wrapper .main__item');
    var categoryArray = [];
    var selectValue = $('.js-select').val();
    var categoryCount = $('.main__sidebar-count');
    var showMoreBtn = $('.js-show-more');
    var renderLimit = 15;
    var resetFilter = $('.main__sidebar-reset');

    resetFilter.on('click', function(e) {
        e.preventDefault();
        $('.main__sidebar input:checked').prop('checked', false)
        $('.js-category-list input').trigger('change');
        $('.js-select').val('all');
        $('.js-select').niceSelect('update');
        $('.js-select').trigger('change');
        $('.js-min').val(0);
        $('.js-max').val(1000000);
        $('.js-min').trigger('change');
        $('.js-max').trigger('change');
        $('.js-show-price').trigger('click')
    })
    categoryCount.hide()
    $('.main__body-temp-wrapper').remove();
    $('.js-category-list input').on('change', function() {
        categoryArray = [];
        $('.js-category-list input:checked').each(function() {
            categoryArray.push($(this).val())
        })
        if (categoryArray.length > 0) {
            categoryCount.show()
            categoryCount.html(categoryArray.length)
        } else {
            categoryCount.hide()
        }
        application.getListForRender()
    })

    $('.js-select').on('change', function() {
        selectValue = $(this).val()
        application.getListForRender()
    });

    function checkMoreBtn() {
        if (renderLimit >= renderList.length) {
            showMoreBtn.hide()
        } else {
            showMoreBtn.show()
        }
    }

    showMoreBtn.on('click', function(e) {
        e.preventDefault()
        renderLimit += 6;
        render()
        checkMoreBtn()
    });
    function render() {
        $('.main__body').html('');
        $.each(renderList, function(key) {
            tempItem.clone().appendTo('.main__body').addClass('work');
            var workItem = $('.main__body .main__item.work')
            workItem.find('.main__item-title-name').html(this.category.name);
            workItem.find('.main__item-title').addClass(this.category.icon);
            workItem.find('.main__item-body-name').html(this.title);
            workItem.find('.main__item-body-name').attr('href', '#detail/' + this.detailLink)
            workItem.find('.main__item-body-status').html(this.status.name);
            workItem.find('.main__item-body-status').addClass(this.status.color);
            workItem.find('.main__item-body-period').html(this.date);
            workItem.find('.main__item-body-preview').html(this.text);
            if (this.author.image) {
                workItem.find('.main__item-body-author-icon').append('<img src="img/mainlist/' + this.author.image + '" alt="">')
            }
            workItem.find('.main__item-body-author-name').html(this.author.name);
            workItem.find('.main__item-details-value--price').html(this.budget);
            workItem.find('.main__item-details-value--vote').html(this.vote);
            workItem.removeClass('work');

            if ((renderLimit - 1) == key) {
                return false
            }
        })
    }
    setTimeout(function() {
        application.getListForRender()
    }, 100)
    return {
        getListForRender: function() {
            renderList = [];

            if (categoryArray.length == 0) {
                $('.js-category-list input').each(function() {
                    categoryArray.push($(this).val())
                })
            }

            $.each(projects, function(key) {
                var that = this;
                var categoryTitle = this.category.title;
                var statusTitle = this.status.title;
                var price = this.price;
                categoryArray.forEach(function(value) {
                    if (categoryTitle == value) {
                        if (selectValue == 'all' && (price > $('.js-min').val() && price < $('.js-max').val())) {
                            renderList.push(that)
                        } else if (selectValue == statusTitle && (price > $('.js-min').val() && price < $('.js-max').val())) {
                            renderList.push(that)
                        }
                    }
                })
            })
            render()
            checkMoreBtn()
        }
    }
})();

if (window.location.href.indexOf('#detail') < 1) {
    window.location = '#index'
}

//ниже реализация роутинга аля SPA

routie('index', function(name) {
    $('.detail-view').hide()
    $('.detail-view').css('opacity', '0');
    $('.index-view').show();
    $('.index-view').css('opacity', '1');
});

routie('detail/:name', function(name) {
    $('.index-view').hide();
    $('.index-view').css('opacity', '0');
    $('.detail-view').show()
    $('.detail-view').css('opacity', '1');
    setTimeout(function() {
        getDetailInfo(name);
    }, 10)
});

//ниже показ деталки, то есть всё что происходит после клика на ссылку проекта
//реализовано ниже - получение ID проекта, поиск проекта в масиве detailWrapper
//и вывод всей инфы с деталки, причем некоторые елементы я выводил циклом -
//такие как елементы слайдера, и блок "ОПИС", что б решение было максимально универсальным

var detailWrapper;
var firstDetailShow = true;

function getDetailInfo(name) {
    $('html,body').scrollTop(0);

    var renderDetail;
    if (firstDetailShow) {
        detailWrapper = $('.detail__wrapper.detail__wrapper--temp');
        firstDetailShow = !firstDetailShow;
    }
    $('.detail__wrapper-render').html('');
    detailWrapper.clone().appendTo('.detail__wrapper-render').addClass('work');
    var workdetailWrapper = $('.detail__wrapper-render .detail__wrapper.work')
    workdetailWrapper.removeClass('detail__wrapper--temp').attr('style', '')

    setTimeout(function() {
        $('.detail__wrapper--temp').hide();
    }, 10)
    $.each(detail, function() {
        if (name == this.id) {
            renderDetail = this;
            return false
        }
    })
    workdetailWrapper.find('.detail__title-name').html(renderDetail.title);
    workdetailWrapper.find('.detail__status').html(renderDetail.status.name);
    workdetailWrapper.find('.detail__status').addClass(renderDetail.status.color);
    workdetailWrapper.find('.detail__short-detail-info--name .detail__short-detail-text').html(renderDetail.author.name);
    if (renderDetail.author.image) {
        workdetailWrapper.find('.detail__short-detail-info--name .detail__short-detail-author-image').append('<img src="img/mainlist/' + renderDetail.author.image + '" alt="">')
    }
    workdetailWrapper.find('.detail__short-detail-info--category .detail__short-detail-text').html(renderDetail.category.name);
    workdetailWrapper.find('.detail__short-detail-info--category .detail__short-detail-author-image').addClass(renderDetail.category.icon);
    workdetailWrapper.find('.detail__short-detail-info--code .detail__short-detail-text').html(renderDetail.code);
    workdetailWrapper.find('.detail__project-tabs-body .project-text').html(renderDetail.info.shorReview);
    workdetailWrapper.find('.detail__project-tabs-detail .city').html(renderDetail.info.city);
    workdetailWrapper.find('.detail__project-tabs-detail .adress').html(renderDetail.info.adress);
    workdetailWrapper.find('.detail__project-tabs-detail .region').html(renderDetail.info.region);
    workdetailWrapper.find('.detail__project-tabs-detail .time').html(renderDetail.info.time);
    workdetailWrapper.find('.detail__project-budget-text').html(renderDetail.budget);
    $.each(renderDetail.review, function() {
        workdetailWrapper.find('.detail__project-review-list').append('<div class="detail__project-review-item"><div class="detail__project-review-name">' + this.name + '</div><div class="detail__project-review-text">' + this.text + '</div></div>')
    });
    $.each(renderDetail.slider, function() {
        workdetailWrapper.find('.js-project-slider').append('<div class="detail__project-photos-slide"><a href="#" class="detail__project-photos-slide-link"><img src="' + this + '" alt=""></a></div>')
    });

    $.each(renderDetail.files, function() {
        workdetailWrapper.find('.detail__project-files-list ').append('<li class="detail__project-files-item"><a href="#" class="detail__project-files-link">' + this + '</a></li>')
    });

    workdetailWrapper.find('.detail__project-example-link').html(renderDetail.examples);

    $.each(renderDetail.otherInfo, function() {
        workdetailWrapper.find('.detail__project-other-info-list').append('<p class="project-text detail__project-other-text">' + this + '</p>')
    });

    workdetailWrapper.find('.js-people').html(renderDetail.people);
    workdetailWrapper.find('.js-deadline').html(renderDetail.deadline);
    setTimeout(function() {

        $('.detail__wrapper-render').append(workdetailWrapper)
        detailSlider()
    }, 100)
}

function detailSlider() {
    $('.detail__wrapper-render .js-project-slider ').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: $('.detail__project-btns--prev'),
        nextArrow: $('.detail__project-btns--next'),
        responsive: [{
                breakpoint: 1300,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    })
}

$(document).on('click', '.detail__side-socials-link', function(e) {
    e.preventDefault();
    var pageTitle = $('.detail__title-name').html();
    var network = $(this).attr('data-social');
    switch (network) {
        case 'tw':
            var tw = window.open("http://twitter.com/share?text=" + pageTitle + "&url=https://devchallenge.it&hashtags=hashtag1,hashtag2,hashtag3", "pop", "width=600, height=400, scrollbars=no")
            break;
        case 'vk':
            var vk = window.open("http://vk.com/share.php?url=https://devchallenge.it&title=" + pageTitle, "pop", "width=600, height=400, scrollbars=no");
            break;
        case 'google':
            var google = window.open("https://plus.google.com/share?url=https://devchallenge.it", "pop", "width=600, height=400, scrollbars=no");
            break;
        case 'fb':
            var fbpopup = window.open("http://www.facebook.com/share.php?u=https://devchallenge.it&title=" + pageTitle, "pop", "width=600, height=400, scrollbars=no");
            break;
        default:
    }
})
