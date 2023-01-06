const RES_UPGS = [
    {
        unl: ()=>true,
        desc: `Boost production based on <b>Compacted Box</b>.`,
        cost: E(1),
        effect() {
            let x = hasResearchUpg(14) ? Decimal.pow(player.reset+2,player.reset**2.5) : Decimal.pow(player.reset+2,player.reset/2+1)

            if (hasResearchUpg(4)) x = x.pow(1.5)

            return x
        },
        effDesc: x=>formatMult(x),
    },{
        unl: ()=>true,
        desc: `Boost production based on <b>Points</b>.`,
        cost: E(2),
        effect() {
            let x = player.p.mul(tmp.penalty).add(1).log10().add(1)

            if (hasResearchUpg(14)) x = Decimal.pow(10,x.pow(0.75))

            x = x.pow(2.5)

            if (hasResearchUpg(4)) x = x.pow(2)

            return x
        },
        effDesc: x=>formatMult(x),
    },{
        unl: ()=>player.reset>=3,
        desc: `Decrease <b>Compacted Box</b>'s penalty base based on unspent <b>Research Points</b>.`,
        cost: E(2),
        effect() {
            let x = tmp.unspentResearch.add(1).log10().mul(2.5)

            if (hasResearchUpg(5)) x = x.mul(researchUpgEff(5))

            if (hasResearchUpg(14)) x = x.pow(1.2)

            return x.softcap(2.5,hasResearchUpg(10)?0.75:0.5,0).toNumber()
        },
        effDesc: x=>"-"+format(x)+softcapHTML(x,2.5),
    },{
        unl: ()=>player.reset>=4,
        desc: `Increase <b>Compacted Box</b>'s bonus base based on unspent <b>Compacted Box</b>.`,
        cost: E(5),
        effect() {
            let x = player.reset*.4

            if (x>=3) x = (x/3)**(hasResearchUpg(10)?.75:.5)*3

            return x
        },
        effDesc: x=>"+"+format(x,2)+softcapHTML(x,3),
    },{
        unl: ()=>player.reset>=6,
        desc: `First 2 <b>Research Upgrades</b> are stronger.`,
        cost: E(8),
    },{
        unl: ()=>player.reset>=9,
        desc: `Third <b>Research Upgrade</b> is stronger based on spent time in <b>Compacted Box</b>. <i>(capped over 5 minutes)</i>`,
        cost: E(10),
        effect() {
            let x = Math.log10(Math.min(300,player.p_time)+1)/2+1

            return E(x**2).softcap(4,1/3,0).toNumber()
        },
        effDesc: x=>formatMult(x)+" stronger"+softcapHTML(x,4),
    },{
        unl: ()=>player.reset>=13 && player.double>0,
        desc: `Increase <b>ψ</b> base by <b>Compacted Box</b>.`,
        cost: E(6),
        effect() {
            let r = player.reset

            if (r>16) r = (r/16)**.5*16

            let x = r*0.075

            return x
        },
        effDesc: x=>"+"+format(x)+softcapHTML(player.reset,16),
    },{
        unl: ()=>player.reset>=17 && player.double>0,
        desc: `Increase <b>ψ</b> base by <b>Double Compacted Box</b>.`,
        cost: E(10),
        effect() {
            let r = player.double

            let x = r*0.075

            if (hasResearchUpg(13)) x *= 2

            return x
        },
        effDesc: x=>"+"+format(x),
    },{
        unl: ()=>player.reset>=17,
        desc: `Normal production is raised to the <b>1.25th</b> power. <i>(before division)</i>`,
        cost: E(10),
    },{
        unl: ()=>player.reset>=18,
        desc: `Decrease <b>Compacted Box</b>'s penalty base based on <b>Core Formula</b>.`,
        cost: E(10),
        effect() {
            let x = tmp.charge_formula.add(1).log10().add(1).log10().mul(3)

            return x.toNumber()
        },
        effDesc: x=>"-"+format(x),
    },{
        unl: ()=>player.reset>=26,
        desc: `Third 4 <b>Research Upgrades</b>' softcap is weaker.`,
        cost: E(15),
    },{
        unl: ()=>player.reset>=27&&player.double>=5,
        desc: `<b>Compacted Box</b>'s penalty scaling is weaker.`,
        cost: E(20),
    },{
        unl: ()=>player.reset>=30&&player.double>=5,
        desc: `Decrease <b>Double Compacted Box</b>'s penalty base based on unspent <b>Research Points</b>.<br><b>ψ</b> base is raised to the <b>1.25th</b> power.`,
        cost: E(20),
        effect() {
            let x = tmp.unspentResearch.add(1).log10().div(10)

            return x.toNumber()
        },
        effDesc: x=>"-"+format(x),
    },{
        unl: ()=>player.reset>=40,
        desc: `Eighth <b>Research Upgrade</b> is twice effective.`,
        cost: E(25),
    },{
        unl: ()=>player.reset>=60,
        desc: `First 3 <b>Research Upgrades</b> are overpowered. <b>Double Compacted Box</b>'s second penalty is weaker.`,
        cost: E(250),
    },
]

const RES_UPGS_LEN = RES_UPGS.length

function hasResearchUpg(i) { return player.res_upgs.includes(i) }
function researchUpgEff(i,def=1) { return tmp.resUpgs.effect[i]||def }

function buyResearchUpg(i) {
    let cost = tmp.resUpgs.cost[i]

    if (tmp.unspentResearch.gte(cost) && !player.res_upgs.includes(i)) {
        player.res_upgs.push(Number(i))
        player.res_spent[i] = cost

        updateTemp()
    }
}

function revertResearchUpg(i) {
    if (!player.res_upgs.includes(i)) return

    player.res_upgs.splice(player.res_upgs.indexOf(i), 1)
    player.res_spent[i] = E(0)

    player.p = E(0)
    if (player.double < 3) player.p_time = 0

    updateRUTemp()
}

function chargeResearchUpg(i) {
    if (player.res_charge.includes(i)) {
        player.res_charge.splice(player.res_charge.indexOf(i), 1)

        player.p = E(0)
        if (player.double < 3) player.p_time = 0

        updateRUTemp()
    } else if (player.res_charge.length < tmp.charger_upgrade) {
        player.res_charge.push(i)

        updateRUTemp()
    }
}

function respecResearch() {
    player.res_upgs = []
    player.res_spent = []

    player.p = E(0)
    if (player.double < 3) player.p_time = 0

    updateTemp()
}

function updateRUTemp() {
    tmp.charger_upgrade = 0
    //if (player.double >= 9) tmp.charger_upgrade++

    let tru = tmp.resUpgs

    let d = player.res_upgs.length

    if (d>13) d = (d/13)**2*13
    tru.scale = 1 + d/2

    for (let x in RES_UPGS) {
        let ru = RES_UPGS[x]

        tru.cost[x] = ru.cost.mul(tru.scale).round()
        if (ru.effect) tru.effect[x] = ru.effect()
    }
}

tmp_update.push(()=>{
    updateRUTemp()
})