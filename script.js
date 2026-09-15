document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // OPSLAAN
    // =========================

    const SAVE_KEY = "pizzaSpinSave";

    function createNewGame() {
        return {
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
                megaRobot: 0,
                pizzaChef: 0,
                pizzaFactory: 0,
                pizzaReactor: 0,
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
    // HTML ELEMENTEN
    // =========================

    const pizza = document.getElementById("pizza");

    const pepperoniElement =
        document.getElementById("pepperoni");

    const spinsElement =
        document.getElementById("spins");

    const comboElement =
        document.getElementById("combo");

    const comboBonusElement =
        document.getElementById("comboBonus");

    const perSpinElement =
        document.getElementById("perSpin");

    const perSecondElement =
        document.getElementById("perSecond");

    const upgradeList =
        document.getElementById("upgradeList");

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

    const resetButton =
        document.getElementById("resetButton");


    // =========================
    // CRITICAL CLICK
    // =========================

    const CRITICAL_CHANCE = 0.05;
    const CRITICAL_MULTIPLIER = 2;


    // =========================
    // COMBO
    // =========================

    let combo = 0;
    let comboTimer = null;

    const MAX_COMBO = 100;
    const COMBO_TIMEOUT = 3000;


    function increaseCombo() {

        if (combo < MAX_COMBO) {
            combo++;
        }

        updateComboDisplay();
        updateComboBonusDisplay();


        if (comboTimer !== null) {
            clearTimeout(comboTimer);
        }


        comboTimer = setTimeout(function () {

            combo = 0;

            updateComboDisplay();
            updateComboBonusDisplay();

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
    // COMBO BONUS
    // =========================

    function getComboMultiplier() {

        if (combo >= 100) {
            return 2;
        }

        if (combo >= 75) {
            return 1.75;
        }

        if (combo >= 50) {
            return 1.50;
        }

        if (combo >= 25) {
            return 1.25;
        }

        if (combo >= 10) {
            return 1.10;
        }

        return 1;
    }


    function updateComboBonusDisplay() {

        if (!comboBonusElement) {
            return;
        }


        const multiplier =
            getComboMultiplier();


        comboBonusElement.textContent =
            "×" +
            multiplier
                .toFixed(2)
                .replace(".", ",");
    }


    // =========================
    // GETALLEN
    // =========================

    function formatNumber(number) {

        return Math.floor(number)
            .toLocaleString("nl-NL");
    }


    // =========================
    // PEPPERONI PER CLICK
    // =========================

    function getPerClick() {

        let amount = 1;


        amount +=
            game.upgrades.pepperoniPower * 1;


        amount +=
            game.upgrades.bigPizza * 2;


        amount +=
            game.upgrades.fastSpin * 5;


        return amount;
    }


    // =========================
    // PEPPERONI PER SECOND
    // =========================

    function getPerSecond() {

        let amount = 0;


        amount +=
            game.upgrades.autoPizza * 1;


        amount +=
            game.upgrades.pizzaRobot * 5;


        amount +=
            game.upgrades.megaRobot * 50;


        amount +=
            game.upgrades.pizzaChef * 20;


        amount +=
            game.upgrades.pizzaFactory * 100;


        amount +=
            game.upgrades.pizzaReactor * 250;


        amount +=
            game.upgrades.pizzaShop * 500;


        amount +=
            game.upgrades.pizzaEmpire * 2500;


        amount +=
            game.upgrades.pizzaRocket * 10000;


        amount +=
            game.upgrades.spacePizza * 50000;


        amount +=
            game.upgrades.pizzaGod * 250000;


        return amount;
    }


    // =========================
    // UPGRADES
    // =========================

    const upgrades = [

        // CLICK UPGRADES
        {
            id: "pepperoniPower",
            name: "Pepperoni Power",
            description: "+1 🍕 per klik",
            baseCost: 10
        },

        {
            id: "bigPizza",
            name: "Big Pizza",
            description: "+2 🍕 per klik",
            baseCost: 50
        },

        {
            id: "fastSpin",
            name: "Turbo Click",
            description: "+5 🍕 per klik",
            baseCost: 150
        },


        // AUTO UPGRADES
        {
            id: "autoPizza",
            name: "Auto Pizza",
            description: "+1 🍕 per seconde",
            baseCost: 100
        },

        {
            id: "pizzaRobot",
            name: "Pizza Robot",
            description: "+5 🍕 per seconde",
            baseCost: 500
        },

        {
            id: "megaRobot",
            name: "Mega Robot",
            description: "+50 🍕 per seconde",
            baseCost: 5000
        },

        {
            id: "pizzaChef",
            name: "Pizza Chef",
            description: "+20 🍕 per seconde",
            baseCost: 2000
        },

        {
            id: "pizzaFactory",
            name: "Pizza Factory",
            description: "+100 🍕 per seconde",
            baseCost: 10000
        },

        {
            id: "pizzaReactor",
            name: "Pizza Reactor",
            description: "+250 🍕 per seconde",
            baseCost: 25000
        },

        {
            id: "pizzaShop",
            name: "Pizza Shop",
            description: "+500 🍕 per seconde",
            baseCost: 50000
        },

        {
            id: "pizzaEmpire",
            name: "Pizza Empire",
            description: "+2.500 🍕 per seconde",
            baseCost: 250000
        },

        {
            id: "pizzaRocket",
            name: "Pizza Rocket",
            description: "+10.000 🍕 per seconde",
            baseCost: 1000000
        },

        {
            id: "spacePizza",
            name: "Space Pizza",
            description: "+50.000 🍕 per seconde",
            baseCost: 5000000
        },

        {
            id: "pizzaGod",
            name: "Pizza God",
            description: "+250.000 🍕 per seconde",
            baseCost: 25000000
        }

    ];


    // =========================
    // UPGRADE PRIJS
    // =========================

    function getUpgradeCost(upgrade) {

        const level =
            game.upgrades[upgrade.id];


        return Math.floor(
            upgrade.baseCost *
            Math.pow(1.15, level)
        );
    }


    // =========================
    // UPGRADE KOPEN
    // =========================

    function buyUpgrade(upgrade) {

        const cost =
            getUpgradeCost(upgrade);


        if (game.pepperoni < cost) {
            return;
        }


        game.pepperoni -= cost;

        game.upgrades[upgrade.id]++;


        saveGame();

        updateGame();
    }


    // =========================
    // UPGRADES WEERGEVEN
    // =========================

    function renderUpgrades() {

        if (!upgradeList) {
            return;
        }


        upgradeList.innerHTML = "";


        upgrades.forEach(function (upgrade) {

            const level =
                game.upgrades[upgrade.id];


            const cost =
                getUpgradeCost(upgrade);


            const card =
                document.createElement("div");


            card.className =
                "upgrade-card";


            card.innerHTML = `
                <h3>${upgrade.name}</h3>

                <p>${upgrade.description}</p>

                <p>
                    Level: ${level}
                </p>

                <button>
                    🍕 ${formatNumber(cost)}
                </button>
            `;


            const button =
                card.querySelector("button");


            // Knop uitschakelen als speler te weinig heeft
            if (game.pepperoni < cost) {
                button.disabled = true;
            }


            button.addEventListener(
                "click",
                function () {

                    buyUpgrade(upgrade);

                }
            );


            upgradeList.appendChild(card);

        });
    }


    // =========================
    // XP EN LEVEL
    // =========================

    function getXPNeeded() {

        return game.level * 100;
    }


    function addXP(amount) {

        game.xp += amount;


        while (game.xp >= getXPNeeded()) {

            game.xp -= getXPNeeded();

            game.level++;


            showAchievementPopup(
                "⭐ LEVEL UP! Je bent nu level " +
                game.level +
                "!"
            );
        }


        checkAchievements();
    }


    function updateXP() {

        const needed =
            getXPNeeded();


        if (levelElement) {

            levelElement.textContent =
                game.level;
        }


        if (xpElement) {

            xpElement.textContent =
                formatNumber(game.xp);
        }


        if (xpNeededElement) {

            xpNeededElement.textContent =
                formatNumber(needed);
        }


        if (xpProgress) {

            const percentage =
                Math.min(
                    (game.xp / needed) * 100,
                    100
                );


            xpProgress.style.width =
                percentage + "%";
        }
    }


    // =========================
    // ACHIEVEMENTS
    // =========================

    const achievements = [

        {
            id: "firstSpin",
            name: "Eerste klik",
            description: "Klik 1 keer op de pizza"
        },

        {
            id: "hundredSpins",
            name: "100 klikken",
            description: "Klik 100 keer"
        },

        {
            id: "thousandSpins",
            name: "1.000 klikken",
            description: "Klik 1.000 keer"
        },

        {
            id: "tenThousandSpins",
            name: "10.000 klikken",
            description: "Klik 10.000 keer"
        },

        {
            id: "millionPepperoni",
            name: "Miljonair",
            description: "Verdien 1.000.000 pepperoni"
        },

        {
            id: "tenMillionPepperoni",
            name: "Pizza Tycoon",
            description: "Verdien 10.000.000 pepperoni"
        },

        {
            id: "tenPerSecond",
            name: "Snelle pizza",
            description: "Verdien 10 per seconde"
        },

        {
            id: "hundredPerSecond",
            name: "Pizza machine",
            description: "Verdien 100 per seconde"
        },

        {
            id: "thousandPerSecond",
            name: "Pizza fabriek",
            description: "Verdien 1.000 per seconde"
        },

        {
            id: "levelTen",
            name: "Level 10",
            description: "Bereik level 10"
        }

    ];


    function showAchievementPopup(text) {

        if (
            !achievementPopup ||
            !popupText
        ) {
            return;
        }


        popupText.textContent =
            text;


        achievementPopup.classList.add(
            "show"
        );


        setTimeout(function () {

            achievementPopup.classList.remove(
                "show"
            );

        }, 1500);
    }


    function checkAchievements() {

        const checks = {

            firstSpin:
                game.spins >= 1,

            hundredSpins:
                game.spins >= 100,

            thousandSpins:
                game.spins >= 1000,

            tenThousandSpins:
                game.spins >= 10000,

            millionPepperoni:
                game.pepperoni >= 1000000,

            tenMillionPepperoni:
                game.pepperoni >= 10000000,

            tenPerSecond:
                getPerSecond() >= 10,

            hundredPerSecond:
                getPerSecond() >= 100,

            thousandPerSecond:
                getPerSecond() >= 1000,

            levelTen:
                game.level >= 10

        };


        achievements.forEach(
            function (achievement) {

                if (
                    checks[achievement.id] &&
                    !game.achievements[
                        achievement.id
                    ]
                ) {

                    game.achievements[
                        achievement.id
                    ] = true;


                    showAchievementPopup(
                        "🏆 " +
                        achievement.name
                    );
                }

            }
        );
    }


    function renderAchievements() {

        if (!achievementList) {
            return;
        }


        achievementList.innerHTML = "";


        achievements.forEach(
            function (achievement) {

                const item =
                    document.createElement("div");


                item.className =
                    "achievement-item";


                if (
                    game.achievements[
                        achievement.id
                    ]
                ) {

                    item.classList.add(
                        "unlocked"
                    );


                    item.innerHTML = `
                        🏆 <strong>
                            ${achievement.name}
                        </strong>

                        <br>

                        <small>
                            ${achievement.description}
                        </small>

                        <br>

                        ✅ Gehaald
                    `;

                } else {

                    item.innerHTML = `
                        🔒 <strong>
                            ${achievement.name}
                        </strong>

                        <br>

                        <small>
                            ${achievement.description}
                        </small>
                    `;
                }


                achievementList.appendChild(
                    item
                );

            }
        );
    }


    // =========================
    // CLICK PARTICLES
    // =========================

    function createClickParticles(
        isCritical = false
    ) {

        if (!pizza) {
            return;
        }


        const rect =
            pizza.getBoundingClientRect();


        const centerX =
            rect.left +
            rect.width / 2;


        const centerY =
            rect.top +
            rect.height / 2;


        let particleAmount = 4;


        if (combo >= 25) {
            particleAmount = 6;
        }


        if (combo >= 50) {
            particleAmount = 8;
        }


        if (combo >= 75) {
            particleAmount = 10;
        }


        if (combo >= 100) {
            particleAmount = 14;
        }


        if (isCritical) {
            particleAmount = 20;
        }


        for (
            let i = 0;
            i < particleAmount;
            i++
        ) {

            const particle =
                document.createElement("div");


            particle.className =
                "click-particle";


            particle.style.left =
                centerX + "px";


            particle.style.top =
                centerY + "px";


            const spread =
                isCritical
                    ? 350
                    : 250;


            const x =
                (Math.random() - 0.5) *
                spread;


            const y =
                (Math.random() - 0.5) *
                spread;


            particle.style.setProperty(
                "--particle-x",
                x + "px"
            );


            particle.style.setProperty(
                "--particle-y",
                y + "px"
            );


            if (isCritical) {

                particle.style.width =
                    "20px";

                particle.style.height =
                    "20px";

                particle.style.background =
                    "#ff7b00";

                particle.style.border =
                    "3px solid #ff3d00";
            }


            document.body.appendChild(
                particle
            );


            setTimeout(
                function () {

                    particle.remove();

                },
                700
            );
        }
    }


    // =========================
    // CRITICAL POPUP
    // =========================

    function showCriticalClick(amount) {

        showAchievementPopup(
            "💥 CRITICAL CLICK! +" +
            formatNumber(amount) +
            " 🍕"
        );
    }


    // =========================
    // OPSLAAN
    // =========================

    function saveGame() {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(game)
        );
    }


    // =========================
    // LADEN
    // =========================

    function loadGame() {

        const savedGame =
            localStorage.getItem(
                SAVE_KEY
            );


        if (!savedGame) {
            return;
        }


        try {

            const loaded =
                JSON.parse(savedGame);


            game = Object.assign(
                createNewGame(),
                loaded
            );


            game.upgrades =
                Object.assign(
                    createNewGame().upgrades,
                    loaded.upgrades || {}
                );


            game.achievements =
                Object.assign(
                    createNewGame().achievements,
                    loaded.achievements || {}
                );


        } catch (error) {

            console.log(
                "Save kon niet worden geladen."
            );
        }
    }


    // =========================
    // GAME UPDATEN
    // =========================

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


        updateComboDisplay();

        updateComboBonusDisplay();

        updateXP();

        renderUpgrades();

        renderAchievements();

        checkAchievements();
    }


    // =========================
    // PIZZA KLIKKEN
    // =========================

    if (pizza) {

        pizza.addEventListener(
            "click",
            function () {

                // Combo
                increaseCombo();


                // Basis
                const baseAmount =
                    getPerClick();


                // Combo
                const comboMultiplier =
                    getComboMultiplier();


                const normalAmount =
                    Math.floor(
                        baseAmount *
                        comboMultiplier
                    );


                // Critical
                const isCritical =
                    Math.random() <
                    CRITICAL_CHANCE;


                let amount =
                    normalAmount;


                if (isCritical) {

                    amount =
                        Math.floor(
                            normalAmount *
                            CRITICAL_MULTIPLIER
                        );
                }


                // Pepperoni
                game.pepperoni +=
                    amount;


                // Klikken
                game.spins++;


                // XP
                addXP(5);


                // Particles
                createClickParticles(
                    isCritical
                );


                // Critical popup
                if (isCritical) {

                    showCriticalClick(
                        amount
                    );
                }


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
                perSecond;


            updateGame();

        },
        1000
    );


    // =========================
    // AUTOSAVE
    // =========================

    setInterval(
        function () {

            saveGame();

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
                        "Weet je zeker dat je helemaal opnieuw wilt beginnen?"
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


                saveGame();

                updateGame();

            }
        );
    }


    // =========================
    // PAGINA VERLATEN
    // =========================

    window.addEventListener(
        "beforeunload",
        function () {

            saveGame();

        }
    );


    // =========================
    // START
    // =========================

    loadGame();

    updateGame();

});
