String.prototype.intConvert = function () {
    return parseInt(this, 10);
}

class spinner {
    branchCount = 0;

    constructor(domname) {
        this.html = `<div class="spinner-block">
            <div class="spinner-line">
                <div class="spinner-line__inner">
                    <!--div class="spinner-line__space spinner-line__space--start"></div-->
                    <div class="spinner-line__space spinner-line__space--end"></div>
                </div>
                <div class="spinner-line__pointer-line"></div>
            </div>
        </div>`;
        $(domname).replaceWith(this.html);
        $(window).on("load", () => this.default());
    }

    createBranch(fake = false, content = "") {
        var branchCount = this.branchCount;
        if (fake) {
            branchCount = NaN;
            this.branchCount--;
        }

        const html = '<div class="spinner-line__branch" data-branch-id="' + branchCount + '">' + content + '</div>';
        $(".spinner-line__space--end").remove();
        $(".spinner-line__inner")
            .append(html)
            .append('<div class="spinner-line__space spinner-line__space--end"></div>');
        
        this.branchCount++;
    }

    createBranches(number = 0, fake = false, content = "") {
        for (let index = 0; index < number; index++) {
            this.createBranch(fake, content);
        }
    }

    default() {
        // Calculate and delete test branch
        if ($(".spinner-line__branch").length == 0) {
            this.createBranch(true);
            $(".spinner-line__branch").remove();
        }
        this.calc();
        // Go to default position
        this.move_to_id(0, 0);
        // Clear count
        this.branchCount = 0;
    }

    calc() {
        this.spinnerWidth = $(".spinner-line__inner").outerWidth();
        this.branchWidth = $(".spinner-line__branch").outerWidth();
        this.indent_step = this.branchWidth;
        this.spinnerInnerWidth = this.indent_step * this.branchCount;
    }

    move_by_one(option) {
        var margin = $(".spinner-line__inner").css("left").replace('px', '').intConvert();
        if (option == "back") {
            $(".spinner-line__inner").animate({
                'left': margin - this.indent_step + "px",
            }, 300);
        } else {
            $(".spinner-line__inner").animate({
                'left': margin + this.indent_step + "px",
            }, 300);
        }
    }

    rand(max = 10) {
        return Math.floor((Math.random() * max) + 1);
    }

    async move_to_id(id, duration = 12000) {
        var branch = $(".spinner-line__branch[data-branch-id=" + id + "]");
        var random = this.rand(this.indent_step);
        if (random > this.indent_step / 2) {
            random = -(random - this.indent_step / 2);
        }
        var gotThere = new Promise((resolve) => {
            $(".spinner-line__inner").scrollTo(branch, duration, {
                offset: -(random + (this.spinnerWidth / 2) - (this.branchWidth / 2)),
                easing: $.bez([.3, .75, .27, 1]),
                onAfter: () => resolve(),
            });
        });
        return await gotThere;
    }

    branchHTML($img = "assets/img/player.png", $color = "orange") {
        if (typeof $img == "object") {
            $img = arguments[0].image;
            $color = arguments[0].color;
        }

        $color = "betted-player__priceness-line--" + $color;

        var html = `<div class="betted-player">
            <img src="` + $img + `" alt="player" class="betted-player__avatar">
            <span class="betted-player__priceness-line ` + $color + `"></span>
        </div>`;
        return html;
    }
}