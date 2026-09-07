// ========================================
// 🍕 PIZZA SPIN V1.1
// MOBILE + SAFE SAVE SYSTEM
// ========================================


// ========================================
// SAVE INSTELLINGEN
// ========================================

const SAVE_KEY = "pizzaSpinSave";

const SAVE_BACKUP_KEY = "pizzaSpinSaveBackup";

const SAVE_VERSION = 2;


// ========================================
// STANDAARD GAME
// ========================================

function createNewGame() {

    return {
        saveVersion: SAVE_VERSION,

        pepperoni: 0,

        spins: 0,

        xp: 0,

        level: 1,

        upgrades: {},

        achievements: {}
    };

}


let game = createNewGame();


// ========================================
// UPGRADES
// ========================================

const upgrades = [

    {
        id: "pepperoniPower",
        name: "⚡ Pepperoni Power",
        description: "+1 pepperoni per draai",
        baseCost: 10,
        effect: "spin",
        amount: 1
    },

    {
        id: "bigPizza",
        name: "🍕 Grotere Pizza",
        description: "+2 pepperoni per draai",
        baseCost: 50,
        effect: "spin",
        amount: 2
    },

    {
        id: "fastSpin",
        name: "💨 Snelle Draai",
        description: "+5 pepperoni per draai",
        baseCost: 150,
        effect: "spin",
        amount: 5
    },

    {
        id: "autoPizza",
        name: "🤖 Auto Pizza",
        description: "+1 pepperoni per seconde",
        baseCost: 100,
        effect: "second",
        amount: 1
    },

    {
        id: "pizzaRobot",
        name: "🦾 Pizza Robot",
        description: "+5 pepperoni per seconde",
        baseCost: 500,
        effect: "second",
        amount: 5
    },

    {
        id: "pizzaChef",
        name: "👨‍🍳 Pizza Chef",
        description: "+20 pepperoni per seconde",
        baseCost: 2000,
        effect: "second",
        amount: 20
    },

    {
        id: "pizzaFactory",
        name: "🏭 Pizza Fabriek",
        description: "+100 pepperoni per seconde",
        baseCost: 10000,
        effect: "second",
        amount: 100
    },

    {
        id: "pizzaShop",
        name: "🏪 Pizzeria",
        description: "+500 pepperoni per seconde",
        baseCost: 50000,
        effect: "second",
        amount: 500
    },

    {
        id: "pizzaEmpire",
        name: "🌎 Pizza Imperium",
        description: "+2.500 pepperoni per seconde",
        baseCost: 250000,
        effect: "second",
        amount: 2500
    },

    {
        id: "pizzaRocket",
        name: "🚀 Pizza Raket",
        description: "+10.000 pepperoni per seconde",
        baseCost: 1000000,
        effect: "second",
        amount: 10000
    },

    {
        id: "spacePizza",
        name: "🌌 Ruimte Pizza",
        description: "+50.000 pepperoni per seconde",
        baseCost: 5000000,
        effect: "second",
        amount: 50000
    },

    {
        id: "pizzaGod",
        name: "👑 Pizza God",
        description: "+250.000 pepperoni per seconde",
        baseCost: 25000000,
        effect: "second",
        amount: 250000
    }

];


// ========================================
// ACHIEVEMENTS
// ========================================

const achievements = [

    {
        id: "firstSpin",
        name: "🥉 Eerste Pizza",
        description: "Maak je eerste draai.",
        requirement: "spins",
        target: 1
    },

    {
        id: "hundredSpins",
        name: "🥈 Pizza Fan",
        description: "Maak 100 draaien.",
        requirement: "spins",
        target: 100
    },

    {
        id: "thousandSpins",
        name: "🥇 Pizza Master",
        description: "Maak 1.000 draaien.",
        requirement: "spins",
        target: 1000
    },

    {
        id: "tenThousandSpins",
        name: "🔥 Pizza Legende",
        description: "Maak 10.000 draaien.",
        requirement: "spins",
        target: 10000
    },

    {
        id: "millionPepperoni",
        name: "💰 Pepperoni Miljonair",
        description: "Verdien 1.000.000 pepperoni.",
        requirement: "pepperoni",
        target: 1000000
    },

    {
        id: "tenMillionPepperoni",
        name: "💎 Pepperoni Rijk",
        description: "Verdien 10.000.000 pepperoni.",
        requirement: "pepperoni",
        target: 10000000
    },

    {
        id: "tenPerSecond",
        name: "🤖 Robot Starter",
        description: "Bereik 10 pepperoni per seconde.",
        requirement: "perSecond",
        target: 10
    },

    {
        id: "hundredPerSecond",
        name: "🏭 Pizza Fabriek",
        description: "Bereik 100 pepperoni per seconde.",
        requirement: "perSecond",
        target: 100
    },

    {
        id: "thousandPerSecond",
        name: "🌎 Pizza Tycoon",
        description: "Bereik 1.000 pepperoni per seconde.",
        requirement: "perSecond",
        target: 1000
    },

    {
        id: "levelTen",
        name: "⭐ Level 10",
        description: "Bereik level 10.",
        requirement: "level",
        target: 10
    }

];


// ========================================
// HTML ELEMENTEN
// ========================================

const pizzaArea =
    document.getElementById("pizzaArea");

const pizza =
    document.getElementById("pizza");

const pepperoniText =
    document.getElementById("pepperoni");

const spinsText =
    document.getElementById("spins");

const perSpinText =
    document.getElementById("perSpin");

const perSecondText =
    document.getElementById("perSecond");

const upgradeList =
    document.getElementById("upgradeList");

const resetButton =
    document.getElementById("resetButton");

const levelText =
    document.getElementById("level");

const xpText =
    document.getElementById("xp");

const xpNeededText =
    document.getElementById("xpNeeded");

const xpProgress =
    document.getElementById("xpProgress");

const achievementList =
    document.getElementById("achievementList");

const achievementPopup =
    document.getElementById("achievementPopup");

const popupText =
    document.getElementById("popupText");


// ========================================
// 💾 VEILIG OPSLAAN
// ========================================

function saveGame() {

    try {

        const saveData = JSON.stringify(game);

        // Eerst een backup maken
        const oldSave =
            localStorage.getItem(SAVE_KEY);

        if (oldSave) {

            localStorage.setItem(
                SAVE_BACKUP_KEY,
                oldSave
            );

        }

        // Nieuwe save opslaan
        localStorage.setItem(
            SAVE_KEY,
            saveData
        );

    } catch (error) {

        console.log(
            "Save kon niet worden opgeslagen:",
            error
        );

    }

}


// ========================================
// 💾 GAME LADEN
// ========================================

function loadGame() {

    let savedGame = null;

    try {

        savedGame =
            localStorage.getItem(SAVE_KEY);

    } catch (error) {

        console.log(
            "Save kon niet worden gelezen."
        );

    }


    // Als normale save bestaat
    if (savedGame) {

        try {

            const parsed =
                JSON.parse(savedGame);

            // Oude gegevens behouden
            game = {
                ...createNewGame(),
                ...parsed
            };

            // Objecten apart veilig samenvoegen
            game.upgrades = {
                ...parsed.upgrades
            };

            game.achievements = {
                ...parsed.achievements
            };

        } catch (error) {

            console.log(
                "Normale save is beschadigd. Backup wordt geprobeerd."
            );

            loadBackup();

        }

    }

    // Geen normale save
    else {

        loadBackup();

    }


    // Controleer belangrijke waarden
    if (
        typeof game.pepperoni !== "number" ||
        !Number.isFinite(game.pepperoni)
    ) {

        game.pepperoni = 0;

    }


    if (
        typeof game.spins !== "number" ||
        !Number.isFinite(game.spins)
    ) {

        game.spins = 0;

    }


    if (
        typeof game.xp !== "number" ||
        !Number.isFinite(game.xp)
    ) {

        game.xp = 0;

    }


    if (
        typeof game.level !== "number" ||
        !Number.isFinite(game.level) ||
        game.level < 1
    ) {

        game.level = 1;

    }


    if (!game.upgrades) {

        game.upgrades = {};

    }


    if (!game.achievements) {

        game.achievements = {};

    }


    // Nieuwe versie opslaan
    saveGame();

}


// ========================================
// 💾 BACKUP LADEN
// ========================================

function loadBackup() {

    try {

        const backup =
            localStorage.getItem(
                SAVE_BACKUP_KEY
            );


        if (backup) {

            const parsed =
                JSON.parse(backup);


            game = {
                ...createNewGame(),
                ...parsed
            };


            game.upgrades =
                parsed.upgrades || {};


            game.achievements =
                parsed.achievements || {};

        }

    } catch (error) {

        console.log(
            "Ook de backup kon niet worden geladen."
        );

        game = createNewGame();

    }

}


// ========================================
// UPGRADE LEVEL
// ========================================

function getUpgradeLevel(id) {

    return game.upgrades[id] || 0;

}


// ========================================
// UPGRADE KOSTEN
// ========================================

function getUpgradeCost(upgrade) {

    const level =
        getUpgradeLevel(upgrade.id);


    return Math.floor(
        upgrade.baseCost *
        Math.pow(1.5, level)
    );

}


// ========================================
// PEPPERONI PER DRAAI
// ========================================

function getPerSpin() {

    let amount = 1;


    upgrades.forEach(upgrade => {

        if (upgrade.effect === "spin") {

            amount +=
                getUpgradeLevel(upgrade.id) *
                upgrade.amount;

        }

    });


    return amount;

}


// ========================================
// PEPPERONI PER SECONDE
// ========================================

function getPerSecond() {

    let amount = 0;


    upgrades.forEach(upgrade => {

        if (upgrade.effect === "second") {

            amount +=
                getUpgradeLevel(upgrade.id) *
                upgrade.amount;

        }

    });


    return amount;

}


// ========================================
// NUMMERS MOOI WEERGEVEN
// ========================================

function formatNumber(number) {

    if (number < 1000) {

        return Math.floor(number);

    }


    if (number < 1000000) {

        return (
            (number / 1000)
                .toFixed(1)
                .replace(".0", "")
            + "K"
        );

    }


    if (number < 1000000000) {

        return (
            (number / 1000000)
                .toFixed(1)
                .replace(".0", "")
            + "M"
        );

    }


    if (number < 1000000000000) {

        return (
            (number / 1000000000)
                .toFixed(1)
                .replace(".0", "")
            + "B"
        );

    }


    return number.toExponential(2);

}


// ========================================
// XP
// ========================================

function getXPNeeded() {

    return 100 + (game.level - 1) * 100;

}


function addXP(amount) {

    game.xp += amount;


    while (game.xp >= getXPNeeded()) {

        game.xp -= getXPNeeded();

        game.level++;

        showLevelUp();

    }

}


// ========================================
// LEVEL UP
// ========================================

function showLevelUp() {

    popupText.textContent =
        "⭐ Je bent nu level " +
        game.level +
        "!";


    achievementPopup.classList.add(
        "show"
    );


    setTimeout(function() {

        achievementPopup.classList.remove(
            "show"
        );

    }, 2500);

}


// ========================================
// ACHIEVEMENTS CONTROLEREN
// ========================================

function checkAchievements() {

    achievements.forEach(
        achievement => {

            if (
                game.achievements[
                    achievement.id
                ]
            ) {

                return;

            }


            let currentValue = 0;


            if (
                achievement.requirement ===
                "spins"
            ) {

                currentValue =
                    game.spins;

            }


            if (
                achievement.requirement ===
                "pepperoni"
            ) {

                currentValue =
                    game.pepperoni;

            }


            if (
                achievement.requirement ===
                "perSecond"
            ) {

                currentValue =
                    getPerSecond();

            }


            if (
                achievement.requirement ===
                "level"
            ) {

                currentValue =
                    game.level;

            }


            if (
                currentValue >=
                achievement.target
            ) {

                game.achievements[
                    achievement.id
                ] = true;


                showAchievement(
                    achievement
                );

            }

        }
    );

}


// ========================================
// ACHIEVEMENT POPUP
// ========================================

function showAchievement(
    achievement
) {

    popupText.textContent =
        achievement.name +
        " gehaald!";


    achievementPopup.classList.add(
        "show"
    );


    setTimeout(function() {

        achievementPopup.classList.remove(
            "show"
        );

    }, 3000);

}


// ========================================
// ACHIEVEMENTS MAKEN
// ========================================

function createAchievements() {

    achievementList.innerHTML = "";


    achievements.forEach(
        achievement => {

            const unlocked =
                game.achievements[
                    achievement.id
                ];


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "achievement " +
                (
                    unlocked
                        ? "unlocked"
                        : ""
                );


            div.innerHTML = `

                <div class="achievement-title">
                    ${achievement.name}
                </div>

                <div class="achievement-description">
                    ${achievement.description}
                </div>

                <div class="achievement-status">
                    ${
                        unlocked
                            ? "✓ GEHAALD"
                            : "🔒 Nog niet gehaald"
                    }
                </div>

            `;


            achievementList.appendChild(
                div
            );

        }
    );

}


// ========================================
// SHOP MAKEN
// ========================================

function createShop() {

    upgradeList.innerHTML = "";


    upgrades.forEach(upgrade => {

        const level =
            getUpgradeLevel(upgrade.id);


        const cost =
            getUpgradeCost(upgrade);


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "upgrade";


        div.innerHTML = `

            <div class="upgrade-info">

                <h3>
                    ${upgrade.name}
                </h3>

                <p>
                    ${upgrade.description}
                </p>

                <p class="level">
                    Level: ${level}
                </p>

            </div>

            <button
                data-upgrade="${upgrade.id}"
                ${
                    game.pepperoni < cost
                        ? "disabled"
                        : ""
                }
            >

                Koop -
                ${formatNumber(cost)}

            </button>

        `;


        upgradeList.appendChild(
            div
        );

    });


    document
        .querySelectorAll(
            "[data-upgrade]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function() {

                    buyUpgrade(
                        this.dataset.upgrade
                    );

                }
            );

        });

}


// ========================================
// UPGRADE KOPEN
// ========================================

function buyUpgrade(id) {

    const upgrade =
        upgrades.find(
            item => item.id === id
        );


    if (!upgrade) {

        return;

    }


    const cost =
        getUpgradeCost(upgrade);


    if (
        game.pepperoni >= cost
    ) {

        game.pepperoni -= cost;


        game.upgrades[id] =
            getUpgradeLevel(id) + 1;


        addXP(10);


        saveGame();

        updateGame();

    }

}


// ========================================
// GAME UPDATE
// ========================================

function updateGame() {

    pepperoniText.textContent =
        formatNumber(
            game.pepperoni
        );


    spinsText.textContent =
        formatNumber(
            game.spins
        );


    perSpinText.textContent =
        formatNumber(
            getPerSpin()
        );


    perSecondText.textContent =
        formatNumber(
            getPerSecond()
        );


    levelText.textContent =
        game.level;


    xpText.textContent =
        Math.floor(game.xp);


    xpNeededText.textContent =
        getXPNeeded();


    const percentage =
        (
            game.xp /
            getXPNeeded()
        ) * 100;


    xpProgress.style.width =
        percentage + "%";


    createShop();

    createAchievements();

    checkAchievements();

    saveGame();

}


// ========================================
// 🍕 PIZZA DRAAIEN
// ========================================

let vorigeHoek = null;

let totaleDraaiing = 0;


// ========================================
// HOEK BEREKENEN
// ========================================

function getAngle(event) {

    const rect =
        pizza.getBoundingClientRect();


    const middenX =
        rect.left +
        rect.width / 2;


    const middenY =
        rect.top +
        rect.height / 2;


    const x =
        event.clientX - middenX;


    const y =
        event.clientY - middenY;


    return (
        Math.atan2(y, x) *
        180 /
        Math.PI
    );

}


// ========================================
// 🖱️ + 📱 POINTER BESTURING
// ========================================

pizzaArea.addEventListener(
    "pointermove",
    function(event) {

        // Alleen als er echt met de muis
        // of vinger wordt bewogen

        if (
            event.pointerType === "mouse" &&
            event.buttons === 0
        ) {

            return;

        }


        const hoek =
            getAngle(event);


        if (
            vorigeHoek === null
        ) {

            vorigeHoek = hoek;

            return;

        }


        let verschil =
            hoek - vorigeHoek;


        if (verschil > 180) {

            verschil -= 360;

        }


        if (verschil < -180) {

            verschil += 360;

        }


        totaleDraaiing += verschil;


        pizza.style.transform =
            `rotate(${totaleDraaiing}deg)`;


        if (
            Math.abs(totaleDraaiing)
            >= 360
        ) {

            const rondjes =
                Math.floor(
                    Math.abs(
                        totaleDraaiing
                    ) / 360
                );


            game.spins +=
                rondjes;


            game.pepperoni +=
                rondjes *
                getPerSpin();


            // XP
            addXP(
                rondjes * 5
            );


            totaleDraaiing %= 360;


            updateGame();

        }


        vorigeHoek = hoek;

    }
);


// ========================================
// POINTER START
// ========================================

pizzaArea.addEventListener(
    "pointerdown",
    function(event) {

        vorigeHoek =
            getAngle(event);

    }
);


// ========================================
// POINTER STOP
// ========================================

pizzaArea.addEventListener(
    "pointerup",
    function() {

        vorigeHoek = null;

    }
);


pizzaArea.addEventListener(
    "pointercancel",
    function() {

        vorigeHoek = null;

    }
);


// ========================================
// 🤖 AUTO PEPPERONI
// ========================================

setInterval(
    function() {

        const amount =
            getPerSecond();


        if (amount > 0) {

            game.pepperoni +=
                amount;


            addXP(
                Math.max(
                    1,
                    Math.floor(
                        amount / 10
                    )
                )
            );


            updateGame();

        }

    },
    1000
);


// ========================================
// 🗑️ RESET
// ========================================

resetButton.addEventListener(
    "click",
    function() {

        const confirmReset =
            confirm(
                "Weet je zeker dat je ALLES wilt verwijderen?"
            );


        if (!confirmReset) {

            return;

        }


        // Zowel save als backup verwijderen
        localStorage.removeItem(
            SAVE_KEY
        );

        localStorage.removeItem(
            SAVE_BACKUP_KEY
        );


        game =
            createNewGame();


        totaleDraaiing = 0;

        vorigeHoek = null;


        pizza.style.transform =
            "rotate(0deg)";


        updateGame();

    }
);


// ========================================
// 🚀 GAME START
// ========================================

loadGame();

updateGame();
