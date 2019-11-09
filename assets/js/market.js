class market_filter {

    isInPriceRange(price = 0, range = {}) {
        return price >= range.from && price <= range.till;
    }

    gather() {
        var data = {
            sort_by: $(".market-sorting__item.menu__item--selected").data("sort_by"),
            pricing: {
                from:
                    $("input[name='market-pricing__from")
                        .val()
                        .multiReplace([" "], "")
                        .intConvert(),
                till:
                    $("input[name='market-pricing__till")
                        .val()
                        .multiReplace([" "], "")
                        .intConvert(),
            },
            search: $("input[name='market-search']").val(),
        };

        return data;
    }

    find_inner() {
        const $this = this;

        var info = this.gather();

        $(".user-skins__item").each(function () {
            var unit_type = $(this).data("type");
            var unit_name = $(this).find(".user-skins__item--title")
                .html()
                .multiReplace(["<span>", "</span>"], "");
            var unit_price = $(this).find(".stdf2-skins__value")
                .html()
                .multiReplace([" ", "P", "Р"], "")
                .replace("$", "")
                .intConvert();

            if (!$this.isInPriceRange(unit_price, info.pricing) || unit_name.search(new RegExp(info.search, 'i')) == -1) {
                $(this).attr("hidden", "");
            } else {
                $(this).removeAttr("hidden");
            }
        });
    }

    find_outer() {
        // Если искать GET запросами
    }
}


const filter = new market_filter();

$(".market__input").change(function() {
    filter.find_inner();
});