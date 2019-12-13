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

// Volume disabler

const volume = new class {
    constructor() {
        this.parent = ".topbar__volume";
        this.bunch = ".built-icon__volume";
        this.stick = ".built-icon__volume--stick-across";
        this.state = "on";

        this.turn("on");
    }

    turn(option) {
        // Possible options
        switch (option) {
            case "off":
                this.state = option;
                this.releaseAnimation("show");
                break;
            
            case "on":
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

function Mmenu(tap) {
    $(".mobile-menu__main")
        .attr("class", "mobile-menu__main mobile-menu__main--" + tap);
}

$(window).on("load", () => {
    $("body, .mobile-sidebar").each(function () {
        const mc = new Hammer(this);
        mc.on("swipeleft swiperight", ev => {
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
    Msidebar("hide")
    $("header, main").click(() => Msidebar("hide"));
    // Volume Swithcer
    $(".topbar__volume").click(() => volume.switch());
    // Language choosing
    $(".dropdown-menu__current").click(() => $(".dropdown-menu__menu").toggleClass("dropdown-menu__menu--deployed"));
    // Mobile Menu Deploying
    Mmenu("hide");
    $(".mobile-menu__trigger").click(function () {
        if ($(".mobile-menu__main").hasClass("mobile-menu__main--show"))
            Mmenu("hide");
        else 
            Mmenu("show");
    });
});