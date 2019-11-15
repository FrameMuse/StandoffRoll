// StandoffRoll Game

class game {
    // The game scripts
}

class game_progress {

    constructor(name = ".stdf2-game-progress", options = {}) {
        this.name = name.replace('.', '');
        this.options = options;
        this.build();

        if (options != undefined) {
            // Recalculation
            this.max = options["max"];
            this.progress = options["progress"]["amount"];
        } else {
            console.error("Options are not defined");
            return;
        }

        // AutoUpdate
        if (this.options["autoUpdate"]) {
            this.update();
        }
    }

    set max(int = 0) {
        if (int < 0 || int < this.options["progress"]["amount"]) {
            console.error("Wrong max.");
            return;
        }
        this.options["max"] = int;
        this.recalc();

        // AutoUpdate
        if (this.options["autoUpdate"]) {
            this.update();
        }
    }

    set progress(int = 0) {
        if (int < 0 || int > this.options["max"] || int > 100 & this.options["progress"]["mode"] == "percent") {
            console.error("Wrong progress");
            return;
        }

        this.options["progress"]["amount"] = int;
        this.recalc();

        // AutoUpdate
        if (this.options["autoUpdate"]) {
            this.update();
        }
    }

    recalc() {
        var progress = this.options["progress"]["amount"];
        var max = this.options["max"];
        this.options["progress"]["recalc"] = (progress / max) * 100;
    }

    relative(ref) {
        if (ref != null)
            return $("." + this.name + "__" + ref);
        return $("." + this.name);
    }

    build() {
        const name = this.name;
        const build = this.relative();
        addDivTo(build, name + "__status");
        addDivTo(build, name + "__background");
        addDivTo(build, name + "__line");
    }

    __statusUpdate() {
        var progress = this.options["progress"]["amount"];
        var max = this.options["max"];
        var saparator = this.options["text"]["separate"];
        var html = progress + " " + saparator + " " + max;
        this.relative("status").html(html);
    }
    __lineUpdate() {
        var procent = 100 - this.options["progress"]["recalc"];
        $(".stdf2-game-progress__line").css({width: procent + "%"});
    }

    update() {
        this.__statusUpdate();
        this.__lineUpdate();
    }
}

class game_aspect {}


class Timer_by_aspect {
    constructor(insteadOf) {
        this.timer = [];
        this.insteadOf = insteadOf;
        this.ms_count = 9;
        this.ms_promise = true;

        $(window).focus();
        $(window).blur(async () => {
            this.ms_update(0);
            this.ms_promise = false;
            console.log("blured");
            
        });
        $(window).focus(() => {
            this.ms_promise = true;
            console.log("focused");
        });
    }

    setTimer(settings = {}) {
        // Create a Timer block
        var timerArray = this.createTimerBlock(settings); // returns array of elements for changing
        // Set update
        this.timer = [timerArray, settings];
        this.settings = settings;
        this.updatees = timerArray;
        // Starting up the timer
        //return this.getTimerUpdate();
    }

    createTimerBlock(settings = {}) {
        const HTML = `<div class="stdf2-game-aspect">
                        <span class="stdf2-game-aspect__name gray"></span>
                        <div class="stdf2-game-aspect__value"><span></span><small></small></div>
                    </div>`;
        const HTML_parsed = $.parseHTML(HTML);
        if (settings.orientaion == "right") {
            $(HTML_parsed).addClass("stdf2-game-aspect--right");
        }

        // Make the changes
        $(HTML_parsed).find(".stdf2-game-aspect__name").html(settings.title);
        // and find the blocks We need
        var aspect = $(HTML_parsed).find(".stdf2-game-aspect__value");
        var forSeconds = aspect.find("span").html(settings.startWith + settings.divider);
        var forMicroSeconds = aspect.find("small").html(0);

        // Put our build instead of that
        const $this = $(this.insteadOf).replaceWith(HTML_parsed);

        return [forSeconds, forMicroSeconds];
    }

    ms_update(int = 0) {
        $(this.updatees[1]).html(int);
    }

    ms_countdown() {
        return new Promise(async (resolve) => {
            var interval = setInterval(() => {
                this.ms_count--;
                this.ms_update(this.ms_count);
                if ((this.ms_count < 1 && this.ms_promise) || !this.ms_promise) {
                    clearInterval(interval);
                    this.ms_update(0);
                    resolve();
                }
            }, 100);
        });
    }

    goDownTo(int = 0) {
        $(this.updatees[0]).html(int + this.settings.divider);
        return this.ms_countdown();
    }
};

const game_timer = new Timer_by_aspect("#timer32");
game_timer.setTimer({
    title: "Ends in:",
    startWith: 9,
    orientaion: "right",
    divider: ".",
});
game_timer.goDownTo(6); // Число до которого нужно дойти
