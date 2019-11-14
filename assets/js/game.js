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


const game_timer = new class {
    constructor() {
        this.timers = [];
    }

    setTimer(name = null, settings = {}) {
        // Create a Timer block
        var timerArray = this.createTimerBlock(settings); // returns array of elements for changing
        // Set update
        this.timers[name] = [timerArray, settings];
        // Starting up the timer
        return this.getTimerUpdate(name);
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
        const $this = $(settings.insteadOf).replaceWith(HTML_parsed);

        return [forSeconds, forMicroSeconds];
    }

    __Timer(startWith = 0, updatees = [], divider = null) {
        var seconds = startWith;
        var ms_able = true;

        function ms_update(int = 0) {
            if (ms_able) $(updatees[1]).html(int);
        }

        function ms_countdown() {
            return new Promise(async (resolve) => {
                for (let index = 9; index >= 0; index--) {
                    ms_update(index);
                    await timeout(100);
                    if (index < 9) resolve();
                }
            });
        }

        let issue = new Promise((resolve, reject) => {
            // Starting out
            ms_countdown();
            seconds--;
            $(updatees[0]).html(seconds + divider);
            // Seconds
            var interval = setInterval(async () => {
                // Counting down
                seconds--;
                ms_countdown();
                // Updating
                $(updatees[0]).html(seconds + divider);

                // Resolving
                if (seconds == 0) {
                    // Clear interval
                    clearInterval(interval);
                    // Wait for microSeconds
                    await timeout(1000);
                    ms_update(0);
                    ms_able = false;
                    // Resolve
                    resolve();
                }
            }, 1000);
        });
        
        return issue;
    }

    begin(name) {       
        if (!Array.isArray(this.timers[name])) throw "Can't handle this";

        var settings = this.timers[name][1];
        var timerArray = this.timers[name][0];

        this.timers[name] = new Promise(async (resolve) => {
            await this.__Timer(settings.startWith, timerArray, settings.divider);
            resolve();
        });
    }

    async getTimerUpdate(name) {
        if (this.timers[name] != undefined)
            return await this.timers[name];
        else
            throw "Wrong name (" + name + ")";
    }
};

game_timer.setTimer("jopa", {
    title: "Ends in:",
    insteadOf: "#timer32",
    startWith: 9,
    orientaion: "right",
    divider: ".",
});
//game_timer.begin("jopa");

console.log(game_timer.getTimerUpdate("jopa"));