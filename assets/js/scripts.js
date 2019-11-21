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


$(".topbar__volume").click(() => volume.switch());