var player = {}, date = Date.now(), diff = 0;

function loop() {
    diff = Date.now() - date
    updateTemp()
    updateHTML()
    calc(diff/1000);
    date = Date.now();
}

const MAIN = {
    gain() {
        let x = E(1)

        x = x.mul(tmp.charge_formula)

        if (hasResearchUpg(0)) x = player.triple>=6 ? x.pow(researchUpgEff(0)) : x.mul(researchUpgEff(0))
        if (hasResearchUpg(1)) x = player.triple>=6 ? x.pow(researchUpgEff(1)) : x.mul(researchUpgEff(1))

        if (hasResearchUpg(8)) x = x.pow(chargedResUpg(8)?1.5:1.25)

        x = x.pow(tmp.glyph.eff[0])

        return x.div(10).div(tmp.penalty)
    },
    penalty() {
        let b = player.reset

        let q = chargedResUpg(11) && hasResearchUpg(11)

        if (b > 640) b = (b/640)**5*640

        if (b > 100) b = (b/100)**4*100

        if (b > 50) b = (b/50)**(q?2.5:3)*50

        if (b > 10) b = (b/10)**(q?1.75:2)*10

        if (hasResearchUpg(2)) b -= researchUpgEff(2,0)
        if (hasResearchUpg(9)) b -= researchUpgEff(9,0)

        b *= tmp.double_penalty[0]

        let x = Decimal.pow(10,Math.max(0,b)**(hasResearchUpg(11)?1.4:1.5))

        if (hasResearchUpg(15)) x = expMult(x,0.8)

        return x
    },
    progress() {
        if (player.p.lte(0)) return 0
        let p = player.p.min(1).log10().toNumber()

        return 1/(Math.log10(1-p)+1)**3
    },
    researchSet() {
        let b = 2

        if (hasResearchUpg(3)) b += researchUpgEff(3,0)

        let x = E(player.reset*b)

        return x.max(0).round()
    },
}

el.update.main = _=>{
    document.getElementById('app').className = tmp.end ? "end" : ""

    document.getElementById('app').style.display = tmp.end_time < 12 ? '' : 'none'
    document.getElementById('end-page').style.display = tmp.end_time >= 12 ? '' : 'none'

    document.getElementById('total-time').innerHTML = formatTime(player.time)

    document.documentElement.style.setProperty('--progress-box', (tmp.progress*100)+'%');

    document.documentElement.style.setProperty('--progress-box2', (tmp.double_progress*100)+'%');

    document.documentElement.style.setProperty('--progress-box3', (tmp.triple_formula*100)+'%');
}

tmp_update.push(_=>{
    tmp.progress = MAIN.progress()
    tmp.penalty = MAIN.penalty()
    tmp.totalResearch = MAIN.researchSet()
    tmp.pGain = MAIN.gain()

    tmp.spentResearch = E(0)
    for (let x = 0; x < RES_UPGS_LEN; x++) {
        tmp.spentResearch = tmp.spentResearch.add(player.res_spent[x]||0)
    }

    tmp.unspentResearch = tmp.totalResearch.sub(tmp.spentResearch).max(0)
})

function finishBox() {
    if (player.p.gte(1)) {
        player.box_unl = true

        player.p = E(0)
        if (player.double < 3) player.p_time = 0
        player.reset++

        tmp.pass = false
    }
}

function formatStaticPercent(x) {
    return x > 0 && x < .0001 ? "<0.01%" : (x*100).toFixed(2)+"%"
}

function formatStaticMain(x) {
    return Decimal.eq(x,0) ? "0" : Decimal.gte(x,1) ? "1" : `<sup>1</sup>/<sub>${format(Decimal.pow(x,-1))}</sub>`
}