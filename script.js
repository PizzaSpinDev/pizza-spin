document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // PIZZA SPIN V3
    // STAP 2A - COMBO BASIS
    // =========================================================

    const SAVE_KEY = "pizzaSpinSave";
    const SAVE_BACKUP_KEY = "pizzaSpinSaveBackup";
    const SAVE_VERSION = 3;


    // =========================================================
    // DOM ELEMENTEN
    // =========================================================

    const pizza = document.getElementById("pizza");

    const pepperoniElement =
        document.getElementById("pepperoni");

    const spinsElement =
        document.getElementById("spins");

    const comboElement =
        document.getElementById("combo");

    const perSpinElement =
        document.getElementById("perSpin");

    const perSecondElement =
        document.getElementById("perSecond");

    const upgradeList =
        document.getElementById("upgradeList");

    const resetButton =
        document.getElementById("resetButton");

    const levelElement =
        document.getElementById("level");

    const xpElement =
        document.getElementById("xp");

    const xpNeededElement =
        document.getElementById("xpNeeded");

    const xpProgress =
        document.getElementById("xpProgress");

    const achievementList =
        document.getElementById("achievementList");

    const achievementPopup =
        document.getElementById("achievementPopup");

    const popupText =
        document.getElementById("popupText");


    // =========================================================
    // CONTROLEREN
    // =========================================================

    if (!pizza) {
        console.error("Pizza element #pizza bestaat niet.");
        return;
    }


    // =========================================================
    // NIEUW SPEL
    // =========================================================

    function createNewGame() {

        return {
            saveVersion: SAVE_VERSION,

            pepperoni: 0,

            // Voor V3 gebruiken we spins als click-teller
            spins: 0,

            xp: 0,
            level: 1,

            upgrades: {
                pepperoniPower: 0,
                bigPizza: 0,
                fastSpin: 0,

                autoPizza: 0,
                pizzaRobot: 0,
                pizzaChef: 0,
                pizzaFactory: 0,
                pizzaShop: 0,
                pizzaEmpire: 0,
                pizzaRocket: 0,
                spacePizza: 0,
                pizzaGod: 0
            },

            achievements: {}
        };
    }


    let game = createNewGame();


    // =========================================================
    // COMBO
    // =========================================================

    let combo = 0;


    // =========================================================
    // UPGRADES
    // =========================================================

    const upgrades = {

        pepperoniPower: {
            name: "Pepperoni Power",
            description: "+1 pepperoni per click",
            baseCost: 10,
            type: "click",
            value: 1
        },

        bigPizza: {
            name: "Big Pizza",
            description: "+2 pepperoni per click",
            baseCost: 50,
            type: "click",
            value: 2
        },

        fastSpin: {
            name: "Turbo Click",
            description: "+5 pepperoni per click",
            baseCost: 150,
            type: "click",
            value: 5
        },

        autoPizza: {
            name: "Auto Pizza",
            description: "+1 pepperoni per seconde",
            baseCost: 100,
            type: "second",
            value: 1
        },

        pizzaRobot: {
            name: "Pizza Robot",
            description: "+5 pepperoni per seconde",
            baseCost: 500,
            type: "second",
            value: 5
        },

        pizzaChef: {
            name: "Pizza Chef",
            description: "+20 pepperoni per seconde",
            baseCost: 2000,
            type: "second",
            value: 20
        },

        pizzaFactory: {
            name: "Pizza Factory",
            description: "+100 pepperoni per seconde",
            baseCost: 10000,
            type: "second",
            value: 100
        },

        pizzaShop: {
            name: "Pizza Shop",
            description: "+500 pepperoni per seconde",
            baseCost: 50000,
            type: "second",
            value: 500
        },

        pizzaEmpire: {
            name: "Pizza Empire",
            description: "+2.500 pepperoni per seconde",
            baseCost: 250000,
            type: "second",
            value: 2500
        },

        pizzaRocket: {
            name: "Pizza Rocket",
            description: "+10.000 pepperoni per seconde",
            baseCost: 1000000,
            type: "second",
            value: 10000
        },

        spacePizza: {
            name: "Space Pizza",
            description: "+50.000 pepperoni per seconde",
            baseCost: 5000000,
            type: "second",
            value: 50000
        },

        pizzaGod: {
            name: "Pizza God",
            description: "+250.000 pepperoni per seconde",
            baseCost: 25000000,
            type: "second",
            value: 250000
        }
    };


    // =========================================================
    // ACHIEVEMENTS
    // =========================================================

    const achievements = {

        firstSpin: {
            name: "First Bite",
            description: "Klik 1 keer op de pizza.",
            requirement: function () {
                return game.spins >= 1;
            }
        },

        hundredSpins: {
            name: "Pizza Lover",
            description: "Klik 100 keer op de pizza.",
            requirement: function () {
                return game.spins >= 100;
            }
        },

        thousandSpins: {
            name: "Pizza Addict",
            description: "Klik 1.000 keer op de pizza.",
            requirement: function () {
                return game.spins >= 1000;
            }
        },

        tenThousandSpins: {
            name: "Pizza Master",
            description: "Klik 10.000 keer op de pizza.",
            requirement: function () {
                return game.spins >= 10000;
            }
        },

        millionPepperoni: {
            name: "Pepperoni Millionaire",
            description: "Verdien 1 miljoen pepperoni.",
            requirement: function () {
                return game.pepperoni >= 1000000;
            }
        },

        tenMillionPepperoni: {
            name: "Pepperoni Tycoon",
            description: "Verdien 10 miljoen pepperoni.",
            requirement: function () {
                return game.pepperoni >= 10000000;
            }
        },

        tenPerSecond: {
            name: "Pizza Machine",
            description: "Bereik 10 pepperoni per seconde.",
            requirement: function () {
                return getPerSecond() >= 10;
            }
        },

        hundredPerSecond: {
            name: "Pizza Factory",
            description: "Bereik 100 pepperoni per seconde.",
            requirement: function () {
                return getPerSecond() >= 100;
            }
        },

        thousandPerSecond: {
            name: "Pizza Empire",
            description: "Bereik 1.000 pepperoni per seconde.",
            requirement: function () {
                return getPerSecond() >= 1000;
            }
        },

        levelTen: {
            name: "Level 10",
            description: "Bereik level 10.",
            requirement: function () {
                return game.level >= 10;
            }
        }
    };


    // =========================================================
    // GETAL FORMATTEREN
    // =========================================================

    function formatNumber(number) {

        if (number < 1000) {
            return Math.floor(number).toString();
        }

        if (number < 1000000) {
            return (number / 1000).toFixed(1) + "K";
        }

        if (number < 1000000000) {
            return (number / 1000000).toFixed(1) + "M";
        }

        if (number < 1000000000000) {
            return (number / 1000000000).toFixed(1) + "B";
        }

        return (number / 1000000000000).toFixed(1) + "T";
    }


    // =========================================================
    // CLICK POWER
    // =========================================================

    function getPerClick() {

        let amount = 1;

        amount +=
            game.upgrades.pepperoniPower *
            upgrades.pepperoniPower.value;

        amount +=
            game.upgrades.bigPizza *
            upgrades.bigPizza.value;

        amount +=
            game.upgrades.fastSpin *
            upgrades.fastSpin.value;

        return amount;
    }


    // =========================================================
    // AUTO PRODUCTIE
    // =========================================================

    function getPerSecond() {

        let amount = 0;

        amount +=
            game.upgrades.autoPizza *
            upgrades.autoPizza.value;

        amount +=
            game.upgrades.pizzaRobot *
            upgrades.pizzaRobot.value;

        amount +=
            game.upgrades.pizzaChef *
            upgrades.pizzaChef.value;

        amount +=
            game.upgrades.pizzaFactory *
            upgrades.pizzaFactory.value;

        amount +=
            game.upgrades.pizzaShop *
            upgrades.pizzaShop.value;

        amount +=
            game.upgrades.pizzaEmpire *
            upgrades.pizzaEmpire.value;

        amount +=
            game.upgrades.pizzaRocket *
            upgrades.pizzaRocket.value;

        amount +=
            game.upgrades.spacePizza *
            upgrades.spacePizza.value;

        amount +=
            game.upgrades.pizzaGod *
            upgrades.pizzaGod.value;

        return amount;
    }


    // =========================================================
    // UPGRADE KOSTEN
    // =========================================================

    function getUpgradeCost(upgradeId) {

        const upgrade = upgrades[upgradeId];

        if (!upgrade) {
            return Infinity;
        }

        const owned =
            game.upgrades[upgradeId] || 0;

        return Math.floor(
            upgrade.baseCost *
            Math.pow(1.15, owned)
        );
    }


    // =========================================================
    // XP
    // =========================================================

    function getXPNeeded() {

        return Math.floor(
            100 *
            Math.pow(1.35, game.level - 1)
        );
    }


    function addXP(amount) {

        if (amount <= 0) {
            return;
        }

        game.xp += amount;

        let leveledUp = false;

        while (
            game.xp >= getXPNeeded()
        ) {

            game.xp -= getXPNeeded();

            game.level++;

            leveledUp = true;
        }

        if (leveledUp) {
            showLevelUp();
        }

        checkAchievements();
    }


    // =========================================================
    // LEVEL UP
    // =========================================================

    function showLevelUp() {

        if (
            !achievementPopup ||
            !popupText
        ) {
            return;
        }

        popupText.textContent =
            "🎉 LEVEL UP! Level " +
            game.level;

        achievementPopup.classList.add("show");

        setTimeout(function () {

            achievementPopup.classList.remove("show");

        }, 1500);
    }


    // =========================================================
    // ACHIEVEMENTS CONTROLEREN
    // =========================================================

    function checkAchievements() {

        for (
            const achievementId in achievements
        ) {

            const achievement =
                achievements[achievementId];

            if (
                !game.achievements[achievementId] &&
                achievement.requirement()
            ) {

                game.achievements[achievementId] =
                    true;

                showAchievement(
                    achievement.name
                );
            }
        }

        renderAchievements();
    }


    // =========================================================
    // ACHIEVEMENT POPUP
    // =========================================================

    function showAchievement(name) {

        if (
            !achievementPopup ||
            !popupText
        ) {
            return;
        }

        popupText.textContent =
            "🏆 Achievement: " +
            name;

        achievementPopup.classList.add("show");

        setTimeout(function () {

            achievementPopup.classList.remove("show");

        }, 1800);
    }


    // =========================================================
    // SHOP MAKEN
    // =========================================================

    function renderUpgrades() {

        if (!upgradeList) {
            return;
        }

        upgradeList.innerHTML = "";

        for (
            const upgradeId in upgrades
        ) {

            const upgrade =
                upgrades[upgradeId];

            const owned =
                game.upgrades[upgradeId] || 0;

            const cost =
                getUpgradeCost(upgradeId);

            const card =
                document.createElement("div");

            card.className =
                "upgrade";

            const title =
                document.createElement("h3");

            title.textContent =
                upgrade.name;

            const description =
                document.createElement("p");

            description.textContent =
                upgrade.description;

            const levelText =
                document.createElement("p");

            levelText.textContent =
                "Level: " + owned;

            const button =
                document.createElement("button");

            button.textContent =
                "Koop voor " +
                formatNumber(cost) +
                " 🍕";

            if (
                game.pepperoni < cost
            ) {

                button.disabled = true;
            }

            button.addEventListener(
                "click",
                function () {

                    buyUpgrade(upgradeId);

                }
            );

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(levelText);
            card.appendChild(button);

            upgradeList.appendChild(card);
        }
    }


    // =========================================================
    // UPGRADE KOPEN
    // =========================================================

    function buyUpgrade(upgradeId) {

        const cost =
            getUpgradeCost(upgradeId);

        if (
            game.pepperoni < cost
        ) {
            return;
        }

        game.pepperoni -= cost;

        game.upgrades[upgradeId]++;

        addXP(10);

        saveGame();

        updateGame();
    }


    // =========================================================
    // ACHIEVEMENTS RENDEREN
    // =========================================================

    function renderAchievements() {

        if (!achievementList) {
            return;
        }

        achievementList.innerHTML = "";

        for (
            const achievementId in achievements
        ) {

            const achievement =
                achievements[achievementId];

            const unlocked =
                !!game.achievements[
                    achievementId
                ];

            const card =
                document.createElement("div");

            card.className =
                "achievement";

            if (unlocked) {
                card.classList.add("unlocked");
            }

            const title =
                document.createElement("h3");

            title.textContent =
                unlocked
                    ? "🏆 " + achievement.name
                    : "🔒 " + achievement.name;

            const description =
                document.createElement("p");

            description.textContent =
                achievement.description;

            card.appendChild(title);
            card.appendChild(description);

            achievementList.appendChild(card);
        }
    }


    // =========================================================
    // CLICK EFFECT
    // =========================================================

    function clickEffect(amount) {

        const rect =
            pizza.getBoundingClientRect();

        const text =
            document.createElement("div");

        text.textContent =
            "+" + formatNumber(amount);

        text.style.position =
            "fixed";

        text.style.left =
            (rect.left + rect.width / 2) +
            "px";

        text.style.top =
            (rect.top + rect.height / 2) +
            "px";

        text.style.pointerEvents =
            "none";

        text.style.fontWeight =
            "bold";

        text.style.fontSize =
            "22px";

        text.style.zIndex =
            "9999";

        text.style.transform =
            "translate(-50%, -50%)";

        text.style.transition =
            "all 0.7s ease";

        document.body.appendChild(text);

        setTimeout(function () {

            text.style.transform =
                "translate(-50%, -100px)";

            text.style.opacity =
                "0";

        }, 20);

        setTimeout(function () {

            text.remove();

        }, 750);
    }


    // =========================================================
    // PIZZA KLIKKEN
    // =========================================================

    pizza.addEventListener(
        "click",
        function () {

            const amount =
                getPerClick();

            game.pepperoni +=
                amount;

            game.spins++;

            // COMBO +1
            combo++;

            addXP(5);

            clickEffect(amount);

            pizza.classList.remove(
                "pizza-click"
            );

            // Forceer opnieuw starten van animatie
            void pizza.offsetWidth;

            pizza.classList.add(
                "pizza-click"
            );

            updateGame();

        }
    );


    // =========================================================
    // TOUCH / MOBIEL
    // =========================================================

    pizza.addEventListener(
        "touchstart",
        function () {

            pizza.style.transform =
                "scale(0.95)";

        },
        {
            passive: true
        }
    );


    pizza.addEventListener(
        "touchend",
        function () {

            pizza.style.transform =
                "";

        },
        {
            passive: true
        }
    );


    // =========================================================
    // RESET
    // =========================================================

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Weet je zeker dat je helemaal opnieuw wilt beginnen?"
                    );

                if (!confirmed) {
                    return;
                }

                game =
                    createNewGame();

                combo = 0;

                saveGame();

                updateGame();
            }
        );
    }


    // =========================================================
    // OPSLAAN
    // =========================================================

    function saveGame() {

        try {

            localStorage.setItem(
                SAVE_BACKUP_KEY,
                JSON.stringify(game)
            );

            localStorage.setItem(
                SAVE_KEY,
                JSON.stringify(game)
            );

        } catch (error) {

            console.error(
                "Opslaan mislukt:",
                error
            );
        }
    }


    // =========================================================
    // LADEN
    // =========================================================

    function loadGame() {

        try {

            let savedGame =
                localStorage.getItem(
                    SAVE_KEY
                );

            if (!savedGame) {

                savedGame =
                    localStorage.getItem(
                        SAVE_BACKUP_KEY
                    );
            }

            if (!savedGame) {
                return;
            }

            const parsed =
                JSON.parse(savedGame);

            const freshGame =
                createNewGame();

            game = {
                ...freshGame,
                ...parsed,

                upgrades: {
                    ...freshGame.upgrades,
                    ...(parsed.upgrades || {})
                },

                achievements: {
                    ...freshGame.achievements,
                    ...(parsed.achievements || {})
                }
            };

            game.saveVersion =
                SAVE_VERSION;

        } catch (error) {

            console.error(
                "Laden mislukt:",
                error
            );

            game =
                createNewGame();
        }
    }


    // =========================================================
    // GAME UI UPDATEN
    // =========================================================

    function updateGame() {

        if (pepperoniElement) {

            pepperoniElement.textContent =
                formatNumber(
                    game.pepperoni
                );
        }

        if (spinsElement) {

            spinsElement.textContent =
                formatNumber(
                    game.spins
                );
        }

        // COMBO WEERGEVEN
        if (comboElement) {

            comboElement.textContent =
                combo;
        }

        if (perSpinElement) {

            perSpinElement.textContent =
                formatNumber(
                    getPerClick()
                );
        }

        if (perSecondElement) {

            perSecondElement.textContent =
                formatNumber(
                    getPerSecond()
                );
        }

        if (levelElement) {

            levelElement.textContent =
                game.level;
        }

        const xpNeeded =
            getXPNeeded();

        if (xpElement) {

            xpElement.textContent =
                formatNumber(
                    game.xp
                );
        }

        if (xpNeededElement) {

            xpNeededElement.textContent =
                formatNumber(
                    xpNeeded
                );
        }

        if (xpProgress) {

            const percentage =
                Math.min(
                    100,
                    (
                        game.xp /
                        xpNeeded
                    ) * 100
                );

            xpProgress.style.width =
                percentage + "%";
        }

        renderUpgrades();

        renderAchievements();

        checkAchievements();

        saveGame();
    }


    // =========================================================
    // AUTOMATISCHE PEPPERONI
    // =========================================================

    setInterval(
        function () {

            const amount =
                getPerSecond();

            if (amount <= 0) {
                return;
            }

            game.pepperoni +=
                amount;

            addXP(
                Math.floor(amount / 2)
            );

            updateGame();

        },
        1000
    );


    // =========================================================
    // AUTOMATISCH OPSLAAN
    // =========================================================

    setInterval(
        function () {

            saveGame();

        },
        5000
    );


    // =========================================================
    // PAGINA VERLATEN
    // =========================================================

    window.addEventListener(
        "beforeunload",
        function () {

            saveGame();

        }
    );


    // =========================================================
    // START GAME
    // =========================================================

    loadGame();

    updateGame();

});
