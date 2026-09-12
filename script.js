document.addEventListener("DOMContentLoaded", function () {

    const SAVE_KEY = "pizzaSpinSave";
    const BACKUP_KEY = "pizzaSpinBackup";
    const SAVE_VERSION = 3;

    // =========================
    // ELEMENTEN
    // =========================

    const pizza = document.getElementById("pizza");
    const pepperoniElement = document.getElementById("pepperoni");
    const spinsElement = document.getElementById("spins");
    const comboElement = document.getElementById("combo");

    const perSpinElement = document.getElementById("perSpin");
    const perSecondElement = document.getElementById("perSecond");

    const upgradeList = document.getElementById("upgradeList");
    const resetButton = document.getElementById("resetButton");

    const levelElement = document.getElementById("level");
    const xpElement = document.getElementById("xp");
    const xpNeededElement = document.getElementById("xpNeeded");
    const xpProgressElement = document.getElementById("xpProgress");

    const achievementList = document.getElementById("achievementList");

    const achievementPopup = document.getElementById("achievementPopup");
    const popupText = document.getElementById("popupText");


    // =========================
    // NIEUW SPEL
    // =========================

    function createNewGame() {
        return {
            version: SAVE_VERSION,

            pepperoni: 0,
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

            achievements: {
                firstSpin: false,
                hundredSpins: false,
                thousandSpins: false,
                tenThousandSpins: false,

                millionPepperoni: false,
                tenMillionPepperoni: false,

                tenPerSecond: false,
                hundredPerSecond: false,
                thousandPerSecond: false,

                levelTen: false
            }
        };
    }

    let game = createNewGame();


    // =========================
    // COMBO
    // =========================

    let combo = 0;
    let comboTimer = null;

    const MAX_COMBO = 100;
    const COMBO_TIMEOUT = 3000;


    function increaseCombo() {

        // Als combo nog niet maximaal is
        if (combo < MAX_COMBO) {
            combo++;
        }

        updateComboDisplay();

        // Oude timer stoppen
        if (comboTimer !== null) {
            clearTimeout(comboTimer);
        }

        // Nieuwe timer starten
        comboTimer = setTimeout(function () {

            combo = 0;

            updateComboDisplay();

            comboTimer = null;

        }, COMBO_TIMEOUT);
    }


    function updateComboDisplay() {

        if (!comboElement) {
            return;
        }

        if (combo >= MAX_COMBO) {
            comboElement.textContent = "MAX!";
        } else {
            comboElement.textContent = combo;
        }
    }


    // =========================
    // UPGRADES
    // =========================

    const upgradeData = {

        pepperoniPower: {
            name: "Pepperoni Power",
            description: "+1 pepperoni per klik",
            baseCost: 10,
            effect: 1,
            type: "click"
        },

        bigPizza: {
            name: "Big Pizza",
            description: "+2 pepperoni per klik",
            baseCost: 50,
            effect: 2,
            type: "click"
        },

        fastSpin: {
            name: "Turbo Click",
            description: "+5 pepperoni per klik",
            baseCost: 150,
            effect: 5,
            type: "click"
        },

        autoPizza: {
            name: "Auto Pizza",
            description: "+1 pepperoni per seconde",
            baseCost: 100,
            effect: 1,
            type: "second"
        },

        pizzaRobot: {
            name: "Pizza Robot",
            description: "+5 pepperoni per seconde",
            baseCost: 500,
            effect: 5,
            type: "second"
        },

        pizzaChef: {
            name: "Pizza Chef",
            description: "+20 pepperoni per seconde",
            baseCost: 2000,
            effect: 20,
            type: "second"
        },

        pizzaFactory: {
            name: "Pizza Factory",
            description: "+100 pepperoni per seconde",
            baseCost: 10000,
            effect: 100,
            type: "second"
        },

        pizzaShop: {
            name: "Pizza Shop",
            description: "+500 pepperoni per seconde",
            baseCost: 50000,
            effect: 500,
            type: "second"
        },

        pizzaEmpire: {
            name: "Pizza Empire",
            description: "+2.500 pepperoni per seconde",
            baseCost: 250000,
            effect: 2500,
            type: "second"
        },

        pizzaRocket: {
            name: "Pizza Rocket",
            description: "+10.000 pepperoni per seconde",
            baseCost: 1000000,
            effect: 10000,
            type: "second"
        },

        spacePizza: {
            name: "Space Pizza",
            description: "+50.000 pepperoni per seconde",
            baseCost: 5000000,
            effect: 50000,
            type: "second"
        },

        pizzaGod: {
            name: "Pizza God",
            description: "+250.000 pepperoni per seconde",
            baseCost: 25000000,
            effect: 250000,
            type: "second"
        }
    };


    // =========================
    // GETTERS
    // =========================

    function getPerClick() {

        let amount = 1;

        for (const key in upgradeData) {

            const upgrade = upgradeData[key];

            if (upgrade.type === "click") {

                amount +=
                    game.upgrades[key] *
                    upgrade.effect;
            }
        }

        return amount;
    }


    function getPerSecond() {

        let amount = 0;

        for (const key in upgradeData) {

            const upgrade = upgradeData[key];

            if (upgrade.type === "second") {

                amount +=
                    game.upgrades[key] *
                    upgrade.effect;
            }
        }

        return amount;
    }


    function getUpgradeCost(key) {

        const upgrade = upgradeData[key];

        const level = game.upgrades[key];

        return Math.floor(
            upgrade.baseCost *
            Math.pow(1.15, level)
        );
    }


    // =========================
    // NUMMERS WEERGEVEN
    // =========================

    function formatNumber(number) {

        if (number < 1000) {
            return Math.floor(number).toString();
        }

        if (number < 1000000) {
            return (
                (number / 1000).toFixed(1)
                .replace(".0", "")
                + "K"
            );
        }

        if (number < 1000000000) {
            return (
                (number / 1000000).toFixed(1)
                .replace(".0", "")
                + "M"
            );
        }

        if (number < 1000000000000) {
            return (
                (number / 1000000000).toFixed(1)
                .replace(".0", "")
                + "B"
            );
        }

        return (
            (number / 1000000000000).toFixed(1)
            .replace(".0", "")
            + "T"
        );
    }


    // =========================
    // XP EN LEVEL
    // =========================

    function getXPNeeded() {

        return Math.floor(
            100 *
            Math.pow(1.25, game.level - 1)
        );
    }


    function addXP(amount) {

        game.xp += amount;

        let levelUp = false;

        while (game.xp >= getXPNeeded()) {

            game.xp -= getXPNeeded();

            game.level++;

            levelUp = true;
        }

        if (levelUp) {

            showAchievementPopup(
                "⭐ LEVEL UP! Level " +
                game.level
            );
        }
    }


    // =========================
    // ACHIEVEMENTS
    // =========================

    const achievementData = {

        firstSpin: {
            name: "First Click",
            description: "Klik voor de eerste keer op de pizza.",
            check: function () {
                return game.spins >= 1;
            }
        },

        hundredSpins: {
            name: "100 Clicks",
            description: "Klik 100 keer op de pizza.",
            check: function () {
                return game.spins >= 100;
            }
        },

        thousandSpins: {
            name: "1.000 Clicks",
            description: "Klik 1.000 keer op de pizza.",
            check: function () {
                return game.spins >= 1000;
            }
        },

        tenThousandSpins: {
            name: "10.000 Clicks",
            description: "Klik 10.000 keer op de pizza.",
            check: function () {
                return game.spins >= 10000;
            }
        },

        millionPepperoni: {
            name: "Millionaire",
            description: "Verdien 1 miljoen pepperoni.",
            check: function () {
                return game.pepperoni >= 1000000;
            }
        },

        tenMillionPepperoni: {
            name: "Pizza Tycoon",
            description: "Verdien 10 miljoen pepperoni.",
            check: function () {
                return game.pepperoni >= 10000000;
            }
        },

        tenPerSecond: {
            name: "Pizza Machine",
            description: "Bereik 10 pepperoni per seconde.",
            check: function () {
                return getPerSecond() >= 10;
            }
        },

        hundredPerSecond: {
            name: "Pizza Factory",
            description: "Bereik 100 pepperoni per seconde.",
            check: function () {
                return getPerSecond() >= 100;
            }
        },

        thousandPerSecond: {
            name: "Pizza Empire",
            description: "Bereik 1.000 pepperoni per seconde.",
            check: function () {
                return getPerSecond() >= 1000;
            }
        },

        levelTen: {
            name: "Level 10",
            description: "Bereik level 10.",
            check: function () {
                return game.level >= 10;
            }
        }
    };


    function showAchievementPopup(text) {

        if (!achievementPopup || !popupText) {
            return;
        }

        popupText.textContent = text;

        achievementPopup.classList.add("show");

        setTimeout(function () {

            achievementPopup.classList.remove("show");

        }, 1500);
    }


    function checkAchievements() {

        for (const key in achievementData) {

            const achievement =
                achievementData[key];

            if (
                !game.achievements[key] &&
                achievement.check()
            ) {

                game.achievements[key] = true;

                showAchievementPopup(
                    "🏆 " +
                    achievement.name
                );
            }
        }
    }


    function renderAchievements() {

        if (!achievementList) {
            return;
        }

        achievementList.innerHTML = "";

        for (const key in achievementData) {

            const achievement =
                achievementData[key];

            const unlocked =
                game.achievements[key];

            const item =
                document.createElement("div");

            item.className =
                "achievement" +
                (unlocked ? " unlocked" : "");

            item.innerHTML = `
                <strong>
                    ${unlocked ? "🏆" : "🔒"}
                    ${achievement.name}
                </strong>
                <p>
                    ${achievement.description}
                </p>
            `;

            achievementList.appendChild(item);
        }
    }


    // =========================
    // SHOP
    // =========================

    function renderShop() {

        if (!upgradeList) {
            return;
        }

        upgradeList.innerHTML = "";

        for (const key in upgradeData) {

            const upgrade =
                upgradeData[key];

            const level =
                game.upgrades[key];

            const cost =
                getUpgradeCost(key);

            const card =
                document.createElement("div");

            card.className = "upgrade-card";

            card.innerHTML = `
                <div class="upgrade-info">
                    <h3>${upgrade.name}</h3>

                    <p>
                        ${upgrade.description}
                    </p>

                    <small>
                        Level: ${level}
                    </small>
                </div>

                <button
                    class="upgrade-button"
                    data-upgrade="${key}"
                    ${game.pepperoni < cost ? "disabled" : ""}
                >
                    🍕 ${formatNumber(cost)}
                </button>
            `;

            upgradeList.appendChild(card);
        }
    }


    // =========================
    // UPGRADE KOPEN
    // =========================

    upgradeList.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".upgrade-button"
                );

            if (!button) {
                return;
            }

            const key =
                button.dataset.upgrade;

            const cost =
                getUpgradeCost(key);

            if (game.pepperoni < cost) {
                return;
            }

            game.pepperoni -= cost;

            game.upgrades[key]++;

            addXP(20);

            saveGame();

            updateGame();
        }
    );


    // =========================
    // PIZZA KLIKKEN
    // =========================

    pizza.addEventListener(
        "click",
        function () {

            const amount =
                getPerClick();

            game.pepperoni += amount;

            game.spins++;

            // COMBO
            increaseCombo();

            // XP
            addXP(5);

            // Pizza animatie
            pizza.classList.remove(
                "pizza-click"
            );

            void pizza.offsetWidth;

            pizza.classList.add(
                "pizza-click"
            );

            updateGame();
        }
    );


    // =========================
    // TOUCH EFFECT
    // =========================

    pizza.addEventListener(
        "touchstart",
        function () {

            pizza.style.transform =
                "scale(0.95)";
        }
    );


    pizza.addEventListener(
        "touchend",
        function () {

            pizza.style.transform =
                "";
        }
    );


    // =========================
    // SAVE
    // =========================

    function saveGame() {

        try {

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


    function saveBackup() {

        try {

            localStorage.setItem(
                BACKUP_KEY,
                JSON.stringify(game)
            );

        } catch (error) {

            console.error(
                "Backup opslaan mislukt:",
                error
            );
        }
    }


    // =========================
    // LOAD
    // =========================

    function loadGame() {

        try {

            const saved =
                localStorage.getItem(
                    SAVE_KEY
                );

            if (!saved) {
                return;
            }

            const parsed =
                JSON.parse(saved);

            if (!parsed) {
                return;
            }

            game = {
                ...createNewGame(),
                ...parsed,

                upgrades: {
                    ...createNewGame().upgrades,
                    ...(parsed.upgrades || {})
                },

                achievements: {
                    ...createNewGame().achievements,
                    ...(parsed.achievements || {})
                }
            };

        } catch (error) {

            console.error(
                "Laden mislukt:",
                error
            );
        }
    }


    // =========================
    // UPDATE GAME
    // =========================

    function updateGame() {

        if (pepperoniElement) {
            pepperoniElement.textContent =
                formatNumber(game.pepperoni);
        }

        if (spinsElement) {
            spinsElement.textContent =
                formatNumber(game.spins);
        }

        if (perSpinElement) {
            perSpinElement.textContent =
                formatNumber(getPerClick());
        }

        if (perSecondElement) {
            perSecondElement.textContent =
                formatNumber(getPerSecond());
        }

        if (levelElement) {
            levelElement.textContent =
                game.level;
        }

        if (xpElement) {
            xpElement.textContent =
                Math.floor(game.xp);
        }

        if (xpNeededElement) {
            xpNeededElement.textContent =
                getXPNeeded();
        }

        if (xpProgressElement) {

            const percentage =
                Math.min(
                    100,
                    (game.xp / getXPNeeded()) * 100
                );

            xpProgressElement.style.width =
                percentage + "%";
        }

        updateComboDisplay();

        renderShop();

        checkAchievements();

        renderAchievements();

        saveGame();
    }


    // =========================
    // AUTO PRODUCTIE
    // =========================

    setInterval(
        function () {

            const perSecond =
                getPerSecond();

            if (perSecond <= 0) {
                return;
            }

            game.pepperoni +=
                perSecond / 10;

            updateGame();

        },
        100
    );


    // =========================
    // AUTO SAVE
    // =========================

    setInterval(
        function () {

            saveGame();
            saveBackup();

        },
        5000
    );


    // =========================
    // RESET
    // =========================

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Weet je zeker dat je alle voortgang wilt verwijderen?"
                    );

                if (!confirmed) {
                    return;
                }

                game =
                    createNewGame();

                combo = 0;

                if (comboTimer !== null) {

                    clearTimeout(
                        comboTimer
                    );

                    comboTimer = null;
                }

                localStorage.removeItem(
                    SAVE_KEY
                );

                localStorage.removeItem(
                    BACKUP_KEY
                );

                updateGame();
            }
        );
    }


    // =========================
    // BIJ PAGINA VERLATEN
    // =========================

    window.addEventListener(
        "beforeunload",
        function () {

            saveGame();
            saveBackup();
        }
    );


    // =========================
    // START
    // =========================

    loadGame();

    updateGame();

});
