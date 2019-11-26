String.prototype.multiReplace = function (array, replacement) {
    var string = this;
    for (var i in array) {
        string = string.replace(new RegExp(array[i], 'g'), replacement);
    }
    return string;
};

String.prototype.intConvert = function () {
    return parseInt(this, 10);
}

String.prototype.wrapText = function (classname) {
    return "<span class='" + classname + "'>" + this + "</span>";
}

// Functions

function addDivTo(context, classname) {
    context.append("<div class=" + classname + "></div>")
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Joiners

var Jwidth = $(".stdf2-game-joiners").width();
var Jwidth_inner = $(".stdf2-game-joiners__inner").width();
var Jwidth_limited = Jwidth - Jwidth_inner;
var Jrate = (1000 / 120); // 120 UPS (почти FPS)

$(".stdf2-game-joiners__cover").on('mouseenter', function () {
    var inner = $(".stdf2-game-joiners__inner");
    this.interval = setInterval(() => {
        var inner_indent = inner.css('margin-left').replace("px", "").intConvert();

        if ($(this).hasClass("stdf2-game-joiners__cover--right")) {
            var indent = (inner_indent - Jrate);
        } else {
            var indent = (inner_indent + Jrate);
        }

        if (indent < Jwidth_limited) {
            indent = Jwidth_limited;
            $(".stdf2-game-joiners__cover--right").css({ opacity: "0" });
            $(".stdf2-game-joiners__cover--left").css({ opacity: "1" });
        } else if (indent >= 0) {
            indent = 0;
            $(".stdf2-game-joiners__cover--right").css({ opacity: "1" });
            $(".stdf2-game-joiners__cover--left").css({ opacity: "0" });
        } else {
            $(".stdf2-game-joiners__cover--right").css({ opacity: "1" });
            $(".stdf2-game-joiners__cover--left").css({ opacity: "1" });
        }

        inner.css({
            "margin-left": indent + "px",
        });
    }, Jrate);
}).on('mouseleave', function () {
    this.interval && clearInterval(this.interval);
});



// To top

$(".to-top").click(() => $("html, body").animate({ scrollTop: 0 }, "slow"));

// FAQ

$(".faq__header").click(function () {
    if ($(this).hasClass("faq__header--toggled")) {
        $(this).removeClass("faq__header--toggled")
            .parent()
            .find(".faq__header--icon").html("&plus;");
    } else {
        $(this).addClass("faq__header--toggled")
            .parent()
            .find(".faq__header--icon").html("&minus;");
    }
});


// Language choosing

$(".dropdown-menu").click(function () {
    var menu = $(this).find(".dropdown-menu__menu");
    
    if (menu.hasClass("dropdown-menu__menu--deployed")) {
        menu.removeClass("dropdown-menu__menu--deployed");
    } else {
        menu.addClass("dropdown-menu__menu--deployed");
    }
});


// Volume disabler

const volume = new class {
    constructor() {
        this.parent = ".topbar__volume";
        this.bunch = ".built-icon__volume";
        this.stick = ".built-icon__volume--stick-across";
        this.state = "on";

        //this.turn("on");
    }

    turn(option) {
        // Possible options
        switch (option) {
            case "on":
                this.state = option;
                this.releaseAnimation("show");
                break;
            
            case "off":
                this.state = option;
                this.releaseAnimation("hide");
                break;
            
            default:
                return this.state;
                break;
        }
    }

    switch() {
        if (this.state == "on") this.turn("off");
        else
        if (this.state == "off") this.turn("on");

        return this.state;
    }

    releaseAnimation(task) {
        // Showing
        if (task == "hide") {
            $(this.stick).animate({
                height: "0em",
            }, 400);
        }

        // Hidding
        if (task == "show") {
            $(this.stick).animate({
                height: "1.2em",
            }, 400);
        }
    }
};

function Msidebar(tap) {
    $(".mobile-sidebar")
        .attr("class", "mobile-sidebar mobile-sidebar--" + tap);
}

function isMobile() {
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        return true;
    } else return false;
}

$(".topbar__volume").click(() => volume.switch());

$(window).on("load", () => {
    if (isMobile()) {
        $("head").append('<link rel="stylesheet" type="text/css" href="assets/css/mobile.css?">');
        $(".sidebar")
            .clone()
            .prependTo("body")
            .removeClass("sidebar")
            .addClass("mobile-sidebar mobile-sidebar--hide");
        $(".topbar__logo")
            .clone()
            .prependTo(".mobile-sidebar")
            .addClass("topbar__logo--mobile");
    }

    $("body, .mobile-sidebar").each(function () {
        const mc = new Hammer(this);
        mc.on("swipeleft swiperight tap", ev => {
            switch (ev.type) {
                case "swiperight":
                    Msidebar("show")
                    break;

                case "tap":
                case "swipeleft":
                    Msidebar("hide")
                    break;
            }
        });
    });
});