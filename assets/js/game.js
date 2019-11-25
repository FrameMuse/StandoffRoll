// StandoffRoll Game

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
                    this.ms_count = 9;
                    this.ms_update(0);
                    resolve();
                }
            }, 100);
        });
    }

    goDownTo(int = 0, microSeconds = false) {
        $(this.updatees[0]).html(int + this.settings.divider);
        if (microSeconds) return this.ms_countdown(); else this.ms_update(0);
    }
};

const stdf2_game_timer = new Timer_by_aspect("#timer32");
stdf2_game_timer.setTimer({
    title: "Ends in:",
    startWith: 9,
    orientaion: "right",
    divider: ".",
});
//game_timer.goDownTo(0, true); // Число до которого нужно дойти

const stdf2_roullete = new spinner(".stdf2-game__body");
const stdf2_game = new class {
    constructor() {
        this.safety("ended");
    }
    async __show(stage, $function = false) {
        var game_inner = ".stdf2-game__inner";
        var game_is = ".stdf2-game--is-";

        $(game_inner).attr("hidden", "");
        $(game_is + stage).removeAttr("hidden");

        if ($function) return await $function();
    }

    async start() {
        for (let index = 4; index >= 0; index--) {
            stdf2_game_timer.goDownTo(index, true);
            await timeout(1000);
        }

        this.onRunning = () => {
            // Нужно обязательно продублировать некоторых юзеров в начале и конце для корректной работы, лучше всего по 20 штук с каждой стороны

            // Это тестовая функция, её не надо использовать
            stdf2_roullete.createBranches(20, true, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranches(60, false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            // Это тестовая функция, её не надо использовать
            stdf2_roullete.createBranches(20, true, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));
        };
        // Start a roullete
        this.edit({
            hash: "asdasdd2d12ojd12897dhyn1289d",
        });
        this.safety("started");
        await this.__show("running", async () => {
            this.onRunning();
            stdf2_roullete.default();
            return await stdf2_roullete.move_to_id(59);
        });
        // Change safety block
        this.safety("ended");
        // Show a winner
        this.edit("winner", {
            nickname: "FrameMuse",
            avatar: "assets/img/player4.png",
            chance: 20,
            ticket: 671,
            benefit: 136782,
        });
        this.__show("showing-winner");
        // Go back to an idle mode after 5s biding
        await timeout(5000);
        this.__show("idle");
    }

    safety(tap) {
        var taps = {
            started: "Игра началась! Вносите предметы!",
            ended: "Игра закончилась!",
        };
        $(".stdf2-game-safety")
            .attr("class", "stdf2-game-safety")
            .addClass("stdf2-game-safety--" + tap)
            .find(".stdf2-game-safety__title")
            .html(taps[tap]);
    }
    
    edit() {
        var unit = "",
            data = {};
        for (const property in arguments) {
            var tag = arguments[property];
            if (typeof tag == "string") unit = tag + '-';
            if (typeof tag == "object") data = tag;
        }
        const $this = (option) => $(`.js-game-${unit}` + option);
        for (const property in data) {
            if ($this(property).is("img"))
                $this(property).attr("src", data[property]);
            else
                $this(property).html(data[property]);
        }
    }
}

$(window).on("load", () => stdf2_game.start());