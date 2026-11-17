// Własny mostek komunikacyjny Unity -> miami.html (zamiast reklam Poki)
window.PokiSDK = {
    init: function () {
        return Promise.resolve();
    },
    gameLoadingStart: function () {},
    gameLoadingFinished: function () {},
    gameLoadingProgress: function () {},
    setDebug: function () {},
    
    // WYWOŁYWANE PRZEZ UNITY GDY ZACZYNA SIĘ BIEG
    gameplayStart: function () {
        console.log("[MOD] Wykryto start gry!");
        window.dispatchEvent(new CustomEvent("unity-game-start"));
    },
    
    // WYWOŁYWANE PRZEZ UNITY GDY POSTAĆ ZGINIE LUB ZAPAUZUJE GRĘ
    gameplayStop: function () {
        console.log("[MOD] Wykryto koniec biegu / pauzę!");
        window.dispatchEvent(new CustomEvent("unity-game-stop"));
    },
    
    commercialBreak: function () {
        return Promise.resolve();
    },
    rewardedBreak: function () {
        // Zawsze zwraca sukces (darmowe nagrody/ożywienia bez reklam!)
        return Promise.resolve(true);
    },
    shareableURL: function () {
        return Promise.reject();
    },
    getURLParam: function () {
        return "";
    }
};
