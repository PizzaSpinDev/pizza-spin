document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // OPSLAAN
    // =========================================================

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
                levelTen: false,
                criticalClick: false,
                combo10: false,
                combo50: false,
                combo100: false,
                hundredThousandSpins: false,
                hundredMillionPepperoni: false,
                megaRobot: false,
                megaRobotLevel10: false,
                pizzaReactor: false,
                level25: false
            }
        };
    }

    let game = createNewGame();

    // =========================================================
    // HTML ELEMENTEN
    // =========================================================

    const pizza = document.getElementById("pizza");
    const pepperoniElement = document.getElementById("pepperoni");
    const spinsElement = document.getElementById("spins");
    const comboElement = document.getElementById("combo");
    const comboBonusElement = document.getElementById("comboBonus");
    const perSpinElement = document.getElementById("perSpin");
    const perSecondElement = document.getElementById("perSecond");
    const upgradeList = document.getElementById("upgradeList");
    const levelElement = document.getElementById("level");
    const xpElement = document.getElementById("xp");
    const xpNeededElement = document.getElementById("xpNeeded");
    const xpProgress = document.getElementById("xpProgress");
    const achievementList = document.getElementById("achievementList");
    const achievementPopup = document.getElementById("achievementPopup");
    const popupText = document.getElementById("popupText");
    const resetButton = document.getElementById("resetButton");

    // =========================================================
    // CRITICAL CLICK
    // =========================================================

    const CRITICAL_CHANCE = 0.05;
    const CRITICAL_MULTIPLIER = 2;

    // =========================================================
    // COMBO
    // =========================================================

    let combo = 0;
    let comboTimer = null;
    let lastComboMultiplier = 1;

    const MAX_COMBO = 100;
    const COMBO_TIMEOUT = 3000;

    function increaseCombo() {
        if (combo < MAX_COMBO) {
            combo++;
        }

        const newMultiplier = getComboMultiplier();

        updateComboDisplay();
        updateComboBonusDisplay();
        checkAchievements();

        if (newMultiplier !== lastComboMultiplier) {
            showComboMilestone(newMultiplier);
            lastComboMultiplier = newMultiplier;
        }

        if (comboTimer !== null) {
            clearTimeout(comboTimer);
        }

        comboTimer = setTimeout(function () {
            combo = 0;
            lastComboMultiplier = 1;

            updateComboDisplay();
            updateComboBonusDisplay();

            comboTimer = null;
        }, COMBO_TIMEOUT);
    }

    // =========================================================
    // COMBO DISPLAY
    // =========================================================

    function updateComboDisplay() {
        if (!comboElement) {
            return;
        }

        comboElement.textContent = formatNumber(combo);
    }

    // =========================================================
    // COMBO MILESTONES
    // =========================================================

    function showComboMilestone(multiplier) {
        let text = "";
        let className = "";

        if (multiplier >= 2) {
            text = "👑 MAX COMBO! ×2,00";
            className = "combo-max";
        } else if (multiplier >= 1.75) {
            text = "🔥 INSANE COMBO! ×1,75";
            className = "combo-insane";
        } else if (multiplier >= 1.50) {
            text = "🔥 GREAT COMBO! ×1,50";
            className = "combo-great";
        } else if (multiplier >= 1.25) {
            text = "🔥 COMBO! ×1,25";
            className = "combo-good";
        } else if (multiplier >= 1.10) {
            text = "🔥 COMBO START! ×1,10";
            className = "combo-start";
        }

        if (!text) {
            return;
        }

        const popup = document.createElement("div");
        popup.className = "combo-milestone " + className;
        popup.textContent = text;

        document.body.appendChild(popup);

        setTimeout(function () {
            popup.classList.add("show");
        }, 10);

        setTimeout(function () {
            popup.classList.remove("show");
        }, 850);

        setTimeout(function () {
            popup.remove();
        }, 1100);
    }

    // =========================================================
    // COMBO BONUS
    // =========================================================

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

        const multiplier = getComboMultiplier();

        comboBonusElement.textContent =
            "×" + multiplier.toFixed(2).replace(".", ",");
    }

    // =========================================================
    // GETALLEN
    // =========================================================

    function formatNumber(number) {
        return Math.floor(number).toLocaleString("nl-NL");
    }

    // =========================================================
    // PER CLICK
    // =========================================================

    function getPerClick() {
        let amount = 1;

        amount += game.upgrades.pepperoniPower * 1;
        amount += game.upgrades.bigPizza * 2;
        amount += game.upgrades.fastSpin * 5;

        return amount;
    }

    // =========================================================
    // PER SECOND
    // =========================================================

    function getPerSecond() {
        let amount = 0;

        amount += game.upgrades.autoPizza * 1;
        amount += game.upgrades.pizzaRobot * 5;
        amount += game.upgrades.megaRobot * 50;
        amount += game.upgrades.pizzaChef * 100;
        amount += game.upgrades.pizzaFactory * 500;
        amount += game.upgrades.pizzaReactor * 2500;
        amount += game.upgrades.pizzaShop * 10000;
        amount += game.upgrades.pizzaEmpire * 50000;
        amount += game.upgrades.pizzaRocket * 250000;
        amount += game.upgrades.spacePizza * 1000000;
        amount += game.upgrades.pizzaGod * 5000000;

        return amount;
    }

    // =========================================================
    // UPGRADE-INFORMATIE
    // =========================================================

    const upgrades = [
        {
            id: "pepperoniPower",
            name: "Extra Pepperoni",
            description: "+1 pepperoni per klik",
            baseCost: 25,
            costMultiplier: 1.5,
            effect: "click"
        },
        {
            id: "bigPizza",
            name: "Grote Pizza",
            description: "+2 pepperoni per klik",
            baseCost: 100,
            costMultiplier: 1.6,
            effect: "click"
        },
        {
            id: "fastSpin",
            name: "Snelle Spin",
            description: "+5 pepperoni per klik",
            baseCost: 500,
            costMultiplier: 1.7,
            effect: "click"
        },
        {
            id: "autoPizza",
            name: "Automatische Pizza",
            description: "+1 pepperoni per seconde",
            baseCost: 100,
            costMultiplier: 1.5,
            effect: "second"
        },
        {
            id: "pizzaRobot",
            name: "Pizza Robot",
            description: "+5 pepperoni per seconde",
            baseCost: 500,
            costMultiplier: 1.6,
            effect: "second"
        },
        {
            id: "megaRobot",
            name: "Mega Robot",
            description: "+50 pepperoni per seconde",
            baseCost: 2500,
            costMultiplier: 1.7,
            effect: "second"
        },
        {
            id: "pizzaChef",
            name: "Pizza Chef",
            description: "+100 pepperoni per seconde",
            baseCost: 10000,
            costMultiplier: 1.75,
            effect: "second"
        },
        {
            id: "pizzaFactory",
            name: "Pizza Fabriek",
            description: "+500 pepperoni per seconde",
            baseCost: 50000,
            costMultiplier: 1.8,
            effect: "second"
        },
        {
            id: "pizzaReactor",
            name: "Pizza Reactor",
            description: "+2.500 pepperoni per seconde",
            baseCost: 250000,
            costMultiplier: 1.85,
            effect: "second"
        },
        {
            id: "pizzaShop",
            name: "Pizza Winkel",
            description: "+10.000 pepperoni per seconde",
            baseCost: 1000000,
            costMultiplier: 1.9,
            effect: "second"
        },
        {
            id: "pizzaEmpire",
            name: "Pizza Imperium",
            description: "+50.000 pepperoni per seconde",
            baseCost: 5000000,
            costMultiplier: 1.95,
            effect: "second"
        },
        {
            id: "pizzaRocket",
            name: "Pizza Raket",
            description: "+250.000 pepperoni per seconde",
            baseCost: 25000000,
            costMultiplier: 2,
            effect: "second"
        },
        {
            id: "spacePizza",
            name: "Ruimtepizza",
            description: "+1.000.000 pepperoni per seconde",
            baseCost: 100000000,
            costMultiplier: 2.05,
            effect: "second"
        },
        {
            id: "pizzaGod",
            name: "Pizza God",
            description: "+5.000.000 pepperoni per seconde",
            baseCost: 500000000,
            costMultiplier: 2.1,
            effect: "second"
        }
    ];

    function getUpgradeCost(upgrade) {
        const level = game.upgrades[upgrade.id];

        return Math.floor(
            upgrade.baseCost * Math.pow(upgrade.costMultiplier, level)
        );
    }

    // =========================================================
    // UPGRADE-KOPEN
    // =========================================================

    function buyUpgrade(upgradeId) {
        const upgrade = upgrades.find(function (item) {
            return item.id === upgradeId;
        });

        if (!upgrade) {
            return;
        }

        const cost = getUpgradeCost(upgrade);

        if (game.pepperoni < cost) {
            return;
        }

        game.pepperoni -= cost;
        game.upgrades[upgradeId]++;

        addXP(5);

        checkAchievements();
        updateGame();
        saveGame();
    }    // =========================================================
    // WINKEL WEERGEVEN
    // =========================================================

    function renderUpgrades() {
        if (!upgradeList) {
            return;
        }

        upgradeList.innerHTML = "";

        upgrades.forEach(function (upgrade) {
            const level = game.upgrades[upgrade.id];
            const cost = getUpgradeCost(upgrade);
            const canAfford = game.pepperoni >= cost;

            const card = document.createElement("div");
            card.className = "upgrade-card";

            const info = document.createElement("div");
            info.className = "upgrade-info";

            const name = document.createElement("h3");
            name.className = "upgrade-name";
            name.textContent = upgrade.name;

            const description = document.createElement("p");
            description.className = "upgrade-description";
            description.textContent = upgrade.description;

            const levelText = document.createElement("p");
            levelText.className = "upgrade-level";
            levelText.textContent = "Level: " + level;

            info.appendChild(name);
            info.appendChild(description);
            info.appendChild(levelText);

            const buyButton = document.createElement("button");
            buyButton.className = "upgrade-button";
            buyButton.type = "button";
            buyButton.disabled = !canAfford;
            buyButton.textContent = "🍕 " + formatNumber(cost);

            buyButton.addEventListener("click", function () {
                buyUpgrade(upgrade.id);
            });

            card.appendChild(info);
            card.appendChild(buyButton);

            upgradeList.appendChild(card);
        });
    }

    // =========================================================
    // XP EN LEVELS
    // =========================================================

    function getXPNeeded() {
        return Math.floor(100 * Math.pow(game.level, 1.5));
    }

    function addXP(amount) {
        game.xp += amount;

        while (game.xp >= getXPNeeded()) {
            game.xp -= getXPNeeded();
            game.level++;

            showLevelUp();
            checkAchievements();
        }

        updateXPDisplay();
    }

    function updateXPDisplay() {
        const needed = getXPNeeded();

        if (levelElement) {
            levelElement.textContent = game.level;
        }

        if (xpElement) {
            xpElement.textContent = formatNumber(game.xp);
        }

        if (xpNeededElement) {
            xpNeededElement.textContent = formatNumber(needed);
        }

        if (xpProgress) {
            const percentage = Math.min(
                100,
                (game.xp / needed) * 100
            );

            xpProgress.style.width = percentage + "%";
        }
    }

    // =========================================================
    // LEVEL-UP MELDING
    // =========================================================

    function showLevelUp() {
        const popup = document.createElement("div");

        popup.className = "level-up-popup";
        popup.textContent = "🎉 LEVEL UP! Level " + game.level;

        document.body.appendChild(popup);

        requestAnimationFrame(function () {
            popup.classList.add("show");
        });

        setTimeout(function () {
            popup.classList.remove("show");
        }, 1500);

        setTimeout(function () {
            popup.remove();
        }, 1800);
    }

    // =========================================================
    // ACHIEVEMENTS
    // =========================================================

    const achievements = [
        {
            id: "firstSpin",
            name: "Eerste klik",
            description: "Klik voor het eerst op de pizza.",
            condition: function () {
                return game.spins >= 1;
            }
        },
        {
            id: "hundredSpins",
            name: "Beginnende pizzabakker",
            description: "Klik 100 keer op de pizza.",
            condition: function () {
                return game.spins >= 100;
            }
        },
        {
            id: "thousandSpins",
            name: "Pizza-professional",
            description: "Klik 1.000 keer op de pizza.",
            condition: function () {
                return game.spins >= 1000;
            }
        },
        {
            id: "tenThousandSpins",
            name: "Pizza-verslaafd",
            description: "Klik 10.000 keer op de pizza.",
            condition: function () {
                return game.spins >= 10000;
            }
        },
        {
            id: "millionPepperoni",
            name: "Miljoen pepperoni",
            description: "Verzamel 1 miljoen pepperoni.",
            condition: function () {
                return game.pepperoni >= 1000000;
            }
        },
        {
            id: "tenMillionPepperoni",
            name: "Pepperoni-miljonair",
            description: "Verzamel 10 miljoen pepperoni.",
            condition: function () {
                return game.pepperoni >= 10000000;
            }
        },
        {
            id: "tenPerSecond",
            name: "Automatische productie",
            description: "Verdien 10 pepperoni per seconde.",
            condition: function () {
                return getPerSecond() >= 10;
            }
        },
        {
            id: "hundredPerSecond",
            name: "Pizzafabriek",
            description: "Verdien 100 pepperoni per seconde.",
            condition: function () {
                return getPerSecond() >= 100;
            }
        },
        {
            id: "thousandPerSecond",
            name: "Pizza-imperium",
            description: "Verdien 1.000 pepperoni per seconde.",
            condition: function () {
                return getPerSecond() >= 1000;
            }
        },
        {
            id: "levelTen",
            name: "Level 10",
            description: "Bereik level 10.",
            condition: function () {
                return game.level >= 10;
            }
        },
        {
            id: "criticalClick",
            name: "Kritieke klik",
            description: "Krijg een critical click.",
            condition: function () {
                return game.achievements.criticalClick === true;
            }
        },
        {
            id: "combo10",
            name: "Combo x10",
            description: "Bereik een combo van 10.",
            condition: function () {
                return combo >= 10;
            }
        },
        {
            id: "combo50",
            name: "Combo x50",
            description: "Bereik een combo van 50.",
            condition: function () {
                return combo >= 50;
            }
        },
        {
            id: "combo100",
            name: "Combo x100",
            description: "Bereik een combo van 100.",
            condition: function () {
                return combo >= 100;
            }
        },
        {
            id: "hundredThousandSpins",
            name: "Kliklegende",
            description: "Klik 100.000 keer op de pizza.",
            condition: function () {
                return game.spins >= 100000;
            }
        },
        {
            id: "hundredMillionPepperoni",
            name: "Honderd miljoen",
            description: "Verzamel 100 miljoen pepperoni.",
            condition: function () {
                return game.pepperoni >= 100000000;
            }
        },
        {
            id: "megaRobot",
            name: "Mega Robot",
            description: "Koop je eerste Mega Robot.",
            condition: function () {
                return game.upgrades.megaRobot >= 1;
            }
        },
        {
            id: "megaRobotLevel10",
            name: "Robotleger",
            description: "Koop 10 Mega Robots.",
            condition: function () {
                return game.upgrades.megaRobot >= 10;
            }
        },
        {
            id: "pizzaReactor",
            name: "Pizza-energie",
            description: "Koop je eerste Pizza Reactor.",
            condition: function () {
                return game.upgrades.pizzaReactor >= 1;
            }
        },
        {
            id: "level25",
            name: "Legendarische pizzabakker",
            description: "Bereik level 25.",
            condition: function () {
                return game.level >= 25;
            }
        }
    ];

    // =========================================================
    // ACHIEVEMENT MELDING
    // =========================================================

    function showAchievement(achievement) {
        if (achievementPopup && popupText) {
            popupText.textContent =
                "🏆 " + achievement.name + " vrijgespeeld!";

            achievementPopup.classList.add("show");

            setTimeout(function () {
                achievementPopup.classList.remove("show");
            }, 2500);

            return;
        }

        const popup = document.createElement("div");

        popup.className = "achievement-notification";
        popup.textContent =
            "🏆 " + achievement.name + " vrijgespeeld!";

        document.body.appendChild(popup);

        setTimeout(function () {
            popup.classList.add("show");
        }, 10);

        setTimeout(function () {
            popup.classList.remove("show");
        }, 2200);

        setTimeout(function () {
            popup.remove();
        }, 2500);
    }

    // =========================================================
    // ACHIEVEMENTS CONTROLEREN
    // =========================================================

    function checkAchievements() {
        let unlockedSomething = false;

        achievements.forEach(function (achievement) {
            if (game.achievements[achievement.id]) {
                return;
            }

            if (achievement.condition()) {
                game.achievements[achievement.id] = true;

                showAchievement(achievement);
                unlockedSomething = true;
            }
        });

        if (unlockedSomething) {
            renderAchievements();
            saveGame();
        }
    }

    // =========================================================
    // ACHIEVEMENTS WEERGEVEN
    // =========================================================

    function renderAchievements() {
        if (!achievementList) {
            return;
        }

        achievementList.innerHTML = "";

        achievements.forEach(function (achievement) {
            const unlocked =
                game.achievements[achievement.id] === true;

            const item = document.createElement("div");

            item.className = unlocked
                ? "achievement unlocked"
                : "achievement locked";

            const title = document.createElement("strong");
            title.textContent =
                (unlocked ? "🏆 " : "🔒 ") + achievement.name;

            const description = document.createElement("p");
            description.textContent = achievement.description;

            item.appendChild(title);
            item.appendChild(description);

            achievementList.appendChild(item);
        });
    }    // =========================================================
    // GAME INTERFACE BIJWERKEN
    // =========================================================

    function updateGame() {
        if (pepperoniElement) {
            pepperoniElement.textContent =
                formatNumber(game.pepperoni);
        }

        if (spinsElement) {
            spinsElement.textContent = formatNumber(game.spins);
        }

        if (perSpinElement) {
            perSpinElement.textContent =
                formatNumber(getPerClick());
        }

        if (perSecondElement) {
            perSecondElement.textContent =
                formatNumber(getPerSecond());
        }

        updateComboDisplay();
        updateComboBonusDisplay();
        updateXPDisplay();
        renderUpgrades();
        renderAchievements();
    }

    // =========================================================
    // OPSLAAN
    // =========================================================

    function saveGame() {
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(game));
        } catch (error) {
            console.error("Pizza Spin kon niet worden opgeslagen:", error);
        }
    }

    // =========================================================
    // OPGESLAGEN GAME LADEN
    // =========================================================

    function loadGame() {
        try {
            const savedGame = localStorage.getItem(SAVE_KEY);

            if (!savedGame) {
                game = createNewGame();
                return;
            }

            const parsedGame = JSON.parse(savedGame);

            if (
                !parsedGame ||
                typeof parsedGame !== "object" ||
                !parsedGame.upgrades ||
                !parsedGame.achievements
            ) {
                console.warn(
                    "De opgeslagen game is ongeldig. Er wordt een nieuwe game gestart."
                );

                game = createNewGame();
                return;
            }

            const freshGame = createNewGame();

            game = {
                ...freshGame,
                ...parsedGame,

                pepperoni:
                    Number.isFinite(Number(parsedGame.pepperoni))
                        ? Math.max(0, Number(parsedGame.pepperoni))
                        : 0,

                spins:
                    Number.isFinite(Number(parsedGame.spins))
                        ? Math.max(0, Number(parsedGame.spins))
                        : 0,

                xp:
                    Number.isFinite(Number(parsedGame.xp))
                        ? Math.max(0, Number(parsedGame.xp))
                        : 0,

                level:
                    Number.isFinite(Number(parsedGame.level))
                        ? Math.max(1, Math.floor(Number(parsedGame.level)))
                        : 1,

                upgrades: {
                    ...freshGame.upgrades,
                    ...parsedGame.upgrades
                },

                achievements: {
                    ...freshGame.achievements,
                    ...parsedGame.achievements
                }
            };

            // Controleer of upgradewaarden geldige getallen zijn.
            Object.keys(game.upgrades).forEach(function (key) {
                const value = Number(game.upgrades[key]);

                game.upgrades[key] =
                    Number.isFinite(value)
                        ? Math.max(0, Math.floor(value))
                        : 0;
            });

        } catch (error) {
            console.error("Pizza Spin kon de save niet laden:", error);
            game = createNewGame();
        }
    }

    // =========================================================
    // KLIK-EFFECTEN
    // =========================================================

    function createClickParticles(isCritical) {
        if (!pizza) {
            return;
        }

        const rect = pizza.getBoundingClientRect();

        const particleCount = isCritical ? 12 : 6;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("span");

            particle.className = isCritical
                ? "click-particle critical-particle"
                : "click-particle";

            particle.textContent = isCritical ? "🔥" : "🍕";

            particle.style.position = "fixed";
            particle.style.left =
                rect.left + rect.width / 2 + "px";
            particle.style.top =
                rect.top + rect.height / 2 + "px";

            particle.style.pointerEvents = "none";
            particle.style.zIndex = "9999";

            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 90;

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            particle.style.setProperty("--particle-x", x + "px");
            particle.style.setProperty("--particle-y", y + "px");

            particle.style.animation = "pizzaParticle 650ms ease-out forwards";

            document.body.appendChild(particle);

            setTimeout(function () {
                particle.remove();
            }, 700);
        }
    }

    // =========================================================
    // CRITICAL CLICK MELDING
    // =========================================================

    function showCriticalClick(amount) {
        const popup = document.createElement("div");

        popup.className = "critical-click-popup";
        popup.textContent =
            "🔥 CRITICAL! +" + formatNumber(amount);

        document.body.appendChild(popup);

        requestAnimationFrame(function () {
            popup.classList.add("show");
        });

        setTimeout(function () {
            popup.classList.remove("show");
        }, 900);

        setTimeout(function () {
            popup.remove();
        }, 1200);
    }    // =========================================================
    // PIZZA AANKLIKKEN
    // =========================================================

    function handlePizzaClick() {
        if (!pizza) {
            return;
        }

        game.spins++;

        increaseCombo();

        let amount = getPerClick();

        // Combo-bonus toepassen.
        amount = Math.floor(amount * getComboMultiplier());

        // Critical click: 5% kans op dubbele opbrengst.
        const isCritical = Math.random() < CRITICAL_CHANCE;

        if (isCritical) {
            amount *= CRITICAL_MULTIPLIER;
            game.achievements.criticalClick = true;
        }

        game.pepperoni += amount;

        // XP verdienen voor iedere klik.
        addXP(1);

        // Klik-effecten tonen.
        createClickParticles(isCritical);

        // Kleine animatie op de pizza.
        pizza.classList.remove("pizza-clicked");

        // De browser opnieuw laten rekenen zodat de animatie opnieuw start.
        void pizza.offsetWidth;

        pizza.classList.add("pizza-clicked");

        setTimeout(function () {
            pizza.classList.remove("pizza-clicked");
        }, 140);

        // Critical click-melding.
        if (isCritical) {
            showCriticalClick(amount);
        }

        // Alles bijwerken en de voortgang opslaan.
        checkAchievements();
        updateGame();
        saveGame();
    }

    // =========================================================
    // KLIK-EVENT AAN DE PIZZA KOPPELEN
    // =========================================================

    if (pizza) {
        pizza.addEventListener("click", handlePizzaClick);

        pizza.setAttribute("role", "button");
        pizza.setAttribute("tabindex", "0");
        pizza.setAttribute(
            "aria-label",
            "Klik op de pizza om pepperoni te verdienen"
        );

        // Ook met Enter of de spatiebalk kunnen klikken.
        pizza.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handlePizzaClick();
            }
        });
    } else {
        console.error(
            'Pizza Spin: het element met id="pizza" is niet gevonden.'
        );
    }

    // =========================================================
    // AUTOMATISCHE PRODUCTIE
    // =========================================================

    setInterval(function () {
        const production = getPerSecond();

        if (production > 0) {
            game.pepperoni += production;

            checkAchievements();
            updateGame();
            saveGame();
        }
    }, 1000);

    // =========================================================
    // RESETKNOP
    // =========================================================

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            const confirmed = window.confirm(
                "Weet je zeker dat je Pizza Spin opnieuw wilt beginnen? " +
                "Je opgeslagen voortgang wordt dan gewist."
            );

            if (!confirmed) {
                return;
            }

            game = createNewGame();

            combo = 0;
            lastComboMultiplier = 1;

            if (comboTimer !== null) {
                clearTimeout(comboTimer);
                comboTimer = null;
            }

            saveGame();
            updateGame();
        });
    }

    // =========================================================
    // GAME STARTEN
    // =========================================================

    loadGame();

    updateGame();
    checkAchievements();
    saveGame();

});
