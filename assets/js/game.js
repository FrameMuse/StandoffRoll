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
    async stage(stage = "idle", options = {}) {
        var game_inner = $(".stdf2-game__inner");
        switch (stage) {
            case "idle":
                var html = `<div class="stdf2-game__details">
                        <div class="stdf2-game-aspect">
                            <span class="stdf2-game-aspect__name">Game</span>
                            <span class="stdf2-game-aspect__value">#07891</span>
                        </div>
                        <div class="stdf2-game-aspect">
                            <span class="stdf2-game-aspect__name">Game bank</span>
                            <span class="stdf2-game-aspect__value">8 960 $</span>
                        </div>
                        <div id="timer32"></div>
                    </div>
                    <div class="stdf2-game__details">
                        <div class="stdf2-game-progress"></div>
                        <button class="stdf2-game__deposit">Bet your skins</button>
                    </div>
                    <div class="stdf2-game__details stdf2-game__details--centred">
                        <div class="stdf2-game-aspect">
                            <span class="stdf2-game-aspect__name gray">You betted</span>
                            <span class="stdf2-game-aspect__value">3 skins</span>
                        </div>
                        <div class="stdf2-game-aspect">
                            <span class="stdf2-game-aspect__name gray">Your chance</span>
                            <span class="stdf2-game-aspect__value">3 %</span>
                        </div>
                    </div>`;
                game_inner
                    .attr("class", "stdf2-game__inner stdf2-game--is-" + stage)
                    .empty()
                    .append(html);
                // Reconstructing elements
                stdf2_game_progress.build();
                stdf2_game_progress.progress = 10;
                stdf2_game_progress.max = 12;
                stdf2_game_timer.setTimer({
                    title: "Ends in:",
                    startWith: 9,
                    orientaion: "right",
                    divider: ".",
                });
                break;
            
            case "showing-winner":
                var html = `<div class="stdf2-winner">
                        <div class="stdf2-winner__header">` + options.nickname + `</div>
                        <div class="stdf2-winner__game-info">
                            <div class="stdf2-winner__detail">
                                <img src="assets/img/icons/dice.png" alt="" class="stdf2-winner__image">
                                <span>Chance: ` + options.chance + `%</span>
                            </div>
                            <img src="` + options.avatar + `" alt="player" class="stdf2-winner__avatar">
                            <div class="stdf2-winner__detail">
                                <img src="assets/img/icons/ticket.png" alt="" class="stdf2-winner__image">
                                <span>Ticket #` + options.ticket + `</span>
                            </div>
                        </div>
                        <div class="stdf2-winner__benefit">
                            <span class="gray">Nickname has taken</span>
                            <span class="stdf2-winner__benefit--number">` + options.benefit + ` $</span>
                        </div>
                    </div>`;
                game_inner
                    .attr("class", "stdf2-game__inner stdf2-game--is-" + stage)
                    .empty()
                    .append(html);
                break;
            
            case "running":
                
                var html = `<div class="stdf2-game__header">` + options.header + `</div>
                    <div class="stdf2-game__body"></div>
                    <span class="gray"><a href="#ozu">Честная игра</a> / Хэш игры: ` + options.hash + `</span>`;
                
                game_inner
                    .attr("class", "stdf2-game__inner stdf2-game--is-" + stage)
                    .empty()
                    .append(html)
                    .find(".stdf2-game__body")
                    .replaceWith(stdf2_roullete.html);
                this.onRunning();

                stdf2_roullete.default();
                return await stdf2_roullete.move_to_id(10);
                break;

            default:
                return "It doesn't exist";
                break;
        }
    }

    async start() {
        for (let index = 4; index >= 0; index--) {
            stdf2_game_timer.goDownTo(index, true);
            await timeout(1000);
        }
        stdf2_game.onRunning = () => {
            // Нужно обязательно продублировать некоторых юзеров в начале и конце для корректной работы, лучше всего по 20 штук с каждой стороны

            // Это тестовая функция, её не надо использовать
            stdf2_roullete.createBranches(20, true, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            stdf2_roullete.createBranch(false, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));

            // Это тестовая функция, её не надо использовать
            stdf2_roullete.createBranches(20, true, stdf2_roullete.branchHTML({
                image: "assets/img/player3.png",
                color: "purple",
            }));
        };
        await stdf2_game.stage("running", {
            header: "И победителем становится...",
            hash: "09s8g9bfdhgdfgbhf8gdsbfdf9gb9dfusgbsd9fugbdfuy",
        });
        stdf2_game.stage("showing-winner", {
            nickname: "FrameMuse",
            avatar: "assets/img/player4.png",
            // ---------------- \\
            chance: 20,
            ticket: 671,
            benefit: 136782,
        });
        await timeout(5000);
        stdf2_game.stage("idle");
    }
}

$(window).on("load", () => {
    stdf2_game.start();
});