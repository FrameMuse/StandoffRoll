function _closePopup() {
    $(".popup-window__close, .popup__cover").click();
}

function tendOption(option) {
    var element = ".popup-window__" + option;
    return $(element);
}
function wEdit(options = {}) {
    for (var option in options) {
        tendOption(option).html(options[option]);
    }
}

function popup($window, options = {}) {
    // Fetching
    function wText(ref) {
        var wText = "popup." + $window + ".";
        return "jopa";
        return getLanguage(wText + ref);
    }
    var title = wText("title");
    var summary = wText("summary");

    // Clearing
    wEdit({
        title: null,
        summary: null,
        content: null,
        help: 'Есть вопросы? Пишите в групу поддержки <a href="#vk" class="popup-window__marked">VK</a>',
    });

    switch ($window) {
        case "top_up":
            wEdit({
                content: `
                    <div class="popup-window__top-up">
                        <input type="text" class="popup-window__top-up--big-input" placeholder="${wText("other.placeholders.promocode")}">
                        <span class="top_up_text">${wText("promocode.default")}</span>
                    </div>
                    <div class="flex flex--center">
                        <input class="popup-window__button button2" type="text" placeholder="100">
                        <input class="popup-window__button button1" type="submit" onclick="redirectToPaymentSystem(this);" value="${wText("other.buttons.payment")}"> 
                    </div>`,
                help: '<div class="paysys paysys--1"><img src="https://standoffcase.ru/assets/img/payments_systems/mastercard.svg" class="paysys__image"><img src="https://standoffcase.ru/assets/img/payments_systems/webmoney.svg" class="paysys__image"><img src="https://standoffcase.ru/assets/img/payments_systems/qiwi.svg" class="paysys__image"><img src="https://standoffcase.ru/assets/img/payments_systems/yandex.svg" class="paysys__image"><img src="https://standoffcase.ru/assets/img/payments_systems/visa.svg" class="paysys__image"></div>',
            });
            $(".popup-window__top-up--big-input").on('input', function () {
                var value = $(this).val();
                if (value == "") {
                    $(".top_up_text").text(getLanguage("popup.top_up.promocode.default"));
                    return;
                }
                $.get("/api/v1/user/promo?name=" + encodeURIComponent(value), (data) => {
                    if (data.percent) {
                        $(".top_up_text").text(getLanguage("popup.top_up.promocode.percent").replace("{percent}", data.percent));
                    } else {
                        $(".top_up_text").text(getLanguage("popup.top_up.promocode.not_found"));
                    }
                });
            });
            break;

        case "vk-accept":
            wEdit({
                content: '<div class="vk-accept"> <section> <div class="vk-accept__title">' + wText("sections.1") + '</div> <div class="vk-accept__content"> <div class="mauto" id="vk_groups"></div> </div> </section> <section> <div class="vk-accept__title">' + wText("sections.2") + '</div> <div class="vk-accept__content"> <div class="mauto width150" id="vk_allow_messages_from_community"></div> </div> </section> <section> <div class="vk-accept__title">' + wText("sections.3") + '</div></section> <button onclick="_closePopup()" class="button1">' + wText("button") + '</button> </div>',
            });

            // VK Widgets
            VK.Widgets.AllowMessagesFromCommunity("vk_allow_messages_from_community", { height: 30 }, 187346506);
            VK.Widgets.Group("vk_groups", { mode: 1, no_cover: 1 }, 187346506);
            break;
        
        case "1":
            wEdit({
                title: 'asd',
                summary: 'asd',
                content: 'asd',
            });
            break;

        // Default
        default:
            wEdit({
                title: title,
                summary: summary,
            });
            break;
    }

    // Animation
    $(".popup").removeAttr("hidden");
    setTimeout(() => $(".popup-window").removeClass("scale-out scale-in").addClass("scale-in"), 0);
}

$(".popup-window__close, .popup__cover").click(() => {
    var window = $(".popup");
    window.find(".popup-window")
        .removeClass("scale-out scale-in")
        .addClass("scale-out");
    setTimeout(() => window.attr("hidden", ""), 195) // Hide popup in 175 msecs
});